// Import all types from unified type system
import {
  IngredientUI as Ingredient,
  SupplierUI as Supplier,
  RecipeUI as Recipe,
  PricePoint,
  UserSettings,
  DashboardStats,
  PriceRecord,
  RecipeIngredient,
  Notification,
  User,
  PriceAlert,
  CostReport
} from '@/types';

// 모의 가격 히스토리 생성 함수
function generatePriceHistory(basePrice: number, days: number = 30): PricePoint[] {
  const history: PricePoint[] = [];
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // 5% 내외의 랜덤한 가격 변동
    const variation = (Math.random() - 0.5) * 0.1;
    currentPrice = Math.max(basePrice * (1 + variation), basePrice * 0.7);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice),
      supplier: i % 3 === 0 ? '신선마트' : i % 3 === 1 ? '도매시장' : '농협'
    });
  }
  
  return history;
}

// 식자재 모의 데이터
export const mockIngredients: Ingredient[] = [
  {
    id: 'ing_001',
    name: '한우등심',
    category: '육류',
    unit: 'kg',
    currentPrice: 45000,
    priceHistory: generatePriceHistory(45000),
    suppliers: ['한우마을', '프리미엄정육점', '축산물유통센터'],
    lastUpdated: '2024-08-27',
    stockLevel: 15,
    minStockLevel: 5,
    status: 'available',
    is_active: true,
    description: '1등급 한우등심, 마블링 우수'
  },
  {
    id: 'ing_002',
    name: '대패삼겹살',
    category: '육류',
    unit: 'kg',
    currentPrice: 12000,
    priceHistory: generatePriceHistory(12000),
    suppliers: ['신선마트', '도매시장'],
    lastUpdated: '2024-08-27',
    stockLevel: 8,
    minStockLevel: 10,
    status: 'low_stock',
    is_active: true,
    description: '국산 돼지고기, 얇게 슬라이스'
  },
  {
    id: 'ing_003',
    name: '양파',
    category: '채소',
    unit: 'kg',
    currentPrice: 3500,
    priceHistory: generatePriceHistory(3500),
    suppliers: ['농협', '도매시장', '신선마트'],
    lastUpdated: '2024-08-27',
    stockLevel: 50,
    minStockLevel: 20,
    status: 'available',
    is_active: true,
    description: '국산 양파, 중간 크기'
  },
  {
    id: 'ing_004',
    name: '대파',
    category: '채소',
    unit: 'kg',
    currentPrice: 4200,
    priceHistory: generatePriceHistory(4200),
    suppliers: ['농협', '신선마트'],
    lastUpdated: '2024-08-27',
    stockLevel: 25,
    minStockLevel: 15,
    status: 'available',
    is_active: true,
    description: '국산 대파, 신선도 우수'
  },
  {
    id: 'ing_005',
    name: '마늘',
    category: '향신료',
    unit: 'kg',
    currentPrice: 8500,
    priceHistory: generatePriceHistory(8500),
    suppliers: ['농협', '도매시장'],
    lastUpdated: '2024-08-27',
    stockLevel: 12,
    minStockLevel: 8,
    status: 'available',
    is_active: true,
    description: '국산 마늘, 6쪽 마늘'
  },
  {
    id: 'ing_006',
    name: '참기름',
    category: '조미료',
    unit: 'L',
    currentPrice: 28000,
    priceHistory: generatePriceHistory(28000),
    suppliers: ['한국조미료', '신선마트'],
    lastUpdated: '2024-08-27',
    stockLevel: 3,
    minStockLevel: 5,
    status: 'low_stock',
    is_active: true,
    description: '100% 참깨로 만든 프리미엄 참기름'
  },
  {
    id: 'ing_007',
    name: '쌀',
    category: '곡류',
    unit: 'kg',
    currentPrice: 4500,
    priceHistory: generatePriceHistory(4500),
    suppliers: ['농협', '미곡상회'],
    lastUpdated: '2024-08-27',
    stockLevel: 100,
    minStockLevel: 50,
    status: 'available',
    is_active: true,
    description: '신동진쌀, 1등급'
  },
  {
    id: 'ing_008',
    name: '계란',
    category: '난류',
    unit: '개',
    currentPrice: 350,
    priceHistory: generatePriceHistory(350),
    suppliers: ['축산물유통센터', '신선마트'],
    lastUpdated: '2024-08-27',
    stockLevel: 200,
    minStockLevel: 100,
    status: 'available',
    is_active: true,
    description: '특란, 무항생제'
  }
];

