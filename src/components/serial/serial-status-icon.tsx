import { ArrowBigDown } from 'lucide-react'

interface SerialStatusIconProps {
  rate: number
}

export default function SerialStatusIcon ({
  rate
}: SerialStatusIconProps) {
  return (
    <p
      className='flex items-center justify-center gap-1 text-primary-muted-foreground'
    >
      <ArrowBigDown
        fill='currentColor'
        className='h-4 w-4 text-downlink'
      />
      <span
        className='text-xs'
      >
        {rate.toFixed(2)} KB/s
      </span>
    </p>
  )
}
