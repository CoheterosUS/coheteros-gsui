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
      className={`flex flex-col gap-2 ${bordered ? 'p-4 border-b-2 border-primary-muted' : 'px-4 py-2'}`}
    >
      <p
        className='text-xs tracking-widest text-primary-muted-foreground'
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
