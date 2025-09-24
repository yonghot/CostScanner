import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/supabase'
import { CollectionSchedulerImpl } from '@/modules/data-collector/collection-scheduler'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, scheduleData } = body

    const scheduler = new CollectionSchedulerImpl()

    switch (action) {
      case 'start':
        if (!scheduleData) {
          return NextResponse.json({ error: 'Schedule data required' }, { status: 400 })
        }
        
        const scheduleId = await scheduler.scheduleCollection(
          scheduleData.collector,
          scheduleData.schedule
        )
        
        return NextResponse.json({ scheduleId, message: '데이터 수집이 시작되었습니다.' })

      case 'stop':
        const { scheduleId: stopId } = body
        if (!stopId) {
          return NextResponse.json({ error: 'Schedule ID required' }, { status: 400 })
        }
        
        await scheduler.cancelSchedule(stopId)
        return NextResponse.json({ message: '데이터 수집이 중지되었습니다.' })

      case 'status':
        const schedules = await scheduler.getSchedules()
        const stats = await scheduler.getScheduleStatistics()
        
        return NextResponse.json({ schedules, stats })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    logger.error('Collection API Error', error as Error, { module: 'api/collect' })
    return NextResponse.json(
      { error: '데이터 수집 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}