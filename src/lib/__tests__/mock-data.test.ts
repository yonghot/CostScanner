import { 
  mockIngredients, 
  mockSuppliers, 
  mockRecipes, 
  mockPriceRecords,
  mockRecipeIngredients,
  mockPriceAlerts,
  mockCostReports,
  mockUsers
} from '../mock-data'

describe('Mock Data', () => {
  describe('mockIngredients', () => {
    it('should have correct structure', () => {
      expect(mockIngredients).toBeDefined()
      expect(Array.isArray(mockIngredients)).toBe(true)
      expect(mockIngredients.length).toBeGreaterThan(0)
      
      const firstIngredient = mockIngredients[0]
      expect(firstIngredient).toHaveProperty('id')
      expect(firstIngredient).toHaveProperty('name')
      expect(firstIngredient).toHaveProperty('category')
      expect(firstIngredient).toHaveProperty('unit')
      expect(firstIngredient).toHaveProperty('is_active')
    })

    it('should have valid categories', () => {
      const validCategories = ['vegetables', 'meat', 'seafood', 'dairy', 'grains', 'condiments', 'fruits', 'others']
      mockIngredients.forEach(ingredient => {
        expect(validCategories).toContain(ingredient.category)
      })
    })

    it('should have unique IDs', () => {
      const ids = mockIngredients.map(i => i.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('mockSuppliers', () => {
    it('should have correct structure', () => {
      expect(mockSuppliers).toBeDefined()
      expect(Array.isArray(mockSuppliers)).toBe(true)
      expect(mockSuppliers.length).toBeGreaterThan(0)
      
      const firstSupplier = mockSuppliers[0]
      expect(firstSupplier).toHaveProperty('id')
      expect(firstSupplier).toHaveProperty('name')
      expect(firstSupplier).toHaveProperty('contact_person')
      expect(firstSupplier).toHaveProperty('phone')
      expect(firstSupplier).toHaveProperty('is_active')
    })

    it('should have valid phone numbers', () => {
      mockSuppliers.forEach(supplier => {
        if (supplier.phone) {
          expect(supplier.phone).toMatch(/^[0-9-]+$/)
        }
      })
    })
  })

  describe('mockRecipes', () => {
    it('should have correct structure', () => {
      expect(mockRecipes).toBeDefined()
      expect(Array.isArray(mockRecipes)).toBe(true)
      expect(mockRecipes.length).toBeGreaterThan(0)
      
      const firstRecipe = mockRecipes[0]
      expect(firstRecipe).toHaveProperty('id')
      expect(firstRecipe).toHaveProperty('name')
      expect(firstRecipe).toHaveProperty('category')
      expect(firstRecipe).toHaveProperty('serving_size')
      expect(firstRecipe).toHaveProperty('is_active')
    })

    it('should have positive serving sizes', () => {
      mockRecipes.forEach(recipe => {
        expect(recipe.serving_size).toBeGreaterThan(0)
      })
    })
  })

  describe('mockPriceRecords', () => {
    it('should have correct structure', () => {
      expect(mockPriceRecords).toBeDefined()
      expect(Array.isArray(mockPriceRecords)).toBe(true)
      expect(mockPriceRecords.length).toBeGreaterThan(0)
      
      const firstRecord = mockPriceRecords[0]
      expect(firstRecord).toHaveProperty('id')
      expect(firstRecord).toHaveProperty('ingredient_id')
      expect(firstRecord).toHaveProperty('supplier_id')
      expect(firstRecord).toHaveProperty('price')
      expect(firstRecord).toHaveProperty('quantity')
      expect(firstRecord).toHaveProperty('unit')
      expect(firstRecord).toHaveProperty('date')
    })

    it('should have positive prices', () => {
      mockPriceRecords.forEach(record => {
        expect(record.price).toBeGreaterThan(0)
        expect(record.quantity).toBeGreaterThan(0)
      })
    })

    it('should reference valid ingredients and suppliers', () => {
      const ingredientIds = mockIngredients.map(i => i.id)
      const supplierIds = mockSuppliers.map(s => s.id)
      
      mockPriceRecords.forEach(record => {
        expect(ingredientIds).toContain(record.ingredient_id)
        expect(supplierIds).toContain(record.supplier_id)
      })
    })
  })

  describe('mockRecipeIngredients', () => {
    it('should have correct structure', () => {
      expect(mockRecipeIngredients).toBeDefined()
      expect(Array.isArray(mockRecipeIngredients)).toBe(true)
      expect(mockRecipeIngredients.length).toBeGreaterThan(0)
      
      const firstItem = mockRecipeIngredients[0]
      expect(firstItem).toHaveProperty('id')
      expect(firstItem).toHaveProperty('recipe_id')
      expect(firstItem).toHaveProperty('ingredient_id')
      expect(firstItem).toHaveProperty('quantity')
      expect(firstItem).toHaveProperty('unit')
    })

    it('should have positive quantities', () => {
      mockRecipeIngredients.forEach(item => {
        expect(item.quantity).toBeGreaterThan(0)
      })
    })

    it('should reference valid recipes and ingredients', () => {
      const recipeIds = mockRecipes.map(r => r.id)
      const ingredientIds = mockIngredients.map(i => i.id)
      
      mockRecipeIngredients.forEach(item => {
        expect(recipeIds).toContain(item.recipe_id)
        expect(ingredientIds).toContain(item.ingredient_id)
      })
    })
  })

  describe('mockPriceAlerts', () => {
    it('should have correct structure', () => {
      expect(mockPriceAlerts).toBeDefined()
      expect(Array.isArray(mockPriceAlerts)).toBe(true)
      expect(mockPriceAlerts.length).toBeGreaterThan(0)
      
      const firstAlert = mockPriceAlerts[0]
      expect(firstAlert).toHaveProperty('id')
      expect(firstAlert).toHaveProperty('user_id')
      expect(firstAlert).toHaveProperty('ingredient_id')
      expect(firstAlert).toHaveProperty('threshold_price')
      expect(firstAlert).toHaveProperty('alert_type')
      expect(firstAlert).toHaveProperty('is_active')
    })

    it('should have valid alert types', () => {
      const validTypes = ['above', 'below']
      mockPriceAlerts.forEach(alert => {
        expect(validTypes).toContain(alert.alert_type)
      })
    })

    it('should have positive threshold prices', () => {
      mockPriceAlerts.forEach(alert => {
        expect(alert.threshold_price).toBeGreaterThan(0)
      })
    })
  })

  describe('mockCostReports', () => {
    it('should have correct structure', () => {
      expect(mockCostReports).toBeDefined()
      expect(Array.isArray(mockCostReports)).toBe(true)
      expect(mockCostReports.length).toBeGreaterThan(0)
      
      const firstReport = mockCostReports[0]
      expect(firstReport).toHaveProperty('id')
      expect(firstReport).toHaveProperty('user_id')
      expect(firstReport).toHaveProperty('period_start')
      expect(firstReport).toHaveProperty('period_end')
      expect(firstReport).toHaveProperty('total_cost')
      expect(firstReport).toHaveProperty('report_data')
    })

    it('should have valid date ranges', () => {
      mockCostReports.forEach(report => {
        const start = new Date(report.period_start)
        const end = new Date(report.period_end)
        expect(start).toBeInstanceOf(Date)
        expect(end).toBeInstanceOf(Date)
        expect(start.getTime()).toBeLessThanOrEqual(end.getTime())
      })
    })

    it('should have non-negative total costs', () => {
      mockCostReports.forEach(report => {
        expect(report.total_cost).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('mockUsers', () => {
    it('should have correct structure', () => {
      expect(mockUsers).toBeDefined()
      expect(Array.isArray(mockUsers)).toBe(true)
      expect(mockUsers.length).toBeGreaterThan(0)
      
      const firstUser = mockUsers[0]
      expect(firstUser).toHaveProperty('id')
      expect(firstUser).toHaveProperty('email')
      expect(firstUser).toHaveProperty('name')
      expect(firstUser).toHaveProperty('business_name')
    })

    it('should have valid email formats', () => {
      mockUsers.forEach(user => {
        expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      })
    })

    it('should have unique emails', () => {
      const emails = mockUsers.map(u => u.email)
      const uniqueEmails = new Set(emails)
      expect(uniqueEmails.size).toBe(emails.length)
    })
  })

  describe('Data Relationships', () => {
    it('should maintain referential integrity', () => {
      // Check that all price records reference valid ingredients and suppliers
      const ingredientIds = new Set(mockIngredients.map(i => i.id))
      const supplierIds = new Set(mockSuppliers.map(s => s.id))
      const recipeIds = new Set(mockRecipes.map(r => r.id))
      const userIds = new Set(mockUsers.map(u => u.id))
      
      // Price records should reference valid ingredients and suppliers
      mockPriceRecords.forEach(record => {
        expect(ingredientIds.has(record.ingredient_id)).toBe(true)
        expect(supplierIds.has(record.supplier_id)).toBe(true)
      })
      
      // Recipe ingredients should reference valid recipes and ingredients
      mockRecipeIngredients.forEach(item => {
        expect(recipeIds.has(item.recipe_id)).toBe(true)
        expect(ingredientIds.has(item.ingredient_id)).toBe(true)
      })
      
      // Price alerts should reference valid ingredients
      mockPriceAlerts.forEach(alert => {
        expect(ingredientIds.has(alert.ingredient_id)).toBe(true)
        expect(userIds.has(alert.user_id)).toBe(true)
      })
      
      // Cost reports should reference valid users
      mockCostReports.forEach(report => {
        expect(userIds.has(report.user_id)).toBe(true)
      })
    })
  })
})