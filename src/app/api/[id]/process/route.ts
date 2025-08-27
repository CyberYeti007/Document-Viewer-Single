// app/api/documents/[id]/process/route.ts

import { NextRequest, NextResponse } from 'next/server';
import PizZip from 'pizzip';
import { GridFSBucket } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import Docxtemplater from 'docxtemplater';

// Helper function to build header XML
function buildHeaderXml(config: any) {
  const currentDate = new Date().toLocaleDateString();
  const rows = [];
  
  // First row: Document name and classification
  rows.push([
    { width: 50, text: `Doc Name: ${config.documentName}` },
    { width: 50, text: `Classification: ${config.classification}` }
  ]);
  
  // Second row: Owner and date
  if (config.owner || config.showDate) {
    const ownerText = config.owner ? `Owner: ${config.owner}` : '';
    const dateText = config.showDate ? `Date: ${currentDate}` : '';
    rows.push([
      { width: 50, text: ownerText },
      { width: 50, text: dateText }
    ]);
  }
  
  // Third row: Custom text if provided
  if (config.customText) {
    rows.push([
      { width: 100, text: config.customText }
    ]);
  }

  return `
    <w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:tbl>
        <w:tblPr>
          <w:tblW w:w="5000" w:type="pct"/>
          <w:tblBorders>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          </w:tblBorders>
        </w:tblPr>
        ${rows.map(row => `
          <w:tr>
            ${row.map(cell => `
              <w:tc>
                <w:tcPr>
                  <w:tcW w:w="${cell.width}" w:type="pct"/>
                </w:tcPr>
                <w:p>
                  <w:pPr>
                    <w:jc w:val="${cell.width === 100 ? 'center' : 'left'}"/>
                  </w:pPr>
                  <w:r>
                    <w:rPr>
                      <w:b/>
                      <w:sz w:val="20"/>
                    </w:rPr>
                    <w:t>${cell.text}</w:t>
                  </w:r>
                </w:p>
              </w:tc>
            `).join('')}
          </w:tr>
        `).join('')}
      </w:tbl>
    </w:hdr>
  `;
}

