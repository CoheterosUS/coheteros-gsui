interface TelemetryTableFieldProps {
  label: string
  value: string | number
}

export default function TelemetryTableField ({
  label,
  value
}: TelemetryTableFieldProps) {
  return (
    <div
      className='flex justify-between px-4 py-2 bg-primary'
    >
      <span
        className='text-primary-muted-foreground'
      >
        {label}:
      </span>
      <span
        className='font-mono'
      >
        {value}
      </span>
    </div>
  )
}
