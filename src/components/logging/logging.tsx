import LoggingMessage from '@/components/logging/logging-message'

interface LoggingProps {
  data: TelemetryData[]
}

export default function Logging ({
  data
}: LoggingProps) {
  return (
    <div
      className='flex flex-col gap-4 p-4 bg-background'
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
