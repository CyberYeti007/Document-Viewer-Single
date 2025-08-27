// app/dashboard/compliance/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  BarChart3,
  Target,
  Award,
  Info,
  Clock,
  Users,
  Activity,
  ChevronRight,
  Download,
  Eye
} from "lucide-react"

// Mock compliance data
const complianceMetrics = {
  overallScore: 98.5,
  scoreChange: 2.3,
  compliantDocuments: 1223,
  totalDocuments: 1247,
  expiredDocuments: 4,
  pendingReviews: 23,
  overdueReviews: 8,
  upcomingAudits: 3,
  certificationsValid: 12,
  certificationsExpiring: 2
}

const complianceByCategory = [
  { category: 'SOPs', total: 342, compliant: 338, percentage: 98.8 },
  { category: 'Work Instructions', total: 256, compliant: 254, percentage: 99.2 },
  { category: 'Forms', total: 198, compliant: 195, percentage: 98.5 },
  { category: 'Policies', total: 87, compliant: 85, percentage: 97.7 },
  { category: 'Records', total: 364, compliant: 351, percentage: 96.4 }
]

const complianceByDepartment = [
  { department: 'Quality Assurance', score: 99.2, documents: 245, issues: 2 },
  { department: 'Production', score: 98.5, documents: 389, issues: 6 },
  { department: 'Engineering', score: 97.8, documents: 156, issues: 3 },
  { department: 'HR', score: 99.5, documents: 89, issues: 0 },
  { department: 'Finance', score: 96.9, documents: 124, issues: 4 },
  { department: 'IT', score: 98.1, documents: 98, issues: 2 }
]

const upcomingDeadlines = [
  {
    id: 1,
    type: 'document',
    name: 'QMS-SOP-001 Document Control Procedure',
    deadline: '2025-01-15',
    daysLeft: 23,
    owner: 'John Smith',
    priority: 'high'
  },
  {
    id: 2,
    type: 'certification',
    name: 'ISO 9001:2015 Certification',
    deadline: '2025-02-01',
    daysLeft: 40,
    owner: 'Sarah Johnson',
    priority: 'critical'
  },
  {
    id: 3,
    type: 'audit',
    name: 'Internal Quality Audit - Q1',
    deadline: '2025-01-30',
    daysLeft: 38,
    owner: 'Mike Davis',
    priority: 'medium'
  },
  {
    id: 4,
    type: 'document',
    name: 'POL-HR-005 Code of Conduct Policy',
    deadline: '2025-01-20',
    daysLeft: 28,
    owner: 'Tom Brown',
    priority: 'medium'
  }
]

const certifications = [
  {
    id: 1,
    name: 'ISO 9001:2015',
    description: 'Quality Management System',
    status: 'valid',
    issueDate: '2023-02-01',
    expiryDate: '2025-02-01',
    certBody: 'TÜV SÜD',
    scope: 'Manufacturing and Quality Control'
  },
  {
    id: 2,
    name: 'ISO 14001:2015',
    description: 'Environmental Management System',
    status: 'valid',
    issueDate: '2023-06-15',
    expiryDate: '2026-06-15',
    certBody: 'DNV GL',
    scope: 'Environmental Compliance'
  },
  {
    id: 3,
    name: 'ISO 45001:2018',
    description: 'Occupational Health & Safety',
    status: 'expiring',
    issueDate: '2022-03-20',
    expiryDate: '2025-03-20',
    certBody: 'BSI',
    scope: 'Workplace Safety Management'
  }
]

