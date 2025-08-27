'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Users,
  Shield,
  Activity,
  Search,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Save,
  X
} from "lucide-react"
import { CardTemplate } from '@/components/card-template'

// Mock data - replace with actual API calls
const systemStats = {
  totalUsers: 156,
  activeUsers: 145,
  pendingApprovals: 8,
  lockedAccounts: 3,
  rolesInUse: 5
}

// Define roles
const roles = ['Admin', 'Manager', 'Reviewer', 'Editor', 'Viewer'] as const
type Role = typeof roles[number]

// Define permissions
const permissions = [
  { id: 'create_docs', name: 'Create Documents', category: 'Documents' },
  { id: 'edit_docs', name: 'Edit Documents', category: 'Documents' },
  { id: 'delete_docs', name: 'Delete Documents', category: 'Documents' },
  { id: 'approve_docs', name: 'Approve Documents', category: 'Documents' },
  { id: 'view_audit', name: 'View Audit Trail', category: 'Audit' },
  { id: 'export_reports', name: 'Export Reports', category: 'Reports' },
  { id: 'manage_users', name: 'Manage Users', category: 'Administration' },
  { id: 'manage_roles', name: 'Manage Roles', category: 'Administration' },
  { id: 'system_settings', name: 'System Settings', category: 'Administration' },
]

const defaultPermissions: Record<Role, string[]> = {
  'Admin': ['create_docs', 'edit_docs', 'delete_docs', 'approve_docs', 'view_audit', 'export_reports', 'manage_users', 'manage_roles', 'system_settings'],
  'Manager': ['create_docs', 'edit_docs', 'delete_docs', 'approve_docs', 'view_audit', 'export_reports'],
  'Reviewer': ['edit_docs', 'approve_docs', 'view_audit', 'export_reports'],
  'Editor': ['create_docs', 'edit_docs', 'view_audit'],
  'Viewer': ['view_audit']
}

// Mock users data
const mockUsers = [
  { id: 1, name: 'John Smith', email: 'john.smith@mazdatoyota.com', role: 'Manager', status: 'active', lastActive: '2 hours ago' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@mazdatoyota.com', role: 'Admin', status: 'active', lastActive: '1 hour ago' },
  { id: 3, name: 'Mike Davis', email: 'mike.d@mazdatoyota.com', role: 'Editor', status: 'active', lastActive: '3 days ago' },
  { id: 4, name: 'Emma Wilson', email: 'emma.w@mazdatoyota.com', role: 'Reviewer', status: 'pending', lastActive: 'Never' },
  { id: 5, name: 'Tom Brown', email: 'tom.b@mazdatoyota.com', role: 'Viewer', status: 'locked', lastActive: '1 week ago' },
]

export default function AdminDashboardPage()  {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [users, setUsers] = useState(mockUsers)
  const [rolePermissions, setRolePermissions] = useState<Record<Role, string[]>>(defaultPermissions)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleRoleChange = (userId: number, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
    setEditingUserId(null)
  }
  const handlePermissionChange = (role: Role, permission: string, granted: boolean) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: granted 
        ? [...(prev[role] || []), permission]
        : (prev[role] || []).filter(p => p !== permission)
    }))
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Administration Dashboard
        </h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <CardTemplate
          title="Total Users"
          label={<Users className="h-4 w-4 text-muted-foreground" />}
          content={
            <>
              <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </> } />
        <CardTemplate 
          title="Active Users"
          label={<Activity className="h-4 w-4 text-green-500" />}
          content={
            <>
              <div className="text-2xl font-bold">{systemStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </>}/>
        <CardTemplate
          title="Pending Approvals"
          label={<AlertTriangle className="h-4 w-4 text-orange-500" />}
          content={
            <>
              <div className="text-2xl font-bold">{systemStats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </>}/>
        <CardTemplate 
          title="Locked" 
          label={<XCircle className="h-4 w-4 text-red-500" />} 
          content={
            <>
            <div className="text-2xl font-bold">{systemStats.lockedAccounts}</div>
            <p className="text-xs text-muted-foreground">Accounts locked</p>
            </>
          }
        />
        <CardTemplate
          title="Roles"
          label={<Shield />}
          content={
            <>
              <div className="text-2xl font-bold">{systemStats.rolesInUse}</div>
              <p className="text-xs text-muted-foreground">Roles in use</p>            
            </>
          } />
      </div>

      {/* Main Content - Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Role Matrix</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and their assigned roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search */}
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {/* Users Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {editingUserId === user.id ? (
                            <div className="flex items-center space-x-2">
                              <select
                                className="border rounded px-2 py-1"
                                defaultValue={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              >
                                {roles.map((role) => (
                                  <option key={role} value={role}>{role}</option>
                                ))}
                              </select>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setEditingUserId(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="outline">{user.role}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.status === 'active' && (
                            <Badge className="bg-green-500">Active</Badge>
                          )}
                          {user.status === 'pending' && (
                            <Badge className="bg-orange-500">Pending</Badge>
                          )}
                          {user.status === 'locked' && (
                            <Badge className="bg-red-500">Locked</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.lastActive}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingUserId(user.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Matrix Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions Matrix</CardTitle>
              <CardDescription>Configure permissions for each role using the radio buttons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Permission</TableHead>
                      {roles.map((role) => (
                        <TableHead key={role} className="text-center">
                          <div className="flex flex-col items-center">
                            <Shield className="h-4 w-4 mb-1" />
                            {role}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{permission.name}</p>
                            <p className="text-xs text-muted-foreground">{permission.category}</p>
                          </div>
                        </TableCell>
                        {roles.map((role) => (
                          <TableCell key={role} className="text-center">
                            <RadioGroup
                              value={rolePermissions[role]?.includes(permission.id) ? 'granted' : 'denied'}
                              onValueChange={(value) => 
                                handlePermissionChange(role, permission.id, value === 'granted')
                              }
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <div className="flex items-center">
                                  <RadioGroupItem 
                                    value="granted" 
                                    id={`${permission.id}-${role}-granted`}
                                    className="border-green-500 text-green-500"
                                  />
                                  <Label 
                                    htmlFor={`${permission.id}-${role}-granted`}
                                    className="ml-1 cursor-pointer"
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </Label>
                                </div>
                                <div className="flex items-center">
                                  <RadioGroupItem 
                                    value="denied" 
                                    id={`${permission.id}-${role}-denied`}
                                    className="border-red-500 text-red-500"
                                  />
                                  <Label 
                                    htmlFor={`${permission.id}-${role}-denied`}
                                    className="ml-1 cursor-pointer"
                                  >
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  </Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Role Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

