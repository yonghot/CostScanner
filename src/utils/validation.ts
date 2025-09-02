/**
 * 이메일 형식 검증
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 비밀번호 강도 검증 (최소 8자, 대소문자, 숫자, 특수문자 포함)
 */
export const isValidPassword = (password: string): boolean => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
}

/**
 * 한국 전화번호 형식 검증
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/
  return phoneRegex.test(phone.replace(/\s+/g, ''))
}

/**
 * 숫자 입력 검증
 */
export const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && Number(value) >= 0
}

/**
 * 가격 입력 검증
 */
export const isValidPrice = (price: string | number): boolean => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return !isNaN(numPrice) && numPrice > 0
}

/**
 * 필수 필드 검증
 */
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0
}

/**
 * 최소 길이 검증
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength
}

/**
 * 최대 길이 검증
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength
}

/**
 * URL 형식 검증
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 공급업체명 검증
 */
export const isValidSupplierName = (name: string): boolean => {
  return isRequired(name) && hasMinLength(name, 2) && hasMaxLength(name, 100)
}

/**
 * 식자재명 검증
 */
export const isValidIngredientName = (name: string): boolean => {
  return isRequired(name) && hasMinLength(name, 1) && hasMaxLength(name, 50)
}

/**
 * 레시피명 검증
 */
export const isValidRecipeName = (name: string): boolean => {
  return isRequired(name) && hasMinLength(name, 2) && hasMaxLength(name, 100)
}

/**
 * 단위 검증
 */
export const isValidUnit = (unit: string): boolean => {
  const validUnits = ['개', 'kg', 'g', 'L', 'ml', '박스', '포', '봉', '팩', '단']
  return validUnits.includes(unit) || (isRequired(unit) && hasMaxLength(unit, 10))
}

/**
 * 크론 표현식 기본 검증
 */
export const isValidCronExpression = (cronExpression: string): boolean => {
  const validPatterns = [
    '*/5 * * * *',    // 5분마다
    '*/10 * * * *',   // 10분마다  
    '*/30 * * * *',   // 30분마다
    '0 * * * *',      // 매시간
    '0 */2 * * *',    // 2시간마다
    '0 */6 * * *',    // 6시간마다
    '0 0 * * *',      // 매일
  ]
  
  return validPatterns.includes(cronExpression)
}