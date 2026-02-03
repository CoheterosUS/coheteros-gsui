import { useEffect, useRef } from 'react'
import LoggingMessage from '@/components/logging/logging-message'

interface LoggingProps {
  data: TelemetryData[]
}

export default function Logging ({
  data
}: LoggingProps) {
  const loggingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loggingRef.current == null) {
      return
    }

    loggingRef.current.scrollTop = loggingRef.current.scrollHeight
  }, [])

  return (
    <div
      ref={loggingRef}
      className='h-full flex flex-col gap-4 p-4 bg-background overflow-y-auto'
    >
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
