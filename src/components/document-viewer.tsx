// components/document-viewer.tsx

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