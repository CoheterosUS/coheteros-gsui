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
    h-4 w-4
    ${direction === 'down' ? 'text-downlink' : 'text-uplink rotate-180'}
  `

  return (
    <p
      title={`${direction.toUpperCase()}LINK`}
      className='flex items-center justify-center gap-1 text-primary-muted-foreground'
    >
      <ArrowBigDown
        fill='currentColor'
        className={arrowStyle}
      />
      <span
        className='text-xs'
      >
        {rate.toFixed(2)} KB/s
      </span>
    </p>
  )
}
