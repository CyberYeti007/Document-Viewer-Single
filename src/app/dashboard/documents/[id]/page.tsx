// app/dashboard/documents/[id]/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText,
  Download,
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  FileUp,
  History,
  MessageSquare,
  Shield,
  ArrowLeft,
  Eye,
  Printer,
  Share2,
  Lock,
  Unlock,
  RefreshCw
} from "lucide-react"

// Mock data - replace with actual API call based on document ID
const documentData = {
  id: 1,
  documentId: 'QMS-SOP-001',
  name: 'Document Control Procedure',
  category: 'SOP',
  version: '2.1',
  status: 'approved',
  description: 'This procedure defines the process for controlling documents within the Quality Management System, including creation, review, approval, distribution, and revision of all controlled documents.',
  owner: 'John Smith',
  ownerEmail: 'john.smith@mazdatoyota.com',
  department: 'Quality Assurance',
  approvedBy: 'Sarah Johnson',
  approvedDate: '2024-10-15',
  effectiveDate: '2024-11-01',
  reviewDate: '2025-11-01',
  fileSize: '245 KB',
  fileType: 'PDF',
  lastModified: '2024-10-15T09:30:00',
  createdDate: '2024-09-01',
  keywords: ['quality', 'document control', 'procedure', 'ISO 9001'],
  relatedDocuments: ['QMS-POL-001', 'FRM-QA-001', 'WI-QA-003'],
  
  // Version history
  versions: [
    {
      version: '2.1',
      date: '2024-10-15',
      author: 'John Smith',
      authorEmail: 'john.smith@mazdatoyota.com',
      changes: 'Updated section 4.2 to align with new ISO requirements',
      status: 'current'
    },
    {
      version: '2.0',
      date: '2024-06-01',
      author: 'Mike Davis',
      authorEmail: 'mike.davis@mazdatoyota.com',
      changes: 'Major revision - Added electronic signature requirements',
      status: 'superseded'
    },
    {
      version: '1.0',
      date: '2023-11-15',
      author: 'Emma Wilson',
      authorEmail: 'emma.wilson@mazdatoyota.com',
      changes: 'Initial release',
      status: 'superseded'
    }
  ],
  
  // Approval history
  approvals: [
    {
      role: 'Document Owner',
      name: 'John Smith',
      email: 'john.smith@mazdatoyota.com',
      date: '2024-10-10',
      status: 'approved',
      comments: 'Ready for management review'
    },
    {
      role: 'Department Manager',
      name: 'Tom Brown',
      email: 'tom.brown@mazdatoyota.com',
      date: '2024-10-12',
      status: 'approved',
      comments: 'Approved with minor formatting changes'
    },
    {
      role: 'Quality Manager',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@mazdatoyota.com',
      date: '2024-10-15',
      status: 'approved',
      comments: 'Final approval granted'
    }
  ],
  
  // Access log
  accessLog: [
    {
      user: 'Mike Davis',
      email: 'mike.davis@mazdatoyota.com',
      action: 'Viewed',
      date: '2024-12-23T10:30:00'
    },
    {
      user: 'Emma Wilson',
      email: 'emma.wilson@mazdatoyota.com',
      action: 'Downloaded',
      date: '2024-12-22T14:15:00'
    },
    {
      user: 'Tom Brown',
      email: 'tom.brown@mazdatoyota.com',
      action: 'Printed',
      date: '2024-12-21T09:00:00'
    }
  ]
}

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })
  
  const router = useRouter()
  const [comment, setComment] = useState('')

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'pending':
        return <Badge className="bg-orange-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'draft':
        return <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" />Draft</Badge>
      case 'expired':
        return <Badge className="bg-red-500"><AlertTriangle className="w-3 h-3 mr-1" />Expired</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/documents')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{documentData.documentId}</h2>
            <p className="text-muted-foreground">{documentData.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-4">
          {/* Document Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <Badge variant="outline" className="mt-1">{documentData.category}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Version</p>
                  <p className="text-sm mt-1">{documentData.version}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(documentData.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="text-sm mt-1">{documentData.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Effective Date</p>
                  <p className="text-sm mt-1 flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {documentData.effectiveDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Review Date</p>
                  <p className="text-sm mt-1 flex items-center">
                    <RefreshCw className="mr-1 h-3 w-3" />
                    {documentData.reviewDate}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{documentData.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {documentData.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">{keyword}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for additional information */}
          <Tabs defaultValue="versions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="versions">Version History</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="access">Access Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="versions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Version History</CardTitle>
                  <CardDescription>Track all changes and revisions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documentData.versions.map((version, index) => (
                      <div key={index} className="flex items-start space-x-4 pb-4 last:pb-0 border-b last:border-0">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getUserInitials(version.author)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">
                                Version {version.version}
                                {version.status === 'current' && (
                                  <Badge className="ml-2 bg-green-500">Current</Badge>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {version.author} • {version.date}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm mt-2">{version.changes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="approvals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Approval Workflow</CardTitle>
                  <CardDescription>Review and approval history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documentData.approvals.map((approval, index) => (
                      <div key={index} className="flex items-start space-x-4 pb-4 last:pb-0 border-b last:border-0">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getUserInitials(approval.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{approval.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {approval.role} • {approval.date}
                              </p>
                            </div>
                            {approval.status === 'approved' ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-orange-500" />
                            )}
                          </div>
                          {approval.comments && (
                            <p className="text-sm mt-2 text-muted-foreground">"{approval.comments}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="access" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Access Log</CardTitle>
                  <CardDescription>Recent document activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documentData.accessLog.map((log, index) => (
                      <div key={index} className="flex items-center justify-between pb-4 last:pb-0 border-b last:border-0">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getUserInitials(log.user)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{log.user}</p>
                            <p className="text-xs text-muted-foreground">
                              {log.action} • {new Date(log.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          {log.action === 'Viewed' && <Eye className="h-4 w-4" />}
                          {log.action === 'Downloaded' && <Download className="h-4 w-4" />}
                          {log.action === 'Printed' && <Printer className="h-4 w-4" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* File Info */}
          <Card>
            <CardHeader>
              <CardTitle>File Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="text-sm font-medium">{documentData.fileType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Size</span>
                <span className="text-sm font-medium">{documentData.fileSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{documentData.createdDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Modified</span>
                <span className="text-sm font-medium">
                  {new Date(documentData.lastModified).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle>Document Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{getUserInitials(documentData.owner)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{documentData.owner}</p>
                  <p className="text-xs text-muted-foreground">{documentData.ownerEmail}</p>
                </div>
              </div>
              {documentData.approvedBy && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Approved by</p>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{documentData.approvedBy}</p>
                      <p className="text-xs text-muted-foreground">{documentData.approvedDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Related Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documentData.relatedDocuments.map((docId, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => router.push(`/dashboard/documents/${docId}`)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {docId}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
              <Button className="w-full" variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                Upload New Version
              </Button>
              <Button className="w-full" variant="outline">
                <Lock className="mr-2 h-4 w-4" />
                Lock Document
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}