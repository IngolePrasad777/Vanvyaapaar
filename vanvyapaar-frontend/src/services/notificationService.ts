import { api } from '../lib/api'

export interface Notification {
  id: number
  userId: number
  userRole: string
  type: string
  title: string
  message: string
  isRead: boolean
  isEmailSent: boolean
  createdAt: string
  readAt?: string
  relatedEntityId?: number
  relatedEntityType?: string
  priority: string
  actionUrl?: string
}

export interface NotificationCount {
  count: number
}

class NotificationService {
  // Get all notifications for a user
  async getNotifications(userId: number, userRole: string): Promise<Notification[]> {
    const response = await api.get(`/api/notifications/${userId}/${userRole}`)
    return response.data
  }

  // Get unread notifications for a user
  async getUnreadNotifications(userId: number, userRole: string): Promise<Notification[]> {
    const response = await api.get(`/api/notifications/${userId}/${userRole}/unread`)
    return response.data
  }

  // Get unread count
  async getUnreadCount(userId: number, userRole: string): Promise<number> {
    const response = await api.get(`/api/notifications/${userId}/${userRole}/count`)
    return response.data.count
  }

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<void> {
    await api.put(`/api/notifications/${notificationId}/read`)
  }

  // Mark all notifications as read
  async markAllAsRead(userId: number, userRole: string): Promise<void> {
    await api.put(`/api/notifications/${userId}/${userRole}/read-all`)
  }

  // Delete notification
  async deleteNotification(notificationId: number): Promise<void> {
    await api.delete(`/api/notifications/${notificationId}`)
  }

  // Create test notification (for development)
  async createTestNotification(data: {
    userId: number
    userRole: string
    type: string
    title: string
    message: string
    priority?: string
    sendEmail?: boolean
  }): Promise<Notification> {
    const response = await api.post('/api/notifications/test', data)
    return response.data
  }

  // Helper method to get notification icon based on type
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'ORDER_PLACED':
      case 'ORDER_CONFIRMED':
      case 'ORDER_SHIPPED':
      case 'ORDER_DELIVERED':
        return 'shopping_bag'
      case 'ORDER_CANCELLED':
        return 'cancel'
      case 'PAYMENT_SUCCESS':
        return 'payment'
      case 'PAYMENT_FAILED':
        return 'error'
      case 'PRODUCT_APPROVED':
        return 'check_circle'
      case 'PRODUCT_REJECTED':
        return 'cancel'
      case 'LOW_STOCK':
        return 'warning'
      case 'ACCOUNT_APPROVED':
        return 'verified_user'
      case 'ACCOUNT_SUSPENDED':
        return 'block'
      case 'NEW_SELLER':
        return 'person_add'
      case 'NEW_COMPLAINT':
        return 'report_problem'
      case 'REVIEW_ADDED':
        return 'star'
      default:
        return 'notifications'
    }
  }

  // Helper method to get notification color based on priority
  getNotificationColor(priority: string): string {
    switch (priority) {
      case 'LOW':
        return '#6B7280'
      case 'NORMAL':
        return '#D4A574'
      case 'HIGH':
        return '#F59E0B'
      case 'URGENT':
        return '#EF4444'
      default:
        return '#D4A574'
    }
  }

  // Helper method to format relative time
  formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
    }
  }
}

export const notificationService = new NotificationService()
export default notificationService