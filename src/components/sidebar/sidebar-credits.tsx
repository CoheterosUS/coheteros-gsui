import { Link } from 'react-router'

export default function SidebarCredits () {
  const labelStyles = `
    w-full flex items-center justify-between text-xs text-primary-muted-foreground whitespace-nowrap overflow-hidden transition
    opacity-0 group-hover:opacity-100 group-hover:translate-x-0
  `

  return (
    <Link
      to='https://coheteros.com'
      target='_blank'
      className={labelStyles}
    >
      COHETEROS @ {new Date().getFullYear()}
      <img
        src='/logo.png'
        alt='Coheteros Logo'
        className='h-8'
      />
    </Link>
  )
}
