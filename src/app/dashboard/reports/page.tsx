// app/dashboard/reports/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { 
  FileText,
  Download,
  Calendar as CalendarIcon,
  TrendingUp,
  AlertTriangle,

  Clock,
  BarChart3,

  Activity,
  FileSpreadsheet,
  Filter,
  Play,
  Pause,
  RefreshCw,
  Mail,
  Settings,
  Save,
  Printer,
  Share2,
  Archive,
  Users,
  Shield,
  Eye
} from "lucide-react"

// Mock data for scheduled reports
const scheduledReports = [
  {
    id: 1,
    name: 'Monthly Compliance Report',
    type: 'compliance',
    frequency: 'monthly',
    nextRun: '2025-01-01',
    lastRun: '2024-12-01',
    recipients: ['sarah.johnson@mazdatoyota.com', 'john.smith@mazdatoyota.com'],
    status: 'active',
    format: 'PDF'
  },
  {
    id: 2,
    name: 'Weekly Document Activity',
    type: 'activity',
    frequency: 'weekly',
    nextRun: '2024-12-30',
    lastRun: '2024-12-23',
    recipients: ['quality.team@mazdatoyota.com'],
    status: 'active',
    format: 'Excel'
  },
  {
    id: 3,
    name: 'Quarterly Audit Summary',
    type: 'audit',
    frequency: 'quarterly',
    nextRun: '2025-01-15',
    lastRun: '2024-10-15',
    recipients: ['management@mazdatoyota.com'],
    status: 'paused',
    format: 'PDF'
  }
]

// Report templates
const reportTemplates = [
  {
    id: 'compliance',
    name: 'Compliance Status Report',
    description: 'Overview of document compliance, expiring documents, and review status',
    icon: Shield,
    color: 'bg-blue-500',
    fields: ['dateRange', 'categories', 'departments']
  },
  {
    id: 'activity',
    name: 'Document Activity Report',
    description: 'Track document creation, updates, approvals, and user activity',
    icon: Activity,
    color: 'bg-green-500',
    fields: ['dateRange', 'users', 'actions']
  },
  {
    id: 'audit',
    name: 'Audit Trail Report',
    description: 'Detailed audit log of all system activities and changes',
    icon: FileText,
    color: 'bg-purple-500',
    fields: ['dateRange', 'users', 'eventTypes']
  },
  {
    id: 'expiring',
    name: 'Expiring Documents Report',
    description: 'List of documents approaching expiration or review dates',
    icon: AlertTriangle,
    color: 'bg-orange-500',
    fields: ['daysAhead', 'categories', 'owners']
  },
  {
    id: 'user',
    name: 'User Activity Report',
    description: 'User access patterns, document ownership, and review performance',
    icon: Users,
    color: 'bg-indigo-500',
    fields: ['dateRange', 'users', 'departments']
  },
  {
    id: 'statistics',
    name: 'Document Statistics Report',
    description: 'Statistical analysis of document distribution and metrics',
    icon: BarChart3,
    color: 'bg-pink-500',
    fields: ['dateRange', 'categories', 'metrics']
  }
]

export default function ReportsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [reportFormat, setReportFormat] = useState('pdf')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const openGenerateDialog = (template: any) => {
    setSelectedTemplate(template)
    setIsGenerateOpen(true)
  }

  const handleGenerateReport = () => {
    console.log('Generating report:', {
      template: selectedTemplate,
      dateFrom,
      dateTo,
      format: reportFormat,
      categories: selectedCategories,
      users: selectedUsers
    })
    setIsGenerateOpen(false)
  }

  const getFrequencyBadge = (frequency: string) => {
    const colors: Record<string, string> = {
      daily: 'bg-blue-500',
      weekly: 'bg-green-500',
      monthly: 'bg-orange-500',
      quarterly: 'bg-purple-500',
      yearly: 'bg-red-500'
    }
    return <Badge className={colors[frequency] || 'bg-gray-500'}>{frequency}</Badge>
  }

  const getStatusIcon = (status: string) => {
    return status === 'active' ? (
      <Play className="h-4 w-4 text-green-500" />
    ) : (
      <Pause className="h-4 w-4 text-orange-500" />
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Generate compliance reports and analyze document metrics
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledReports.length}</div>
            <p className="text-xs text-muted-foreground">
              {scheduledReports.filter(r => r.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        {/* Generate Reports Tab */}
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Select a report template to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reportTemplates.map((template) => {
                  const Icon = template.icon
                  return (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${template.color}`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{template.name}</CardTitle>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {template.fields.slice(0, 2).map((field, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                            {template.fields.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{template.fields.length - 2}
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => openGenerateDialog(template)}
                          >
                            Generate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
              <CardDescription>Generate commonly used reports with one click</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-20 flex-col">
                  <AlertTriangle className="h-6 w-6 mb-2 text-orange-500" />
                  <span className="text-xs">Documents Expiring This Week</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Clock className="h-6 w-6 mb-2 text-blue-500" />
                  <span className="text-xs">Pending Reviews Summary</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Activity className="h-6 w-6 mb-2 text-green-500" />
                  <span className="text-xs">Today's Activity Log</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Shield className="h-6 w-6 mb-2 text-purple-500" />
                  <span className="text-xs">Monthly Compliance</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>Manage automated report generation</CardDescription>
                </div>
                <Button onClick={() => setIsScheduleOpen(true)}>
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{report.name}</h4>
                            {getFrequencyBadge(report.frequency)}
                            <Badge variant="outline">{report.format}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <p>Next run: {report.nextRun}</p>
                              <p>Last run: {report.lastRun}</p>
                            </div>
                            <div>
                              <p>Recipients: {report.recipients.length}</p>
                              <p className="truncate">{report.recipients[0]}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(report.status)}
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Monthly Compliance Report - December 2024</p>
                        <p className="text-sm text-muted-foreground">
                          Generated on Dec {20 - i}, 2024 at 09:00 AM • PDF • 2.3 MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              {selectedTemplate && `Configure parameters for ${selectedTemplate.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Date To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Report Format</Label>
              <Select value={reportFormat} onValueChange={setReportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                  <SelectItem value="word">Word Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Include Categories</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sop">SOPs</SelectItem>
                  <SelectItem value="wi">Work Instructions</SelectItem>
                  <SelectItem value="form">Forms</SelectItem>
                  <SelectItem value="policy">Policies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}