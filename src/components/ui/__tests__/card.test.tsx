import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render with children', () => {
      render(
        <Card>
          <div>Card Content</div>
        </Card>
      )
      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <Card className="custom-class">
          <div>Content</div>
        </Card>
      )
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should forward ref', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <Card ref={ref}>
          <div>Content</div>
        </Card>
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('CardHeader', () => {
    it('should render with children', () => {
      render(
        <CardHeader>
          <div>Header Content</div>
        </CardHeader>
      )
      expect(screen.getByText('Header Content')).toBeInTheDocument()
    })

    it('should apply default styles', () => {
      const { container } = render(
        <CardHeader>
          <div>Header</div>
        </CardHeader>
      )
      expect(container.firstChild).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })
  })

  describe('CardFooter', () => {
    it('should render with children', () => {
      render(
        <CardFooter>
          <div>Footer Content</div>
        </CardFooter>
      )
      expect(screen.getByText('Footer Content')).toBeInTheDocument()
    })

    it('should apply default styles', () => {
      const { container } = render(
        <CardFooter>
          <div>Footer</div>
        </CardFooter>
      )
      expect(container.firstChild).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })
  })

  describe('CardTitle', () => {
    it('should render as h3 element', () => {
      render(
        <CardTitle>
          Title Text
        </CardTitle>
      )
      const title = screen.getByText('Title Text')
      expect(title.tagName).toBe('H3')
    })

    it('should apply default styles', () => {
      render(
        <CardTitle>
          Title
        </CardTitle>
      )
      const title = screen.getByText('Title')
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
    })
  })

  describe('CardDescription', () => {
    it('should render as p element', () => {
      render(
        <CardDescription>
          Description Text
        </CardDescription>
      )
      const description = screen.getByText('Description Text')
      expect(description.tagName).toBe('P')
    })

    it('should apply default styles', () => {
      render(
        <CardDescription>
          Description
        </CardDescription>
      )
      const description = screen.getByText('Description')
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('should render with children', () => {
      render(
        <CardContent>
          <div>Content Body</div>
        </CardContent>
      )
      expect(screen.getByText('Content Body')).toBeInTheDocument()
    })

    it('should apply padding styles', () => {
      const { container } = render(
        <CardContent>
          <div>Content</div>
        </CardContent>
      )
      expect(container.firstChild).toHaveClass('p-6', 'pt-0')
    })
  })
})