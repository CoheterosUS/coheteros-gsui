import { Activity } from 'lucide-react'

interface SerialPacketsIconProps {
  pps: number
}

export default function SerialPacketsIcon ({
  pps
}: SerialPacketsIconProps) {
  return (
    <p
      title='PACKETS PER SECOND'
      className='flex items-center justify-center gap-1 text-primary-muted-foreground'
    >
      <Activity
        className='h-4 w-4'
      />
      <span
        className='text-xs'
      >
        {pps.toFixed(0)} PPS
      </span>
    </p>
  )
}
