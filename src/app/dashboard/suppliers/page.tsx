'use client';

import { useState } from 'react';
import { SupplierUI as Supplier, SupplierFormData } from '@/types';
import { mockSuppliers } from '@/lib/mock-data';
import { formatPrice, formatNumberToKorean } from '@/lib/utils/formatting';
import SuppliersTable from '@/components/dashboard/suppliers/SuppliersTable';
import SupplierForm from '@/components/dashboard/suppliers/SupplierForm';

export default function SuppliersPageRoute() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();
  const [contactSupplier, setContactSupplier] = useState<Supplier | undefined>();

  // Calculate statistics
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.is_active === true).length;
  const averageRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;
  const totalOrders = suppliers.reduce((sum, s) => sum + (s.total_orders || 0), 0);
  const averageMinOrder = suppliers.reduce((sum, s) => sum + s.min_order, 0) / suppliers.length;

  const handleAddSupplier = () => {
    setEditingSupplier(undefined);
    setIsFormOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm('이 공급업체를 삭제하시겠습니까?')) {
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
    }
  };

  const handleContactSupplier = (supplier: Supplier) => {
    setContactSupplier(supplier);
  };

  const handleSaveSupplier = (formData: SupplierFormData) => {
    if (editingSupplier) {
      // Edit existing supplier
      setSuppliers(prev => prev.map(supplier => 
        supplier.id === editingSupplier.id
          ? {
              ...supplier,
              ...formData,
              rating: supplier.rating, // Keep existing rating
              deliveryTime: supplier.delivery_time || '미지정',
              status: supplier.is_active,
              totalOrders: supplier.total_orders,
              lastOrderDate: supplier.last_order_date
            }
          : supplier
      ));
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        id: `sup_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...formData,
        min_order: formData.min_order || 0,
        payment_terms: formData.payment_terms || '',
        specialties: formData.specialties || [],
        rating: 0,
        delivery_time: '미지정',
        is_active: true,
        total_orders: 0,
      };
      setSuppliers(prev => [...prev, newSupplier]);
    }
    setIsFormOpen(false);
    setEditingSupplier(undefined);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingSupplier(undefined);
  };

  const handleCloseContact = () => {
    setContactSupplier(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공급업체 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            공급업체 정보를 관리하고 가격 경쟁력을 분석하세요
          </p>
        </div>
        <button
          onClick={handleAddSupplier}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
        >
          + 새 공급업체 추가
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 공급업체</p>
              <p className="text-2xl font-bold text-gray-900">{totalSuppliers}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-md">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">활성 업체</p>
              <p className="text-2xl font-bold text-primary">{activeSuppliers}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-md">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">평균 평점</p>
              <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}점</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-md">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 주문</p>
              <p className="text-2xl font-bold text-purple-600">{totalOrders}회</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-md">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">평균 최소주문</p>
              <p className="text-lg font-bold text-orange-600">{formatNumberToKorean(averageMinOrder)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <SuppliersTable 
        suppliers={suppliers}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
        onContact={handleContactSupplier}
      />

      {/* Supplier Form Modal */}
      {isFormOpen && (
        <SupplierForm
          supplier={editingSupplier}
          onSave={handleSaveSupplier}
          onCancel={handleCancelForm}
        />
      )}

      {/* Contact Modal */}
      {contactSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {contactSupplier.name} 연락처
                </h3>
                <button
                  onClick={handleCloseContact}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">담당자</p>
                  <p className="text-gray-900">{contactSupplier.contact_manager || '미지정'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">전화번호</p>
                  <a 
                    href={`tel:${contactSupplier.phone}`}
                    className="text-primary hover:text-primary"
                  >
                    {contactSupplier.phone}
                  </a>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">이메일</p>
                  <a 
                    href={`mailto:${contactSupplier.email}`}
                    className="text-primary hover:text-primary"
                  >
                    {contactSupplier.email}
                  </a>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">주소</p>
                  <p className="text-gray-900">{contactSupplier.address}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">결제조건</p>
                  <p className="text-gray-900">{contactSupplier.payment_terms}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">최소주문금액</p>
                  <p className="text-gray-900">{formatPrice(contactSupplier.min_order)}</p>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => window.open(`tel:${contactSupplier.phone}`)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  전화 걸기
                </button>
                <button
                  onClick={() => window.open(`mailto:${contactSupplier.email}`)}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  이메일 보내기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}