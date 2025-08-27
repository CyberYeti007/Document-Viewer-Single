'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Trash2, X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import notificationService, { Notification } from '@/lib/notifications'
import { formatDistanceToNow } from 'date-fns'

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load initial notifications
    setNotifications(notificationService.getNotifications())
    setUnreadCount(notificationService.getUnreadCount())

    // Subscribe to notification changes
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications)
      setUnreadCount(notificationService.getUnreadCount())
    })

    // Start simulation for demo
    notificationService.startSimulation()

    return unsubscribe
  }, [])

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id)
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead()
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    notificationService.deleteNotification(id)
  }

  const handleClearAll = () => {
    notificationService.clearAll()
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'document':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'approval':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      case 'compliance':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'team':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[420px] max-h-[600px] p-0">
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="font-semibold text-lg">Notifications</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger 
              value="all" 
              className="flex-1"
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger 
              value="unread" 
              className="flex-1"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px]">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="p-1">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative p-3 hover:bg-muted/50 cursor-pointer transition-colors border-b last:border-0 ${
                      !notification.read ? 'bg-muted/20' : ''
                    }`}
                    onClick={() => {
                      handleMarkAsRead(notification.id)
                      if (notification.action) {
                        window.location.href = notification.action.href
                        setIsOpen(false)
                      }
                    }}
                  >
                    {!notification.read && (
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                    
                    <div className="flex items-start gap-3 ml-3">
                      <div className="mt-1">
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          {notification.category && (
                            <Badge 
                              variant="secondary"
                              className={`text-xs px-1.5 py-0 ${getCategoryColor(notification.category)}`}
                            >
                              {notification.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                          {notification.action && (
                            <Button
                              variant="link"
                              size="sm"
                              className="text-xs h-auto p-0"
                            >
                              {notification.action.label} →
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDelete(notification.id, e)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Tabs>

        {notifications.length > 0 && (
          <div className="p-3 border-t bg-muted/30">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                window.location.href = '/dashboard/notifications'
                setIsOpen(false)
              }}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}