export default function CompliancePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 98) return 'text-green-600'
    if (score >= 95) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 98) return 'bg-green-100'
    if (score >= 95) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-600">Critical</Badge>
      case 'high':
        return <Badge className="bg-red-500">High</Badge>
      case 'medium':
        return <Badge className="bg-orange-500">Medium</Badge>
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'certification':
        return <Award className="h-4 w-4" />
      case 'audit':
        return <Shield className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h2>
          <p className="text-muted-foreground">
            Track compliance metrics, certifications, and regulatory requirements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Compliance Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Compliance Score</CardTitle>
          <CardDescription>Organization-wide compliance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-4">
              <span className={`text-6xl font-bold ${getScoreColor(complianceMetrics.overallScore)}`}>
                {complianceMetrics.overallScore}%
              </span>
              <div className="flex items-center text-sm">
                {complianceMetrics.scoreChange > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+{complianceMetrics.scoreChange}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-600">{complianceMetrics.scoreChange}%</span>
                  </>
                )}
                <span className="text-muted-foreground ml-1">from last period</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Compliant Documents</p>
                <p className="text-2xl font-semibold text-green-600">
                  {complianceMetrics.compliantDocuments}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Non-Compliant</p>
                <p className="text-2xl font-semibold text-red-600">
                  {complianceMetrics.totalDocuments - complianceMetrics.compliantDocuments}
                </p>
              </div>
            </div>
          </div>
          <Progress 
            value={complianceMetrics.overallScore} 
            className="mt-4 h-3"
          />
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Documents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceMetrics.expiredDocuments}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceMetrics.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              {complianceMetrics.overdueReviews} overdue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Certifications</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceMetrics.certificationsValid}</div>
            <p className="text-xs text-muted-foreground">
              {complianceMetrics.certificationsExpiring} expiring soon
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Audits</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceMetrics.upcomingAudits}</div>
            <p className="text-xs text-muted-foreground">Next 90 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Tabs */}
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* By Category Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance by Document Category</CardTitle>
              <CardDescription>Breakdown of compliance across document types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceByCategory.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">
                          {item.compliant} / {item.total} documents
                        </span>
                        <span className={`font-semibold ${getScoreColor(item.percentage)}`}>
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Department Tab */}
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Departmental Compliance</CardTitle>
              <CardDescription>Compliance scores by department</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Issues</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceByDepartment.map((dept) => (
                    <TableRow key={dept.department}>
                      <TableCell className="font-medium">{dept.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={dept.score} className="w-20 h-2" />
                          <span className={`font-semibold ${getScoreColor(dept.score)}`}>
                            {dept.score}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{dept.documents}</TableCell>
                      <TableCell>
                        {dept.issues === 0 ? (
                          <span className="text-green-600">No issues</span>
                        ) : (
                          <span className="text-orange-600">{dept.issues} issues</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {dept.score >= 98 ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Excellent
                          </Badge>
                        ) : dept.score >= 95 ? (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Good
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3 mr-1" />
                            Needs Attention
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Deadlines Tab */}
        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Compliance Deadlines</CardTitle>
              <CardDescription>Critical dates requiring action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <Card key={deadline.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            deadline.type === 'certification' ? 'bg-purple-100' :
                            deadline.type === 'audit' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}>
                            {getTypeIcon(deadline.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{deadline.name}</p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                Due: {deadline.deadline}
                              </span>
                              <span className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {deadline.daysLeft} days left
                              </span>
                              <span className="flex items-center">
                                <Users className="mr-1 h-3 w-3" />
                                {deadline.owner}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(deadline.priority)}
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
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

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Standards</CardTitle>
              <CardDescription>Active certifications and compliance standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <Card key={cert.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Award className="h-5 w-5 text-muted-foreground" />
                            <h4 className="font-semibold">{cert.name}</h4>
                            {cert.status === 'valid' ? (
                              <Badge className="bg-green-100 text-green-700">Valid</Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-700">Expiring Soon</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{cert.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Certification Body</p>
                              <p className="font-medium">{cert.certBody}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Scope</p>
                              <p className="font-medium">{cert.scope}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Issue Date</p>
                              <p className="font-medium">{cert.issueDate}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Expiry Date</p>
                              <p className="font-medium">{cert.expiryDate}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Certificate
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
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
      </Tabs>
    </div>
  )
}