import { User, PriceAlert, Notification } from '@/types'

// 알림 서비스 인터페이스
export interface NotificationService {
  /**
   * 알림 전송
   */
  sendNotification(
    notification: NotificationRequest
  ): Promise<NotificationResult>
  
  /**
   * 대량 알림 전송
   */
  sendBulkNotifications(
    notifications: NotificationRequest[]
  ): Promise<NotificationResult[]>
  
  /**
   * 알림 템플릿 렌더링
   */
  renderTemplate(
    templateName: string,
    data: Record<string, any>
  ): Promise<RenderedTemplate>
  
  /**
   * 사용자 알림 설정 확인
   */
  getUserNotificationSettings(userId: string): Promise<NotificationSettings>
  
  /**
   * 알림 전송 이력 조회
   */
  getNotificationHistory(
    userId: string,
    dateRange?: DateRange
  ): Promise<NotificationHistory[]>
}

// 알림 요청
export interface NotificationRequest {
  userId: string
  type: NotificationType
  channel: NotificationChannel[]
  title: string
  message: string
  templateName?: string
  templateData?: Record<string, any>
  priority: NotificationPriority
  scheduledAt?: Date
  metadata?: Record<string, any>
}

// 알림 타입
export type NotificationType = 
  | 'price_alert'
  | 'cost_report'
  | 'supplier_update'
  | 'system_maintenance'
  | 'marketing'
  | 'security'

// 알림 채널
export type NotificationChannel = 'email' | 'sms' | 'push' | 'webhook'

// 알림 우선순위
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

// 알림 결과
export interface NotificationResult {
  id: string
  userId: string
  channel: NotificationChannel
  status: NotificationStatus
  sentAt?: Date
  deliveredAt?: Date
  error?: string
  cost?: number
  externalId?: string
}

// 알림 상태
export type NotificationStatus = 
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'rejected'

// 렌더링된 템플릿
export interface RenderedTemplate {
  subject: string
  htmlBody: string
  textBody: string
  attachments?: TemplateAttachment[]
}

// 템플릿 첨부파일
export interface TemplateAttachment {
  filename: string
  content: Buffer
  contentType: string
}

// 사용자 알림 설정
export interface NotificationSettings {
  userId: string
  email: EmailSettings
  sms: SMSSettings
  push: PushSettings
  preferences: NotificationPreferences
}

// 이메일 설정
export interface EmailSettings {
  enabled: boolean
  address: string
  verified: boolean
  frequency: NotificationFrequency
  allowedTypes: NotificationType[]
}

// SMS 설정
export interface SMSSettings {
  enabled: boolean
  phoneNumber: string
  verified: boolean
  frequency: NotificationFrequency
  allowedTypes: NotificationType[]
}

// 푸시 설정
export interface PushSettings {
  enabled: boolean
  deviceTokens: string[]
  frequency: NotificationFrequency
  allowedTypes: NotificationType[]
}

// 알림 빈도
export type NotificationFrequency = 
  | 'immediate'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'never'

// 알림 선호도
export interface NotificationPreferences {
  quietHours: {
    enabled: boolean
    startTime: string // HH:mm
    endTime: string   // HH:mm
    timezone: string
  }
  priceAlertThreshold: number // 최소 가격 변동률
  reportDeliveryTime: string  // HH:mm
  language: string
}

// 알림 이력
export interface NotificationHistory {
  id: string
  userId: string
  type: NotificationType
  channel: NotificationChannel
  title: string
  message: string
  status: NotificationStatus
  sentAt: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date
}

// 날짜 범위
export interface DateRange {
  startDate: Date
  endDate: Date
}

// 이메일 알림 서비스
export interface EmailNotifier extends NotificationService {
  /**
   * 이메일 전송
   */
  sendEmail(emailRequest: EmailRequest): Promise<EmailResult>
  
  /**
   * 이메일 템플릿 검증
   */
  validateEmailTemplate(template: EmailTemplate): Promise<boolean>
  
  /**
   * 이메일 전송 상태 확인
   */
  getEmailStatus(messageId: string): Promise<EmailStatus>
}

