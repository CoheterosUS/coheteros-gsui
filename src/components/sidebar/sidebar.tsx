import { useLocation } from 'react-router'
import { links } from '@/utils/links'
import SidebarLink from '@/components/sidebar/sidebar-link'
import SidebarCredits from '@/components/sidebar/sidebar-credits'

export default function Sidebar () {
  const location = useLocation()

  const sidebarStyle = `
    min-w-14 group h-full flex flex-col justify-between bg-primary transition-all duration-100
    w-14 hover:w-56
  `

  return (
    <div
      className={sidebarStyle}
    >
      <div
        className='w-full flex flex-col'
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
      <div
        className='h-14 flex px-4'
      >
        <SidebarCredits />
      </div>
    </div>
  )
}
