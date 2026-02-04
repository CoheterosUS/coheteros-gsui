import { BookHeart, ChartLine, GamepadDirectional, MapPin, Terminal } from 'lucide-react'

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
    Icon: GamepadDirectional,
    href: '/controls',
    label: 'CONTROLS'
  },
  {
    Icon: Terminal,
    href: '/logging',
    label: 'LOGGING'
  },
  {
    Icon: BookHeart,
    href: '/about',
    label: 'ABOUT'
  }
]
