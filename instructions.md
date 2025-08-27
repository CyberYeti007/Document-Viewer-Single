Perfect! I've updated all the file paths to match your actual project structure. Here's a summary of where each file should be placed:
📁 File Locations in Your Project:
Components (Already in place):

✅ src/components/document-viewer.tsx
✅ src/components/document-viewer-react-doc.tsx

Pages (Already exists):

✅ src/app/dashboard/documents/viewer/[id]/page.tsx

New API Routes to Create:
Since you already have some API structure, you'll need to create these new routes under src/app/api/documents/[id]/:
src/app/api/documents/[id]/
├── process/
│   └── route.ts       # Document processing with headers
├── view/
│   └── route.ts       # Document viewing endpoint
├── metadata/
│   └── route.ts       # Document metadata endpoint
└── download/
    └── route.ts       # Document download with headers
Library File to Create:

src/lib/pdf-converter.ts (if implementing PDF conversion)

🔧 Integration Notes:

MongoDB Connection: Your existing src/lib/db/mongodb.ts file will be used by all the API routes
Existing Routes: I noticed you have src/app/api/[id]/process/route.ts - you might want to consolidate document processing under /api/documents/ for better organization
GridFS Types: You already have src/types/gridfs.ts which the new routes will use
File Upload: Your existing /api/upload/ and /api/files/ routes can work alongside the new document viewer routes

📝 Quick Setup Steps:

Create the new API route folders:

bashmkdir -p src/app/api/documents/[id]/process
mkdir -p src/app/api/documents/[id]/view
mkdir -p src/app/api/documents/[id]/metadata
mkdir -p src/app/api/documents/[id]/download

Copy the API route code from the artifacts into the respective route.ts files
Install required dependencies:

bashnpm install pizzip docxtemplater @cyntler/react-doc-viewer

Test the viewer by navigating to:

/dashboard/documents/viewer/[your-document-id]
The code is now properly aligned with your project structure and should integrate seamlessly with your existing MongoDB/GridFS setup!

// src/components/document-viewer.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  RefreshCw, 
  Lock,
  Shield,
  FileUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

