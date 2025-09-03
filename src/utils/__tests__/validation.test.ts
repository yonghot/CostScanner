import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidBusinessNumber,
  isValidUrl,
  isRequired,
  hasMinLength,
  hasMaxLength,
  isInRange,
  isPositiveNumber,
  isValidDate,
  isValidCurrency,
  sanitizeInput,
  validateRecipeIngredient,
  validatePriceData,
} from '../validation'

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@company.co.kr')).toBe(true)
      expect(isValidEmail('admin+test@domain.org')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(isValidEmail('notanemail')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('user @example.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('isValidPassword', () => {
    it('should validate strong passwords', () => {
      expect(isValidPassword('Password123!')).toBe(true)
      expect(isValidPassword('StrongP@ss99')).toBe(true)
      expect(isValidPassword('MyP@ssw0rd!')).toBe(true)
    })

    it('should reject weak passwords', () => {
      expect(isValidPassword('password')).toBe(false) // 대문자, 숫자, 특수문자 없음
      expect(isValidPassword('Password')).toBe(false) // 숫자, 특수문자 없음
      expect(isValidPassword('Pass123')).toBe(false) // 특수문자 없음, 길이 부족
      expect(isValidPassword('Pass@')).toBe(false) // 길이 부족
      expect(isValidPassword('')).toBe(false)
    })
  })

  describe('isValidPhoneNumber', () => {
    it('should validate Korean phone numbers', () => {
      expect(isValidPhoneNumber('010-1234-5678')).toBe(true)
      expect(isValidPhoneNumber('02-123-4567')).toBe(true)
      expect(isValidPhoneNumber('031-987-6543')).toBe(true)
      expect(isValidPhoneNumber('01012345678')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('123-456')).toBe(false)
      expect(isValidPhoneNumber('010-12-345')).toBe(false)
      expect(isValidPhoneNumber('phone-number')).toBe(false)
      expect(isValidPhoneNumber('')).toBe(false)
    })
  })

  describe('isValidBusinessNumber', () => {
    it('should validate Korean business numbers', () => {
      expect(isValidBusinessNumber('123-45-67890')).toBe(true)
      expect(isValidBusinessNumber('1234567890')).toBe(true)
    })

    it('should reject invalid business numbers', () => {
      expect(isValidBusinessNumber('123-456')).toBe(false)
      expect(isValidBusinessNumber('abc-de-fghij')).toBe(false)
      expect(isValidBusinessNumber('')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://www.example.co.kr')).toBe(true)
      expect(isValidUrl('https://sub.domain.com/path?query=1')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false)
      expect(isValidUrl('example.com')).toBe(false) // No protocol
      expect(isValidUrl('ftp://example.com')).toBe(false) // Not http/https
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('isRequired', () => {
    it('should validate required values', () => {
      expect(isRequired('value')).toBe(true)
      expect(isRequired(123)).toBe(true)
      expect(isRequired(['item'])).toBe(true)
      expect(isRequired({ key: 'value' })).toBe(true)
    })

    it('should reject empty values', () => {
      expect(isRequired('')).toBe(false)
      expect(isRequired('   ')).toBe(false)
      expect(isRequired(null)).toBe(false)
      expect(isRequired(undefined)).toBe(false)
      expect(isRequired([])).toBe(false)
      expect(isRequired({})).toBe(false)
    })
  })

  describe('hasMinLength', () => {
    it('should validate minimum length', () => {
      expect(hasMinLength('hello', 3)).toBe(true)
      expect(hasMinLength('hello', 5)).toBe(true)
      expect(hasMinLength([1, 2, 3], 2)).toBe(true)
    })

    it('should reject values below minimum length', () => {
      expect(hasMinLength('hi', 3)).toBe(false)
      expect(hasMinLength('', 1)).toBe(false)
      expect(hasMinLength([], 1)).toBe(false)
    })
  })

  describe('hasMaxLength', () => {
    it('should validate maximum length', () => {
      expect(hasMaxLength('hello', 10)).toBe(true)
      expect(hasMaxLength('hello', 5)).toBe(true)
      expect(hasMaxLength([1, 2], 3)).toBe(true)
    })

    it('should reject values above maximum length', () => {
      expect(hasMaxLength('hello world', 5)).toBe(false)
      expect(hasMaxLength([1, 2, 3, 4], 3)).toBe(false)
    })
  })

  describe('isInRange', () => {
    it('should validate values within range', () => {
      expect(isInRange(5, 1, 10)).toBe(true)
      expect(isInRange(1, 1, 10)).toBe(true)
      expect(isInRange(10, 1, 10)).toBe(true)
    })

    it('should reject values outside range', () => {
      expect(isInRange(0, 1, 10)).toBe(false)
      expect(isInRange(11, 1, 10)).toBe(false)
      expect(isInRange(-5, 0, 10)).toBe(false)
    })
  })

  describe('isPositiveNumber', () => {
    it('should validate positive numbers', () => {
      expect(isPositiveNumber(1)).toBe(true)
      expect(isPositiveNumber(0.5)).toBe(true)
      expect(isPositiveNumber(100)).toBe(true)
    })

    it('should reject non-positive numbers', () => {
      expect(isPositiveNumber(0)).toBe(false)
      expect(isPositiveNumber(-1)).toBe(false)
      expect(isPositiveNumber(NaN)).toBe(false)
    })
  })

  describe('isValidDate', () => {
    it('should validate valid dates', () => {
      expect(isValidDate('2024-01-15')).toBe(true)
      expect(isValidDate('2024-12-31')).toBe(true)
      expect(isValidDate(new Date())).toBe(true)
    })

    it('should reject invalid dates', () => {
      expect(isValidDate('2024-13-01')).toBe(false)
      expect(isValidDate('2024-01-32')).toBe(false)
      expect(isValidDate('not a date')).toBe(false)
      expect(isValidDate('')).toBe(false)
    })
  })

  describe('isValidCurrency', () => {
    it('should validate currency values', () => {
      expect(isValidCurrency(1000)).toBe(true)
      expect(isValidCurrency('1000')).toBe(true)
      expect(isValidCurrency('1,000')).toBe(true)
      expect(isValidCurrency('1000.50')).toBe(true)
    })

    it('should reject invalid currency values', () => {
      expect(isValidCurrency('not a number')).toBe(false)
      expect(isValidCurrency(-100)).toBe(false)
      expect(isValidCurrency('')).toBe(false)
    })
  })

  describe('sanitizeInput', () => {
    it('should remove HTML and script tags', () => {
      expect(sanitizeInput('<script>alert("XSS")</script>')).toBe('')
      expect(sanitizeInput('Hello <b>World</b>')).toBe('Hello World')
      expect(sanitizeInput('<img src=x onerror=alert("XSS")>')).toBe('')
    })

    it('should preserve normal text', () => {
      expect(sanitizeInput('Normal text')).toBe('Normal text')
      expect(sanitizeInput('Text with & special < characters >')).toBe('Text with &amp; special &lt; characters &gt;')
    })
  })

  describe('validateRecipeIngredient', () => {
    it('should validate valid recipe ingredients', () => {
      const valid = {
        ingredientId: 'ing123',
        quantity: 100,
        unit: 'g'
      }
      expect(validateRecipeIngredient(valid)).toEqual({ valid: true, errors: [] })
    })

    it('should reject invalid recipe ingredients', () => {
      const invalid = {
        ingredientId: '',
        quantity: -10,
        unit: ''
      }
      const result = validateRecipeIngredient(invalid)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Ingredient ID is required')
      expect(result.errors).toContain('Quantity must be positive')
      expect(result.errors).toContain('Unit is required')
    })
  })

  describe('validatePriceData', () => {
    it('should validate valid price data', () => {
      const valid = {
        price: 10000,
        currency: 'KRW',
        date: '2024-01-15'
      }
      expect(validatePriceData(valid)).toEqual({ valid: true, errors: [] })
    })

    it('should reject invalid price data', () => {
      const invalid = {
        price: -1000,
        currency: '',
        date: 'invalid-date'
      }
      const result = validatePriceData(invalid)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Price must be positive')
      expect(result.errors).toContain('Currency is required')
      expect(result.errors).toContain('Invalid date format')
    })
  })
})