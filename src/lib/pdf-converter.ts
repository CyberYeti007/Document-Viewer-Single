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