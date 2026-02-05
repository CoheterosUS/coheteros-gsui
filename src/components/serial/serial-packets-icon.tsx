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
    h-4 w-4
    ${status === 'connected' ? 'text-downlink' : 'text-primary-muted-foreground'}
  `

  return (
    <p
      title='PACKETS PER SECOND'
      className='flex items-center justify-center gap-1 text-primary-muted-foreground'
    >
      <Activity
        className={iconStyle}
      />
      <span
        className='text-xs'
      >
        {pps.toFixed(0)} PPS
      </span>
    </p>
  )
}
