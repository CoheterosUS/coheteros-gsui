interface LoggingMessageProps {
  packet: TelemetryPacket
}

export default function LoggingMessage ({
  packet
}: LoggingMessageProps) {
  return (
    <div
      className='flex gap-6 text-primary-muted-foreground whitespace-nowrap'
    >
      <span>
        {packet.timestamp.toFixed(2)}
      </span>
      <span>
        {JSON.stringify(packet)}
      </span>
    </div>
  )
}
