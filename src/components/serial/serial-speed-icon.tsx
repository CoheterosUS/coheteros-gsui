import { ArrowDownToLine } from 'lucide-react'

interface SerialSpeedIconProps {
  status: WebsocketStatus
  rate: number
}

export default function SerialSpeedIcon ({
  status,
  rate
}: SerialSpeedIconProps) {
  const iconStyle = `
    h-4 w-4
    ${status === 'connected' ? 'text-downlink' : 'text-primary-muted-foreground'}
  `

  return (
    <p
      className='flex items-center justify-center gap-1 text-primary-muted-foreground'
    >
      <ArrowDownToLine
        className={iconStyle}
      />
      <span
        className='text-xs'
      >
        {rate.toFixed(2)} KB/s
      </span>
    </p>
  )
}
