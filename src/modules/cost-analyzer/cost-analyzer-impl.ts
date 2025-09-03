import {
  CostAnalyzer,
  DateRange,
  PriceComparison,
  SupplierAnalysis,
  RecipeCostAnalysis,
  PricePrediction,
  MarketPrice,
  PriceAnomaly,
  SeasonalityAnalysis
} from './analyzer-interface'
import { supabase } from '@/lib/supabase'
import { PriceRecord, ChartDataPoint, TrendAnalysis } from '@/types'

export class CostAnalyzerImpl implements CostAnalyzer {
  
  async analyzePriceTrend(
    ingredientId: string,
    dateRange: DateRange
  ): Promise<TrendAnalysis> {
    try {
      // 데이터베이스에서 가격 트렌드 데이터 조회
      const { data: priceData, error } = await supabase
        .rpc('get_price_trend', {
          ingredient_uuid: ingredientId,
          days_back: this.calculateDaysDifference(dateRange)
        })

      if (error) throw error

      // 식자재 정보 조회
      const { data: ingredient } = await supabase
        .from('ingredients')
        .select('name')
        .eq('id', ingredientId)
        .single()

      if (!priceData || priceData.length === 0) {
        throw new Error('가격 트렌드 데이터가 없습니다')
      }

      // 차트 데이터 변환
      const chartData: ChartDataPoint[] = priceData.map(item => ({
        date: item.date,
        value: Number(item.avg_price),
        supplier: 'average' // 평균 가격이므로
      }))

      // 트렌드 계산
      const prices = priceData.map(item => Number(item.avg_price))
      const currentPrice = prices[0] || 0 // 최신 가격
      const previousPrice = prices[prices.length - 1] || 0 // 가장 오래된 가격
      const priceChange = currentPrice - previousPrice
      const priceChangePercentage = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0

      // 트렌드 방향 결정
      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
      if (Math.abs(priceChangePercentage) > 5) {
        trend = priceChangePercentage > 0 ? 'increasing' : 'decreasing'
      }

      return {
        ingredient_id: ingredientId,
        ingredient_name: ingredient?.name || '알 수 없는 식자재',
        current_price: currentPrice,
        previous_price: previousPrice,
        price_change: priceChange,
        price_change_percentage: priceChangePercentage,
        trend,
        chart_data: chartData
      }

    } catch (error) {
      console.error('가격 트렌드 분석 오류:', error)
      throw new Error(`가격 트렌드 분석 실패: ${error}`)
    }
  }

  async compareIngredientPrices(
    ingredientIds: string[],
    dateRange: DateRange
  ): Promise<PriceComparison[]> {
    const results: PriceComparison[] = []

    for (const ingredientId of ingredientIds) {
      try {
        // 공급업체별 가격 비교 데이터 조회
        const { data: supplierPrices, error } = await supabase
          .rpc('compare_supplier_prices', {
            ingredient_uuid: ingredientId,
            days_back: this.calculateDaysDifference(dateRange)
          })

        if (error) throw error

        // 식자재 정보 조회
        const { data: ingredient } = await supabase
          .from('ingredients')
          .select('name')
          .eq('id', ingredientId)
          .single()

        if (supplierPrices && supplierPrices.length > 0) {
          const prices = supplierPrices.map(sp => Number(sp.avg_price))
          const lowestPrice = Math.min(...prices)
          const highestPrice = Math.max(...prices)
          const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
          const priceVariance = this.calculateVariance(prices)

          // 추천 공급업체 (가장 저렴한 가격)
          const recommendedSupplier = supplierPrices.find(sp => 
            Number(sp.avg_price) === lowestPrice
          )?.supplier_name

          const comparison: PriceComparison = {
            ingredient_id: ingredientId,
            ingredient_name: ingredient?.name || '알 수 없는 식자재',
            suppliers: supplierPrices.map(sp => ({
              supplier_id: sp.supplier_id,
              supplier_name: sp.supplier_name,
              current_price: Number(sp.avg_price),
              price_change: 0, // 이전 가격과의 변화량 (별도 계산 필요)
              last_updated: new Date(sp.last_update),
              availability: 'available' as const
            })),
            lowest_price: lowestPrice,
            highest_price: highestPrice,
            average_price: averagePrice,
            price_variance: priceVariance,
            recommended_supplier: recommendedSupplier
          }

          results.push(comparison)
        }
      } catch (error) {
        console.error(`식자재 가격 비교 오류 [${ingredientId}]:`, error)
        continue
      }
    }

    return results
  }

