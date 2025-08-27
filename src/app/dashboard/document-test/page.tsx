'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  RefreshCw, 
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Upload,
  CheckCircle2
} from 'lucide-react'

export default function DocumentTestPage() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(5)
  const [zoom, setZoom] = useState(100)
  const [viewMode, setViewMode] = useState('pdf')
  const [headerConfig, setHeaderConfig] = useState({
    documentName: 'Quality Management System Manual',
    owner: 'John Smith',
    classification: 'CONFIDENTIAL',
    showPageNumbers: true,
    showDate: true,
    customText: 'ISO 9001:2015 Compliant'
  })

  const securityLevels = [
    { value: 'PUBLIC', label: 'Public', color: 'bg-green-500' },
    { value: 'INTERNAL', label: 'Internal Use', color: 'bg-blue-500' },
    { value: 'CONFIDENTIAL', label: 'Confidential', color: 'bg-yellow-500' },
    { value: 'SECRET', label: 'Secret', color: 'bg-orange-500' },
    { value: 'TOP_SECRET', label: 'Top Secret', color: 'bg-red-500' }
  ]

  const handleZoom = (direction: string) => {
    if (direction === 'in' && zoom < 200) {
      setZoom(zoom + 10)
    } else if (direction === 'out' && zoom > 50) {
      setZoom(zoom - 10)
    } else if (direction === 'reset') {
      setZoom(100)
    }
  }

  const sampleDocumentContent = `
    <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <div style="border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #1e40af; margin: 0;">Quality Management System Manual</h1>
        <p style="color: #666; margin-top: 10px;">Version 2.1 | ISO 9001:2015 Compliant</p>
      </div>
      
      <section style="margin-bottom: 30px;">
        <h2 style="color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">1. Introduction</h2>
        <p style="line-height: 1.6; color: #333;">
          This Quality Management System (QMS) Manual describes our commitment to quality and continuous improvement. 
          It outlines the policies, procedures, and responsibilities necessary to achieve and maintain the highest 
          standards of quality in our products and services.
        </p>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">2. Scope</h2>
        <p style="line-height: 1.6; color: #333;">
          This QMS applies to all departments and functions within our organization, covering the design, development, 
          production, and delivery of our products and services. It ensures compliance with ISO 9001:2015 standards 
          and regulatory requirements.
        </p>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">3. Quality Policy</h2>
        <div style="background: #f3f4f6; padding: 20px; border-left: 4px solid #1e40af; margin: 20px 0;">
          <p style="font-style: italic; color: #333; margin: 0;">
            "We are committed to providing products and services that meet or exceed customer expectations 
            through continuous improvement, innovation, and adherence to quality standards."
          </p>
        </div>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">4. Key Processes</h2>
        <ul style="line-height: 1.8; color: #333;">
          <li>Customer Requirements Review</li>
          <li>Design and Development Control</li>
          <li>Supplier Management</li>
          <li>Production and Service Provision</li>
          <li>Quality Control and Testing</li>
          <li>Nonconformance Management</li>
          <li>Corrective and Preventive Actions</li>
          <li>Management Review</li>
        </ul>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">5. Document Control</h2>
        <p style="line-height: 1.6; color: #333;">
          All documents within the QMS are controlled according to our Document Control Procedure (QMS-PR-001). 
          This ensures that only current, approved versions of documents are in use throughout the organization.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background: #f3f4f6;">
            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left;">Document Type</th>
            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left;">Review Frequency</th>
            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left;">Owner</th>
          </tr>
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 10px;">Policies</td>
            <td style="border: 1px solid #e5e7eb; padding: 10px;">Annual</td>
            <td style="border: 1px solid #e5e7eb; padding: 10px;">Quality Manager</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 10px;">Procedures</td>
            <td style="border: 1px solid #e5e7eb; padding: 10px;">Bi-annual</td>
            <td style="border: 1px solid #e5e7eb; padding: 10px;">Process Owner</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 10px;">Work Instructions</td>
            <td style="border: 1px solid #e5e7eb; padding: 10px;">As needed</td>
            <td style="border: 1px solid #e5e7eb; padding: 10px;">Department Head</td>
          </tr>
        </table>
      </section>

      <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666;">
        <p>Page 1 of 5 | ${headerConfig.classification} | Document ID: QMS-MAN-001</p>
      </div>
    </div>
  `

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Document Viewer Demo</h2>
          <p className="text-muted-foreground">
            Interactive document viewer with security headers and controls
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
          <Upload className="mr-2 h-4 w-4" />
          Upload New Document
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-500" />
              <div>
                <CardTitle className="text-xl font-semibold">Document Viewer</CardTitle>
                <CardDescription>Enhanced viewer with security classifications</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50">
                <CheckCircle2 className="mr-1 h-3 w-3 text-green-600" />
                Approved
              </Badge>
              <Badge className={`${securityLevels.find(s => s.value === headerConfig.classification)?.color} text-white`}>
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
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium px-2">
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
                  <span className="text-sm w-12 text-center font-medium">{zoom}%</span>
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
                  
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setLoading(!loading)}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Document Viewer */}
              <div className="relative w-full bg-white rounded-lg border overflow-hidden" style={{ height: '700px' }}>
                {loading ? (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
                      <p className="text-gray-600">Loading document...</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-full overflow-auto bg-gray-50 p-4"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                  >
                    {/* Document Header */}
                    <div className="bg-white shadow-lg mx-auto" style={{ maxWidth: '850px', minHeight: '1100px' }}>
                      <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-semibold">Document: {headerConfig.documentName}</p>
                            <p>Owner: {headerConfig.owner}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">Classification: {headerConfig.classification}</p>
                            {headerConfig.showDate && <p>Date: {new Date().toLocaleDateString()}</p>}
                          </div>
                        </div>
                        {headerConfig.customText && (
                          <p className="mt-2 text-center text-sm italic">{headerConfig.customText}</p>
                        )}
                      </div>
                      
                      {/* Document Content */}
                      <div dangerouslySetInnerHTML={{ __html: sampleDocumentContent }} />
                      
                      {/* Document Footer */}
                      {headerConfig.showPageNumbers && (
                        <div className="bg-gray-100 p-3 text-center text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </div>
                      )}
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

              <Alert>
                <AlertDescription>
                  Changes to header settings will be reflected in the document viewer immediately. 
                  These settings will be applied when downloading or printing the document.
                </AlertDescription>
              </Alert>

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
                <Button onClick={() => {
                  setLoading(true)
                  setTimeout(() => setLoading(false), 1000)
                }}>
                  <Settings className="mr-2 h-4 w-4" />
                  Apply Headers
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}