// 공급업체 모의 데이터
export const mockSuppliers: Supplier[] = [
  {
    id: 'sup_001',
    name: '신선마트',
    contact: {
      phone: '02-1234-5678',
      email: 'order@sinseon.co.kr',
      address: '서울시 강남구 테헤란로 123',
      manager: '김신선'
    },
    rating: 4.5,
    deliveryTime: '당일배송',
    minOrder: 50000,
    paymentTerms: '월말결제',
    specialties: ['채소', '과일', '육류'],
    is_active: true,
    status: 'active',
    totalOrders: 156,
    lastOrderDate: '2024-08-25',
    notes: '품질 우수, 배송 빠름'
  },
  {
    id: 'sup_002',
    name: '농협',
    contact: {
      phone: '02-2345-6789',
      email: 'business@nonghyup.co.kr',
      address: '서울시 서초구 농협중앙회로 456',
      manager: '박농협'
    },
    rating: 4.8,
    deliveryTime: '1-2일',
    minOrder: 100000,
    paymentTerms: '현금결제시 2% 할인',
    specialties: ['곡류', '채소', '과일'],
    is_active: true,
    status: 'active',
    totalOrders: 89,
    lastOrderDate: '2024-08-26',
    notes: '국산 농산물 전문, 신뢰도 높음'
  },
  {
    id: 'sup_003',
    name: '도매시장',
    contact: {
      phone: '02-3456-7890',
      email: 'info@wholesale.co.kr',
      address: '서울시 송파구 가락시장로 789',
      manager: '이도매'
    },
    rating: 4.2,
    deliveryTime: '2-3일',
    minOrder: 30000,
    paymentTerms: '15일 후 결제',
    specialties: ['육류', '해산물', '채소'],
    is_active: true,
    status: 'active',
    totalOrders: 234,
    lastOrderDate: '2024-08-24',
    notes: '가격 경쟁력 우수'
  },
  {
    id: 'sup_004',
    name: '한우마을',
    contact: {
      phone: '02-4567-8901',
      email: 'order@hanwoo.co.kr',
      address: '경기도 안성시 한우로 123',
      manager: '최한우'
    },
    rating: 4.9,
    deliveryTime: '1-2일',
    minOrder: 200000,
    paymentTerms: '월말결제',
    specialties: ['한우', '국산소고기'],
    is_active: true,
    status: 'active',
    totalOrders: 67,
    lastOrderDate: '2024-08-23',
    notes: '프리미엄 한우 전문'
  }
];

// 레시피 모의 데이터
export const mockRecipes: Recipe[] = [
  {
    id: 'rec_001',
    name: '불고기',
    category: '메인요리',
    servings: 4,
    ingredients: [
      { ingredientId: 'ing_001', name: '한우등심', quantity: 0.5, unit: 'kg', cost: 22500 },
      { ingredientId: 'ing_003', name: '양파', quantity: 0.2, unit: 'kg', cost: 700 },
      { ingredientId: 'ing_004', name: '대파', quantity: 0.1, unit: 'kg', cost: 420 },
      { ingredientId: 'ing_005', name: '마늘', quantity: 0.05, unit: 'kg', cost: 425 },
      { ingredientId: 'ing_006', name: '참기름', quantity: 0.02, unit: 'L', cost: 560 }
    ],
    totalCost: 24605,
    costPerServing: 6151,
    sellingPrice: 15000,
    profitAmount: 8849,
    profitMargin: 59,
    prepTime: 30,
    cookTime: 15,
    difficulty: 'medium',
    tags: ['한식', '인기메뉴', '육류'],
    lastUpdated: '2024-08-27'
  },
  {
    id: 'rec_002',
    name: '김치볶음밥',
    category: '밥요리',
    servings: 2,
    ingredients: [
      { ingredientId: 'ing_007', name: '쌀', quantity: 0.3, unit: 'kg', cost: 1350 },
      { ingredientId: 'ing_002', name: '대패삼겹살', quantity: 0.15, unit: 'kg', cost: 1800 },
      { ingredientId: 'ing_008', name: '계란', quantity: 2, unit: '개', cost: 700 },
      { ingredientId: 'ing_006', name: '참기름', quantity: 0.01, unit: 'L', cost: 280 }
    ],
    totalCost: 4130,
    costPerServing: 2065,
    sellingPrice: 8000,
    profitAmount: 3870,
    profitMargin: 48,
    prepTime: 15,
    cookTime: 10,
    difficulty: 'easy',
    tags: ['한식', '간편식', '볶음밥'],
    lastUpdated: '2024-08-27'
  },
  {
    id: 'rec_003',
    name: '된장찌개',
    category: '국/찌개',
    servings: 4,
    ingredients: [
      { ingredientId: 'ing_003', name: '양파', quantity: 0.1, unit: 'kg', cost: 350 },
      { ingredientId: 'ing_004', name: '대파', quantity: 0.05, unit: 'kg', cost: 210 },
      { ingredientId: 'ing_005', name: '마늘', quantity: 0.02, unit: 'kg', cost: 170 }
    ],
    totalCost: 730,
    costPerServing: 183,
    sellingPrice: 3000,
    profitAmount: 2270,
    profitMargin: 76,
    prepTime: 10,
    cookTime: 20,
    difficulty: 'easy',
    tags: ['한식', '국물요리', '가정식'],
    lastUpdated: '2024-08-27'
  }
];

