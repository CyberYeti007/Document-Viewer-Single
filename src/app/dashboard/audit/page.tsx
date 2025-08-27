// app/dashboard/audit/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { 
  FileText,
  Download,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Activity,
  Shield,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Lock,
} from "lucide-react"
import LoadingIcon from '@/components/layout/loading-icon'

// Mock data - replace with actual API calls
const auditEvents = [
  {
    id: 1,
    timestamp: '2024-12-23T14:30:00',
    user: 'John Smith',
    userEmail: 'john.smith@mazdatoyota.com',
    action: 'Document Approved',
    actionType: 'approval',
    documentId: 'QMS-SOP-001',
    documentName: 'Document Control Procedure',
    details: 'Document approved and published',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/120.0.0.0'
  },
  {
    id: 2,
    timestamp: '2024-12-23T13:45:00',
    user: 'Sarah Johnson',
    userEmail: 'sarah.johnson@mazdatoyota.com',
    action: 'User Role Changed',
    actionType: 'security',
    documentId: null,
    documentName: null,
    details: 'Changed role for Mike Davis from Editor to Reviewer',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox/121.0'
  },
  {
    id: 3,
    timestamp: '2024-12-23T12:20:00',
    user: 'Mike Davis',
    userEmail: 'mike.davis@mazdatoyota.com',
    action: 'Document Updated',
    actionType: 'modify',
    documentId: 'WI-PRD-045',
    documentName: 'Product Inspection Work Instruction',
    details: 'Updated section 3.2 - Inspection criteria',
    ipAddress: '192.168.1.102',
    userAgent: 'Edge/120.0.0.0'
  },
  {
    id: 4,
    timestamp: '2024-12-23T11:00:00',
    user: 'Emma Wilson',
    userEmail: 'emma.wilson@mazdatoyota.com',
    action: 'Document Viewed',
    actionType: 'access',
    documentId: 'FRM-QA-012',
    documentName: 'Non-Conformance Report Form',
    details: 'Document accessed and viewed',
    ipAddress: '192.168.1.103',
    userAgent: 'Safari/17.2'
  },
  {
    id: 5,
    timestamp: '2024-12-23T10:30:00',
    user: 'Tom Brown',
    userEmail: 'tom.brown@mazdatoyota.com',
    action: 'Document Downloaded',
    actionType: 'download',
    documentId: 'POL-HR-005',
    documentName: 'Code of Conduct Policy',
    details: 'PDF version downloaded',
    ipAddress: '192.168.1.104',
    userAgent: 'Chrome/120.0.0.0'
  },
  {
    id: 6,
    timestamp: '2024-12-23T09:15:00',
    user: 'John Smith',
    userEmail: 'john.smith@mazdatoyota.com',
    action: 'Login Success',
    actionType: 'authentication',
    documentId: null,
    documentName: null,
    details: 'User successfully logged in',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/120.0.0.0'
  },
  {
    id: 7,
    timestamp: '2024-12-22T16:45:00',
    user: 'Sarah Johnson',
    userEmail: 'sarah.johnson@mazdatoyota.com',
    action: 'Document Deleted',
    actionType: 'delete',
    documentId: 'TMP-001',
    documentName: 'Temporary Test Document',
    details: 'Document permanently deleted',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox/121.0'
  },
  {
    id: 8,
    timestamp: '2024-12-22T15:30:00',
    user: 'System',
    userEmail: 'system@mazdatoyota.com',
    action: 'Automatic Backup',
    actionType: 'system',
    documentId: null,
    documentName: null,
    details: 'Daily backup completed successfully',
    ipAddress: 'N/A',
    userAgent: 'System Process'
  }
]

const actionTypes = [
  { value: 'all', label: 'All Actions' },
  { value: 'approval', label: 'Approvals' },
  { value: 'modify', label: 'Modifications' },
  { value: 'access', label: 'Access' },
  { value: 'download', label: 'Downloads' },
  { value: 'delete', label: 'Deletions' },
  { value: 'security', label: 'Security' },
  { value: 'authentication', label: 'Authentication' },
  { value: 'system', label: 'System' }
]

export default function AuditTrailPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedActionType, setSelectedActionType] = useState('all')
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [showFilters, setShowFilters] = useState(false)

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIcon />
      </div>
    )
  }

  // Filter audit events
  const filteredEvents = auditEvents.filter(event => {
    const matchesSearch = 
      event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.documentId && event.documentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.documentName && event.documentName.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = selectedActionType === 'all' || event.actionType === selectedActionType
    
    const eventDate = new Date(event.timestamp)
    const matchesDateFrom = !dateFrom || eventDate >= dateFrom
    const matchesDateTo = !dateTo || eventDate <= dateTo

    return matchesSearch && matchesType && matchesDateFrom && matchesDateTo
  })

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'modify':
        return <Edit className="h-4 w-4 text-blue-500" />
      case 'access':
        return <Eye className="h-4 w-4 text-gray-500" />
      case 'download':
        return <Download className="h-4 w-4 text-indigo-500" />
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />
      case 'security':
        return <Shield className="h-4 w-4 text-orange-500" />
      case 'authentication':
        return <Lock className="h-4 w-4 text-purple-500" />
      case 'system':
        return <Activity className="h-4 w-4 text-cyan-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActionBadge = (actionType: string) => {
    const colors: Record<string, string> = {
      approval: 'bg-green-100 text-green-700',
      modify: 'bg-blue-100 text-blue-700',
      access: 'bg-gray-100 text-gray-700',
      download: 'bg-indigo-100 text-indigo-700',
      delete: 'bg-red-100 text-red-700',
      security: 'bg-orange-100 text-orange-700',
      authentication: 'bg-purple-100 text-purple-700',
      system: 'bg-cyan-100 text-cyan-700'
    }
    
    return (
      <Badge className={cn('font-normal', colors[actionType] || 'bg-gray-100 text-gray-700')}>
        {actionType}
      </Badge>
    )
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const exportAuditLog = () => {
    // Implementation for exporting audit log
    console.log('Exporting audit log...')
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Trail</h2>
          <p className="text-muted-foreground">
            Complete log of all system activities and document changes
          </p>
        </div>
        <Button onClick={exportAuditLog}>
          <Download className="mr-2 h-4 w-4" />
          Export Log
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+23% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Document Changes</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">Updates & approvals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Role & access changes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserPlus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">In the last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Filter and search through all system events</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user, action, or document..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select
                value={selectedActionType}
                onValueChange={setSelectedActionType}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="grid gap-4 md:grid-cols-2 p-4 border rounded-lg">
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
                        {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
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
                        {dateTo ? format(dateTo, "PPP") : "Pick a date"}
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
            )}
          </div>

          {/* Audit Events Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-sm">
                      {new Date(event.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getUserInitials(event.user)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{event.user}</p>
                          <p className="text-xs text-muted-foreground">{event.userEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getActionIcon(event.actionType)}
                        <div>
                          <p className="text-sm">{event.action}</p>
                          <div className="mt-1">{getActionBadge(event.actionType)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.documentId ? (
                        <div>
                          <p className="text-sm font-medium">{event.documentId}</p>
                          <p className="text-xs text-muted-foreground">{event.documentName}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate">{event.details}</p>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p className="font-mono">{event.ipAddress}</p>
                        <p className="text-muted-foreground">{event.userAgent.split('/')[0]}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredEvents.length} of {auditEvents.length} events
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}