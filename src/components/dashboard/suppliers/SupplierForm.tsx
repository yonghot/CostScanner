'use client';

import { useState, useEffect } from 'react';
import { SupplierUI as Supplier, SupplierFormData } from '@/types';
import { supplierSpecialties } from '@/lib/mock-data';

interface SupplierFormProps {
  supplier?: Supplier;
  onSave: (data: SupplierFormData) => void;
  onCancel: () => void;
}

export default function SupplierForm({ supplier, onSave, onCancel }: SupplierFormProps) {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    contact_person: '',
    payment_terms: '',
    min_order: 0,
    specialties: [],
    notes: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
        contact_person: supplier.contact_person || '',
        payment_terms: supplier.payment_terms || '',
        min_order: supplier.min_order || 0,
        specialties: supplier.specialties || [],
        notes: supplier.notes || '',
      });
    }
  }, [supplier]);

  const paymentTermsOptions = [
    '현금결제',
    '월말결제',
    '15일 후 결제',
    '30일 후 결제',
    '현금결제시 할인',
    '카드결제 가능',
    '은행이체만'
  ];

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = '공급업체명을 입력해주세요.';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = '연락처를 입력해주세요.';
    }

    if (!formData.email?.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.address?.trim()) {
      newErrors.address = '주소를 입력해주세요.';
    }

    if (!formData.payment_terms) {
      newErrors.payment_terms = '결제조건을 선택해주세요.';
    }

    if (!formData.min_order || formData.min_order <= 0) {
      newErrors.min_order = '최소주문금액을 입력해주세요.';
    }

    if (!formData.specialties || formData.specialties.length === 0) {
      newErrors.specialties = '최소 하나의 전문 분야를 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof SupplierFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && formData.specialties && !formData.specialties.includes(newSpecialty.trim())) {
      handleInputChange('specialties', [...formData.specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    if (formData.specialties) {
      handleInputChange('specialties', formData.specialties.filter(s => s !== specialty));
    }
  };

  const addPredefinedSpecialty = (specialty: string) => {
    if (formData.specialties && !formData.specialties.includes(specialty)) {
      handleInputChange('specialties', [...formData.specialties, specialty]);
    } else if (!formData.specialties) {
      handleInputChange('specialties', [specialty]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {supplier ? '공급업체 수정' : '새 공급업체 추가'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  공급업체명 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="예: 신선마트"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  담당자명
                </label>
                <input
                  type="text"
                  value={formData.contact_person || ''}
                  onChange={(e) => handleInputChange('contact_person', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="담당자 이름"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">연락처 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전화번호 *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="02-1234-5678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="contact@supplier.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소 *
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="서울시 강남구 테헤란로 123"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Business Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  결제조건 *
                </label>
                <select
                  value={formData.payment_terms || ''}
                  onChange={(e) => handleInputChange('payment_terms', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.payment_terms ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">결제조건 선택</option>
                  {paymentTermsOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.payment_terms && (
                  <p className="mt-1 text-sm text-red-600">{errors.payment_terms}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최소주문금액 *
                </label>
                <input
                  type="number"
                  value={formData.min_order || ''}
                  onChange={(e) => handleInputChange('min_order', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.min_order ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="원"
                  min="0"
                />
                {errors.min_order && (
                  <p className="mt-1 text-sm text-red-600">{errors.min_order}</p>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전문 분야 *
              </label>
              
              {/* Predefined specialties */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">추천 분야를 선택하세요:</p>
                <div className="flex flex-wrap gap-2">
                  {supplierSpecialties.map(specialty => (
                    <button
                      key={specialty}
                      type="button"
                      onClick={() => addPredefinedSpecialty(specialty)}
                      disabled={formData.specialties?.includes(specialty)}
                      className={`px-3 py-1 text-sm rounded-full border ${
                        formData.specialties?.includes(specialty)
                          ? 'bg-primary/10 text-primary border-primary/20 cursor-not-allowed'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Custom specialty input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="직접 입력"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSpecialty();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addSpecialty}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  추가
                </button>
              </div>

              {/* Selected specialties */}
              <div className="space-y-2">
                {formData.specialties?.map((specialty, index) => (
                  <div key={index} className="flex items-center justify-between bg-primary/5 px-3 py-2 rounded-md">
                    <span className="text-sm text-primary">{specialty}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {errors.specialties && (
                <p className="mt-1 text-sm text-red-600">{errors.specialties}</p>
              )}

              {(!formData.specialties || formData.specialties.length === 0) && (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-md">
                  <p className="text-sm text-gray-500">전문 분야를 추가해주세요</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메모
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="공급업체에 대한 추가 정보나 메모를 입력하세요"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {supplier ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}