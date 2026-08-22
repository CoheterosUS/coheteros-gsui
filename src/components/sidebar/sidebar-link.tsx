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
    group/link relative w-full h-12 flex items-center px-4 border-l-2 transition-colors duration-100
    hover:bg-background
    ${selected ? 'bg-background border-primary-foreground' : 'border-transparent'}
  `

  const iconStyles = `
    shrink-0 transition-colors duration-100 group-hover/link:text-primary-foreground
    ${selected ? 'text-primary-foreground' : 'text-primary-muted-foreground'}
  `

  const labelStyles = `
    ml-4 text-xs tracking-widest whitespace-nowrap overflow-hidden transition-all duration-100
    opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
    ${selected ? 'text-primary-foreground' : 'text-primary-muted-foreground group-hover/link:text-primary-foreground'}
  `

  return (
    <Link
      to={href}
      title={label}
      className={linkStyles}
    >
      <Icon
        className={iconStyles}
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
