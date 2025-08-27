// app/dashboard/categories/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import { Switch } from "@/components/ui/switch"
import { 
  FolderOpen,
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Settings,
  Copy,
  Archive,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileCode,
  FileSpreadsheet,
  FileType,
  Paperclip,
  Tag
} from "lucide-react"

// Mock data - replace with actual API calls
const categories = [
  {
    id: 1,
    code: 'SOP',
    name: 'Standard Operating Procedure',
    description: 'Detailed written instructions to achieve uniformity of performance',
    prefix: 'QMS-SOP',
    color: 'bg-blue-500',
    icon: FileText,
    documentCount: 342,
    active: true,
    retentionDays: 1095, // 3 years
    reviewCycle: 365, // 1 year
    approvalLevels: 3,
    template: true,
    fields: [
      { name: 'Purpose', type: 'text', required: true },
      { name: 'Scope', type: 'text', required: true },
      { name: 'Responsibilities', type: 'text', required: true },
      { name: 'Procedure', type: 'richtext', required: true }
    ]
  },
  {
    id: 2,
    code: 'WI',
    name: 'Work Instruction',
    description: 'Step-by-step guide to perform specific tasks',
    prefix: 'WI',
    color: 'bg-green-500',
    icon: FileCode,
    documentCount: 256,
    active: true,
    retentionDays: 730, // 2 years
    reviewCycle: 180, // 6 months
    approvalLevels: 2,
    template: true,
    fields: [
      { name: 'Task', type: 'text', required: true },
      { name: 'Materials', type: 'text', required: false },
      { name: 'Steps', type: 'richtext', required: true },
      { name: 'Safety', type: 'text', required: true }
    ]
  },
  {
    id: 3,
    code: 'FRM',
    name: 'Form',
    description: 'Templates and forms for data collection',
    prefix: 'FRM',
    color: 'bg-purple-500',
    icon: FileSpreadsheet,
    documentCount: 198,
    active: true,
    retentionDays: 365, // 1 year
    reviewCycle: 365, // 1 year
    approvalLevels: 1,
    template: false,
    fields: []
  },
  {
    id: 4,
    code: 'POL',
    name: 'Policy',
    description: 'High-level organizational policies and guidelines',
    prefix: 'POL',
    color: 'bg-orange-500',
    icon: Shield,
    documentCount: 87,
    active: true,
    retentionDays: 2555, // 7 years
    reviewCycle: 730, // 2 years
    approvalLevels: 4,
    template: true,
    fields: [
      { name: 'Policy Statement', type: 'richtext', required: true },
      { name: 'Applicability', type: 'text', required: true },
      { name: 'Compliance', type: 'text', required: true }
    ]
  },
  {
    id: 5,
    code: 'REC',
    name: 'Record',
    description: 'Quality records and evidence of compliance',
    prefix: 'REC',
    color: 'bg-red-500',
    icon: Archive,
    documentCount: 364,
    active: true,
    retentionDays: 2555, // 7 years
    reviewCycle: 0, // No review cycle
    approvalLevels: 0,
    template: false,
    fields: []
  }
]

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'richtext', label: 'Rich Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'file', label: 'File Upload' }
]

export default function CategoriesPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({
    code: '',
    name: '',
    description: '',
    prefix: '',
    retentionDays: 365,
    reviewCycle: 365,
    approvalLevels: 1,
    template: false
  })

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Filter categories
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddCategory = () => {
    console.log('Adding category:', newCategory)
    setIsAddCategoryOpen(false)
    // Reset form
    setNewCategory({
      code: '',
      name: '',
      description: '',
      prefix: '',
      retentionDays: 365,
      reviewCycle: 365,
      approvalLevels: 1,
      template: false
    })
  }

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category)
    setIsEditCategoryOpen(true)
  }

  const formatDays = (days: number) => {
    if (days === 0) return 'N/A'
    if (days < 365) return `${days} days`
    const years = Math.floor(days / 365)
    return years === 1 ? '1 year' : `${years} years`
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Document Categories</h2>
          <p className="text-muted-foreground">
            Manage document types, templates, and retention policies
          </p>
        </div>
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new document category with its configuration
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Category Code</Label>
                  <Input
                    id="code"
                    value={newCategory.code}
                    onChange={(e) => setNewCategory({ ...newCategory, code: e.target.value })}
                    placeholder="e.g., SOP"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prefix">Document Prefix</Label>
                  <Input
                    id="prefix"
                    value={newCategory.prefix}
                    onChange={(e) => setNewCategory({ ...newCategory, prefix: e.target.value })}
                    placeholder="e.g., QMS-SOP"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g., Standard Operating Procedure"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Describe the purpose of this category"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="retention">Retention Period</Label>
                  <Select
                    value={newCategory.retentionDays.toString()}
                    onValueChange={(value) => setNewCategory({ ...newCategory, retentionDays: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="730">2 years</SelectItem>
                      <SelectItem value="1095">3 years</SelectItem>
                      <SelectItem value="1825">5 years</SelectItem>
                      <SelectItem value="2555">7 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review">Review Cycle</Label>
                  <Select
                    value={newCategory.reviewCycle.toString()}
                    onValueChange={(value) => setNewCategory({ ...newCategory, reviewCycle: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No review</SelectItem>
                      <SelectItem value="90">3 months</SelectItem>
                      <SelectItem value="180">6 months</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="730">2 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approval">Approval Levels</Label>
                  <Select
                    value={newCategory.approvalLevels.toString()}
                    onValueChange={(value) => setNewCategory({ ...newCategory, approvalLevels: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No approval</SelectItem>
                      <SelectItem value="1">1 level</SelectItem>
                      <SelectItem value="2">2 levels</SelectItem>
                      <SelectItem value="3">3 levels</SelectItem>
                      <SelectItem value="4">4 levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="template"
                  checked={newCategory.template}
                  onCheckedChange={(checked) => setNewCategory({ ...newCategory, template: checked })}
                />
                <Label htmlFor="template" className="cursor-pointer">
                  Enable document template for this category
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>
                Create Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Document types</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.documentCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Templates</CardTitle>
            <FileType className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(cat => cat.template).length}
            </div>
            <p className="text-xs text-muted-foreground">Template enabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(cat => cat.active).length}
            </div>
            <p className="text-xs text-muted-foreground">Categories in use</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Configure document categories and their properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 max-w-sm"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {category.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {category.code} • {category.prefix}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Configure Template
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Documents</span>
                        <span className="font-medium">{category.documentCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Retention</span>
                        <span className="font-medium">{formatDays(category.retentionDays)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Review Cycle</span>
                        <span className="font-medium">{formatDays(category.reviewCycle)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Approvals</span>
                        <span className="font-medium">
                          {category.approvalLevels === 0 ? 'None' : `${category.approvalLevels} levels`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {category.template ? (
                            <>
                              <FileCode className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">Template enabled</span>
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">No template</span>
                            </>
                          )}
                        </div>
                        {category.active ? (
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                    </div>

                    {category.template && category.fields.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Template Fields</p>
                        <div className="flex flex-wrap gap-1">
                          {category.fields.map((field, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {field.name}
                              {field.required && <span className="ml-1 text-red-500">*</span>}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No categories found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}