// 리포트 모의 데이터
export const mockReports: CostReport[] = [
  {
    id: 'rep_001',
    title: '2024년 8월 원가 분석',
    type: 'monthly',
    period: {
      start: '2024-08-01',
      end: '2024-08-31'
    },
    data: {
      totalCost: 2450000,
      costChange: -5.2,
      topExpensiveIngredients: [
        { name: '한우등심', cost: 450000, percentage: 18.4 },
        { name: '참기름', cost: 280000, percentage: 11.4 },
        { name: '마늘', cost: 170000, percentage: 6.9 },
        { name: '대파', cost: 126000, percentage: 5.1 }
      ],
      costByCategory: [
        { category: '육류', amount: 850000, percentage: 34.7 },
        { category: '채소', amount: 490000, percentage: 20.0 },
        { category: '조미료', amount: 420000, percentage: 17.1 },
        { category: '곡류', amount: 315000, percentage: 12.9 },
        { category: '기타', amount: 375000, percentage: 15.3 }
      ],
      savingsOpportunities: [
        { description: '양파 구매처 변경으로', potentialSavings: 35000 },
        { description: '대량구매 할인 활용으로', potentialSavings: 68000 },
        { description: '계절 식자재 활용으로', potentialSavings: 42000 }
      ]
    },
    createdAt: '2024-08-27'
  }
];

// 가격 알림 모의 데이터
export const mockPriceAlerts: PriceAlert[] = [
  {
    id: 'alert_001',
    ingredientId: 'ing_001',
    ingredientName: '한우등심',
    alertType: 'price_increase',
    threshold: 42000,
    currentValue: 45000,
    isActive: true,
    lastTriggered: '2024-08-25',
    notifications: {
      email: true,
      browser: true,
      sms: false
    }
  },
  {
    id: 'alert_002',
    ingredientId: 'ing_006',
    ingredientName: '참기름',
    alertType: 'stock_low',
    threshold: 5,
    currentValue: 3,
    isActive: true,
    lastTriggered: '2024-08-26',
    notifications: {
      email: true,
      browser: false,
      sms: true
    }
  }
];

// 사용자 설정 모의 데이터
export const mockUserSettings: UserSettings = {
  id: 'user_001',
  profile: {
    name: '김요리',
    email: 'chef.kim@restaurant.co.kr',
    businessName: '맛있는 식당',
    businessType: '한식당',
    phone: '010-1234-5678'
  },
  preferences: {
    currency: 'KRW',
    language: 'ko',
    timezone: 'Asia/Seoul',
    dateFormat: 'YYYY-MM-DD',
    notifications: {
      email: true,
      browser: true,
      sms: false
    }
  },
  subscription: {
    plan: 'pro',
    is_active: true,
    status: 'active',
    expiresAt: '2024-12-31',
    features: [
      '무제한 식자재 등록',
      '실시간 가격 알림',
      'OCR 거래명세서 처리',
      '상세 분석 리포트',
      '다중 공급업체 관리'
    ]
  }
};

// 대시보드 통계 모의 데이터
export const mockDashboardStats: DashboardStats = {
  totalIngredients: mockIngredients.length,
  totalRecipes: mockRecipes.length,
  totalSuppliers: mockSuppliers.length,
  monthlySpending: 2450000,
  avgCostPerRecipe: 9822,
  costSavingsThisMonth: 145000,
  priceAlertsActive: mockPriceAlerts.filter(alert => alert.isActive).length,
  topExpensiveIngredient: {
    name: '한우등심',
    price: 45000,
    change: 7.1
  }
};

// 카테고리 목록
export const ingredientCategories = [
  '육류', '채소', '과일', '곡류', '조미료', '향신료', '난류', '유제품', '해산물', '기타'
];

export const recipeCategories = [
  '메인요리', '밑반찬', '국/찌개', '밥요리', '면요리', '디저트', '음료', '기타'
];

export const supplierSpecialties = [
  '육류', '채소', '과일', '곡류', '해산물', '유제품', '조미료', '냉동식품', '기타'
];

