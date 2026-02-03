import { Link } from 'react-router'
import type { LucideIcon } from 'lucide-react'

interface SidebarLinkProps {
  Icon: LucideIcon
  href: string
  label: string
  selected: boolean
}

export default function SidebarLink ({
  Icon,
  href,
  label,
  selected
}: SidebarLinkProps) {
  const linkStyles = `
    w-full h-14 flex items-center p-4 hover:bg-background
    ${selected ? 'bg-background opacity-100' : 'opacity-60'}
  `

  const labelStyles = `
    whitespace-nowrap overflow-hidden transition
    ml-4 group-hover:opacity-100 group-hover:translate-x-0
  `

  return (
    <Link
      to={href}
      title={label}
      className={linkStyles}
      // reloadDocument
    >
      <Icon
        className='shrink-0 text-primary-foreground'
        strokeWidth={1.5}
      />
      <p
        className={labelStyles}
      >
        {label}
      </p>
    </Link>
  )
}
