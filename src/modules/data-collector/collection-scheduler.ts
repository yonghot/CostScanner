import { 
  CollectionScheduler, 
  CollectionSchedule,
  DataCollector 
} from './collector-interface'
import { WebScrapingCollectorImpl } from './web-scraping-collector'
import { OCRCollectorImpl } from './ocr-collector'
import { APICollectorImpl } from './api-collector'
import { supabase } from '@/lib/supabase'

interface ScheduledJob {
  id: string
  schedule: CollectionSchedule
  collector: DataCollector
  isRunning: boolean
  lastRun?: Date
  nextRun: Date
}

export class CollectionSchedulerImpl implements CollectionScheduler {
  private scheduledJobs: Map<string, ScheduledJob> = new Map()
  private collectors: Map<string, DataCollector> = new Map()
  private intervalIds: Map<string, NodeJS.Timeout> = new Map()

  constructor() {
    this.initializeCollectors()
  }

  private initializeCollectors(): void {
    this.collectors.set('web-scraping', new WebScrapingCollectorImpl())
    this.collectors.set('ocr', new OCRCollectorImpl())
    this.collectors.set('api', new APICollectorImpl())
  }

  async scheduleCollection(
    collector: DataCollector,
    schedule: CollectionSchedule
  ): Promise<string> {
    const jobId = this.generateJobId()
    
    const scheduledJob: ScheduledJob = {
      id: jobId,
      schedule,
      collector,
      isRunning: false,
      nextRun: this.calculateNextRun(schedule.cronExpression)
    }

    this.scheduledJobs.set(jobId, scheduledJob)
    
    // 실제 스케줄링 시작
    await this.startSchedule(jobId)
    
    // 데이터베이스에 스케줄 정보 저장
    await this.saveScheduleToDatabase(schedule)

    return jobId
  }

  async cancelSchedule(scheduleId: string): Promise<void> {
    const job = this.scheduledJobs.get(scheduleId)
    if (!job) {
      throw new Error(`스케줄을 찾을 수 없습니다: ${scheduleId}`)
    }

    // 인터벌 정리
    const intervalId = this.intervalIds.get(scheduleId)
    if (intervalId) {
      clearInterval(intervalId)
      this.intervalIds.delete(scheduleId)
    }

    // 메모리에서 제거
    this.scheduledJobs.delete(scheduleId)

    // 데이터베이스에서 제거
    await this.removeScheduleFromDatabase(scheduleId)
  }

  async getSchedules(): Promise<CollectionSchedule[]> {
    const schedules: CollectionSchedule[] = []
    
    for (const job of Array.from(this.scheduledJobs.values())) {
      schedules.push({
        ...job.schedule,
        lastRunAt: job.lastRun,
        nextRunAt: job.nextRun
      })
    }

    return schedules
  }

  private async startSchedule(jobId: string): Promise<void> {
    const job = this.scheduledJobs.get(jobId)
    if (!job) return

    // cron 표현식을 간격(ms)으로 변환
    const intervalMs = this.cronToInterval(job.schedule.cronExpression)
    
    if (intervalMs > 0) {
      const intervalId = setInterval(async () => {
        await this.executeJob(jobId)
      }, intervalMs)
      
      this.intervalIds.set(jobId, intervalId)
    }

    // 첫 실행을 위해 즉시 실행 여부 확인
    if (this.shouldRunNow(job.nextRun)) {
      setTimeout(() => this.executeJob(jobId), 1000) // 1초 후 실행
    }
  }

  private async executeJob(jobId: string): Promise<void> {
    const job = this.scheduledJobs.get(jobId)
    if (!job || job.isRunning) return

    job.isRunning = true
    job.lastRun = new Date()
    
    try {
      console.log(`스케줄 작업 시작: ${job.schedule.name}`)
      
      // 공급업체 및 식자재 정보 로드
      const suppliers = await this.getSuppliersByIds(job.schedule.suppliers)
      const ingredients = await this.getIngredientsByIds(job.schedule.ingredients)

      if (suppliers.length === 0 || ingredients.length === 0) {
        console.warn(`스케줄 작업 건너뛰기: 유효한 공급업체 또는 식자재 없음`)
        return
      }

      // 각 공급업체에 대해 데이터 수집 실행
      for (const supplier of suppliers) {
        try {
          const priceRecords = await job.collector.collectPrices(supplier as any, ingredients as any)
          const validRecords = await job.collector.validateData(priceRecords)
          
          if (validRecords.length > 0) {
            await this.savePriceRecords(validRecords)
            console.log(`${supplier.name}에서 ${validRecords.length}개 가격 정보 수집`)
          }
        } catch (supplierError) {
          console.error(`${supplier.name} 데이터 수집 실패:`, supplierError)
        }
      }

      // 다음 실행 시간 계산
      job.nextRun = this.calculateNextRun(job.schedule.cronExpression)
      
      // 스케줄 정보 업데이트
      await this.updateScheduleInDatabase(job.schedule.id, {
        lastRunAt: job.lastRun,
        nextRunAt: job.nextRun
      })

    } catch (error) {
      console.error(`스케줄 작업 실행 오류 [${job.schedule.name}]:`, error)
    } finally {
      job.isRunning = false
    }
  }

