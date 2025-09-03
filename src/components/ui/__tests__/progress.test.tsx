import React from 'react'
import { render } from '@testing-library/react'
import { Progress } from '../progress'

describe('Progress Component', () => {
  it('should render with default value', () => {
    const { container } = render(<Progress />)
    const progressRoot = container.querySelector('div[role="progressbar"]')
    expect(progressRoot).toBeInTheDocument()
    expect(progressRoot).toHaveAttribute('aria-valuemax', '100')
    expect(progressRoot).toHaveAttribute('aria-valuemin', '0')
  })

  it('should render with specified value', () => {
    const { container } = render(<Progress value={50} />)
    const progressRoot = container.querySelector('div[role="progressbar"]')
    expect(progressRoot).toHaveAttribute('aria-valuenow', '50')
    
    const indicator = container.querySelector('div[data-state="loading"]')
    expect(indicator).toHaveStyle({ transform: 'translateX(-50%)' })
  })

  it('should render with 0 value', () => {
    const { container } = render(<Progress value={0} />)
    const progressRoot = container.querySelector('div[role="progressbar"]')
    expect(progressRoot).toHaveAttribute('aria-valuenow', '0')
    
    const indicator = container.querySelector('div[data-state="loading"]')
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' })
  })

  it('should render with 100 value', () => {
    const { container } = render(<Progress value={100} />)
    const progressRoot = container.querySelector('div[role="progressbar"]')
    expect(progressRoot).toHaveAttribute('aria-valuenow', '100')
    
    const indicator = container.querySelector('div[data-state="loading"]')
    expect(indicator).toHaveStyle({ transform: 'translateX(-0%)' })
  })

  it('should handle null value', () => {
    const { container } = render(<Progress value={null} />)
    const progressRoot = container.querySelector('div[role="progressbar"]')
    expect(progressRoot).not.toHaveAttribute('aria-valuenow')
    
    const indicator = container.querySelector('div[data-state="indeterminate"]')
    expect(indicator).toBeInTheDocument()
  })

  it('should handle undefined value', () => {
    const { container } = render(<Progress value={undefined} />)
    const progressRoot = container.querySelector('div[role="progressbar"]')
    expect(progressRoot).not.toHaveAttribute('aria-valuenow')
    
    const indicator = container.querySelector('div[data-state="indeterminate"]')
    expect(indicator).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<Progress className="custom-class" value={50} />)
    const progressRoot = container.querySelector('div[role="progressbar"]')
    expect(progressRoot).toHaveClass('custom-class')
  })

  it('should apply base styles', () => {
    const { container } = render(<Progress value={50} />)
    const progressRoot = container.querySelector('div[role="progressbar"]')
    expect(progressRoot).toHaveClass(
      'relative',
      'h-4',
      'w-full',
      'overflow-hidden',
      'rounded-full',
      'bg-secondary'
    )
  })

  it('should apply indicator styles', () => {
    const { container } = render(<Progress value={50} />)
    const indicator = container.querySelector('div[data-state="loading"]')
    expect(indicator).toHaveClass(
      'h-full',
      'w-full',
      'flex-1',
      'bg-primary',
      'transition-all'
    )
  })

  it('should forward ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(<Progress ref={ref} value={50} />)
    const progressRoot = container.querySelector('div[role="progressbar"]')
    expect(ref.current).toBe(progressRoot)
  })
})