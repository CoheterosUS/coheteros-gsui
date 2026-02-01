import { useLocation } from 'react-router'
import { links } from '@/utils/links'
import SidebarLink from '@/components/sidebar/sidebar-link'

export default function Sidebar () {
  const location = useLocation()

  return (
    <div
      className='w-14 flex flex-col items-center justify-between bg-primary'
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
      <img
        src='/logo.png'
        alt='Logo'
        className='w-full h-auto p-3 aspect-square'
      />
    </div>
  )
}
