import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/supabase'
import { logger } from '@/lib/logger'

// NOTE: 데이터 수집 라우트는 현재 비활성화 상태입니다.
// 사유: in-memory CollectionSchedulerImpl이 Next.js/Vercel serverless 환경에서
// cold start마다 상태가 소실되어 스케줄링이 실제로 동작하지 않음 (코드 리뷰
// Critical #4). DB-backed queue 또는 Vercel Cron 기반으로 재설계가 필요합니다.
// 자세한 내용: docs/PROGRESS.md "Critical 차단 항목" 섹션 참조.

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

    logger.warn('Collection API called but disabled', {
      module: 'api/collect',
      userId: user.id,
    })

    return NextResponse.json(
      {
        success: false,
        error: '데이터 수집 기능은 현재 재설계 중입니다.',
      },
      { status: 503 }
    )
  } catch (error) {
    logger.error('Collection API Error', error as Error, {
      module: 'api/collect',
    })
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
