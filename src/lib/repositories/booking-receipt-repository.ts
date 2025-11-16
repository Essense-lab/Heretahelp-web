import { BaseRepository } from './base-repository'
import { createSupabaseClient } from '@/lib/supabase'

interface BookingReceiptData {
  customerEmail: string
  customerPhone: string
  customerName: string
  appointmentId: string
  serviceName: string
  serviceCategory: string
  appointmentDate: string
  timeSlot: string
  serviceAddress: string
  vehicleInfo: string
  totalAmount: number
  paymentMethod: string
  confirmationNumber: string
}

export class BookingReceiptRepository extends BaseRepository {
  generateConfirmationNumber(): string {
    return `BK${Date.now().toString().slice(-8)}`
  }

  async sendBookingReceipt(receiptData: BookingReceiptData): Promise<void> {
    try {
      // In a real implementation, this would call an email service API
      // For now, we'll log the receipt data and simulate sending
      console.log('📧 Sending booking receipt:', receiptData)

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // TODO: Implement actual email sending via:
      // 1. Supabase Edge Functions
      // 2. SendGrid/Resend API
      // 3. Custom email service

      const emailContent = this.generateEmailContent(receiptData)
      const smsContent = this.generateSMSContent(receiptData)

      // Placeholder for actual email sending
      await this.sendEmail(receiptData.customerEmail, 'Booking Confirmation', emailContent)

      // Placeholder for SMS sending (if phone provided)
      if (receiptData.customerPhone) {
        await this.sendSMS(receiptData.customerPhone, smsContent)
      }

      console.log('✅ Booking receipt sent successfully')
    } catch (error) {
      console.error('❌ Failed to send booking receipt:', error)
      // Don't throw error - payment was successful, email is secondary
    }
  }

  private generateEmailContent(data: BookingReceiptData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0D1B2A;">Booking Confirmed</h1>

        <p>Dear ${data.customerName},</p>

        <p>Your booking has been confirmed! Here are the details:</p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details</h3>
          <p><strong>Confirmation Number:</strong> ${data.confirmationNumber}</p>
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Category:</strong> ${data.serviceCategory}</p>
          <p><strong>Date:</strong> ${data.appointmentDate}</p>
          <p><strong>Time:</strong> ${data.timeSlot}</p>
          <p><strong>Location:</strong> ${data.serviceAddress}</p>
          <p><strong>Vehicle:</strong> ${data.vehicleInfo}</p>
          <p><strong>Total Amount:</strong> $${data.totalAmount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
        </div>

        <p>Thank you for choosing Here Ta Help!</p>

        <p>If you have any questions, please contact us at support@heretahelp.online</p>

        <p>Best regards,<br>The Here Ta Help Team</p>
      </div>
    `
  }

  private generateSMSContent(data: BookingReceiptData): string {
    return `Your booking is confirmed! ${data.serviceName} on ${data.appointmentDate} at ${data.timeSlot}. Confirmation: ${data.confirmationNumber}. Total: $${data.totalAmount.toFixed(2)}`
  }

  private async sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
    // Placeholder - replace with actual email service
    console.log(`📧 Email would be sent to ${to} with subject: ${subject}`)

    // Example implementation with a service like Resend:
    /*
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html: htmlContent })
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }
    */
  }

  private async sendSMS(to: string, message: string): Promise<void> {
    // Placeholder - replace with actual SMS service
    console.log(`📱 SMS would be sent to ${to}: ${message}`)

    // Example implementation with Twilio:
    /*
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message })
    })

    if (!response.ok) {
      throw new Error('Failed to send SMS')
    }
    */
  }
}
