import type { ReactNode } from 'react'

interface ControlsSectionProps {
  title: string
  children: ReactNode
}

export default function ControlsSection ({
  title,
  children
}: ControlsSectionProps) {
  return (
    <div
      className='flex flex-col gap-2 p-2 border-b-2 border-primary-muted'
    >
      <p
        className='text-primary-foreground'
      >
        {title}
      </p>
      <div
        className='flex flex-row gap-2'
      >
        {children}
      </div>
    </div>
  )
}
