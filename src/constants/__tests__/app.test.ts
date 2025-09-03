import { APP_CONFIG, COLLECTION_STATUS, NOTIFICATION_STATUS } from '../app'

describe('App Constants', () => {
  describe('APP_CONFIG', () => {
    it('should have correct app name', () => {
      expect(APP_CONFIG.name).toBe('코스트스캐너')
    })

    it('should have correct app description', () => {
      expect(APP_CONFIG.description).toBe('스마트한 식자재 비용 관리 시스템')
    })

    it('should have correct app version', () => {
      expect(APP_CONFIG.version).toBe('1.0.0')
    })

    it('should have correct app url', () => {
      expect(APP_CONFIG.url).toBe('https://costscanner.io')
    })

    it('should have correct support email', () => {
      expect(APP_CONFIG.supportEmail).toBe('support@costscanner.io')
    })

    it('should have correct company information', () => {
      expect(APP_CONFIG.company).toEqual({
        name: 'JNF',
        website: 'https://jnf.co.kr',
        address: '서울특별시 강남구',
      })
    })

    it('should have correct currency setting', () => {
      expect(APP_CONFIG.currency).toBe('KRW')
    })

    it('should have correct locale setting', () => {
      expect(APP_CONFIG.locale).toBe('ko-KR')
    })

    it('should have correct timezone setting', () => {
      expect(APP_CONFIG.timezone).toBe('Asia/Seoul')
    })

    it('should have correct date format', () => {
      expect(APP_CONFIG.dateFormat).toBe('yyyy년 MM월 dd일')
    })

    it('should have correct pagination settings', () => {
      expect(APP_CONFIG.pagination).toEqual({
        defaultPageSize: 20,
        pageSizeOptions: [10, 20, 50, 100],
      })
    })
  })

  describe('COLLECTION_STATUS', () => {
    it('should have correct status values', () => {
      expect(COLLECTION_STATUS.PENDING).toBe('pending')
      expect(COLLECTION_STATUS.PROCESSING).toBe('processing')
      expect(COLLECTION_STATUS.COMPLETED).toBe('completed')
      expect(COLLECTION_STATUS.FAILED).toBe('failed')
    })

    it('should have all required statuses', () => {
      const statuses = Object.values(COLLECTION_STATUS)
      expect(statuses).toContain('pending')
      expect(statuses).toContain('processing')
      expect(statuses).toContain('completed')
      expect(statuses).toContain('failed')
    })
  })

  describe('NOTIFICATION_STATUS', () => {
    it('should have correct notification status values', () => {
      expect(NOTIFICATION_STATUS.UNREAD).toBe('unread')
      expect(NOTIFICATION_STATUS.READ).toBe('read')
      expect(NOTIFICATION_STATUS.ARCHIVED).toBe('archived')
    })

    it('should have all required notification statuses', () => {
      const statuses = Object.values(NOTIFICATION_STATUS)
      expect(statuses).toContain('unread')
      expect(statuses).toContain('read')
      expect(statuses).toContain('archived')
    })
  })
})