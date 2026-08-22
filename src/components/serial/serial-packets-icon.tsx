import { Activity } from 'lucide-react'

interface SerialPacketsIconProps {
  status: WebsocketStatus
  pps: number
}

export default function SerialPacketsIcon ({
  status,
  pps
}: SerialPacketsIconProps) {
  const iconStyle = `
    size-3.5
    ${status === 'connected' ? 'text-downlink' : 'text-primary-muted-foreground'}
  `

  return (
    <p
      title='PACKETS PER SECOND'
      className='flex items-center gap-1.5 px-3 text-primary-muted-foreground'
    >
      <Activity
        className={iconStyle}
      />
      <span
        className='text-xs tabular-nums'
      >
        {pps.toFixed(0)}
      </span>
      <span
        className='text-[10px] tracking-widest text-primary-muted-foreground'
      >
        PPS
      </span>
    </p>
  )
}
