import TelemetryTableField from '@/components/telemetry-table/telemetry-table-field'

interface TelemetryTableCellProps {
  name: string
  className: string
  accentClassName: string
  fields: TelemetryTableFieldProps[]
}

export default function TelemetryTableCell ({
  name,
  className,
  accentClassName,
  fields
}: TelemetryTableCellProps) {
  return (
    <div
      className='flex border-2 border-primary'
    >
      <div
        className={`w-1 shrink-0 opacity-70 ${accentClassName}`}
      />
      <div
        className='min-w-0 flex-1 flex flex-col'
      >
        <p
          className={`border-b-2 border-primary bg-primary px-2 py-1 text-xs tracking-widest ${className}`}
        >
          {name}
        </p>
        <div
          className='flex flex-col gap-0.5 px-2 py-1'
        >
          {
            fields.map((field) => (
              <TelemetryTableField
                key={field.label}
                {...field}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}