  async analyzeSupplierPrices(
    supplierId: string,
    dateRange: DateRange
  ): Promise<SupplierAnalysis> {
    try {
      // 공급업체 기본 정보 조회
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('name')
        .eq('id', supplierId)
        .single()

      if (!supplier) {
        throw new Error('공급업체를 찾을 수 없습니다')
      }

      // 해당 공급업체의 가격 데이터 조회
      const { data: priceRecords, error } = await supabase
        .from('price_records')
        .select(`
          *,
          ingredients (name, category)
        `)
        .eq('supplier_id', supplierId)
        .gte('created_at', dateRange.startDate.toISOString())
        .lte('created_at', dateRange.endDate.toISOString())

      if (error) throw error

      if (!priceRecords || priceRecords.length === 0) {
        throw new Error('공급업체 가격 데이터가 없습니다')
      }

      // 카테고리별 분석
      const categoryMap = new Map<string, { prices: number[], count: number }>()
      
      priceRecords.forEach(record => {
        const category = record.ingredients?.category || '기타'
        if (!categoryMap.has(category)) {
          categoryMap.set(category, { prices: [], count: 0 })
        }
        categoryMap.get(category)!.prices.push(record.price)
        categoryMap.get(category)!.count++
      })

      const categoryAnalysis = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        ingredient_count: data.count,
        average_price: data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length,
        price_trend: 'stable' as const // 트렌드 계산 로직 필요
      }))

      // 전체 평균 가격 계산
      const allPrices = priceRecords.map(record => record.price)
      const averagePrice = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length
      
      // 가격 수준 결정 (시장 평균과 비교 필요 - 임시로 절대값 기준)
      let averagePriceLevel: 'low' | 'medium' | 'high' = 'medium'
      if (averagePrice < 5000) averagePriceLevel = 'low'
      else if (averagePrice > 15000) averagePriceLevel = 'high'

      // 가격 안정성 계산 (변동계수)
      const priceStability = 1 - (this.calculateStandardDeviation(allPrices) / averagePrice)
      const reliabilityScore = Math.min(Math.max(priceStability, 0), 1) // 0-1 사이로 정규화

      return {
        supplier_id: supplierId,
        supplier_name: supplier.name,
        total_ingredients: new Set(priceRecords.map(record => record.ingredient_id)).size,
        average_price_level: averagePriceLevel,
        price_stability: Math.max(0, Math.min(1, priceStability)),
        reliability_score: reliabilityScore,
        ingredient_categories: categoryAnalysis,
        monthly_trends: [] // 월별 트렌드 계산 필요
      }

    } catch (error) {
      console.error('공급업체 분석 오류:', error)
      throw new Error(`공급업체 분석 실패: ${error}`)
    }
  }

  async calculateRecipeCost(recipeId: string): Promise<RecipeCostAnalysis> {
    try {
      // 데이터베이스 함수를 사용하여 레시피 원가 계산
      const { data: calculatedCost, error } = await supabase
        .rpc('calculate_recipe_cost', {
          recipe_uuid: recipeId
        })

      if (error) throw error

      // 레시피 기본 정보 조회
      const { data: recipe } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            *,
            ingredients (name, unit)
          )
        `)
        .eq('id', recipeId)
        .single()

      if (!recipe) {
        throw new Error('레시피를 찾을 수 없습니다')
      }

      // 식자재별 원가 계산
      const ingredientCosts = []
      let totalCost = 0

      for (const recipeIngredient of recipe.recipe_ingredients) {
        // 해당 식자재의 최신 최저가 조회
        const { data: latestPrices } = await supabase
          .rpc('get_latest_ingredient_price', {
            ingredient_uuid: recipeIngredient.ingredient_id
          })

        let unitPrice = 0
        let suppliers: any[] = []

        if (latestPrices && latestPrices.length > 0) {
          // 최저가 찾기
          const sortedPrices = latestPrices.sort((a, b) => a.price - b.price)
          unitPrice = sortedPrices[0].price

          suppliers = sortedPrices.slice(0, 3).map(price => ({
            supplier_id: price.supplier_id,
            supplier_name: price.supplier_name,
            price: price.price,
            potential_saving: price.price - sortedPrices[0].price,
            quality_grade: undefined
          }))
        }

        const ingredientTotalCost = recipeIngredient.quantity * unitPrice
        totalCost += ingredientTotalCost

        ingredientCosts.push({
          ingredient_id: recipeIngredient.ingredient_id,
          ingredient_name: recipeIngredient.ingredients.name,
          quantity: recipeIngredient.quantity,
          unit: recipeIngredient.unit,
          unit_price: unitPrice,
          total_cost: ingredientTotalCost,
          cost_percentage: 0, // 나중에 계산
          suppliers
        })
      }

      // 원가 비율 계산
      ingredientCosts.forEach(cost => {
        cost.cost_percentage = totalCost > 0 ? (cost.total_cost / totalCost) * 100 : 0
      })

      const costPerServing = recipe.servings > 0 ? totalCost / recipe.servings : 0

      // 수익성 분석
      const suggestedSellingPrice = totalCost * 2.5 // 2.5배 마진
      const currentSellingPrice = recipe.selling_price || 0
      const grossMargin = currentSellingPrice - totalCost
      const grossMarginPercentage = currentSellingPrice > 0 ? (grossMargin / currentSellingPrice) * 100 : 0

      return {
        recipe_id: recipeId,
        recipe_name: recipe.name,
        total_cost: totalCost,
        cost_per_serving: costPerServing,
        ingredient_costs: ingredientCosts,
        cost_breakdown: {
          ingredients_cost: totalCost,
          ingredients_percentage: 100, // 현재는 식자재 비용만 고려
          total_cost: totalCost
        },
        profitability: {
          current_selling_price: currentSellingPrice,
          suggested_selling_price: suggestedSellingPrice,
          gross_margin: grossMargin,
          gross_margin_percentage: grossMarginPercentage,
          break_even_price: totalCost,
          competitive_price_range: {
            min: totalCost * 1.8,
            max: totalCost * 3.2
          }
        },
        recommendations: this.generateCostRecommendations(ingredientCosts)
      }

    } catch (error) {
      console.error('레시피 원가 계산 오류:', error)
      throw new Error(`레시피 원가 계산 실패: ${error}`)
    }
  }

  async predictPrices(
    ingredientId: string,
    daysAhead: number
  ): Promise<PricePrediction> {
    try {
      // 과거 가격 데이터 조회 (단순 예측 모델)
      const { data: historicalPrices, error } = await supabase
        .rpc('get_price_trend', {
          ingredient_uuid: ingredientId,
          days_back: Math.min(daysAhead * 4, 120) // 최대 4개월 데이터
        })

      if (error) throw error

      const { data: ingredient } = await supabase
        .from('ingredients')
        .select('name')
        .eq('id', ingredientId)
        .single()

      if (!historicalPrices || historicalPrices.length < 7) {
        throw new Error('예측을 위한 충분한 데이터가 없습니다')
      }

      // 단순 선형 회귀 예측
      const prices = historicalPrices.map(p => Number(p.avg_price))
      const trend = this.calculateLinearTrend(prices)
      const currentPrice = prices[0]
      const predictedPrice = currentPrice + (trend * daysAhead)

      // 신뢰도 계산 (데이터 일관성 기반)
      const priceVariability = this.calculateVarianceCoefficient(prices)
      const confidenceLevel = Math.max(0.3, Math.min(0.9, 1 - priceVariability))

      // 예측 범위 계산
      const standardDeviation = this.calculateStandardDeviation(prices)
      const priceRange = {
        min: Math.max(0, predictedPrice - standardDeviation),
        max: predictedPrice + standardDeviation
      }

      return {
        ingredient_id: ingredientId,
        ingredient_name: ingredient?.name || '알 수 없는 식자재',
        prediction_date: new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000),
        predicted_price: predictedPrice,
        confidence_level: confidenceLevel,
        price_range: priceRange,
        factors: [
          {
            factor: '가격 트렌드',
            impact: trend > 0 ? 'positive' : 'negative',
            weight: 0.7,
            description: `${Math.abs(trend).toFixed(2)}원/일 ${trend > 0 ? '상승' : '하락'} 추세`
          },
          {
            factor: '가격 변동성',
            impact: priceVariability > 0.2 ? 'negative' : 'positive',
            weight: 0.3,
            description: `변동계수: ${(priceVariability * 100).toFixed(1)}%`
          }
        ]
      }

    } catch (error) {
      console.error('가격 예측 오류:', error)
      throw new Error(`가격 예측 실패: ${error}`)
    }
  }

  // 유틸리티 메서드들
  private calculateDaysDifference(dateRange: DateRange): number {
    return Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2))
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length
  }

  private calculateStandardDeviation(numbers: number[]): number {
    return Math.sqrt(this.calculateVariance(numbers))
  }

  private calculateVarianceCoefficient(numbers: number[]): number {
    if (numbers.length === 0) return 0
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length
    if (mean === 0) return 0
    return this.calculateStandardDeviation(numbers) / mean
  }

  private calculateLinearTrend(prices: number[]): number {
    if (prices.length < 2) return 0
    
    const n = prices.length
    const xSum = (n * (n - 1)) / 2 // 0 + 1 + 2 + ... + (n-1)
    const ySum = prices.reduce((sum, price) => sum + price, 0)
    const xySum = prices.reduce((sum, price, index) => sum + price * index, 0)
    const xxSum = (n * (n - 1) * (2 * n - 1)) / 6 // 0² + 1² + 2² + ... + (n-1)²
    
    const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum)
    return slope
  }

  private generateCostRecommendations(ingredientCosts: any[]): any[] {
    const recommendations = []

    // 고비용 식자재 대체 추천
    const sortedByCost = [...ingredientCosts].sort((a, b) => b.cost_percentage - a.cost_percentage)
    
    for (const cost of sortedByCost.slice(0, 3)) { // 상위 3개만
      if (cost.cost_percentage > 20 && cost.suppliers.length > 1) {
        const cheapestSupplier = cost.suppliers[0]
        const currentSupplier = cost.suppliers.find((s: any) => s.price === cost.unit_price) || cost.suppliers[1]
        
        if (currentSupplier && cheapestSupplier.price < currentSupplier.price) {
          recommendations.push({
            type: 'supplier_switch' as const,
            ingredient_id: cost.ingredient_id,
            ingredient_name: cost.ingredient_name,
            current_cost: cost.total_cost,
            recommended_action: `${cheapestSupplier.supplier_name}으로 공급업체 변경`,
            potential_saving: currentSupplier.price - cheapestSupplier.price,
            impact_level: 'medium' as const,
            feasibility: 'easy' as const
          })
        }
      }
    }

    return recommendations
  }
}