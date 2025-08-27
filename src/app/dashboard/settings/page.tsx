// app/dashboard/settings/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Mail,
  Database,
  Users,
  RefreshCw,
  Save,
  Archive
} from "lucide-react"

export default function SettingsPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  // Form states
  const [companyName, setCompanyName] = useState('Mazda Toyota Manufacturing')
  const [emailDomain, setEmailDomain] = useState('mazdatoyota.com')
  const [timezone, setTimezone] = useState('America/Chicago')
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState({
    documentExpiring: true,
    reviewPending: true,
    documentApproved: true,
    systemAlerts: true,
    weeklyReport: false,
    monthlyReport: true
  })

  // Document settings
  const [documentSettings, setDocumentSettings] = useState({
    autoNumbering: true,
    requireApproval: true,
    versionControl: true,
    watermark: false,
    defaultRetention: '3',
    maxFileSize: '10'
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    minPasswordLength: '8',
    requireComplexPassword: true,
    ipWhitelist: false
  })

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleSaveGeneral = () => {
    console.log('Saving general settings...')
  }

  const handleBackup = () => {
    console.log('Starting backup...')
  }

  const handleRestore = () => {
    console.log('Starting restore...')
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage system configuration and preferences
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Email Domain</Label>
                    <Input
                      id="domain"
                      value={emailDomain}
                      onChange={(e) => setEmailDomain(e.target.value)}
                      placeholder="@mazdatoyota.com"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Regional Settings</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select value={dateFormat} onValueChange={setDateFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">System Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version</span>
                      <span>2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>December 15, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">License</span>
                      <span>Enterprise</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Support</span>
                      <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure when you receive email alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Document Expiring</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when documents are approaching expiration
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications.documentExpiring}
                    onCheckedChange={(checked) => 
                      setEmailNotifications({ ...emailNotifications, documentExpiring: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Review Pending</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when documents are assigned for review
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications.reviewPending}
                    onCheckedChange={(checked) => 
                      setEmailNotifications({ ...emailNotifications, reviewPending: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Document Approved</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when your documents are approved
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications.documentApproved}
                    onCheckedChange={(checked) => 
                      setEmailNotifications({ ...emailNotifications, documentApproved: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important system notifications and maintenance
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications.systemAlerts}
                    onCheckedChange={(checked) => 
                      setEmailNotifications({ ...emailNotifications, systemAlerts: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Report Subscriptions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Summary</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly compliance summary every Monday
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.weeklyReport}
                      onCheckedChange={(checked) => 
                        setEmailNotifications({ ...emailNotifications, weeklyReport: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Monthly Report</Label>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive monthly compliance report
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.monthlyReport}
                      onCheckedChange={(checked) => 
                        setEmailNotifications({ ...emailNotifications, monthlyReport: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Settings */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Management Settings</CardTitle>
              <CardDescription>Configure document handling preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-numbering</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate document IDs
                    </p>
                  </div>
                  <Switch
                    checked={documentSettings.autoNumbering}
                    onCheckedChange={(checked) => 
                      setDocumentSettings({ ...documentSettings, autoNumbering: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      All documents must go through approval workflow
                    </p>
                  </div>
                  <Switch
                    checked={documentSettings.requireApproval}
                    onCheckedChange={(checked) => 
                      setDocumentSettings({ ...documentSettings, requireApproval: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Version Control</Label>
                    <p className="text-sm text-muted-foreground">
                      Track all document versions and changes
                    </p>
                  </div>
                  <Switch
                    checked={documentSettings.versionControl}
                    onCheckedChange={(checked) => 
                      setDocumentSettings({ ...documentSettings, versionControl: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Watermark</Label>
                    <p className="text-sm text-muted-foreground">
                      Add watermark to downloaded documents
                    </p>
                  </div>
                  <Switch
                    checked={documentSettings.watermark}
                    onCheckedChange={(checked) => 
                      setDocumentSettings({ ...documentSettings, watermark: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="retention">Default Retention Period</Label>
                  <Select 
                    value={documentSettings.defaultRetention} 
                    onValueChange={(value) => 
                      setDocumentSettings({ ...documentSettings, defaultRetention: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 year</SelectItem>
                      <SelectItem value="3">3 years</SelectItem>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="7">7 years</SelectItem>
                      <SelectItem value="0">Permanent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filesize">Max File Size (MB)</Label>
                  <Input
                    id="filesize"
                    type="number"
                    value={documentSettings.maxFileSize}
                    onChange={(e) => 
                      setDocumentSettings({ ...documentSettings, maxFileSize: e.target.value })
                    }
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all users
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactor}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({ ...securitySettings, twoFactor: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict access to specific IP addresses
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.ipWhitelist}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({ ...securitySettings, ipWhitelist: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => 
                      setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => 
                      setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Requirements</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={securitySettings.minPasswordLength}
                      onChange={(e) => 
                        setSecuritySettings({ ...securitySettings, minPasswordLength: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      checked={securitySettings.requireComplexPassword}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({ ...securitySettings, requireComplexPassword: checked })
                      }
                    />
                    <Label>Require complex passwords</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Integrations</CardTitle>
              <CardDescription>Connect with external systems and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Email Server (SMTP)</h4>
                          <p className="text-sm text-muted-foreground">Send notifications and reports</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Connected</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-orange-100">
                          <Users className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Active Directory</h4>
                          <p className="text-sm text-muted-foreground">Single sign-on authentication</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-purple-100">
                          <Database className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">ERP System</h4>
                          <p className="text-sm text-muted-foreground">Import/export document data</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Restore */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Manage system backups and data recovery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Backup</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Last backup: December 22, 2024 at 3:00 AM
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Backup size: 2.4 GB
                      </p>
                    </div>
                    <Button onClick={handleBackup} className="w-full">
                      <Archive className="mr-2 h-4 w-4" />
                      Create Backup Now
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Restore</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Restore from a previous backup
                      </p>
                      <p className="text-sm text-orange-600">
                        Warning: This will overwrite current data
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleRestore} className="w-full">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Restore from Backup
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Automatic Backups</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">
                        Daily backups at 3:00 AM
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>Retention Period</Label>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}