// Helper function to build footer XML with page numbers
function buildFooterXml(config: any) {
  if (!config.showPageNumbers) return '';
  
  return `
    <w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:p>
        <w:pPr>
          <w:jc w:val="center"/>
        </w:pPr>
        <w:r>
          <w:t>Page </w:t>
        </w:r>
        <w:r>
          <w:fldSimple w:instr="PAGE"/>
        </w:r>
        <w:r>
          <w:t> of </w:t>
        </w:r>
        <w:r>
          <w:fldSimple w:instr="NUMPAGES"/>
        </w:r>
      </w:p>
    </w:ftr>
  `;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { headerConfig, outputFormat = 'pdf' } = body;

    // Connect to MongoDB and GridFS
    const client = await clientPromise;
    const db = client.db('filesDb');
    const bucket = new GridFSBucket(db, { bucketName: 'documents' });

    // Fetch the original document from GridFS
    const downloadStream = bucket.openDownloadStream(id);
    const chunks: Buffer[] = [];
    
    for await (const chunk of downloadStream) {
      chunks.push(chunk as Buffer);
    }
    
    const originalBuffer = Buffer.concat(chunks);

    // Process DOCX with headers
    if (outputFormat === 'docx' || outputFormat === 'pdf') {
      const zip = new PizZip(originalBuffer);
      
      // Add header XML
      const headerXml = buildHeaderXml(headerConfig);
      zip.file('word/header1.xml', headerXml);
      
      // Add footer XML if page numbers are enabled
      if (headerConfig.showPageNumbers) {
        const footerXml = buildFooterXml(headerConfig);
        zip.file('word/footer1.xml', footerXml);
      }
      
      // Update relationships
      const relsPath = 'word/_rels/document.xml.rels';
      let relsFile = zip.file(relsPath)?.asText() || '';
      
      if (!relsFile.includes('header1.xml')) {
        relsFile = relsFile.replace(
          '</Relationships>',
          `<Relationship Id="rIdHeader1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
          ${headerConfig.showPageNumbers ? '<Relationship Id="rIdFooter1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>' : ''}
          </Relationships>`
        );
        zip.file(relsPath, relsFile);
      }
      
      // Update document.xml to reference headers/footers
      const docXmlPath = 'word/document.xml';
      let docXml = zip.file(docXmlPath)?.asText() || '';
      
      // Find and update sectPr
      const sectPrRegex = /<w:sectPr[^>]*>[\s\S]*?<\/w:sectPr>/;
      const newSectPr = `
        <w:sectPr>
          <w:headerReference w:type="default" r:id="rIdHeader1"/>
          ${headerConfig.showPageNumbers ? '<w:footerReference w:type="default" r:id="rIdFooter1"/>' : ''}
          <w:pgSz w:w="12240" w:h="15840"/>
          <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720"/>
        </w:sectPr>
      `;
      
      if (sectPrRegex.test(docXml)) {
        docXml = docXml.replace(sectPrRegex, newSectPr);
      } else {
        // If no sectPr exists, add it before closing body tag
        docXml = docXml.replace('</w:body>', newSectPr + '</w:body>');
      }
      
      zip.file(docXmlPath, docXml);
      
      // Generate the modified document
      const processedBuffer = zip.generate({ type: 'nodebuffer' });
      
      // Store processed document in GridFS
      const uploadStream = bucket.openUploadStream(`processed_${id}_${Date.now()}.docx`, {
        metadata: {
          originalId: id,
          processed: true,
          headerConfig,
          processedAt: new Date()
        }
      });
      
      const processedId = uploadStream.id;
      
      await new Promise((resolve, reject) => {
        uploadStream.end(processedBuffer, (error) => {
          if (error) reject(error);
          else resolve(processedId);
        });
      });
      
      // Generate view URL
      const viewUrl = `/api/documents/${processedId}/view`;
      
      // If PDF conversion is requested, we'll need to handle that
      if (outputFormat === 'pdf') {
        // Note: You'll need to implement PDF conversion
        // Options: puppeteer, libreoffice-convert, or external service
        // For now, returning the DOCX viewer URL
        return NextResponse.json({
          viewUrl,
          processedId: processedId.toString(),
          format: 'docx',
          pageCount: 1, // You'd calculate this from the document
          message: 'Document processed with headers (PDF conversion pending implementation)'
        });
      }
      
      return NextResponse.json({
        viewUrl,
        processedId: processedId.toString(),
        format: outputFormat,
        pageCount: 1 // You'd calculate this from the document
      });
    }
    
  } catch (error) {
    console.error('Document processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}

// app/api/documents/[id]/view/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Connect to MongoDB and GridFS
    const client = await clientPromise;
    const db = client.db('filesDb');
    const bucket = new GridFSBucket(db, { bucketName: 'documents' });
    
    // Stream the document
    const downloadStream = bucket.openDownloadStream(id);
    const chunks: Buffer[] = [];
    
    for await (const chunk of downloadStream) {
      chunks.push(chunk as Buffer);
    }
    
    const buffer = Buffer.concat(chunks);
    
    // Return with appropriate headers for viewing
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `inline; filename="document.docx"`,
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Document view error:', error);
    return NextResponse.json(
      { error: 'Failed to load document' },
      { status: 500 }
    );
  }
}

// app/api/documents/[id]/metadata/route.ts

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Fetch document metadata from your database
    // This is a mock - replace with actual database query
    const metadata = {
      id,
      documentId: 'QMS-SOP-001',
      name: 'Standard Operating Procedure',
      status: 'approved',
      version: '2.1',
      owner: 'John Smith',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-10-15'),
      category: 'SOP',
      securityLevel: 'CONFIDENTIAL'
    };
    
    return NextResponse.json(metadata);
    
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document metadata' },
      { status: 500 }
    );
  }
}

// app/api/documents/[id]/download/route.ts

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { headerConfig, format = 'docx' } = body;
    
    // Connect to MongoDB and GridFS
    const client = await clientPromise;
    const db = client.db('filesDb');
    const bucket = new GridFSBucket(db, { bucketName: 'documents' });
    
    // Process document with headers (similar to process route)
    // ... (same processing logic as above)
    
    // For now, return the original document
    const downloadStream = bucket.openDownloadStream(id);
    const chunks: Buffer[] = [];
    
    for await (const chunk of downloadStream) {
      chunks.push(chunk as Buffer);
    }
    
    const buffer = Buffer.concat(chunks);
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': format === 'pdf' 
          ? 'application/pdf' 
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="document.${format}"`,
      }
    });
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}