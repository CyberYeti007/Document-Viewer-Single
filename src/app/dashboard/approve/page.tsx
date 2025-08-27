// app/dashboard/users/page.tsx
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { 
  Users,
  Shield,
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Building,
  CheckCircle,
  AlertTriangle,
  Key,
  Settings,
  UserCheck,
  UserX,
  ShieldCheck,
  Clock
} from "lucide-react"
import {CardTemplate} from "@/components/card-template";

// Mock data - replace with actual API calls
const mockUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@mazdatoyota.com',
    phone: '+1 (555) 123-4567',
    department: 'Quality Assurance',
    role: 'Manager',
    status: 'active',
    lastActive: '2024-12-23T14:30:00',
    createdDate: '2023-06-15',
    documentsOwned: 45,
    pendingReviews: 3,
    avatar: null
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@mazdatoyota.com',
    phone: '+1 (555) 234-5678',
    department: 'Management',
    role: 'Admin',
    status: 'active',
    lastActive: '2024-12-23T15:45:00',
    createdDate: '2023-01-10',
    documentsOwned: 0,
    pendingReviews: 0,
    avatar: null
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike.davis@mazdatoyota.com',
    phone: '+1 (555) 345-6789',
    department: 'Production',
    role: 'Editor',
    status: 'active',
    lastActive: '2024-12-20T09:15:00',
    createdDate: '2023-09-22',
    documentsOwned: 23,
    pendingReviews: 5,
    avatar: null
  },

  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma.wilson@mazdatoyota.com',
    phone: '+1 (555) 456-7890',
    department: 'Quality Assurance',
    role: 'Reviewer',
    status: 'pending',
    lastActive: null,
    createdDate: '2024-12-15',
    documentsOwned: 0,
    pendingReviews: 0,
    avatar: null
  },
  {
    id: 5,
    name: 'Tom Brown',
    email: 'tom.brown@mazdatoyota.com',
    phone: '+1 (555) 567-8901',
    department: 'HR',
    role: 'Viewer',
    status: 'locked',
    lastActive: '2024-12-16T11:30:00',
    createdDate: '2024-03-20',
    documentsOwned: 8,
    pendingReviews: 0,
    avatar: null
  }
]

const roles = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full system access with all permissions',
    color: 'bg-purple-500',
    users: 1,
    permissions: {
      documents: ['create', 'read', 'update', 'delete', 'approve'],
      users: ['create', 'read', 'update', 'delete'],
      system: ['settings', 'backup', 'audit'],
      reports: ['view', 'export', 'schedule']
    }
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Manage documents and approve changes',
    color: 'bg-blue-500',
    users: 1,
    permissions: {
      documents: ['create', 'read', 'update', 'delete', 'approve'],
      users: ['read'],
      system: ['audit'],
      reports: ['view', 'export']
    }
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    description: 'Review and approve document changes',
    color: 'bg-green-500',
    users: 1,
    permissions: {
      documents: ['read', 'update', 'approve'],
      users: ['read'],
      system: ['audit'],
      reports: ['view']
    }
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Create and edit documents',
    color: 'bg-orange-500',
    users: 1,
    permissions: {
      documents: ['create', 'read', 'update'],
      users: [],
      system: [],
      reports: ['view']
    }
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'View documents and reports only',
    color: 'bg-gray-500',
    users: 1,
    permissions: {
      documents: ['read'],
      users: [],
      system: [],
      reports: ['view']
    }
  }
]

const departments = [
  'Quality Assurance',
  'Production',
  'Management',
  'HR',
  'Engineering',
  'Finance',
  'IT',
  'Sales'
]

