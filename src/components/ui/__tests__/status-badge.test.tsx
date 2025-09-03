import React from 'react'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../status-badge'

describe('StatusBadge Component', () => {
  describe('status variants', () => {
    it('should render active status with correct styles', () => {
      render(<StatusBadge status="active">활성</StatusBadge>)
      const badge = screen.getByText('활성')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('should render inactive status with correct styles', () => {
      render(<StatusBadge status="inactive">비활성</StatusBadge>)
      const badge = screen.getByText('비활성')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
    })

    it('should render pending status with correct styles', () => {
      render(<StatusBadge status="pending">대기중</StatusBadge>)
      const badge = screen.getByText('대기중')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800')
    })

    it('should render error status with correct styles', () => {
      render(<StatusBadge status="error">오류</StatusBadge>)
      const badge = screen.getByText('오류')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('should render success status with correct styles', () => {
      render(<StatusBadge status="success">성공</StatusBadge>)
      const badge = screen.getByText('성공')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('should render warning status with correct styles', () => {
      render(<StatusBadge status="warning">경고</StatusBadge>)
      const badge = screen.getByText('경고')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-orange-100', 'text-orange-800')
    })
  })

  it('should apply base styles', () => {
    const { container } = render(<StatusBadge status="active">Test</StatusBadge>)
    const badge = container.firstChild
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-medium'
    )
  })

  it('should apply custom className', () => {
    const { container } = render(
      <StatusBadge status="active" className="custom-class">
        Custom
      </StatusBadge>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should handle multiple children', () => {
    render(
      <StatusBadge status="active">
        <span>Icon</span>
        <span>Text</span>
      </StatusBadge>
    )
    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text')).toBeInTheDocument()
  })

  it('should handle empty children', () => {
    const { container } = render(<StatusBadge status="active" />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('bg-green-100')
  })
})