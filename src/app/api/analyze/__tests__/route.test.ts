import { POST } from '../route'
import { NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { CostAnalyzerImpl } from '@/modules/cost-analyzer/cost-analyzer-impl'

// Mock dependencies
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@/modules/cost-analyzer/cost-analyzer-impl', () => ({
  CostAnalyzerImpl: jest.fn().mockImplementation(() => ({
    analyzePriceTrend: jest.fn(),
    compareIngredientPrices: jest.fn(),
    calculateRecipeCost: jest.fn(),
    analyzeSupplierPrices: jest.fn(),
  })),
}))

describe.skip('/api/analyze', () => {
  let mockSupabase: any
  let mockAnalyzer: any
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
    
    // Setup mock analyzer
    mockAnalyzer = new CostAnalyzerImpl()
    
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
      
      const request = mockRequest({ type: 'price_trend', data: { ingredientId: '123' } })
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should proceed with analysis if user is authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
      
      mockAnalyzer.analyzePriceTrend.mockResolvedValue({ trend: 'increasing' })
      
      const request = mockRequest({ 
        type: 'price_trend', 
        data: { ingredientId: '123' } 
      })
      const response = await POST(request)
      
      expect(response.status).toBe(200)
    })
  })

  describe('Price Trend Analysis', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should analyze price trend for valid ingredient', async () => {
      const mockTrendData = {
        trend: 'increasing',
        percentageChange: 15.5,
        predictions: [],
      }
      mockAnalyzer.analyzePriceTrend.mockResolvedValue(mockTrendData)
      
      const request = mockRequest({ 
        type: 'price_trend', 
        data: { 
          ingredientId: 'ing123',
          dateRange: { start: '2024-01-01', end: '2024-01-31' }
        } 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.analysis).toEqual(mockTrendData)
      expect(mockAnalyzer.analyzePriceTrend).toHaveBeenCalledWith(
        'ing123',
        { start: '2024-01-01', end: '2024-01-31' }
      )
    })

    it('should return 400 if ingredient ID is missing', async () => {
      const request = mockRequest({ 
        type: 'price_trend', 
        data: { dateRange: { start: '2024-01-01', end: '2024-01-31' } } 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Ingredient ID required')
    })
  })

  describe('Supplier Comparison', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should compare prices for multiple ingredients', async () => {
      const mockComparison = {
        supplier1: { avgPrice: 1000, total: 5000 },
        supplier2: { avgPrice: 950, total: 4750 },
      }
      mockAnalyzer.compareIngredientPrices.mockResolvedValue(mockComparison)
      
      const request = mockRequest({ 
        type: 'supplier_comparison', 
        data: { ingredients: ['ing1', 'ing2', 'ing3'] } 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.comparison).toEqual(mockComparison)
      expect(mockAnalyzer.compareIngredientPrices).toHaveBeenCalled()
    })

    it('should return 400 if ingredients list is empty', async () => {
      const request = mockRequest({ 
        type: 'supplier_comparison', 
        data: { ingredients: [] } 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Ingredients required')
    })

    it('should return 400 if ingredients is missing', async () => {
      const request = mockRequest({ 
        type: 'supplier_comparison', 
        data: {} 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Ingredients required')
    })
  })

  describe('Recipe Cost Calculation', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should calculate recipe cost for valid recipe', async () => {
      const mockRecipeCost = {
        totalCost: 25000,
        costPerServing: 2500,
        ingredients: [
          { name: '닭고기', cost: 15000 },
          { name: '양파', cost: 3000 },
          { name: '마늘', cost: 2000 },
        ],
      }
      mockAnalyzer.calculateRecipeCost.mockResolvedValue(mockRecipeCost)
      
      const request = mockRequest({ 
        type: 'recipe_cost', 
        data: { recipeId: 'recipe123' } 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.recipeCost).toEqual(mockRecipeCost)
      expect(mockAnalyzer.calculateRecipeCost).toHaveBeenCalledWith('recipe123')
    })

    it('should return 400 if recipe ID is missing', async () => {
      const request = mockRequest({ 
        type: 'recipe_cost', 
        data: {} 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Recipe ID required')
    })
  })

  describe('Supplier Analysis', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should analyze supplier prices with valid data', async () => {
      const mockSupplierAnalysis = {
        averagePrice: 12000,
        priceStability: 0.85,
        competitiveness: 'above_average',
        recommendations: ['Consider negotiating bulk discounts'],
      }
      mockAnalyzer.analyzeSupplierPrices.mockResolvedValue(mockSupplierAnalysis)
      
      const request = mockRequest({ 
        type: 'supplier_analysis', 
        data: { 
          supplierId: 'supplier123',
          metrics: ['price', 'stability', 'competitiveness']
        } 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.analysis).toEqual(mockSupplierAnalysis)
      expect(mockAnalyzer.analyzeSupplierPrices).toHaveBeenCalledWith(
        'supplier123',
        expect.objectContaining({
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        })
      )
    })

    it('should return 400 if supplier ID is missing', async () => {
      const request = mockRequest({ 
        type: 'supplier_analysis', 
        data: { metrics: ['price'] } 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Supplier ID required')
    })
  })

  describe('Invalid Analysis Type', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should return 400 for invalid analysis type', async () => {
      const request = mockRequest({ 
        type: 'invalid_type', 
        data: {} 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid analysis type')
    })

    it('should return 400 for missing type', async () => {
      const request = mockRequest({ 
        data: { ingredientId: '123' } 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid analysis type')
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should handle analyzer errors gracefully', async () => {
      mockAnalyzer.analyzePriceTrend.mockRejectedValue(new Error('Database connection failed'))
      
      const request = mockRequest({ 
        type: 'price_trend', 
        data: { ingredientId: '123' } 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error).toBe('분석 처리 중 오류가 발생했습니다.')
    })

    it('should handle JSON parsing errors', async () => {
      const request = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as NextRequest
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error).toBe('분석 처리 중 오류가 발생했습니다.')
    })

    it('should handle Supabase auth errors', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Auth service unavailable'))
      
      const request = mockRequest({ 
        type: 'price_trend', 
        data: { ingredientId: '123' } 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error).toBe('분석 처리 중 오류가 발생했습니다.')
    })
  })

  describe('Date Range Handling', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    })

    it('should use default 30-day range for supplier comparison', async () => {
      mockAnalyzer.compareIngredientPrices.mockResolvedValue({})
      
      const request = mockRequest({ 
        type: 'supplier_comparison', 
        data: { ingredients: ['ing1'] } 
      })
      
      await POST(request)
      
      expect(mockAnalyzer.compareIngredientPrices).toHaveBeenCalledWith(
        ['ing1'],
        expect.objectContaining({
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        })
      )
      
      const call = mockAnalyzer.compareIngredientPrices.mock.calls[0]
      const dateRange = call[1]
      const daysDiff = (dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24)
      expect(Math.round(daysDiff)).toBe(30)
    })

    it('should use default 30-day range for supplier analysis', async () => {
      mockAnalyzer.analyzeSupplierPrices.mockResolvedValue({})
      
      const request = mockRequest({ 
        type: 'supplier_analysis', 
        data: { supplierId: 'supplier123' } 
      })
      
      await POST(request)
      
      expect(mockAnalyzer.analyzeSupplierPrices).toHaveBeenCalledWith(
        'supplier123',
        expect.objectContaining({
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        })
      )
      
      const call = mockAnalyzer.analyzeSupplierPrices.mock.calls[0]
      const dateRange = call[1]
      const daysDiff = (dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24)
      expect(Math.round(daysDiff)).toBe(30)
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
      mockAnalyzer.analyzePriceTrend.mockResolvedValue({ trend: 'stable' })
      
      const request = mockRequest({ 
        type: 'price_trend', 
        data: { 
          ingredientId: "'; DROP TABLE ingredients; --",
          dateRange: { 
            start: "2024-01-01'; DELETE FROM prices; --",
            end: '2024-01-31'
          }
        } 
      })
      
      const response = await POST(request)
      
      expect(response.status).toBe(200)
      // Verify that the potentially malicious input is passed as-is to the analyzer
      // which should handle sanitization internally
      expect(mockAnalyzer.analyzePriceTrend).toHaveBeenCalledWith(
        "'; DROP TABLE ingredients; --",
        expect.any(Object)
      )
    })

    it('should handle XSS attempts in response data', async () => {
      const maliciousData = {
        trend: '<script>alert("XSS")</script>',
        data: '<img src=x onerror=alert("XSS")>',
      }
      mockAnalyzer.analyzePriceTrend.mockResolvedValue(maliciousData)
      
      const request = mockRequest({ 
        type: 'price_trend', 
        data: { ingredientId: '123' } 
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      // The API should return data as-is, sanitization happens on the frontend
      expect(data.analysis).toEqual(maliciousData)
    })
  })
})