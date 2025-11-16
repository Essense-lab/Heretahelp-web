import { BaseRepository } from './base-repository'
import { NotificationType, type CustomerNotificationDto } from '@/types'

export class NotificationRepository extends BaseRepository {
  async getUserNotifications(userId: string): Promise<CustomerNotificationDto[]> {
    const { data, error } = await this.supabase
      .from('customer_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error, 'load notifications')

    return (data ?? []) as CustomerNotificationDto[]
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('customer_notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) this.handleError(error, 'load unread count')

    return count ?? 0
  }

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('customer_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      } as never)
      .eq('id', notificationId)

    if (error) this.handleError(error, 'mark notification as read')
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('customer_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      } as never)
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) this.handleError(error, 'mark all notifications as read')
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('customer_notifications')
      .delete()
      .eq('id', notificationId)

    if (error) this.handleError(error, 'delete notification')
  }

  getTypeDisplay(type: NotificationType | string): { emoji: string; label: string } {
    switch (type) {
      case NotificationType.NEW_BID:
        return { emoji: '💰', label: 'New Bid' }
      case NotificationType.NEW_MESSAGE:
        return { emoji: '💬', label: 'New Message' }
      case NotificationType.JOB_IN_PROGRESS:
        return { emoji: '🔧', label: 'Job in progress' }
      case NotificationType.JOB_COMPLETED:
        return { emoji: '✅', label: 'Job completed' }
      case NotificationType.REVIEW_REQUEST:
        return { emoji: '⭐', label: 'Review request' }
      default:
        return { emoji: '🔔', label: 'Notification' }
    }
  }
}
