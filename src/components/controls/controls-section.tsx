import type { ReactNode } from 'react'

interface ControlsSectionProps {
  title: string
  children: ReactNode
  direction?: 'row' | 'col'
  bordered?: boolean
}

export default function ControlsSection ({
  title,
  children,
  direction = 'row',
  bordered = true
}: ControlsSectionProps) {
  return (
    <div
      className={`flex flex-col gap-2 p-4 ${bordered ? 'border-b-2 border-primary-muted' : ''}`}
    >
      <p
        className='text-primary-foreground'
      >
        {title}
      </p>
      <div
        className={`flex ${direction === 'row' ? 'flex-row' : 'w-fit flex-col'} gap-2`}
      >
        {children}
      </div>
    </div>
  )
}
