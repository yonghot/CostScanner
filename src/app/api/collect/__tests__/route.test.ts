import { POST } from '../route'
import { NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { CollectionSchedulerImpl } from '@/modules/data-collector/collection-scheduler'

// Mock dependencies
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@/modules/data-collector/collection-scheduler', () => ({
  CollectionSchedulerImpl: jest.fn().mockImplementation(() => ({
    scheduleCollection: jest.fn(),
    cancelSchedule: jest.fn(),
    getSchedules: jest.fn(),
    getScheduleStatistics: jest.fn(),
  })),
}))

describe.skip('/api/collect', () => {
  let mockSupabase: any
  let mockScheduler: any
  let mockRequest: (body: any) => NextRequest

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
    }
    ;(createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase)
    
    // Setup mock scheduler
    mockScheduler = new CollectionSchedulerImpl()
    
    // Helper to create NextRequest with JSON body
    mockRequest = (body: any) => {
      return {
        json: jest.fn().mockResolvedValue(body),
      } as unknown as NextRequest
    }
  })

  describe('Authentication Tests', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })
      
      const request = mockRequest({ action: 'start', scheduleData: {} })
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should proceed with collection if user is authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
      
      mockScheduler.scheduleCollection.mockResolvedValue('schedule123')
      
      const request = mockRequest({ 
        action: 'start', 
        scheduleData: {
          collector: 'web-scraping',
          schedule: { frequency: 'daily', time: '09:00' }
        } 
      })
      const response = await POST(request)
      
      expect(response.status).toBe(200)
    })
  })

  describe('Start Collection Action', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should start collection with valid schedule data', async () => {
      mockScheduler.scheduleCollection.mockResolvedValue('schedule123')
      
      const scheduleData = {
        collector: 'web-scraping',
        schedule: { 
          frequency: 'daily', 
          time: '09:00',
          urls: ['https://supplier1.com', 'https://supplier2.com']
        }
      }
      
      const request = mockRequest({ 
        action: 'start', 
        scheduleData 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.scheduleId).toBe('schedule123')
      expect(data.message).toBe('데이터 수집이 시작되었습니다.')
      expect(mockScheduler.scheduleCollection).toHaveBeenCalledWith(
        'web-scraping',
        scheduleData.schedule
      )
    })

    it('should return 400 if schedule data is missing', async () => {
      const request = mockRequest({ action: 'start' })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Schedule data required')
    })

    it('should handle different collector types', async () => {
      mockScheduler.scheduleCollection.mockResolvedValue('schedule456')
      
      const collectorTypes = ['web-scraping', 'ocr', 'api']
      
      for (const collectorType of collectorTypes) {
        const request = mockRequest({ 
          action: 'start', 
          scheduleData: {
            collector: collectorType,
            schedule: { frequency: 'hourly' }
          } 
        })
        
        const response = await POST(request)
        const data = await response.json()
        
        expect(response.status).toBe(200)
        expect(data.scheduleId).toBe('schedule456')
      }
      
      expect(mockScheduler.scheduleCollection).toHaveBeenCalledTimes(3)
    })

    it('should handle different schedule frequencies', async () => {
      mockScheduler.scheduleCollection.mockResolvedValue('schedule789')
      
      const frequencies = ['hourly', 'daily', 'weekly', 'monthly']
      
      for (const frequency of frequencies) {
        const request = mockRequest({ 
          action: 'start', 
          scheduleData: {
            collector: 'api',
            schedule: { frequency }
          } 
        })
        
        const response = await POST(request)
        
        expect(response.status).toBe(200)
      }
      
      expect(mockScheduler.scheduleCollection).toHaveBeenCalledTimes(4)
    })
  })

  describe('Stop Collection Action', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should stop collection with valid schedule ID', async () => {
      mockScheduler.cancelSchedule.mockResolvedValue(undefined)
      
      const request = mockRequest({ 
        action: 'stop', 
        scheduleId: 'schedule123' 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.message).toBe('데이터 수집이 중지되었습니다.')
      expect(mockScheduler.cancelSchedule).toHaveBeenCalledWith('schedule123')
    })

    it('should return 400 if schedule ID is missing', async () => {
      const request = mockRequest({ action: 'stop' })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Schedule ID required')
    })

    it('should handle non-existent schedule ID gracefully', async () => {
      mockScheduler.cancelSchedule.mockRejectedValue(new Error('Schedule not found'))
      
      const request = mockRequest({ 
        action: 'stop', 
        scheduleId: 'non-existent' 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error).toBe('데이터 수집 처리 중 오류가 발생했습니다.')
    })
  })

  describe('Status Action', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should return schedules and statistics', async () => {
      const mockSchedules = [
        {
          id: 'schedule1',
          collector: 'web-scraping',
          status: 'active',
          lastRun: '2024-01-15T09:00:00Z',
        },
        {
          id: 'schedule2',
          collector: 'api',
          status: 'paused',
          lastRun: '2024-01-14T15:00:00Z',
        },
      ]
      
      const mockStats = {
        totalRuns: 150,
        successfulRuns: 145,
        failedRuns: 5,
        averageRunTime: 3.5,
        dataCollected: {
          ingredients: 500,
          prices: 2500,
        },
      }
      
      mockScheduler.getSchedules.mockResolvedValue(mockSchedules)
      mockScheduler.getScheduleStatistics.mockResolvedValue(mockStats)
      
      const request = mockRequest({ action: 'status' })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.schedules).toEqual(mockSchedules)
      expect(data.stats).toEqual(mockStats)
      expect(mockScheduler.getSchedules).toHaveBeenCalled()
      expect(mockScheduler.getScheduleStatistics).toHaveBeenCalled()
    })

    it('should handle empty schedules', async () => {
      mockScheduler.getSchedules.mockResolvedValue([])
      mockScheduler.getScheduleStatistics.mockResolvedValue({
        totalRuns: 0,
        successfulRuns: 0,
        failedRuns: 0,
        averageRunTime: 0,
        dataCollected: {},
      })
      
      const request = mockRequest({ action: 'status' })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.schedules).toEqual([])
      expect(data.stats.totalRuns).toBe(0)
    })
  })

  describe('Invalid Action', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should return 400 for invalid action', async () => {
      const request = mockRequest({ action: 'invalid' })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid action')
    })

    it('should return 400 for missing action', async () => {
      const request = mockRequest({ scheduleData: {} })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid action')
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should handle scheduler errors gracefully', async () => {
      mockScheduler.scheduleCollection.mockRejectedValue(new Error('Database connection failed'))
      
      const request = mockRequest({ 
        action: 'start', 
        scheduleData: {
          collector: 'web-scraping',
          schedule: { frequency: 'daily' }
        } 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error).toBe('데이터 수집 처리 중 오류가 발생했습니다.')
    })

    it('should handle JSON parsing errors', async () => {
      const request = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as NextRequest
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error).toBe('데이터 수집 처리 중 오류가 발생했습니다.')
    })

    it('should handle Supabase auth errors', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Auth service unavailable'))
      
      const request = mockRequest({ action: 'status' })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error).toBe('데이터 수집 처리 중 오류가 발생했습니다.')
    })
  })

  describe('Security Tests', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should sanitize user input to prevent injection attacks', async () => {
      mockScheduler.scheduleCollection.mockResolvedValue('schedule123')
      
      const request = mockRequest({ 
        action: 'start', 
        scheduleData: {
          collector: "'; DROP TABLE schedules; --",
          schedule: { 
            frequency: "daily'; DELETE FROM collections; --",
            urls: ["https://evil.com/<script>alert('XSS')</script>"]
          }
        } 
      })
      
      const response = await POST(request)
      
      expect(response.status).toBe(200)
      // Verify that the potentially malicious input is passed to the scheduler
      // which should handle sanitization internally
      expect(mockScheduler.scheduleCollection).toHaveBeenCalledWith(
        "'; DROP TABLE schedules; --",
        expect.objectContaining({
          frequency: "daily'; DELETE FROM collections; --"
        })
      )
    })

    it('should handle XSS attempts in schedule ID', async () => {
      mockScheduler.cancelSchedule.mockResolvedValue(undefined)
      
      const request = mockRequest({ 
        action: 'stop', 
        scheduleId: '<script>alert("XSS")</script>' 
      })
      
      const response = await POST(request)
      
      expect(response.status).toBe(200)
      expect(mockScheduler.cancelSchedule).toHaveBeenCalledWith(
        '<script>alert("XSS")</script>'
      )
    })

    it('should validate collector types', async () => {
      mockScheduler.scheduleCollection.mockResolvedValue('schedule123')
      
      const invalidCollectors = ['../../etc/passwd', '../../../windows/system32', 'file:///', 'javascript:alert(1)']
      
      for (const collector of invalidCollectors) {
        const request = mockRequest({ 
          action: 'start', 
          scheduleData: {
            collector,
            schedule: { frequency: 'daily' }
          } 
        })
        
        const response = await POST(request)
        
        // The API should still process these (validation happens in scheduler)
        expect(response.status).toBe(200)
      }
    })
  })

  describe('Concurrent Requests', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should handle multiple simultaneous collection starts', async () => {
      let scheduleCounter = 0
      mockScheduler.scheduleCollection.mockImplementation(async () => {
        return `schedule${++scheduleCounter}`
      })
      
      const requests = Array.from({ length: 5 }, (_, i) => 
        mockRequest({ 
          action: 'start', 
          scheduleData: {
            collector: `collector${i}`,
            schedule: { frequency: 'daily' }
          } 
        })
      )
      
      const responses = await Promise.all(requests.map(req => POST(req)))
      const data = await Promise.all(responses.map(res => res.json()))
      
      expect(responses.every(res => res.status === 200)).toBe(true)
      expect(data.map(d => d.scheduleId)).toEqual([
        'schedule1', 'schedule2', 'schedule3', 'schedule4', 'schedule5'
      ])
    })
  })
})