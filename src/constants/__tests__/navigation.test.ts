import { mainNavigation, dashboardNavigation, settingsNavigation } from '../navigation'

describe('Navigation Constants', () => {
  describe('mainNavigation', () => {
    it('should have correct number of main navigation items', () => {
      expect(mainNavigation).toHaveLength(3)
    })

    it('should have home navigation item', () => {
      const home = mainNavigation[0]
      expect(home.name).toBe('홈')
      expect(home.href).toBe('/')
      expect(home.icon).toBe('Home')
    })

    it('should have dashboard navigation item', () => {
      const dashboard = mainNavigation[1]
      expect(dashboard.name).toBe('대시보드')
      expect(dashboard.href).toBe('/dashboard')
      expect(dashboard.icon).toBe('LayoutDashboard')
    })

    it('should have login navigation item', () => {
      const login = mainNavigation[2]
      expect(login.name).toBe('로그인')
      expect(login.href).toBe('/login')
      expect(login.icon).toBe('LogIn')
    })
  })

  describe('dashboardNavigation', () => {
    it('should have correct number of dashboard navigation items', () => {
      expect(dashboardNavigation).toHaveLength(5)
    })

    it('should have overview navigation item', () => {
      const overview = dashboardNavigation[0]
      expect(overview.name).toBe('개요')
      expect(overview.href).toBe('/dashboard')
      expect(overview.icon).toBe('Home')
      expect(overview.description).toBe('비용 현황 한눈에 보기')
    })

    it('should have ingredients navigation item', () => {
      const ingredients = dashboardNavigation[1]
      expect(ingredients.name).toBe('식자재 관리')
      expect(ingredients.href).toBe('/dashboard/ingredients')
      expect(ingredients.icon).toBe('Package')
      expect(ingredients.description).toBe('식자재 목록 및 가격 관리')
    })

    it('should have recipes navigation item', () => {
      const recipes = dashboardNavigation[2]
      expect(recipes.name).toBe('레시피 관리')
      expect(recipes.href).toBe('/dashboard/recipes')
      expect(recipes.icon).toBe('BookOpen')
      expect(recipes.description).toBe('레시피별 원가 계산')
    })

    it('should have suppliers navigation item', () => {
      const suppliers = dashboardNavigation[3]
      expect(suppliers.name).toBe('거래처 관리')
      expect(suppliers.href).toBe('/dashboard/suppliers')
      expect(suppliers.icon).toBe('Building2')
      expect(suppliers.description).toBe('거래처 정보 및 가격 비교')
    })

    it('should have reports navigation item', () => {
      const reports = dashboardNavigation[4]
      expect(reports.name).toBe('리포트')
      expect(reports.href).toBe('/dashboard/reports')
      expect(reports.icon).toBe('FileText')
      expect(reports.description).toBe('비용 분석 리포트')
    })
  })

  describe('settingsNavigation', () => {
    it('should have correct number of settings navigation items', () => {
      expect(settingsNavigation).toHaveLength(4)
    })

    it('should have profile settings item', () => {
      const profile = settingsNavigation[0]
      expect(profile.name).toBe('프로필')
      expect(profile.href).toBe('/dashboard/settings/profile')
      expect(profile.icon).toBe('User')
      expect(profile.description).toBe('사용자 정보 관리')
    })

    it('should have business settings item', () => {
      const business = settingsNavigation[1]
      expect(business.name).toBe('사업장 정보')
      expect(business.href).toBe('/dashboard/settings/business')
      expect(business.icon).toBe('Building')
      expect(business.description).toBe('사업장 정보 설정')
    })

    it('should have alerts settings item', () => {
      const alerts = settingsNavigation[2]
      expect(alerts.name).toBe('알림 설정')
      expect(alerts.href).toBe('/dashboard/settings/alerts')
      expect(alerts.icon).toBe('Bell')
      expect(alerts.description).toBe('가격 변동 알림 설정')
    })

    it('should have collection settings item', () => {
      const collection = settingsNavigation[3]
      expect(collection.name).toBe('데이터 수집')
      expect(collection.href).toBe('/dashboard/settings/collection')
      expect(collection.icon).toBe('Download')
      expect(collection.description).toBe('자동 데이터 수집 설정')
    })
  })

  describe('navigation structure', () => {
    it('should have unique href for all navigation items', () => {
      const allItems = [
        ...mainNavigation,
        ...dashboardNavigation,
        ...settingsNavigation
      ]
      const hrefs = allItems.map(item => item.href)
      const uniqueHrefs = new Set(hrefs)
      expect(uniqueHrefs.size).toBe(hrefs.length)
    })

    it('should have icons for all navigation items', () => {
      const allItems = [
        ...mainNavigation,
        ...dashboardNavigation,
        ...settingsNavigation
      ]
      allItems.forEach(item => {
        expect(item.icon).toBeDefined()
        expect(item.icon).not.toBe('')
      })
    })

    it('should have descriptions for dashboard and settings navigation', () => {
      const itemsWithDescriptions = [
        ...dashboardNavigation,
        ...settingsNavigation
      ]
      itemsWithDescriptions.forEach(item => {
        expect(item.description).toBeDefined()
        expect(item.description).not.toBe('')
      })
    })
  })
})