export default function TelemetryTableField ({
  label,
  value,
  unit,
  className = 'text-primary-foreground'
}: TelemetryTableFieldProps) {
  return (
    <div
      className='flex items-baseline justify-between gap-2 text-sm'
    >
      <span
        className='truncate text-primary-muted-foreground'
      >
        {label}
      </span>
      <span
        className={`shrink-0 tabular-nums ${className}`}
      >
        {value}
        {unit && (
          <span
            className='ml-1 text-xs text-primary-muted-foreground'
          >
            {unit}
          </span>
        )}
      </span>
    </div>
  )
}
