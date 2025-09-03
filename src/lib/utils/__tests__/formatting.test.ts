import {
  formatCurrency,
  formatPercent,
  formatQuantity,
  formatDateRange,
  formatPhoneNumber,
  formatBusinessNumber,
  formatFileSize,
  parseAmount,
  truncate,
  capitalize,
  formatDuration,
  formatRelativeTime,
  formatErrorMessage,
  formatSuccessMessage,
  formatIngredientUnit
} from '../formatting'

describe('Formatting Utils', () => {
  describe('formatCurrency', () => {
    it('should format Korean Won correctly', () => {
      expect(formatCurrency(10000)).toBe('₩10,000')
      expect(formatCurrency(1234567)).toBe('₩1,234,567')
      expect(formatCurrency(0)).toBe('₩0')
    })

    it('should handle different currencies', () => {
      expect(formatCurrency(100, 'USD')).toBe('$100.00')
      expect(formatCurrency(100, 'EUR')).toBe('€100.00')
      expect(formatCurrency(100, 'JPY')).toBe('¥100')
    })

    it('should format with custom locale', () => {
      expect(formatCurrency(1000, 'KRW', 'en-US')).toBe('₩1,000')
      expect(formatCurrency(1000, 'USD', 'ko-KR')).toBe('US$1,000.00')
    })

    it('should handle negative values', () => {
      expect(formatCurrency(-5000)).toBe('-₩5,000')
      expect(formatCurrency(-100, 'USD')).toBe('-$100.00')
    })
  })

  describe('formatPercent', () => {
    it('should format percentages correctly', () => {
      expect(formatPercent(0.15)).toBe('15%')
      expect(formatPercent(0.1234)).toBe('12.34%')
      expect(formatPercent(1)).toBe('100%')
      expect(formatPercent(0)).toBe('0%')
    })

    it('should handle decimal places', () => {
      expect(formatPercent(0.15678, 0)).toBe('16%')
      expect(formatPercent(0.15678, 1)).toBe('15.7%')
      expect(formatPercent(0.15678, 3)).toBe('15.678%')
    })

    it('should handle values already as percentages', () => {
      expect(formatPercent(15, 0, false)).toBe('15%')
      expect(formatPercent(15.5, 1, false)).toBe('15.5%')
    })
  })

  describe('formatQuantity', () => {
    it('should format quantities with units', () => {
      expect(formatQuantity(1, 'kg')).toBe('1kg')
      expect(formatQuantity(500, 'g')).toBe('500g')
      expect(formatQuantity(2.5, 'L')).toBe('2.5L')
      expect(formatQuantity(3, '개')).toBe('3개')
    })

    it('should handle decimal places', () => {
      expect(formatQuantity(1.234, 'kg', 1)).toBe('1.2kg')
      expect(formatQuantity(1.567, 'L', 2)).toBe('1.57L')
      expect(formatQuantity(1.999, 'kg', 0)).toBe('2kg')
    })

    it('should handle zero and negative values', () => {
      expect(formatQuantity(0, 'kg')).toBe('0kg')
      expect(formatQuantity(-1, 'kg')).toBe('-1kg')
    })
  })

  describe('formatDateRange', () => {
    it('should format date ranges in Korean', () => {
      const start = new Date('2024-01-01')
      const end = new Date('2024-01-31')
      const formatted = formatDateRange(start, end)
      expect(formatted).toContain('2024년 1월 1일')
      expect(formatted).toContain('2024년 1월 31일')
      expect(formatted).toContain('~')
    })

    it('should handle same day range', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDateRange(date, date)
      expect(formatted).toBe('2024년 1월 15일')
    })

    it('should handle string dates', () => {
      const formatted = formatDateRange('2024-01-01', '2024-01-31')
      expect(formatted).toContain('2024년 1월 1일')
      expect(formatted).toContain('2024년 1월 31일')
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format Korean phone numbers', () => {
      expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678')
      expect(formatPhoneNumber('0212345678')).toBe('02-1234-5678')
      expect(formatPhoneNumber('0311234567')).toBe('031-123-4567')
    })

    it('should handle already formatted numbers', () => {
      expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678')
      expect(formatPhoneNumber('02-123-4567')).toBe('02-123-4567')
    })

    it('should handle international format', () => {
      expect(formatPhoneNumber('+821012345678')).toBe('+82-10-1234-5678')
      expect(formatPhoneNumber('+8221234567')).toBe('+82-2-123-4567')
    })

    it('should handle invalid numbers', () => {
      expect(formatPhoneNumber('123')).toBe('123')
      expect(formatPhoneNumber('')).toBe('')
      expect(formatPhoneNumber('abc')).toBe('abc')
    })
  })

  describe('formatBusinessNumber', () => {
    it('should format Korean business numbers', () => {
      expect(formatBusinessNumber('1234567890')).toBe('123-45-67890')
      expect(formatBusinessNumber('123-45-67890')).toBe('123-45-67890')
    })

    it('should handle invalid formats', () => {
      expect(formatBusinessNumber('12345')).toBe('12345')
      expect(formatBusinessNumber('abc')).toBe('abc')
      expect(formatBusinessNumber('')).toBe('')
    })
  })

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1)).toBe('1 Byte')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1073741824)).toBe('1 GB')
    })

    it('should handle decimal places', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(1536000)).toBe('1.46 MB')
      expect(formatFileSize(1536000, 1)).toBe('1.5 MB')
    })

    it('should handle negative values', () => {
      expect(formatFileSize(-1024)).toBe('-1 KB')
    })
  })

  describe('parseAmount', () => {
    it('should parse formatted amounts', () => {
      expect(parseAmount('₩1,000')).toBe(1000)
      expect(parseAmount('1,234,567')).toBe(1234567)
      expect(parseAmount('$100.50')).toBe(100.5)
    })

    it('should handle various formats', () => {
      expect(parseAmount('1000원')).toBe(1000)
      expect(parseAmount('5,000 KRW')).toBe(5000)
      expect(parseAmount('  1,000  ')).toBe(1000)
    })

    it('should handle invalid inputs', () => {
      expect(parseAmount('')).toBe(0)
      expect(parseAmount('abc')).toBe(0)
      expect(parseAmount(null as any)).toBe(0)
    })
  })

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const text = 'This is a very long string that needs to be truncated'
      expect(truncate(text, 20)).toBe('This is a very lo...')
      expect(truncate(text, 10)).toBe('This is...')
    })

    it('should not truncate short strings', () => {
      expect(truncate('Short', 10)).toBe('Short')
      expect(truncate('Equal', 5)).toBe('Equal')
    })

    it('should handle custom ellipsis', () => {
      expect(truncate('Long text here', 8, '…')).toBe('Long te…')
      expect(truncate('Long text here', 8, '~')).toBe('Long te~')
    })

    it('should handle edge cases', () => {
      expect(truncate('', 10)).toBe('')
      expect(truncate('Test', 0)).toBe('...')
      expect(truncate('Test', -1)).toBe('...')
    })
  })

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('hello world')).toBe('Hello world')
      expect(capitalize('HELLO')).toBe('Hello')
    })

    it('should handle each word when specified', () => {
      expect(capitalize('hello world', true)).toBe('Hello World')
      expect(capitalize('the quick brown fox', true)).toBe('The Quick Brown Fox')
    })

    it('should handle edge cases', () => {
      expect(capitalize('')).toBe('')
      expect(capitalize('a')).toBe('A')
      expect(capitalize('123')).toBe('123')
      expect(capitalize('  hello')).toBe('  Hello')
    })
  })

  describe('formatDuration', () => {
    it('should format durations in Korean', () => {
      expect(formatDuration(60)).toBe('1분')
      expect(formatDuration(3600)).toBe('1시간')
      expect(formatDuration(86400)).toBe('1일')
      expect(formatDuration(90)).toBe('1분 30초')
    })

    it('should handle complex durations', () => {
      expect(formatDuration(3661)).toBe('1시간 1분')
      expect(formatDuration(90061)).toBe('1일 1시간')
      expect(formatDuration(93784)).toBe('1일 2시간 3분')
    })

    it('should handle zero and negative', () => {
      expect(formatDuration(0)).toBe('0초')
      expect(formatDuration(-60)).toBe('-1분')
    })

    it('should handle English format', () => {
      expect(formatDuration(60, 'en')).toBe('1 minute')
      expect(formatDuration(120, 'en')).toBe('2 minutes')
      expect(formatDuration(3600, 'en')).toBe('1 hour')
    })
  })

  describe('formatRelativeTime', () => {
    const now = new Date()
    
    it('should format past times', () => {
      const past = new Date(now.getTime() - 60000) // 1 minute ago
      expect(formatRelativeTime(past)).toBe('1분 전')
      
      const hourAgo = new Date(now.getTime() - 3600000) // 1 hour ago
      expect(formatRelativeTime(hourAgo)).toBe('1시간 전')
      
      const dayAgo = new Date(now.getTime() - 86400000) // 1 day ago
      expect(formatRelativeTime(dayAgo)).toBe('어제')
    })

    it('should format future times', () => {
      const future = new Date(now.getTime() + 60000) // 1 minute from now
      expect(formatRelativeTime(future)).toBe('1분 후')
      
      const hourLater = new Date(now.getTime() + 3600000) // 1 hour from now
      expect(formatRelativeTime(hourLater)).toBe('1시간 후')
      
      const tomorrow = new Date(now.getTime() + 86400000) // 1 day from now
      expect(formatRelativeTime(tomorrow)).toBe('내일')
    })

    it('should handle "just now"', () => {
      expect(formatRelativeTime(now)).toBe('방금')
      const fewSecondsAgo = new Date(now.getTime() - 5000)
      expect(formatRelativeTime(fewSecondsAgo)).toBe('방금')
    })
  })

  describe('formatErrorMessage', () => {
    it('should format error messages with prefix', () => {
      expect(formatErrorMessage('Something went wrong')).toBe('❌ Something went wrong')
      expect(formatErrorMessage('Invalid input')).toBe('❌ Invalid input')
    })

    it('should handle Error objects', () => {
      const error = new Error('Test error')
      expect(formatErrorMessage(error)).toBe('❌ Test error')
    })

    it('should handle custom prefix', () => {
      expect(formatErrorMessage('Error', '⚠️')).toBe('⚠️ Error')
      expect(formatErrorMessage('Failed', '🚫')).toBe('🚫 Failed')
    })
  })

  describe('formatSuccessMessage', () => {
    it('should format success messages with prefix', () => {
      expect(formatSuccessMessage('Operation completed')).toBe('✅ Operation completed')
      expect(formatSuccessMessage('Saved successfully')).toBe('✅ Saved successfully')
    })

    it('should handle custom prefix', () => {
      expect(formatSuccessMessage('Done', '✨')).toBe('✨ Done')
      expect(formatSuccessMessage('Complete', '🎉')).toBe('🎉 Complete')
    })
  })

  describe('formatIngredientUnit', () => {
    it('should format ingredient units correctly', () => {
      expect(formatIngredientUnit(1, 'kg')).toBe('1kg')
      expect(formatIngredientUnit(500, 'g')).toBe('500g')
      expect(formatIngredientUnit(2.5, 'L')).toBe('2.5L')
      expect(formatIngredientUnit(3, '개')).toBe('3개')
    })

    it('should handle unit conversions', () => {
      expect(formatIngredientUnit(1000, 'g')).toBe('1kg')
      expect(formatIngredientUnit(1500, 'g')).toBe('1.5kg')
      expect(formatIngredientUnit(500, 'g')).toBe('500g')
      expect(formatIngredientUnit(1000, 'ml')).toBe('1L')
      expect(formatIngredientUnit(250, 'ml')).toBe('250ml')
    })

    it('should handle special units', () => {
      expect(formatIngredientUnit(0.5, 'tsp')).toBe('0.5tsp')
      expect(formatIngredientUnit(2, 'tbsp')).toBe('2tbsp')
      expect(formatIngredientUnit(1, 'cup')).toBe('1cup')
    })
  })
})