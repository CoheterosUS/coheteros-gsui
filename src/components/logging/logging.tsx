import { useEffect, useRef } from 'react'
import LoggingMessage from '@/components/logging/logging-message'

interface LoggingProps {
  data: WebsocketTelemetryData[]
  autoScroll?: boolean
}

export default function Logging ({
  data,
  autoScroll = true
}: LoggingProps) {
  const loggingRef = useRef<HTMLDivElement>(null)

  // follow the tail of the log unless the operator pinned the view
  useEffect(() => {
    if (loggingRef.current == null || !autoScroll) {
      return
    }

    loggingRef.current.scrollTop = loggingRef.current.scrollHeight
  }, [data, autoScroll])

  return (
    <div
      ref={loggingRef}
      className='h-full overflow-y-auto'
    >
      <div
        className='sticky top-0 z-10 flex items-baseline gap-3 border-b-2 border-primary bg-primary px-3 py-1 text-[10px] tracking-widest text-primary-muted-foreground'
      >
        <span
          className='w-24 shrink-0'
        >
          TIME
        </span>
        <span
          className='w-20 shrink-0'
        >
          TICK
        </span>
        <span
          className='w-32 shrink-0'
        >
          STATE
        </span>
        <span
          className='min-w-0 flex-1'
        >
          PACKET
        </span>
      </div>
      {
        data.map((single, index) => (
          <LoggingMessage
            key={index}
            data={single}
          />
        ))
      }
    </div>
  )
}
