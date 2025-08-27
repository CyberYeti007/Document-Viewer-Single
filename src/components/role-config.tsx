'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Shield } from "lucide-react"

interface RoleConfigProps {
  roles: string[]
  permissions: {
    id: string
    name: string
    description?: string
  }[]
  currentPermissions: Record<string, string[]>
  onPermissionChange: (role: string, permission: string, granted: boolean) => void
  readOnly?: boolean
}

export function RoleConfigMatrix({
  roles,
  permissions,
  currentPermissions,
  onPermissionChange,
  readOnly = false
}: RoleConfigProps) {
  return (
    <div className="space-y-6">
      {/* Role Legend */}
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <Badge key={role} variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {role}
          </Badge>
        ))}
      </div>

      {/* Permission Cards */}
      <div className="grid gap-4">
        {permissions.map((permission) => (
          <Card key={permission.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{permission.name}</CardTitle>
              {permission.description && (
                <CardDescription className="text-sm">
                  {permission.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {roles.map((role) => (
                  <div key={role} className="space-y-2">
                    <Label className="text-sm font-medium">{role}</Label>
                    <RadioGroup
                      disabled={readOnly}
                      value={
                        currentPermissions[role]?.includes(permission.id)
                          ? 'granted'
                          : 'denied'
                      }
                      onValueChange={(value) =>
                        onPermissionChange(
                          role,
                          permission.id,
                          value === 'granted'
                        )
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="granted"
                          id={`${permission.id}-${role}-granted`}
                          className="border-green-500 text-green-500"
                        />
                        <Label
                          htmlFor={`${permission.id}-${role}-granted`}
                          className="flex items-center cursor-pointer"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-xs">Grant</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="denied"
                          id={`${permission.id}-${role}-denied`}
                          className="border-red-500 text-red-500"
                        />
                        <Label
                          htmlFor={`${permission.id}-${role}-denied`}
                          className="flex items-center cursor-pointer"
                        >
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-xs">Deny</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}