  // 간단한 cron 표현식 파서 (실제 환경에서는 node-cron 등 사용 권장)
  private cronToInterval(cronExpression: string): number {
    // 기본적인 패턴만 지원 (분 시 일 월 요일)
    const patterns: { [key: string]: number } = {
      '*/5 * * * *': 5 * 60 * 1000,      // 5분마다
      '*/10 * * * *': 10 * 60 * 1000,    // 10분마다
      '*/30 * * * *': 30 * 60 * 1000,    // 30분마다
      '0 * * * *': 60 * 60 * 1000,       // 매시간
      '0 */2 * * *': 2 * 60 * 60 * 1000, // 2시간마다
      '0 */6 * * *': 6 * 60 * 60 * 1000, // 6시간마다
      '0 0 * * *': 24 * 60 * 60 * 1000,  // 매일
    }

    return patterns[cronExpression] || 0
  }

  private calculateNextRun(cronExpression: string): Date {
    const now = new Date()
    const intervalMs = this.cronToInterval(cronExpression)
    
    if (intervalMs > 0) {
      return new Date(now.getTime() + intervalMs)
    }
    
    // 기본값: 1시간 후
    return new Date(now.getTime() + 60 * 60 * 1000)
  }

  private shouldRunNow(nextRun: Date): boolean {
    const now = new Date()
    return nextRun.getTime() <= now.getTime()
  }

  // 데이터베이스 관련 메서드들
  private async saveScheduleToDatabase(schedule: CollectionSchedule): Promise<void> {
    // 임시로 주석 처리 - collection_schedules 테이블이 스키마에 정의되지 않음
    /*
    const { error } = await supabase
      .from('collection_schedules') // 이 테이블은 실제 구현에서 추가 필요
      .insert({
        id: schedule.id,
        name: schedule.name,
        collector: schedule.collector,
        cron_expression: schedule.cronExpression,
        suppliers: schedule.suppliers,
        ingredients: schedule.ingredients,
        is_active: schedule.isActive,
        next_run_at: schedule.nextRunAt?.toISOString()
      })

    if (error) {
      console.error('스케줄 저장 오류:', error)
    }
    */
  }

  private async removeScheduleFromDatabase(scheduleId: string): Promise<void> {
    // 임시로 주석 처리 - collection_schedules 테이블이 스키마에 정의되지 않음
    /*
    const { error } = await supabase
      .from('collection_schedules')
      .delete()
      .eq('id', scheduleId)

    if (error) {
      console.error('스케줄 삭제 오류:', error)
    }
    */
  }

  private async updateScheduleInDatabase(
    scheduleId: string, 
    updates: { lastRunAt?: Date; nextRunAt?: Date }
  ): Promise<void> {
    // 임시로 주석 처리 - collection_schedules 테이블이 스키마에 정의되지 않음
    /*
    const { error } = await supabase
      .from('collection_schedules')
      .update({
        last_run_at: updates.lastRunAt?.toISOString(),
        next_run_at: updates.nextRunAt?.toISOString()
      })
      .eq('id', scheduleId)

    if (error) {
      console.error('스케줄 업데이트 오류:', error)
    }
    */
  }

  private async getSuppliersByIds(supplierIds: string[]) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .in('id', supplierIds)
      .eq('is_active', true)

    if (error) {
      console.error('공급업체 조회 오류:', error)
      return []
    }

    return data || []
  }

  private async getIngredientsByIds(ingredientIds: string[]) {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .in('id', ingredientIds)
      .eq('is_active', true)

    if (error) {
      console.error('식자재 조회 오류:', error)
      return []
    }

    return data || []
  }

  private async savePriceRecords(priceRecords: any[]): Promise<void> {
    const { error } = await supabase
      .from('price_records')
      .insert(priceRecords)

    if (error) {
      console.error('가격 정보 저장 오류:', error)
    }
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 전체 스케줄러 정리 (앱 종료 시 호출)
  async cleanup(): Promise<void> {
    // 모든 인터벌 정리
    for (const intervalId of Array.from(this.intervalIds.values())) {
      clearInterval(intervalId)
    }
    this.intervalIds.clear()

    // 모든 컬렉터 정리
    for (const collector of Array.from(this.collectors.values())) {
      if ('cleanup' in collector && typeof collector.cleanup === 'function') {
        await collector.cleanup()
      }
    }
    this.collectors.clear()
    this.scheduledJobs.clear()
  }

  // 모든 스케줄 일시 중지/재개
  async pauseAllSchedules(): Promise<void> {
    for (const [jobId] of Array.from(this.scheduledJobs.entries())) {
      const intervalId = this.intervalIds.get(jobId)
      if (intervalId) {
        clearInterval(intervalId)
        this.intervalIds.delete(jobId)
      }
    }
  }

  async resumeAllSchedules(): Promise<void> {
    for (const [jobId] of Array.from(this.scheduledJobs.entries())) {
      await this.startSchedule(jobId)
    }
  }

  // 스케줄 통계 조회
  async getScheduleStatistics() {
    const stats = {
      totalSchedules: this.scheduledJobs.size,
      activeSchedules: 0,
      runningSchedules: 0,
      recentErrors: 0,
    }

    for (const job of Array.from(this.scheduledJobs.values())) {
      if (job.schedule.isActive) stats.activeSchedules++
      if (job.isRunning) stats.runningSchedules++
    }

    return stats
  }
}