// Additional mock data for DemoContext compatibility

// Price Records mock data
export const mockPriceRecords: PriceRecord[] = [
  {
    id: 'price_001',
    ingredient_id: 'ing_001',
    supplier_id: 'sup_001', 
    price: 45000,
    unit: 'kg',
    source: 'manual',
    quality_grade: '1등급',
    notes: '한우등심 1등급',
    created_at: '2024-08-27T10:00:00Z',
    updated_at: '2024-08-27T10:00:00Z'
  },
  {
    id: 'price_002',
    ingredient_id: 'ing_002',
    supplier_id: 'sup_001',
    price: 12000,
    unit: 'kg', 
    source: 'manual',
    notes: '국산 돼지고기',
    created_at: '2024-08-27T09:30:00Z',
    updated_at: '2024-08-27T09:30:00Z'
  },
  {
    id: 'price_003',
    ingredient_id: 'ing_003',
    supplier_id: 'sup_002',
    price: 3500,
    unit: 'kg',
    source: 'scraping',
    notes: '국산 양파',
    created_at: '2024-08-27T08:00:00Z',
    updated_at: '2024-08-27T08:00:00Z'
  },
  {
    id: 'price_004',
    ingredient_id: 'ing_004', 
    supplier_id: 'sup_002',
    price: 4200,
    unit: 'kg',
    source: 'manual',
    notes: '국산 대파',
    created_at: '2024-08-27T07:30:00Z',
    updated_at: '2024-08-27T07:30:00Z'
  },
  {
    id: 'price_005',
    ingredient_id: 'ing_005',
    supplier_id: 'sup_003',
    price: 8500,
    unit: 'kg',
    source: 'manual',
    notes: '6쪽 마늘',
    created_at: '2024-08-26T16:00:00Z',
    updated_at: '2024-08-26T16:00:00Z'
  }
];

// Recipe Ingredients mock data
export const mockRecipeIngredients: RecipeIngredient[] = [
  {
    id: 'recipe_ing_001',
    recipe_id: 'rec_001',
    ingredient_id: 'ing_001',
    quantity: 0.5,
    unit: 'kg',
    notes: '불고기용 등심',
    created_at: '2024-08-27T10:00:00Z',
    updated_at: '2024-08-27T10:00:00Z'
  },
  {
    id: 'recipe_ing_002',
    recipe_id: 'rec_001',
    ingredient_id: 'ing_003',
    quantity: 0.2,
    unit: 'kg',
    notes: '불고기 양념용',
    created_at: '2024-08-27T10:00:00Z',
    updated_at: '2024-08-27T10:00:00Z'
  },
  {
    id: 'recipe_ing_003',
    recipe_id: 'rec_002',
    ingredient_id: 'ing_007',
    quantity: 0.3,
    unit: 'kg',
    notes: '김치볶음밥용 밥',
    created_at: '2024-08-27T10:00:00Z',
    updated_at: '2024-08-27T10:00:00Z'
  },
  {
    id: 'recipe_ing_004',
    recipe_id: 'rec_002',
    ingredient_id: 'ing_002',
    quantity: 0.15,
    unit: 'kg',
    notes: '김치볶음밥 고기',
    created_at: '2024-08-27T10:00:00Z',
    updated_at: '2024-08-27T10:00:00Z'
  }
];

// Notifications mock data
export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    user_id: 'demo-user-1',
    type: 'price_alert',
    title: '한우등심 가격 상승 알림',
    message: '한우등심 가격이 7% 상승했습니다 (₩42,000 → ₩45,000)',
    is_read: false,
    data: { ingredient_id: 'ing_001', old_price: 42000, new_price: 45000 },
    created_at: '2024-08-27T09:00:00Z',
    updated_at: '2024-08-27T09:00:00Z'
  },
  {
    id: 'notif_002',
    user_id: 'demo-user-1',
    type: 'price_alert',
    title: '대파 가격 하락 알림',
    message: '대파 가격이 8.5% 하락했습니다 (₩4,590 → ₩4,200)',
    is_read: true,
    data: { ingredient_id: 'ing_004', old_price: 4590, new_price: 4200 },
    created_at: '2024-08-26T14:00:00Z',
    updated_at: '2024-08-26T14:30:00Z'
  },
  {
    id: 'notif_003',
    user_id: 'demo-user-1',
    type: 'system',
    title: '월간 리포트 생성 완료',
    message: '8월 식자재 원가 분석 리포트가 생성되었습니다.',
    is_read: false,
    data: { report_id: 'rep_001' },
    created_at: '2024-08-25T10:00:00Z',
    updated_at: '2024-08-25T10:00:00Z'
  }
];