import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Database } from '@/types/supabase'
import { CostAnalyzerImpl } from '@/modules/cost-analyzer/cost-analyzer-impl'
import { logger } from '@/lib/logger'

const RequestSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('price_trend'),
    data: z.object({
      ingredientId: z.string().uuid(),
      dateRange: z
        .object({
          startDate: z.coerce.date(),
          endDate: z.coerce.date(),
        })
        .optional(),
    }),
  }),
  z.object({
    type: z.literal('supplier_comparison'),
    data: z.object({
      ingredients: z.array(z.string().uuid()).min(1),
    }),
  }),
  z.object({
    type: z.literal('recipe_cost'),
    data: z.object({
      recipeId: z.string().uuid(),
    }),
  }),
  z.object({
    type: z.literal('supplier_analysis'),
    data: z.object({
      supplierId: z.string().uuid(),
      metrics: z.array(z.string()).optional(),
    }),
  }),
])

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const parsed = RequestSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: '요청 형식이 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    const analyzer = new CostAnalyzerImpl()

    switch (parsed.data.type) {
      case 'price_trend': {
        const { ingredientId, dateRange } = parsed.data.data
        const range = dateRange ?? {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
        }
        const analysis = await analyzer.analyzePriceTrend(ingredientId, range)
        return NextResponse.json({ success: true, data: { analysis } })
      }
      case 'supplier_comparison': {
        const { ingredients } = parsed.data.data
        const comparison = await analyzer.compareIngredientPrices(ingredients, {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
        })
        return NextResponse.json({ success: true, data: { comparison } })
      }
      case 'recipe_cost': {
        const { recipeId } = parsed.data.data
        const recipeCost = await analyzer.calculateRecipeCost(recipeId)
        return NextResponse.json({ success: true, data: { recipeCost } })
      }
      case 'supplier_analysis': {
        const { supplierId } = parsed.data.data
        const analysis = await analyzer.analyzeSupplierPrices(supplierId, {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
        })
        return NextResponse.json({ success: true, data: { analysis } })
      }
    }
  } catch (error) {
    logger.error('Analysis API Error', error as Error, { module: 'api/analyze' })
    return NextResponse.json(
      { success: false, error: '분석 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
