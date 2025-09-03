import React from 'react'
import { render } from '@testing-library/react'
import { Separator } from '../separator'

describe('Separator Component', () => {
  it('should render horizontal separator by default', () => {
    const { container } = render(<Separator />)
    const separator = container.querySelector('div[role="separator"]')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    expect(separator).toHaveClass('h-[1px]', 'w-full')
  })

  it('should render vertical separator when specified', () => {
    const { container } = render(<Separator orientation="vertical" />)
    const separator = container.querySelector('div[role="separator"]')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    expect(separator).toHaveAttribute('data-orientation', 'vertical')
    expect(separator).toHaveClass('h-full', 'w-[1px]')
  })

  it('should not render decorative separator', () => {
    const { container } = render(<Separator decorative={false} />)
    const separator = container.querySelector('div[role="separator"]')
    expect(separator).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<Separator className="custom-class" />)
    const separator = container.querySelector('div[role="separator"]')
    expect(separator).toHaveClass('custom-class')
  })

  it('should apply base styles', () => {
    const { container } = render(<Separator />)
    const separator = container.querySelector('div[role="separator"]')
    expect(separator).toHaveClass('shrink-0', 'bg-border')
  })

  it('should forward ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(<Separator ref={ref} />)
    const separator = container.querySelector('div[role="separator"]')
    expect(ref.current).toBe(separator)
  })
})