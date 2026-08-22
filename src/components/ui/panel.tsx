import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  accentClassName?: string
  actions?: ReactNode
  className?: string
  contentClassName?: string
  children: ReactNode
}

export default function Panel ({
  title,
  accentClassName = 'text-primary-muted-foreground',
  actions,
  className = '',
  contentClassName = '',
  children
}: PanelProps) {
  return (
    <div
      className={`min-h-0 min-w-0 flex flex-col border-2 border-primary ${className}`}
    >
      <div
        className='shrink-0 flex items-center justify-between gap-2 px-2 py-1 bg-primary'
      >
        <p
          className={`text-xs tracking-widest ${accentClassName}`}
        >
          {title}
        </p>
        {actions}
      </div>
      <div
        className={`min-h-0 min-w-0 flex-1 ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
