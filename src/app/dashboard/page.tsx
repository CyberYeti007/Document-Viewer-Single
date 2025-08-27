'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Users,
  Shield,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  FolderOpen,
  Bell,
  BarChart3,
  PieChart,
  Download,
  Eye,
  RefreshCw,
  ArrowRight,
  Star,
  Zap,
  Target,
  Award
} from "lucide-react"
import LoadingIcon from '@/components/layout/loading-icon'
import QuickActionBar from '@/components/layout/quick-action-bar'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart as RePieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

export default function EnhancedDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  // Fetch dashboard stats
  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIcon />
      </div>
    )
  }

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  
  // Sample data for radar chart
  const performanceData = [
    { metric: 'Quality', value: 92 },
    { metric: 'Compliance', value: 88 },
    { metric: 'Efficiency', value: 78 },
    { metric: 'Security', value: 95 },
    { metric: 'Documentation', value: 85 },
    { metric: 'Training', value: 72 }
  ]

  // Recent activities
  const recentActivities = [
    { id: 1, action: 'Document approved', user: 'Sarah Chen', time: '2 minutes ago', type: 'success' },
    { id: 2, action: 'New file uploaded', user: 'Mike Johnson', time: '15 minutes ago', type: 'info' },
    { id: 3, action: 'Compliance check passed', user: 'System', time: '1 hour ago', type: 'success' },
    { id: 4, action: 'Review requested', user: 'Alex Park', time: '2 hours ago', type: 'warning' },
    { id: 5, action: 'Document expired', user: 'System', time: '3 hours ago', type: 'error' }
  ]

  // Top contributors
  const topContributors = [
    { name: 'Sarah Chen', documents: 45, score: 98 },
    { name: 'Mike Johnson', documents: 38, score: 94 },
    { name: 'Alex Park', documents: 32, score: 91 },
    { name: 'Emily Davis', documents: 28, score: 89 }
  ]

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Welcome back, {session?.user?.name || 'User'}
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your documents today
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={fetchDashboardStats}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
            <Badge className="ml-2" variant="destructive">3</Badge>
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Quick Actions with animations */}
      <QuickActionBar />

      {/* Key Metrics Cards with animations */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDocuments || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span> from last month
            </div>
            <Progress value={75} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingApprovals || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 text-orange-500 mr-1" />
              <span>Requires attention</span>
            </div>
            <Progress value={35} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.complianceScore || 0}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+2.5%</span> improvement
            </div>
            <Progress value={stats?.complianceScore || 0} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.teamMembers || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-blue-500 mr-1" />
              <span>{stats?.recentActivity || 0} active today</span>
            </div>
            <Progress value={65} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area with Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        {/* Document Upload Trends */}
        <Card className="col-span-4 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Document Upload Trends</CardTitle>
                <CardDescription>Monthly document uploads over time</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant={selectedPeriod === 'week' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedPeriod('week')}>
                  Week
                </Button>
                <Button variant={selectedPeriod === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedPeriod('month')}>
                  Month
                </Button>
                <Button variant={selectedPeriod === 'year' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedPeriod('year')}>
                  Year
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats?.monthlyUploads || []}>
                <defs>
                  <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorUploads)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Categories */}
        <Card className="col-span-3 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Document Categories</CardTitle>
            <CardDescription>Distribution by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={stats?.documentsByCategory || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, count }) => `${category}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(stats?.documentsByCategory || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Document Status */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Document Status</CardTitle>
            <CardDescription>Current status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.documentsByStatus || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Radar */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Performance" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
            <CardDescription>Most active team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index === 0 ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {index === 0 ? <Award className="h-4 w-4 text-yellow-600" /> : <span className="text-sm font-medium">{index + 1}</span>}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{contributor.name}</p>
                      <p className="text-xs text-muted-foreground">{contributor.documents} documents</p>
                    </div>
                  </div>
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    {contributor.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-100' :
                  activity.type === 'warning' ? 'bg-orange-100' :
                  activity.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> :
                   activity.type === 'warning' ? <AlertTriangle className="h-4 w-4 text-orange-600" /> :
                   activity.type === 'error' ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
                   <Activity className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">by {activity.user} • {activity.time}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}