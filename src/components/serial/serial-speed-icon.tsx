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
    size-3.5
    ${status === 'connected' ? 'text-downlink' : 'text-primary-muted-foreground'}
  `

  return (
    <p
      title='DOWNLINK RATE'
      className='flex items-center gap-1.5 pr-3 text-primary-muted-foreground'
    >
      <ArrowDownToLine
        className={iconStyle}
      />
      <span
        className='text-xs tabular-nums'
      >
        {rate.toFixed(2)}
      </span>
      <span
        className='text-[10px] tracking-widest text-primary-muted-foreground'
      >
        KB/S
      </span>
    </p>
  )
}