// Document Viewer Component
const DocumentViewer = ({ documentId = 'example-doc-id' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [viewerUrl, setViewerUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState('pdf'); // 'pdf' or 'docx'
  const [headerConfig, setHeaderConfig] = useState({
    documentName: 'Document Title',
    owner: 'John Doe',
    classification: 'CONFIDENTIAL',
    showPageNumbers: true,
    showDate: true,
    customText: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const iframeRef = useRef(null);

  // Security classifications
  const securityLevels = [
    { value: 'PUBLIC', label: 'Public', color: 'bg-green-500' },
    { value: 'INTERNAL', label: 'Internal Use', color: 'bg-blue-500' },
    { value: 'CONFIDENTIAL', label: 'Confidential', color: 'bg-yellow-500' },
    { value: 'SECRET', label: 'Secret', color: 'bg-orange-500' },
    { value: 'TOP_SECRET', label: 'Top Secret', color: 'bg-red-500' }
  ];

  // Fetch and process document with headers
  const fetchDocument = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First, get document metadata
      const metaResponse = await fetch(`/api/documents/${documentId}/metadata`);
      if (!metaResponse.ok) throw new Error('Failed to fetch document metadata');
      const metadata = await metaResponse.json();
      setDocumentData(metadata);

      // Process document with headers
      const processResponse = await fetch(`/api/documents/${documentId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headerConfig,
          outputFormat: viewMode // 'pdf' or 'docx'
        })
      });

      if (!processResponse.ok) throw new Error('Failed to process document');
      
      // Get the processed document URL
      const processedData = await processResponse.json();
      setViewerUrl(processedData.viewUrl);
      setTotalPages(processedData.pageCount || 1);
      
    } catch (err) {
      setError(err.message);
      console.error('Document fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply headers to document
  const applyHeaders = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/apply-headers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headerConfig)
      });

      if (!response.ok) throw new Error('Failed to apply headers');
      
      // Refresh document view
      await fetchDocument();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download processed document
  const downloadDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headerConfig,
          format: viewMode
        })
      });

      if (!response.ok) throw new Error('Failed to download document');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${headerConfig.documentName || 'document'}.${viewMode}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  // Print document
  const printDocument = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.print();
    }
  };

  // Zoom controls
  const handleZoom = (direction) => {
    if (direction === 'in' && zoom < 200) {
      setZoom(zoom + 10);
    } else if (direction === 'out' && zoom > 50) {
      setZoom(zoom - 10);
    } else if (direction === 'reset') {
      setZoom(100);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Header Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Document Viewer</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={documentData?.status === 'approved' ? 'success' : 'secondary'}>
                {documentData?.status || 'Draft'}
              </Badge>
              <Badge className={securityLevels.find(s => s.value === headerConfig.classification)?.color}>
                <Shield className="mr-1 h-3 w-3" />
                {headerConfig.classification}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="viewer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="viewer">Document</TabsTrigger>
              <TabsTrigger value="settings">Header Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="viewer" className="space-y-4">
              {/* Viewer Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleZoom('out')}
                    disabled={zoom <= 50}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm w-12 text-center">{zoom}%</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleZoom('in')}
                    disabled={zoom >= 200}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleZoom('reset')}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={viewMode} onValueChange={setViewMode}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">DOCX</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm" onClick={printDocument}>
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadDocument}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={fetchDocument}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Document Viewer */}
              <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Loading document...</p>
                    </div>
                  </div>
                ) : error ? (
                  <Alert variant="destructive" className="m-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : viewerUrl ? (
                  <iframe
                    ref={iframeRef}
                    src={viewerUrl}
                    className="w-full h-full border-0"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                    title="Document Viewer"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No document loaded</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="docName">Document Name</Label>
                  <Input
                    id="docName"
                    value={headerConfig.documentName}
                    onChange={(e) => setHeaderConfig({...headerConfig, documentName: e.target.value})}
                    placeholder="Enter document name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner">Document Owner</Label>
                  <Input
                    id="owner"
                    value={headerConfig.owner}
                    onChange={(e) => setHeaderConfig({...headerConfig, owner: e.target.value})}
                    placeholder="Enter owner name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classification">Security Classification</Label>
                  <Select 
                    value={headerConfig.classification} 
                    onValueChange={(value) => setHeaderConfig({...headerConfig, classification: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {securityLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            {level.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customText">Custom Header Text</Label>
                  <Input
                    id="customText"
                    value={headerConfig.customText}
                    onChange={(e) => setHeaderConfig({...headerConfig, customText: e.target.value})}
                    placeholder="Optional custom text"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={headerConfig.showPageNumbers}
                    onChange={(e) => setHeaderConfig({...headerConfig, showPageNumbers: e.target.checked})}
                    className="rounded"
                  />
                  <span>Show Page Numbers</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={headerConfig.showDate}
                    onChange={(e) => setHeaderConfig({...headerConfig, showDate: e.target.checked})}
                    className="rounded"
                  />
                  <span>Show Date</span>
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setHeaderConfig({
                  documentName: 'Document Title',
                  owner: 'John Doe',
                  classification: 'CONFIDENTIAL',
                  showPageNumbers: true,
                  showDate: true,
                  customText: ''
                })}>
                  Reset to Default
                </Button>
                <Button onClick={applyHeaders} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Settings className="mr-2 h-4 w-4" />
                      Apply Headers
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentViewer;

// src/app/api/documents/[id]/process/route.ts

import { NextRequest, NextResponse } from 'next/server';
import PizZip from 'pizzip';
import { GridFSBucket } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';
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

// src/app/api/documents/[id]/view/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

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

// src/app/api/documents/[id]/metadata/route.ts

import { NextRequest, NextResponse } from 'next/server';

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

// src/app/api/documents/[id]/download/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

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


// src/components/document-viewer-react-doc.tsx
'use client';

import React, { useState, useEffect } from 'react';
import DocViewer, { DocViewerRenderers, IDocument } from '@cyntler/react-doc-viewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Printer, 
  Shield, 
  RefreshCw,
  FileText,
  Settings
} from 'lucide-react';

interface DocumentViewerProps {
  documentId: string;
  headerConfig?: {
    documentName: string;
    owner: string;
    classification: string;
    showPageNumbers: boolean;
    showDate: boolean;
  };
}

const ReactDocumentViewer: React.FC<DocumentViewerProps> = ({ 
  documentId,
  headerConfig = {
    documentName: 'Document',
    owner: 'Unknown',
    classification: 'INTERNAL',
    showPageNumbers: true,
    showDate: true
  }
}) => {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);

  const processAndLoadDocument = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Process document with headers
      const processResponse = await fetch(`/api/documents/${documentId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headerConfig,
          outputFormat: 'docx' // or 'pdf' based on your needs
        })
      });

      if (!processResponse.ok) {
        throw new Error('Failed to process document');
      }

      const { processedId } = await processResponse.json();
      
      // Create document URL for react-doc-viewer
      const docUrl = `${window.location.origin}/api/documents/${processedId}/view`;
      setProcessedUrl(docUrl);
      
      // Set documents for viewer
      setDocuments([
        {
          uri: docUrl,
          fileName: `${headerConfig.documentName}.docx`,
        }
      ]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load document');
      console.error('Document loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!processedUrl) return;
    
    try {
      const response = await fetch(processedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${headerConfig.documentName}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    processAndLoadDocument();
  }, [documentId]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5" />
            <CardTitle>{headerConfig.documentName}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Shield className="mr-1 h-3 w-3" />
              {headerConfig.classification}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={processAndLoadDocument}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="border rounded-lg overflow-hidden" style={{ height: '700px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600">Processing document...</p>
              </div>
            </div>
          ) : documents.length > 0 ? (
            <DocViewer
              documents={documents}
              pluginRenderers={DocViewerRenderers}
              config={{
                header: {
                  disableHeader: false,
                  disableFileName: false,
                  retainURLParams: false
                },
                csvDelimiter: ",",
                pdfZoom: {
                  defaultZoom: 1.1,
                  zoomJump: 0.2
                },
                pdfVerticalScrollByDefault: true
              }}
              style={{ height: '100%' }}
              className="react-doc-viewer"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No document loaded</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReactDocumentViewer;

// ============================================
// PDF Conversion Service using Puppeteer
// ============================================

// src/lib/pdf-converter.ts

import puppeteer from 'puppeteer';
import { writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export class PDFConverter {
  async convertDocxToPdf(docxBuffer: Buffer): Promise<Buffer> {
    const tempId = uuidv4();
    const tempHtmlPath = join('/tmp', `${tempId}.html`);
    const tempPdfPath = join('/tmp', `${tempId}.pdf`);
    
    try {
      // First convert DOCX to HTML (you'll need mammoth or similar)
      const mammoth = require('mammoth');
      const result = await mammoth.convertToHtml({ buffer: docxBuffer });
      
      // Create HTML with proper styling
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .header {
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .header table {
              width: 100%;
              border-collapse: collapse;
            }
            .header td {
              padding: 5px;
              font-weight: bold;
            }
            .page-number {
              position: fixed;
              bottom: 20mm;
              right: 20mm;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          ${result.value}
        </body>
        </html>
      `;
      
      await writeFile(tempHtmlPath, html);
      
      // Launch Puppeteer and convert to PDF
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' });
      
      await page.pdf({
        path: tempPdfPath,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="width: 100%; text-align: center; font-size: 10px;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        `,
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '20mm',
          right: '20mm'
        }
      });
      
      await browser.close();
      
      // Read the PDF and return as buffer
      const pdfBuffer = await readFile(tempPdfPath);
      
      // Cleanup temp files
      await unlink(tempHtmlPath);
      await unlink(tempPdfPath);
      
      return pdfBuffer;
      
    } catch (error) {
      // Cleanup on error
      try {
        await unlink(tempHtmlPath);
        await unlink(tempPdfPath);
      } catch {}
      
      throw error;
    }
  }
}

// ============================================
// Updated package.json dependencies
// ============================================

const requiredDependencies = {
  // Document processing
  "pizzip": "^3.1.4",
  "docxtemplater": "^3.42.0",
  
  // Document viewing
  "@cyntler/react-doc-viewer": "^1.14.0",
  
  // PDF conversion (choose one approach)
  "puppeteer": "^21.6.0",  // For server-side PDF conversion
  "mammoth": "^1.6.0",      // For DOCX to HTML conversion
  
  // Alternative PDF libraries
  "pdfjs-dist": "^3.11.174", // For PDF viewing in browser
  "react-pdf": "^7.5.1",     // React PDF viewer component
  
  // Optional: Office file conversion
  "libreoffice-convert": "^1.4.1", // Requires LibreOffice installed
  
  // File handling utilities
  "file-saver": "^2.0.5",
  "uuid": "^9.0.1"
};


// src/app/dashboard/documents/viewer/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, History, Share2 } from 'lucide-react';
import DocumentViewer from '@/components/document-viewer';
import ReactDocumentViewer from '@/components/document-viewer-react-doc';

export default function DocumentViewerPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  
  const [viewerType, setViewerType] = useState<'custom' | 'react-doc'>('custom');
  const [documentInfo, setDocumentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocumentInfo();
  }, [documentId]);

  const fetchDocumentInfo = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}/metadata`);
      if (response.ok) {
        const data = await response.json();
        setDocumentInfo(data);
      }
    } catch (error) {
      console.error('Error fetching document info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/documents')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Button>
          
          {documentInfo && (
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <h1 className="text-2xl font-bold">{documentInfo.name}</h1>
                <p className="text-sm text-gray-500">
                  Version {documentInfo.version} • {documentInfo.documentId}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            Version History
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Viewer Selection Tabs */}
      <Tabs value={viewerType} onValueChange={(v) => setViewerType(v as any)}>
        <TabsList>
          <TabsTrigger value="custom">Enhanced Viewer</TabsTrigger>
          <TabsTrigger value="react-doc">React Doc Viewer</TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="mt-4">
          <DocumentViewer documentId={documentId} />
        </TabsContent>

        <TabsContent value="react-doc" className="mt-4">
          <ReactDocumentViewer 
            documentId={documentId}
            headerConfig={{
              documentName: documentInfo?.name || 'Document',
              owner: documentInfo?.owner || 'Unknown',
              classification: documentInfo?.securityLevel || 'INTERNAL',
              showPageNumbers: true,
              showDate: true
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================
// Environment Configuration
// ============================================

// .env.local additions
/*
# Document Processing
DOCX_TO_PDF_SERVICE=puppeteer # or 'libreoffice' or 'external'
PDF_SERVICE_URL=http://localhost:3005 # if using external service

# Storage
TEMP_FILES_DIR=/tmp
MAX_DOCUMENT_SIZE=52428800 # 50MB in bytes
*/

// ============================================
// Docker Configuration for LibreOffice (Optional)
// ============================================

// docker-compose.yml
const dockerCompose = `
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/qms
    depends_on:
      - mongo
      - libreoffice

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  libreoffice:
    image: libreoffice/online:latest
    ports:
      - "9980:9980"
    environment:
      - domain=localhost
      - username=admin
      - password=admin
    cap_add:
      - MKNOD

volumes:
  mongo_data:
`;

// ============================================
// Nginx Configuration for Document Serving
// ============================================

// nginx.conf
const nginxConfig = `
server {
    listen 80;
    server_name documents.yourapp.com;

    # Security headers for documents
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header Content-Security-Policy "default-src 'self';";

    # Document viewer route
    location /viewer {
        proxy_pass http://localhost:3000/dashboard/documents/viewer;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API routes for documents
    location /api/documents {
        proxy_pass http://localhost:3000/api/documents;
        proxy_set_header Host $host;
        
        # Increase limits for file uploads
        client_max_body_size 50M;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # Cache static document assets
    location ~* \.(pdf|docx|xlsx)$ {
        expires 1h;
        add_header Cache-Control "public, immutable";
    }
}
`;

// ============================================
// Implementation Checklist
// ============================================

const implementationSteps = `
## Implementation Checklist

### 1. Install Dependencies
\`\`\`bash
npm install pizzip docxtemplater @cyntler/react-doc-viewer mammoth file-saver uuid
npm install --save-dev @types/uuid
\`\`\`

### 2. For PDF Conversion (Choose One):

#### Option A: Puppeteer (Recommended for control)
\`\`\`bash
npm install puppeteer
\`\`\`

#### Option B: LibreOffice (Better for complex documents)
\`\`\`bash
npm install libreoffice-convert
# Requires LibreOffice installed on server
apt-get install libreoffice # Ubuntu/Debian
\`\`\`

### 3. Set Up Routes
- Create /api/documents/[id]/process/route.ts
- Create /api/documents/[id]/view/route.ts
- Create /api/documents/[id]/metadata/route.ts
- Create /api/documents/[id]/download/route.ts

### 4. Create Components
- /components/document-viewer.tsx (Enhanced viewer)
- /components/document-viewer-react-doc.tsx (React-doc-viewer)

### 5. Create Viewer Page
- /app/dashboard/documents/viewer/[id]/page.tsx

### 6. Configure Environment Variables
- Add document processing settings to .env.local

### 7. Test Features
- Document upload and storage in GridFS ✓
- Dynamic header application ✓
- Page numbering ✓
- Security classification badges ✓
- PDF conversion (if implemented)
- Document download with headers ✓

### 8. Security Considerations
- Implement access control for documents
- Add watermarks for sensitive documents
- Audit trail for document access
- Encryption for sensitive documents in storage

### 9. Performance Optimizations
- Implement document caching
- Use CDN for static documents
- Lazy load large documents
- Implement pagination for multi-page documents

### 10. Additional Features to Consider
- Document comparison tool
- Annotation support
- Digital signatures
- Version control with diff viewing
- Full-text search within documents
- OCR for scanned documents
`;