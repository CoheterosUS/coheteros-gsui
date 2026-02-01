export default function TelemetryTableField ({
  label,
  value,
  unit,
  className
}: TelemetryTableFieldProps) {
  return (
    <div
      className='flex justify-between'
    >
      <span>
        {label}:
      </span>
      <span
        className={className}
      >
        {value} {unit}
      </span>
    </div>
  )
}
