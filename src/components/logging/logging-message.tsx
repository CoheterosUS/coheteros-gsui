interface LoggingMessageProps {
  data: WebsocketTelemetryData
}

export default function LoggingMessage ({
  data
}: LoggingMessageProps) {
  return (
    <div
      className='flex gap-6 text-primary-muted-foreground'
    >
      <span>
        {data.timestamp.toFixed(2)}s
      </span>
      <span>
        {JSON.stringify(data)}
      </span>
    </div>
  )
}
