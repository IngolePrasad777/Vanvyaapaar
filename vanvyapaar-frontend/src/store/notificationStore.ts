import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Notification, notificationService } from '../services/notificationService'
import toast from 'react-hot-toast'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  lastFetched: string | null
  
  // Actions
  fetchNotifications: (userId: number, userRole: string) => Promise<void>
  fetchUnreadCount: (userId: number, userRole: string) => Promise<void>
  markAsRead: (notificationId: number) => Promise<void>
  markAllAsRead: (userId: number, userRole: string) => Promise<void>
  deleteNotification: (notificationId: number) => Promise<void>
  addNotification: (notification: Notification) => void
  clearNotifications: () => void
  
  // Real-time updates
  startPolling: (userId: number, userRole: string) => void
  stopPolling: () => void
}

let pollingInterval: number | null = null

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      lastFetched: null,

      fetchNotifications: async (userId: number, userRole: string) => {
        set({ isLoading: true })
        try {
          const notifications = await notificationService.getNotifications(userId, userRole)
          const unreadCount = await notificationService.getUnreadCount(userId, userRole)
          
          set({ 
            notifications, 
            unreadCount, 
            isLoading: false,
            lastFetched: new Date().toISOString()
          })
        } catch (error) {
          console.error('Error fetching notifications:', error)
          set({ isLoading: false })
        }
      },

      fetchUnreadCount: async (userId: number, userRole: string) => {
        try {
          const unreadCount = await notificationService.getUnreadCount(userId, userRole)
          set({ unreadCount })
        } catch (error) {
          console.error('Error fetching unread count:', error)
        }
      },

      markAsRead: async (notificationId: number) => {
        try {
          await notificationService.markAsRead(notificationId)
          
          const { notifications, unreadCount } = get()
          const updatedNotifications = notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true, readAt: new Date().toISOString() }
              : notification
          )
          
          const wasUnread = notifications.find(n => n.id === notificationId && !n.isRead)
          const newUnreadCount = wasUnread ? Math.max(0, unreadCount - 1) : unreadCount
          
          set({ 
            notifications: updatedNotifications,
            unreadCount: newUnreadCount
          })
        } catch (error) {
          console.error('Error marking notification as read:', error)
          toast.error('Failed to mark notification as read')
        }
      },

      markAllAsRead: async (userId: number, userRole: string) => {
        try {
          await notificationService.markAllAsRead(userId, userRole)
          
          const { notifications } = get()
          const updatedNotifications = notifications.map(notification => ({
            ...notification,
            isRead: true,
            readAt: new Date().toISOString()
          }))
          
          set({ 
            notifications: updatedNotifications,
            unreadCount: 0
          })
          
          toast.success('All notifications marked as read')
        } catch (error) {
          console.error('Error marking all notifications as read:', error)
          toast.error('Failed to mark all notifications as read')
        }
      },

      deleteNotification: async (notificationId: number) => {
        try {
          await notificationService.deleteNotification(notificationId)
          
          const { notifications, unreadCount } = get()
          const notificationToDelete = notifications.find(n => n.id === notificationId)
          const updatedNotifications = notifications.filter(n => n.id !== notificationId)
          
          const newUnreadCount = notificationToDelete && !notificationToDelete.isRead 
            ? Math.max(0, unreadCount - 1) 
            : unreadCount
          
          set({ 
            notifications: updatedNotifications,
            unreadCount: newUnreadCount
          })
          
          toast.success('Notification deleted')
        } catch (error) {
          console.error('Error deleting notification:', error)
          toast.error('Failed to delete notification')
        }
      },

      addNotification: (notification: Notification) => {
        const { notifications, unreadCount } = get()
        set({ 
          notifications: [notification, ...notifications],
          unreadCount: notification.isRead ? unreadCount : unreadCount + 1
        })
      },

      clearNotifications: () => {
        set({ 
          notifications: [], 
          unreadCount: 0, 
          lastFetched: null 
        })
      },

      startPolling: (userId: number, userRole: string) => {
        // Stop existing polling
        if (pollingInterval) {
          clearInterval(pollingInterval)
        }
        
        // Start new polling every 30 seconds
        pollingInterval = setInterval(() => {
          get().fetchUnreadCount(userId, userRole)
        }, 30000)
      },

      stopPolling: () => {
        if (pollingInterval) {
          clearInterval(pollingInterval)
          pollingInterval = null
        }
      }
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({ 
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        lastFetched: state.lastFetched
      })
    }
  )
)