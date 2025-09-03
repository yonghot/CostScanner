import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge, badgeVariants } from '../badge'

describe('Badge Component', () => {
  it('should render with children', () => {
    render(<Badge>Badge Text</Badge>)
    expect(screen.getByText('Badge Text')).toBeInTheDocument()
  })

  describe('variants', () => {
    it('should render default variant', () => {
      const { container } = render(<Badge>Default</Badge>)
      expect(container.firstChild).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('should render secondary variant', () => {
      const { container } = render(<Badge variant="secondary">Secondary</Badge>)
      expect(container.firstChild).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })

    it('should render destructive variant', () => {
      const { container } = render(<Badge variant="destructive">Destructive</Badge>)
      expect(container.firstChild).toHaveClass('bg-destructive', 'text-destructive-foreground')
    })

    it('should render outline variant', () => {
      const { container } = render(<Badge variant="outline">Outline</Badge>)
      expect(container.firstChild).toHaveClass('text-foreground')
    })
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Badge className="custom-class">Custom</Badge>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should apply base styles', () => {
    const { container } = render(<Badge>Base Styles</Badge>)
    expect(container.firstChild).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold'
    )
  })

  it('should generate badge variant classes correctly', () => {
    const defaultClasses = badgeVariants({ variant: 'default' })
    expect(defaultClasses).toContain('bg-primary')
    expect(defaultClasses).toContain('text-primary-foreground')

    const secondaryClasses = badgeVariants({ variant: 'secondary' })
    expect(secondaryClasses).toContain('bg-secondary')
    expect(secondaryClasses).toContain('text-secondary-foreground')

    const destructiveClasses = badgeVariants({ variant: 'destructive' })
    expect(destructiveClasses).toContain('bg-destructive')
    expect(destructiveClasses).toContain('text-destructive-foreground')

    const outlineClasses = badgeVariants({ variant: 'outline' })
    expect(outlineClasses).toContain('text-foreground')
  })

  it('should render with different HTML props', () => {
    render(
      <Badge id="test-badge" data-testid="badge">
        With Props
      </Badge>
    )
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveAttribute('id', 'test-badge')
  })
})