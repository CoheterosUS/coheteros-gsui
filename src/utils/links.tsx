import { BookHeart, ChartLine, MapPin, Settings, Terminal } from 'lucide-react'

export const links = [
  {
    Icon: ChartLine,
    href: '/',
    label: 'DASHBOARD'
  },
  {
    Icon: MapPin,
    href: '/map',
    label: 'MAP'
  },
  {
    Icon: Terminal,
    href: '/logging',
    label: 'LOGGING'
  },
  {
    Icon: Settings,
    href: '/settings',
    label: 'SETTINGS'
  },
  {
    Icon: BookHeart,
    href: '/about',
    label: 'ABOUT'
  }
]
