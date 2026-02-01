import { getFirstCapitalized } from '@/utils/utils'
import { ArrowBigDown } from 'lucide-react'

interface SerialStatusIconProps {
  direction: 'up' | 'down'
  rate: number
}

export default function SerialStatusIcon ({
  direction,
  rate
}: SerialStatusIconProps) {
  const arrowStyle = `
    h-4
    ${direction === 'down' ? 'text-blue-500' : 'text-green-500 rotate-180'}
  `

  return (
    <div
      title={getFirstCapitalized(`${direction}link`)}
      className='flex items-center justify-center'
    >
      <ArrowBigDown
        fill='currentColor'
        className={arrowStyle}
      />
      <p
        className='text-sm text-primary-foreground'
      >
        {rate.toFixed(2)} KB/s
      </p>
    </div>
  )
}