// 이메일 요청
export interface EmailRequest {
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  htmlBody?: string
  textBody?: string
  attachments?: EmailAttachment[]
  replyTo?: string
  headers?: Record<string, string>
}

// 이메일 첨부파일
export interface EmailAttachment {
  filename: string
  content: Buffer | string
  contentType: string
  encoding?: string
}

// 이메일 결과
export interface EmailResult extends NotificationResult {
  messageId: string
  recipients: EmailRecipientResult[]
}

// 이메일 수신자 결과
export interface EmailRecipientResult {
  email: string
  status: 'accepted' | 'rejected' | 'deferred'
  error?: string
}

// 이메일 템플릿
export interface EmailTemplate {
  name: string
  subject: string
  htmlBody: string
  textBody?: string
  variables: string[]
}

// 이메일 상태
export interface EmailStatus {
  messageId: string
  status: 'sent' | 'delivered' | 'bounced' | 'complained' | 'rejected'
  timestamp: Date
  recipient: string
  error?: string
}

// SMS 알림 서비스
export interface SMSNotifier extends NotificationService {
  /**
   * SMS 전송
   */
  sendSMS(smsRequest: SMSRequest): Promise<SMSResult>
  
  /**
   * SMS 전송 상태 확인
   */
  getSMSStatus(messageId: string): Promise<SMSStatus>
  
  /**
   * SMS 잔액 확인
   */
  getSMSBalance(): Promise<SMSBalance>
}

// SMS 요청
export interface SMSRequest {
  to: string
  message: string
  from?: string
}

// SMS 결과
export interface SMSResult extends NotificationResult {
  messageId: string
  segments: number
  cost: number
}

// SMS 상태
export interface SMSStatus {
  messageId: string
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered'
  timestamp: Date
  errorCode?: string
  errorMessage?: string
}

// SMS 잔액
export interface SMSBalance {
  balance: number
  currency: string
  lastUpdated: Date
}

// 푸시 알림 서비스
export interface PushNotifier extends NotificationService {
  /**
   * 푸시 알림 전송
   */
  sendPushNotification(
    pushRequest: PushRequest
  ): Promise<PushResult>
  
  /**
   * 디바이스 토큰 등록
   */
  registerDeviceToken(
    userId: string,
    deviceToken: string,
    platform: 'ios' | 'android'
  ): Promise<void>
  
  /**
   * 디바이스 토큰 제거
   */
  unregisterDeviceToken(
    userId: string,
    deviceToken: string
  ): Promise<void>
}

// 푸시 요청
export interface PushRequest {
  deviceTokens: string[]
  title: string
  body: string
  badge?: number
  sound?: string
  data?: Record<string, any>
  imageUrl?: string
}

// 푸시 결과
export interface PushResult extends NotificationResult {
  successCount: number
  failureCount: number
  results: PushDeviceResult[]
}

// 푸시 디바이스 결과
export interface PushDeviceResult {
  deviceToken: string
  status: 'success' | 'failed'
  error?: string
}

// 알림 스케줄러
export interface NotificationScheduler {
  /**
   * 스케줄된 알림 등록
   */
  scheduleNotification(
    notification: ScheduledNotificationRequest
  ): Promise<string>
  
  /**
   * 스케줄된 알림 취소
   */
  cancelScheduledNotification(scheduleId: string): Promise<void>
  
  /**
   * 스케줄 목록 조회
   */
  getScheduledNotifications(
    userId?: string
  ): Promise<ScheduledNotification[]>
}

// 스케줄된 알림 요청
export interface ScheduledNotificationRequest 
  extends Omit<NotificationRequest, 'scheduledAt'> {
  scheduledAt: Date
  repeatPattern?: RepeatPattern
}

// 반복 패턴
export interface RepeatPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  interval: number
  endDate?: Date
  daysOfWeek?: number[] // 0=일요일, 6=토요일
  dayOfMonth?: number
  cronExpression?: string
}

// 스케줄된 알림
export interface ScheduledNotification {
  id: string
  userId: string
  notification: NotificationRequest
  scheduledAt: Date
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  nextRunAt?: Date
  repeatPattern?: RepeatPattern
}