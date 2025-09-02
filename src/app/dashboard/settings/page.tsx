'use client';

import { useState } from 'react';

export default function SettingsPageRoute() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: '맛있는 식당',
      timezone: 'Asia/Seoul',
      currency: 'KRW',
      language: 'ko',
      dateFormat: 'YYYY-MM-DD'
    },
    notifications: {
      priceAlerts: true,
      stockAlerts: true,
      supplierUpdates: false,
      weeklyReports: true,
      emailNotifications: true,
      pushNotifications: false,
      alertThresholds: {
        priceIncrease: 10,
        lowStock: 5
      }
    },
    account: {
      name: '김대표',
      email: 'admin@restaurant.com',
      phone: '010-1234-5678',
      role: '관리자'
    },
    system: {
      autoBackup: true,
      backupFrequency: 'weekly',
      dataRetention: 365,
      exportFormat: 'excel'
    }
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleNestedSettingChange = (category: string, parentKey: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [parentKey]: {
          ...(prev[category as keyof typeof prev] as any)[parentKey],
          [key]: value
        }
      }
    }));
  };

  const saveSettings = () => {
    // Simulate save
    alert('설정이 저장되었습니다.');
  };

  const resetSettings = () => {
    if (confirm('설정을 초기값으로 되돌리시겠습니까?')) {
      // Reset to default values
      alert('설정이 초기화되었습니다.');
    }
  };

  const tabs = [
    { id: 'general', name: '일반 설정', icon: '⚙️' },
    { id: 'notifications', name: '알림 설정', icon: '🔔' },
    { id: 'account', name: '계정 관리', icon: '👤' },
    { id: 'system', name: '시스템', icon: '💾' },
    { id: 'billing', name: '결제 관리', icon: '💳' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="mt-1 text-sm text-gray-500">
          계정 정보와 시스템 설정을 관리하세요
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded-lg shadow-sm border p-4">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">일반 설정</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      사업체명
                    </label>
                    <input
                      type="text"
                      value={settings.general.companyName}
                      onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        시간대
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Asia/Seoul">서울 (UTC+9)</option>
                        <option value="UTC">협정세계시 (UTC)</option>
                        <option value="America/New_York">뉴욕 (UTC-5)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        통화
                      </label>
                      <select
                        value={settings.general.currency}
                        onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="KRW">한국 원 (₩)</option>
                        <option value="USD">미국 달러 ($)</option>
                        <option value="JPY">일본 엔 (¥)</option>
                        <option value="EUR">유로 (€)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        언어
                      </label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="ko">한국어</option>
                        <option value="en">English</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        날짜 형식
                      </label>
                      <select
                        value={settings.general.dateFormat}
                        onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="YYYY-MM-DD">2024-01-15</option>
                        <option value="MM/DD/YYYY">01/15/2024</option>
                        <option value="DD/MM/YYYY">15/01/2024</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">알림 설정</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">알림 유형</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'priceAlerts', label: '가격 변동 알림', desc: '식자재 가격이 변동될 때 알림을 받습니다' },
                        { key: 'stockAlerts', label: '재고 부족 알림', desc: '재고가 설정된 기준 이하로 떨어질 때 알림을 받습니다' },
                        { key: 'supplierUpdates', label: '공급업체 업데이트', desc: '공급업체 정보가 변경될 때 알림을 받습니다' },
                        { key: 'weeklyReports', label: '주간 리포트', desc: '매주 성과 리포트를 이메일로 받습니다' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">{item.label}</h5>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(settings.notifications as any)[item.key]}
                              onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">전송 방법</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">이메일 알림</h5>
                          <p className="text-sm text-gray-500">이메일로 알림을 받습니다</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.emailNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">푸시 알림</h5>
                          <p className="text-sm text-gray-500">브라우저 푸시 알림을 받습니다</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.pushNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">알림 기준 설정</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          가격 증가 알림 기준 (%)
                        </label>
                        <input
                          type="number"
                          value={settings.notifications.alertThresholds.priceIncrease}
                          onChange={(e) => handleNestedSettingChange('notifications', 'alertThresholds', 'priceIncrease', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          재고 부족 알림 기준 (단위)
                        </label>
                        <input
                          type="number"
                          value={settings.notifications.alertThresholds.lowStock}
                          onChange={(e) => handleNestedSettingChange('notifications', 'alertThresholds', 'lowStock', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Management */}
            {activeTab === 'account' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">계정 관리</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">개인 정보</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          이름
                        </label>
                        <input
                          type="text"
                          value={settings.account.name}
                          onChange={(e) => handleSettingChange('account', 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          이메일
                        </label>
                        <input
                          type="email"
                          value={settings.account.email}
                          onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          전화번호
                        </label>
                        <input
                          type="tel"
                          value={settings.account.phone}
                          onChange={(e) => handleSettingChange('account', 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          역할
                        </label>
                        <input
                          type="text"
                          value={settings.account.role}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">보안 설정</h4>
                    <div className="space-y-4">
                      <button className="w-full md:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary">
                        비밀번호 변경
                      </button>
                      <button className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ml-0 md:ml-3 mt-3 md:mt-0">
                        2단계 인증 설정
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">시스템 설정</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">데이터 백업</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">자동 백업</h5>
                          <p className="text-sm text-gray-500">정기적으로 데이터를 자동 백업합니다</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.system.autoBackup}
                            onChange={(e) => handleSettingChange('system', 'autoBackup', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            백업 주기
                          </label>
                          <select
                            value={settings.system.backupFrequency}
                            onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="daily">매일</option>
                            <option value="weekly">매주</option>
                            <option value="monthly">매월</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            데이터 보관 기간 (일)
                          </label>
                          <input
                            type="number"
                            value={settings.system.dataRetention}
                            onChange={(e) => handleSettingChange('system', 'dataRetention', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">데이터 내보내기</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          기본 내보내기 형식
                        </label>
                        <select
                          value={settings.system.exportFormat}
                          onChange={(e) => handleSettingChange('system', 'exportFormat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="excel">Excel (.xlsx)</option>
                          <option value="csv">CSV (.csv)</option>
                          <option value="pdf">PDF (.pdf)</option>
                        </select>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                          전체 데이터 내보내기
                        </button>
                        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary">
                          백업 생성
                        </button>
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                          백업 복원
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Management */}
            {activeTab === 'billing' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">결제 관리</h3>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-primary/5 to-indigo-50 p-6 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-primary-dark">프로 플랜</h4>
                        <p className="text-sm text-primary">현재 구독 중인 플랜입니다</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-dark">₩29,000</div>
                        <div className="text-sm text-primary">/ 월</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-primary">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      다음 결제일: 2024년 2월 15일
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">결제 수단</h4>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-5 bg-primary rounded mr-3 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">BC</span>
                          </div>
                          <div>
                            <div className="font-medium">BC카드</div>
                            <div className="text-sm text-gray-500">**** **** **** 1234</div>
                          </div>
                        </div>
                        <button className="text-primary hover:text-primary text-sm font-medium">
                          변경
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">결제 내역</h4>
                    <div className="border rounded-lg">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                결제일
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                플랜
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                금액
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                상태
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                영수증
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {[
                              { date: '2024-01-15', plan: '프로 플랜', amount: '₩29,000', status: '완료' },
                              { date: '2023-12-15', plan: '프로 플랜', amount: '₩29,000', status: '완료' },
                              { date: '2023-11-15', plan: '프로 플랜', amount: '₩29,000', status: '완료' },
                            ].map((payment, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {payment.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {payment.plan}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {payment.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    {payment.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <button className="text-primary hover:text-primary">
                                    다운로드
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary">
                      플랜 변경
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                      구독 취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save/Reset Buttons */}
            <div className="border-t p-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveSettings}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  설정 저장
                </button>
                <button
                  onClick={resetSettings}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  초기화
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}