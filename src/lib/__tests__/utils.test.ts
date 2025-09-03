import { cn, formatBytes, formatRelativeTime, formatNumber, formatPrice, formatDateKr, truncateText, isValidEmail, generateId, debounce, throttle } from '../utils'

describe('lib/utils', () => {
  describe('cn (classname utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active')
      expect(cn('base', { active: false, disabled: true })).toBe('base disabled')
    })

    it('should handle arrays of classes', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
      expect(cn(['foo', undefined, 'bar'])).toBe('foo bar')
    })

    it('should override tailwind classes correctly', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2')
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
      expect(cn('bg-gray-100', 'bg-white')).toBe('bg-white')
    })
  })

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes')
      expect(formatBytes(1024)).toBe('1 KB')
      expect(formatBytes(1048576)).toBe('1 MB')
      expect(formatBytes(1073741824)).toBe('1 GB')
    })

    it('should handle decimals', () => {
      expect(formatBytes(1536, 1)).toBe('1.5 KB')
      expect(formatBytes(1536000, 2)).toBe('1.46 MB')
    })

    it('should handle large values', () => {
      expect(formatBytes(1099511627776)).toBe('1 TB')
    })
  })

  describe('formatRelativeTime', () => {
    const now = Date.now()
    const mockDate = (diff: number) => new Date(now - diff)

    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-01-15T10:00:00'))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should format recent times', () => {
      expect(formatRelativeTime(mockDate(30000))).toBe('방금 전') // 30 seconds ago
      expect(formatRelativeTime(mockDate(0))).toBe('방금 전') // now
    })

    it('should format minutes', () => {
      expect(formatRelativeTime(mockDate(60000))).toBe('1분 전') // 1 minute
      expect(formatRelativeTime(mockDate(120000))).toBe('2분 전') // 2 minutes
      expect(formatRelativeTime(mockDate(3540000))).toBe('59분 전') // 59 minutes
    })

    it('should format hours', () => {
      expect(formatRelativeTime(mockDate(3600000))).toBe('1시간 전') // 1 hour
      expect(formatRelativeTime(mockDate(7200000))).toBe('2시간 전') // 2 hours
      expect(formatRelativeTime(mockDate(86340000))).toBe('23시간 전') // 23 hours
    })

    it('should format days', () => {
      expect(formatRelativeTime(mockDate(86400000))).toBe('1일 전') // 1 day
      expect(formatRelativeTime(mockDate(172800000))).toBe('2일 전') // 2 days
      expect(formatRelativeTime(mockDate(2505600000))).toBe('29일 전') // 29 days
    })

    it('should format months', () => {
      expect(formatRelativeTime(mockDate(2592000000))).toBe('1개월 전') // 30 days
      expect(formatRelativeTime(mockDate(5184000000))).toBe('2개월 전') // 60 days
    })

    it('should format years', () => {
      expect(formatRelativeTime(mockDate(31536000000))).toBe('1년 전') // 1 year
      expect(formatRelativeTime(mockDate(63072000000))).toBe('2년 전') // 2 years
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with Korean locale', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1234567)).toBe('1,234,567')
      expect(formatNumber(0)).toBe('0')
    })

    it('should handle decimals', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56')
      expect(formatNumber(0.123)).toBe('0.123')
    })

    it('should handle negative numbers', () => {
      expect(formatNumber(-1000)).toBe('-1,000')
      expect(formatNumber(-1234567)).toBe('-1,234,567')
    })
  })

  describe('formatPrice', () => {
    it('should format prices in Korean Won', () => {
      expect(formatPrice(10000)).toBe('₩10,000')
      expect(formatPrice(1234567)).toBe('₩1,234,567')
      expect(formatPrice(0)).toBe('₩0')
    })

    it('should handle negative prices', () => {
      expect(formatPrice(-10000)).toBe('-₩10,000')
    })

    it('should handle string input', () => {
      expect(formatPrice('10000')).toBe('₩10,000')
      expect(formatPrice('not a number')).toBe('₩0')
    })
  })

  describe('formatDateKr', () => {
    it('should format dates in Korean format', () => {
      const date = new Date('2024-01-15T09:30:00')
      expect(formatDateKr(date)).toMatch(/2024년 1월 15일/)
    })

    it('should handle string dates', () => {
      expect(formatDateKr('2024-01-15')).toMatch(/2024년 1월 15일/)
    })

    it('should show time when specified', () => {
      const date = new Date('2024-01-15T15:30:00')
      const formatted = formatDateKr(date, true)
      expect(formatted).toMatch(/2024년 1월 15일/)
      expect(formatted).toMatch(/15:30/)
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated'
      expect(truncateText(text, 20)).toBe('This is a very lon...')
      expect(truncateText(text, 10)).toBe('This is...')
    })

    it('should not truncate short text', () => {
      expect(truncateText('Short', 10)).toBe('Short')
      expect(truncateText('Equal', 5)).toBe('Equal')
    })

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('')
    })

    it('should handle custom suffix', () => {
      expect(truncateText('Long text here', 8, '…')).toBe('Long t…')
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@company.co.kr')).toBe(true)
      expect(isValidEmail('admin+test@domain.org')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(isValidEmail('notanemail')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('user @example.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('should generate IDs with prefix', () => {
      const id = generateId('user')
      expect(id).toMatch(/^user_/)
    })

    it('should generate IDs of expected format', () => {
      const id = generateId()
      expect(id).toMatch(/^[a-z0-9]+$/)
      expect(id.length).toBeGreaterThan(10)
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('should debounce function calls', () => {
      const fn = jest.fn()
      const debounced = debounce(fn, 100)

      debounced('a')
      debounced('b')
      debounced('c')

      expect(fn).not.toBeCalled()

      jest.advanceTimersByTime(100)
      expect(fn).toBeCalledTimes(1)
      expect(fn).toBeCalledWith('c')
    })

    it('should reset timer on each call', () => {
      const fn = jest.fn()
      const debounced = debounce(fn, 100)

      debounced('a')
      jest.advanceTimersByTime(50)
      debounced('b')
      jest.advanceTimersByTime(50)
      debounced('c')
      jest.advanceTimersByTime(50)

      expect(fn).not.toBeCalled()

      jest.advanceTimersByTime(50)
      expect(fn).toBeCalledTimes(1)
      expect(fn).toBeCalledWith('c')
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })

  describe('throttle', () => {
    jest.useFakeTimers()

    it('should throttle function calls', () => {
      const fn = jest.fn()
      const throttled = throttle(fn, 100)

      throttled('a')
      expect(fn).toBeCalledTimes(1)
      expect(fn).toBeCalledWith('a')

      throttled('b')
      throttled('c')
      expect(fn).toBeCalledTimes(1)

      jest.advanceTimersByTime(100)
      throttled('d')
      expect(fn).toBeCalledTimes(2)
      expect(fn).toBeCalledWith('d')
    })

    it('should handle multiple throttle periods', () => {
      const fn = jest.fn()
      const throttled = throttle(fn, 100)

      throttled('a')
      jest.advanceTimersByTime(100)
      throttled('b')
      jest.advanceTimersByTime(100)
      throttled('c')

      expect(fn).toBeCalledTimes(3)
      expect(fn).toHaveBeenNthCalledWith(1, 'a')
      expect(fn).toHaveBeenNthCalledWith(2, 'b')
      expect(fn).toHaveBeenNthCalledWith(3, 'c')
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })
})