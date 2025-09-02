// 가격 포맷팅 유틸리티 (통합)

// 기본 가격 포맷팅 (한국어 특화)
export function formatPrice(price: number, currency = '원'): string {
  return `${price.toLocaleString('ko-KR')}${currency}`;
}

// Intl API 기반 화폐 포맷팅 (format.ts에서 통합)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0
  }).format(amount);
}

// 숫자 포맷팅 (천 단위 콤마)
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}

// 가격 변화율 포맷팅
export function formatPriceChange(change: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

// 날짜 포맷팅
export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  const d = new Date(date);
  
  switch (format) {
    case 'YYYY-MM-DD':
      return d.toISOString().split('T')[0];
    case 'MM/DD':
      return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    case 'YYYY년 MM월 DD일':
      return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월 ${String(d.getDate()).padStart(2, '0')}일`;
    case 'relative':
      return getRelativeTime(d);
    default:
      return d.toLocaleDateString('ko-KR');
  }
}

// 상대적 시간 표시 (확장)
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}일 전`;
  
  return formatDate(date, 'YYYY-MM-DD');
}

// 상대 시간 포맷팅 (format.ts에서 통합)
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '방금 전';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}분 전`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}시간 전`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  } else {
    return formatDate(dateObj);
  }
}

// 퍼센트 포맷팅 (통합)
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

// 퍼센트 직접 포맷팅 (format.ts에서 통합)
export function formatPercent(value: number, digits: number = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

// 수량 포맷팅 (단위 포함)
export function formatQuantity(quantity: number, unit: string): string {
  // 소수점 제거 (정수인 경우)
  const formattedQuantity = quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(2);
  return `${formattedQuantity}${unit}`;
}

// 상태 색상 반환
export function getStatusColor(status: string): string {
  switch (status) {
    case 'available':
    case 'active':
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'low_stock':
    case 'warning':
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'out_of_stock':
    case 'inactive':
    case 'error':
      return 'text-red-600 bg-red-100';
    case 'trial':
      return 'text-primary bg-primary/10';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// 상태 라벨 반환
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'available': return '재고 충분';
    case 'low_stock': return '재고 부족';
    case 'out_of_stock': return '재고 없음';
    case 'active': return '활성';
    case 'inactive': return '비활성';
    case 'pending': return '대기';
    case 'completed': return '완료';
    case 'trial': return '체험';
    case 'free': return '무료';
    case 'pro': return '프로';
    case 'business': return '비즈니스';
    default: return status;
  }
}

// 평점 별표 생성
export function generateStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  let stars = '★'.repeat(fullStars);
  if (hasHalfStar) stars += '☆';
  stars += '☆'.repeat(5 - Math.ceil(rating));
  
  return stars;
}

// 난이도 색상 반환
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'hard':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// 난이도 라벨 반환
export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return '쉬움';
    case 'medium': return '보통';
    case 'hard': return '어려움';
    default: return difficulty;
  }
}

// 카테고리 색상 반환 (식자재)
export function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    '육류': 'text-red-600 bg-red-100',
    '채소': 'text-green-600 bg-green-100',
    '과일': 'text-orange-600 bg-orange-100',
    '곡류': 'text-yellow-600 bg-yellow-100',
    '조미료': 'text-purple-600 bg-purple-100',
    '향신료': 'text-pink-600 bg-pink-100',
    '난류': 'text-amber-600 bg-amber-100',
    '유제품': 'text-primary bg-primary/10',
    '해산물': 'text-cyan-600 bg-cyan-100',
    '기타': 'text-gray-600 bg-gray-100'
  };
  
  return colors[category] || 'text-gray-600 bg-gray-100';
}

// 시간 포맷팅 (분)
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}시간`;
  }
  
  return `${hours}시간 ${remainingMinutes}분`;
}

// 수익률 색상 반환
export function getProfitColor(margin: number): string {
  if (margin >= 60) return 'text-green-600';
  if (margin >= 40) return 'text-primary';
  if (margin >= 20) return 'text-yellow-600';
  return 'text-red-600';
}

// 가격 변화 색상 반환
export function getPriceChangeColor(change: number): string {
  if (change > 0) return 'text-red-600';
  if (change < 0) return 'text-green-600';
  return 'text-gray-600';
}

// 가격 변화 아이콘 반환
export function getPriceChangeIcon(change: number): string {
  if (change > 0) return '↑';
  if (change < 0) return '↓';
  return '→';
}

// 숫자를 한국어 단위로 변환 (만, 억)
export function formatNumberToKorean(num: number): string {
  if (num >= 100000000) { // 1억 이상
    return `${(num / 100000000).toFixed(1)}억원`;
  } else if (num >= 10000) { // 1만 이상
    return `${(num / 10000).toFixed(1)}만원`;
  } else {
    return `${num.toLocaleString()}원`;
  }
}

// 검색 하이라이트
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}

// 파일 크기 포맷팅
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 전화번호 포맷팅
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    // 010-1234-5678
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 10) {
    // 02-1234-5678 또는 031-123-4567
    if (cleaned.startsWith('02')) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    } else {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
  }
  
  return phone; // 포맷할 수 없는 경우 원본 반환
}