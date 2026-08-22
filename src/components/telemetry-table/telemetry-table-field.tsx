export default function TelemetryTableField ({
  label,
  value,
  unit,
  className = 'text-primary-foreground'
}: TelemetryTableFieldProps) {
  // FIRED/SAFE are the only textual values that carry a warning meaning
  const valueClassName = value === 'FIRED'
    ? 'text-negative'
    : className

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
        className={`shrink-0 tabular-nums ${valueClassName}`}
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
