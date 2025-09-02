'use client';

import { useState } from 'react';
import { SupplierUI, FilterOptions, SortOptions } from '@/types';
import { 
  formatDate, 
  formatPhoneNumber, 
  formatPrice,
  getStatusColor, 
  getStatusLabel,
  generateStars
} from '@/lib/utils/formatting';

interface SuppliersTableProps {
  suppliers: SupplierUI[];
  onEdit: (supplier: SupplierUI) => void;
  onDelete: (id: string) => void;
  onContact: (supplier: SupplierUI) => void;
}

export default function SuppliersTable({ suppliers, onEdit, onDelete, onContact }: SuppliersTableProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'name', direction: 'asc' });

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    if (filters.status) {
      // Map status filter to is_active boolean
      const isActive = filters.status === 'active';
      if ((isActive && !supplier.is_active) || (!isActive && supplier.is_active)) {
        return false;
      }
    }
    return true;
  });

  // Sort suppliers
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sort.field) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'min_order':
        aValue = a.min_order;
        bValue = b.min_order;
        break;
      case 'total_orders':
        aValue = a.total_orders || 0;
        bValue = b.total_orders || 0;
        break;
      case 'last_order_date':
        aValue = new Date(a.last_order_date || '1900-01-01');
        bValue = new Date(b.last_order_date || '1900-01-01');
        break;
      default:
        aValue = a[sort.field as keyof SupplierUI];
        bValue = b[sort.field as keyof SupplierUI];
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sort.direction === 'asc' 
        ? aValue.localeCompare(bValue, 'ko-KR')
        : bValue.localeCompare(aValue, 'ko-KR');
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sort.direction === 'asc' 
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    
    return 0;
  });

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">필터</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">전체</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="pending">대기</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전문 분야
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => {
                // Filter by specialty - this would need more complex logic
                console.log('Filter by specialty:', e.target.value);
              }}
            >
              <option value="">전체</option>
              <option value="육류">육류</option>
              <option value="채소">채소</option>
              <option value="과일">과일</option>
              <option value="해산물">해산물</option>
              <option value="곡류">곡류</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              평점 기준
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => {
                const minRating = parseFloat(e.target.value);
                setFilters(prev => ({
                  ...prev,
                  // Custom filter for rating - would need to extend FilterOptions type
                }));
              }}
            >
              <option value="">전체</option>
              <option value="4.5">4.5점 이상</option>
              <option value="4.0">4.0점 이상</option>
              <option value="3.5">3.5점 이상</option>
              <option value="3.0">3.0점 이상</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={() => setFilters({})}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          필터 초기화
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  공급업체명
                  {sort.field === 'name' && (
                    <span className="ml-1">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락처
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('rating')}
                >
                  평점
                  {sort.field === 'rating' && (
                    <span className="ml-1">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  전문 분야
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('min_order')}
                >
                  최소주문금액
                  {sort.field === 'min_order' && (
                    <span className="ml-1">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  배송 시간
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('total_orders')}
                >
                  총 주문
                  {sort.field === 'total_orders' && (
                    <span className="ml-1">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {supplier.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        담당자: {supplier.contact_person || '미지정'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{formatPhoneNumber(supplier.phone || '')}</div>
                      <div className="text-gray-500">{supplier.email || ''}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 mr-2">
                        {supplier.rating.toFixed(1)}
                      </div>
                      <div className="text-yellow-400 text-xs">
                        {generateStars(supplier.rating)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {supplier.specialties.slice(0, 2).map((specialty, index) => (
                        <span 
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                        >
                          {specialty}
                        </span>
                      ))}
                      {supplier.specialties.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          +{supplier.specialties.length - 2}개
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(supplier.min_order)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.delivery_time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {supplier.total_orders || 0}회
                    </div>
                    {supplier.last_order_date && (
                      <div className="text-xs text-gray-500">
                        최근: {formatDate(supplier.last_order_date, 'MM/DD')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${supplier.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {supplier.is_active ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => onContact(supplier)}
                      className="text-green-600 hover:text-green-900"
                    >
                      연락
                    </button>
                    <button
                      onClick={() => onEdit(supplier)}
                      className="text-primary hover:text-primary-dark"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => onDelete(supplier.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedSuppliers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">조건에 맞는 공급업체가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-green-800">
              총 {sortedSuppliers.length}개의 공급업체가 표시됩니다.
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-green-600">
              활성: {sortedSuppliers.filter(s => s.is_active).length}개
            </span>
            <span className="text-gray-600">
              비활성: {sortedSuppliers.filter(s => !s.is_active).length}개
            </span>
            <span className="text-primary">
              평균 평점: {(sortedSuppliers.reduce((sum, s) => sum + s.rating, 0) / sortedSuppliers.length).toFixed(1)}점
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}