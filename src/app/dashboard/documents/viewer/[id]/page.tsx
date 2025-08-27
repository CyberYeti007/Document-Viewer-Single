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