'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  IngredientUI as Ingredient, 
  RecipeUI as Recipe, 
  SupplierUI as Supplier,
  PriceAlert,
  User, 
  PriceRecord, 
  RecipeIngredient, 
  Notification 
} from '@/types'
import { 
  mockIngredients, 
  mockRecipes, 
  mockSuppliers,
  mockPriceAlerts,
  mockPriceRecords,
  mockRecipeIngredients,
  mockNotifications
} from '@/lib/mock-data'


interface DemoState {
  user: User
  ingredients: Ingredient[]
  recipes: Recipe[]
  suppliers: Supplier[]
  priceAlerts: PriceAlert[]
  notifications: Notification[]
  priceRecords: PriceRecord[]
  recipeIngredients: RecipeIngredient[]
}

interface DemoContextType {
  // State
  demoState: DemoState
  isDemoMode: boolean
  
  // User actions
  updateUser: (updates: Partial<User>) => void
  
  // Ingredient actions
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void
  deleteIngredient: (id: string) => void
  
  // Recipe actions
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void
  updateRecipe: (id: string, updates: Partial<Recipe>) => void
  deleteRecipe: (id: string) => void
  
  // Supplier actions
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void
  updateSupplier: (id: string, updates: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void
  
  // Utility functions
  resetDemo: () => void
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

// Mock user for demo
const mockUser: User = {
  id: 'demo-user-1',
  email: 'demo@costscanner.co.kr',
  name: '김데모',
  business_name: '데모 식당',
  business_type: '한식당',
  phone: '010-1234-5678',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

const getInitialState = (): DemoState => ({
  user: mockUser,
  ingredients: [...mockIngredients],
  recipes: [...mockRecipes],
  suppliers: [...mockSuppliers],
  priceAlerts: [...mockPriceAlerts],
  notifications: [...mockNotifications],
  priceRecords: [...mockPriceRecords],
  recipeIngredients: [...mockRecipeIngredients]
})

export function DemoProvider({ children }: { children: ReactNode }) {
  const [demoState, setDemoState] = useState<DemoState>(getInitialState())
  const [isHydrated, setIsHydrated] = useState(false)

  // Load demo state from localStorage on mount
  useEffect(() => {
    setIsHydrated(true)
    const savedState = localStorage.getItem('costscanner-demo-state')
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        setDemoState(parsedState)
      } catch (error) {
        // Failed to load demo state from localStorage - 로거로 대체 필요
      }
    }
  }, [])

  // Save demo state to localStorage on changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('costscanner-demo-state', JSON.stringify(demoState))
    }
  }, [demoState, isHydrated])

  // Prevent hydration mismatch by showing loading state
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">데모 환경을 준비중입니다...</p>
        </div>
      </div>
    )
  }

  // User actions
  const updateUser = (updates: Partial<User>) => {
    setDemoState(prev => ({
      ...prev,
      user: { ...prev.user, ...updates, updated_at: new Date().toISOString() }
    }))
  }

  // Ingredient actions
  const addIngredient = (ingredientData: Omit<Ingredient, 'id'>) => {
    const newIngredient: Ingredient = {
      ...ingredientData,
      id: `demo-ingredient-${Date.now()}`,
      updated_at: new Date().toISOString()
    }
    
    setDemoState(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient]
    }))
  }

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setDemoState(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ingredient =>
        ingredient.id === id 
          ? { ...ingredient, ...updates, updated_at: new Date().toISOString() }
          : ingredient
      )
    }))
  }

  const deleteIngredient = (id: string) => {
    setDemoState(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ingredient => ingredient.id !== id)
    }))
  }

  // Recipe actions
  const addRecipe = (recipeData: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: `demo-recipe-${Date.now()}`,
      updated_at: new Date().toISOString()
    }
    
    setDemoState(prev => ({
      ...prev,
      recipes: [...prev.recipes, newRecipe]
    }))
  }

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setDemoState(prev => ({
      ...prev,
      recipes: prev.recipes.map(recipe =>
        recipe.id === id 
          ? { ...recipe, ...updates, updated_at: new Date().toISOString() }
          : recipe
      )
    }))
  }

  const deleteRecipe = (id: string) => {
    setDemoState(prev => ({
      ...prev,
      recipes: prev.recipes.filter(recipe => recipe.id !== id)
    }))
  }

  // Supplier actions
  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: `demo-supplier-${Date.now()}`
    }
    
    setDemoState(prev => ({
      ...prev,
      suppliers: [...prev.suppliers, newSupplier]
    }))
  }

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setDemoState(prev => ({
      ...prev,
      suppliers: prev.suppliers.map(supplier =>
        supplier.id === id 
          ? { ...supplier, ...updates }
          : supplier
      )
    }))
  }

  const deleteSupplier = (id: string) => {
    setDemoState(prev => ({
      ...prev,
      suppliers: prev.suppliers.filter(supplier => supplier.id !== id)
    }))
  }

  // Reset demo to initial state
  const resetDemo = () => {
    setDemoState(getInitialState())
    localStorage.removeItem('costscanner-demo-state')
  }

  const contextValue: DemoContextType = {
    demoState,
    isDemoMode: true,
    updateUser,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    resetDemo
  }

  return (
    <DemoContext.Provider value={contextValue}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemoContext() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error('useDemoContext must be used within a DemoProvider')
  }
  return context
}