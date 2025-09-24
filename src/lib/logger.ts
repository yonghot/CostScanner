/**
 * 프로덕션 환경을 위한 로거 유틸리티
 * 개발 환경에서는 console을 사용하고, 프로덕션에서는 외부 로깅 서비스로 전송
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  module?: string
  action?: string
  userId?: string
  metadata?: Record<string, any>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...context
    }

    if (this.isDevelopment) {
      // 개발 환경에서는 console 사용
      switch (level) {
        case 'debug':
          console.debug(`[${timestamp}]`, message, context)
          break
        case 'info':
          console.info(`[${timestamp}]`, message, context)
          break
        case 'warn':
          console.warn(`[${timestamp}]`, message, context)
          break
        case 'error':
          console.error(`[${timestamp}]`, message, context)
          break
      }
    } else {
      // 프로덕션 환경에서는 외부 로깅 서비스로 전송
      // TODO: 실제 로깅 서비스 (예: Sentry, LogRocket, DataDog) 통합
      this.sendToLoggingService(logEntry)
    }
  }

  private sendToLoggingService(logEntry: any): void {
    // 외부 로깅 서비스로 전송하는 로직
    // 현재는 스텁 구현
    if (process.env.LOGGING_SERVICE_ENDPOINT) {
      // fetch(process.env.LOGGING_SERVICE_ENDPOINT, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // }).catch(() => {
      //   // 로깅 실패 시 조용히 실패
      // })
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = {
      ...context,
      metadata: {
        ...context?.metadata,
        error: {
          message: error?.message,
          stack: error?.stack,
          name: error?.name
        }
      }
    }
    this.log('error', message, errorContext)
  }
}

// 싱글톤 인스턴스
export const logger = new Logger()