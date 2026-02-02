import { Link, useLocation } from 'react-router'
import { links } from '@/utils/links'
import SidebarLink from '@/components/sidebar/sidebar-link'

export default function Sidebar () {
  const location = useLocation()

  return (
    <div
      className='min-w-14 w-14 h-full flex flex-col items-center justify-between bg-primary pb-6'
    >
      <div
        className='w-full flex flex-col items-center'
      >
        {
          links.map((link, index) => (
            <SidebarLink
              key={index}
              {...link}
              selected={location.pathname === link.href}
            />
          ))
        }
      </div>
      <Link
        to='https://coheteros.com'
        target='_blank'
      >
        <img
          src='/logo.png'
          alt='Logo'
          className='w-full h-auto p-3 aspect-square'
        />
      </Link>
    </div>
  )
}
