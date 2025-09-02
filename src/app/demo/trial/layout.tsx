'use client'

import { DemoProvider } from '@/contexts/DemoContext'
import DemoLayout from '@/components/demo/DemoLayout'

export default function DemoTrialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DemoProvider>
      <DemoLayout>
        {children}
      </DemoLayout>
    </DemoProvider>
  )
}