export default function UsersRolesPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: 'Viewer'
  })

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
      case 'pending':
        return <Badge className="bg-orange-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'locked':
        return <Badge className="bg-red-500"><Lock className="w-3 h-3 mr-1" />Locked</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    const roleData = roles.find(r => r.name === role)
    return (
      <Badge className={roleData?.color || 'bg-gray-500'}>
        <Shield className="w-3 h-3 mr-1" />
        {role}
      </Badge>
    )
  }

  const handleAddUser = () => {
    const newUserData = {
      id: users.length + 1,
      ...newUser,
      status: 'pending',
      lastActive: null,
      createdDate: new Date().toISOString().split('T')[0],
      documentsOwned: 0,
      pendingReviews: 0,
      avatar: null
    }
    setUsers([...users, newUserData])
    setIsAddUserOpen(false)
    setNewUser({
      name: '',
      email: '',
      phone: '',
      department: '',
      role: 'Viewer'
    })
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setIsEditUserOpen(true)
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId))
  }

  const handleToggleUserStatus = (userId: number) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'locked' : 'active'
        }
      }
      return user
    }))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users & Roles</h2>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and assign their role
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="user@mazdatoyota.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Select
                  value={newUser.department}
                  onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        <div className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          {role.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <CardTemplate title={"Total Users"}
                      label={<Users className="h-4 w-4 text-muted-foreground"/>}
                      content={
                      <><div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">Across all departments</p></>} />
        <CardTemplate title={"Active Users"}
                      content={<>
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground">Across all departments</p></>}
                      label={<UserCheck className="h-4 w-4 text-green-500" />} />
        <CardTemplate title={"Pending"}
                      label={<AlertTriangle className="h-4 w-4 text-orange-500" />}
                      content={<>
                        <div className="text-2xl font-bold">
                          {users.filter(u => u.status === 'pending').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Awaiting activation</p></>} />
        <CardTemplate title={"Locked"}
                      label={<UserX className="h-4 w-4 text-red-500" />}
                      content={<>
                        <div className="text-2xl font-bold">
                          {users.filter(u => u.status === 'locked').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Accounts locked</p> </>} />
        <CardTemplate title={"Roles"}
                      label={<ShieldCheck className="h-4 w-4 text-blue-500" />}
                      content={<>
                        <div className="text-2xl font-bold">{roles.length}</div>
                        <p className="text-xs text-muted-foreground">Defined roles</p> </>} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={user.avatar || undefined} />
                              <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building className="mr-1 h-3 w-3 text-muted-foreground" />
                            {user.department}
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{user.documentsOwned} owned</p>
                            {user.pendingReviews > 0 && (
                              <p className="text-orange-500">{user.pendingReviews} pending</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.lastActive ? (
                            <div className="text-sm">
                              <p>{new Date(user.lastActive).toLocaleDateString()}</p>
                              <p className="text-muted-foreground">
                                {new Date(user.lastActive).toLocaleTimeString()}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Key className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id)}>
                                {user.status === 'active' ? (
                                  <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Lock Account
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="mr-2 h-4 w-4" />
                                    Unlock Account
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${role.color}`}>
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <CardDescription>{role.users} users</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Document Permissions</h4>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.documents.map((perm) => (
                          <Badge key={perm} variant="secondary" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {role.permissions.users.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">User Permissions</h4>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.users.map((perm) => (
                            <Badge key={perm} variant="secondary" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {role.permissions.system.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">System Permissions</h4>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.system.map((perm) => (
                            <Badge key={perm} variant="secondary" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {role.permissions.reports.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Report Permissions</h4>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.reports.map((perm) => (
                            <Badge key={perm} variant="secondary" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Permissions Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Permissions Matrix</CardTitle>
              <CardDescription>Configure granular permissions for each role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Permission</TableHead>
                      {roles.map((role) => (
                        <TableHead key={role.id} className="text-center">
                          <div className="flex flex-col items-center">
                            <Shield className={`h-4 w-4 mb-1 ${role.color.replace('bg-', 'text-')}`} />
                            {role.name}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} className="font-medium bg-muted">
                        Document Management
                      </TableCell>
                    </TableRow>
                    {['Create Documents', 'Edit Documents', 'Delete Documents', 'Approve Documents', 'View Documents'].map((perm) => (
                      <TableRow key={perm}>
                        <TableCell>{perm}</TableCell>
                        {roles.map((role) => (
                          <TableCell key={role.id} className="text-center">
                            <Switch 
                              checked={role.permissions.documents.includes(perm.toLowerCase().split(' ')[0])}
                              onCheckedChange={() => {}}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    
                    <TableRow>
                      <TableCell colSpan={6} className="font-medium bg-muted">
                        User Management
                      </TableCell>
                    </TableRow>
                    {['Create Users', 'Edit Users', 'Delete Users', 'View Users'].map((perm) => (
                      <TableRow key={perm}>
                        <TableCell>{perm}</TableCell>
                        {roles.map((role) => (
                          <TableCell key={role.id} className="text-center">
                            <Switch 
                              checked={role.permissions.users.includes(perm.toLowerCase().split(' ')[0])}
                              onCheckedChange={() => {}}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button>
                  <Settings className="mr-2 h-4 w-4" />
                  Save Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}