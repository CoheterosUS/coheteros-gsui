import LoggingMessage from '@/components/logging/logging-message'
import { useEffect, useRef } from 'react'

interface LoggingProps {
  data: TelemetryPacket[]
}

export default function Logging ({
  data
}: LoggingProps) {
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }

  }, [data])

  return (
    <div
      className='h-full p-2 overflow-auto'
      ref={listRef}
    >
      <div
        className='flex flex-col gap-1'
      >
        {
          data.map((message, index) => (
            <LoggingMessage
              key={index}
              message={JSON.stringify(message).slice(0, 100) + '...'}
            />
          ))
        }
      </div>
    </div>
  )
}
