interface LoggingMessageProps {
  message: string
}

export default function LoggingMessage ({
  message
}: LoggingMessageProps) {
  return (
    <p
      className='text-primary-foreground'
    >
      {message}
    </p>
  )
}
