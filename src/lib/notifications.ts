// Global Notification System
import { toast } from 'sonner'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  action?: {
    label: string
    href: string
  }
  icon?: string
  category?: string
}

class NotificationService {
  private notifications: Notification[] = []
  private listeners: Set<(notifications: Notification[]) => void> = new Set()

  constructor() {
    // Initialize with some sample notifications
    this.initializeNotifications()
  }

  private initializeNotifications() {
    this.notifications = [
      {
        id: '1',
        title: 'New Document Uploaded',
        message: 'Sarah Chen uploaded "Q4 Compliance Report"',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: false,
        action: {
          label: 'View Document',
          href: '/dashboard/documents/1'
        },
        category: 'document'
      },
      {
        id: '2',
        title: 'Approval Required',
        message: 'SOP-2024-15 requires your approval',
        type: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        action: {
          label: 'Review Now',
          href: '/dashboard/approve'
        },
        category: 'approval'
      },
      {
        id: '3',
        title: 'Document Approved',
        message: 'Your document "Training Manual v2" has been approved',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        read: true,
        category: 'approval'
      },
      {
        id: '4',
        title: 'Compliance Alert',
        message: '3 documents are expiring this week',
        type: 'error',
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        read: false,
        action: {
          label: 'View Documents',
          href: '/dashboard/compliance'
        },
        category: 'compliance'
      },
      {
        id: '5',
        title: 'Team Update',
        message: 'Mike Johnson joined the Quality Assurance team',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        read: true,
        category: 'team'
      }
    ]
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return this.notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Get unread notifications
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read)
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  // Add a new notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    
    this.notifications.unshift(newNotification)
    this.notifyListeners()
    
    // Show toast notification
    this.showToast(newNotification)
  }

  // Mark notification as read
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  // Mark all as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
    this.notifyListeners()
  }

  // Delete notification
  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.notifyListeners()
  }

  // Clear all notifications
  clearAll(): void {
    this.notifications = []
    this.notifyListeners()
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.notifications))
  }

  // Show toast notification
  private showToast(notification: Notification): void {
    const options: any = {
      description: notification.message,
      duration: 5000,
    }

    if (notification.action) {
      options.action = {
        label: notification.action.label,
        onClick: () => {
          window.location.href = notification.action!.href
        }
      }
    }

    switch (notification.type) {
      case 'success':
        toast.success(notification.title, options)
        break
      case 'error':
        toast.error(notification.title, options)
        break
      case 'warning':
        toast.warning(notification.title, options)
        break
      default:
        toast(notification.title, options)
    }
  }

  // Simulate real-time notifications
  startSimulation(): void {
    const notifications = [
      {
        title: 'New Compliance Update',
        message: 'ISO 9001:2025 standards have been updated',
        type: 'info' as const,
        category: 'compliance'
      },
      {
        title: 'Document Review Complete',
        message: 'Your document has passed quality review',
        type: 'success' as const,
        category: 'review'
      },
      {
        title: 'Training Reminder',
        message: 'Annual compliance training is due in 3 days',
        type: 'warning' as const,
        action: {
          label: 'Start Training',
          href: '/dashboard/training'
        },
        category: 'training'
      },
      {
        title: 'System Update',
        message: 'New features have been added to the document viewer',
        type: 'info' as const,
        category: 'system'
      },
      {
        title: 'Approval Deadline',
        message: 'Document approval deadline approaching',
        type: 'warning' as const,
        action: {
          label: 'Review',
          href: '/dashboard/approve'
        },
        category: 'approval'
      }
    ]

    // Add a random notification every 30-60 seconds
    setInterval(() => {
      if (Math.random() > 0.5) { // 50% chance
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
        this.addNotification(randomNotification)
      }
    }, 45000) // Every 45 seconds
  }
}

// Create singleton instance
const notificationService = new NotificationService()

// Export service and helper functions
export default notificationService

export const notify = {
  success: (title: string, message: string, action?: { label: string; href: string }) => {
    notificationService.addNotification({ title, message, type: 'success', action })
  },
  error: (title: string, message: string, action?: { label: string; href: string }) => {
    notificationService.addNotification({ title, message, type: 'error', action })
  },
  warning: (title: string, message: string, action?: { label: string; href: string }) => {
    notificationService.addNotification({ title, message, type: 'warning', action })
  },
  info: (title: string, message: string, action?: { label: string; href: string }) => {
    notificationService.addNotification({ title, message, type: 'info', action })
  }
}