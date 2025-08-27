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