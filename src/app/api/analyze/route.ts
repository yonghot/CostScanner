import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/supabase'
import { CostAnalyzerImpl } from '@/modules/cost-analyzer/cost-analyzer-impl'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    const analyzer = new CostAnalyzerImpl()

    switch (type) {
      case 'price_trend':
        const { ingredientId, dateRange } = data
        if (!ingredientId) {
          return NextResponse.json({ error: 'Ingredient ID required' }, { status: 400 })
        }
        
        const trendAnalysis = await analyzer.analyzePriceTrend(ingredientId, dateRange)
        return NextResponse.json({ analysis: trendAnalysis })

      case 'supplier_comparison':
        const { ingredients } = data
        if (!ingredients || ingredients.length === 0) {
          return NextResponse.json({ error: 'Ingredients required' }, { status: 400 })
        }
        
        const comparison = await analyzer.compareIngredientPrices(ingredients, { 
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
          endDate: new Date() 
        })
        return NextResponse.json({ comparison })

      case 'recipe_cost':
        const { recipeId } = data
        if (!recipeId) {
          return NextResponse.json({ error: 'Recipe ID required' }, { status: 400 })
        }
        
        const recipeCost = await analyzer.calculateRecipeCost(recipeId)
        return NextResponse.json({ recipeCost })

      case 'supplier_analysis':
        const { supplierId, metrics } = data
        if (!supplierId) {
          return NextResponse.json({ error: 'Supplier ID required' }, { status: 400 })
        }
        
        const supplierAnalysis = await analyzer.analyzeSupplierPrices(supplierId, { 
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
          endDate: new Date() 
        })
        return NextResponse.json({ analysis: supplierAnalysis })

      default:
        return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Analysis API Error:', error)
    return NextResponse.json(
      { error: '분석 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}