'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, FileText, Users, Settings, BarChart3 } from "lucide-react"

interface RoleSummaryProps {
  role: string
  permissions: string[]
  description?: string
}

// Permission icons mapping
const permissionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'create_docs': FileText,
  'edit_docs': FileText,
  'delete_docs': FileText,
  'approve_docs': CheckCircle,
  'view_audit': BarChart3,
  'export_reports': BarChart3,
  'manage_users': Users,
  'manage_roles': Shield,
  'system_settings': Settings,
}

// Permission display names
const permissionNames: Record<string, string> = {
  'create_docs': 'Create Documents',
  'edit_docs': 'Edit Documents',
  'delete_docs': 'Delete Documents',
  'approve_docs': 'Approve Documents',
  'view_audit': 'View Audit Trail',
  'export_reports': 'Export Reports',
  'manage_users': 'Manage Users',
  'manage_roles': 'Manage Roles',
  'system_settings': 'System Settings',
}

export function RoleSummaryCard({ role, permissions, description }: RoleSummaryProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {role}
          </CardTitle>
          <Badge variant="secondary">{permissions.length} permissions</Badge>
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {permissions.map((permission) => {
            const Icon = permissionIcons[permission] || FileText
            return (
              <div
                key={permission}
                className="flex items-center gap-2 text-sm p-2 rounded-md bg-muted/50"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{permissionNames[permission] || permission}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Role descriptions
const roleDescriptions: Record<string, string> = {
  'Admin': 'Full system access with all permissions',
  'Manager': 'Document management and approval capabilities',
  'Reviewer': 'Review and approve documents',
  'Editor': 'Create and edit documents',
  'Viewer': 'Read-only access to documents and audit trails'
}

export function RoleSummaryGrid({ 
  roles, 
  permissions 
}: { 
  roles: string[], 
  permissions: Record<string, string[]> 
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <RoleSummaryCard
          key={role}
          role={role}
          permissions={permissions[role] || []}
          description={roleDescriptions[role]}
        />
      ))}
    </div>
  )
}