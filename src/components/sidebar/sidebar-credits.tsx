import { Link } from 'react-router'

export default function SidebarCredits () {
  const linkStyles = `
    w-full flex items-center overflow-hidden whitespace-nowrap
    text-[10px] tracking-widest text-primary-muted-foreground transition-all duration-100
    opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 hover:text-primary-foreground
  `

  return (
    <Link
      to='https://coheteros.com'
      target='_blank'
      title='COHETEROS.COM'
      className={linkStyles}
    >
      COHETEROS @ {new Date().getFullYear()}
    </Link>
  )
}
