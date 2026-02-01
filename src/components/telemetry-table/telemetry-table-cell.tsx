import TelemetryTableField from '@/components/telemetry-table/telemetry-table-field'

interface TelemetryTableCellProps {
  name: string
  className: string
  fields: TelemetryTableFieldProps[]
}

export default function TelemetryTableCell ({
  name,
  className,
  fields
}: TelemetryTableCellProps) {
  return (
    <div
      className='border-2 border-primary px-2 py-1'
    >
      <p
        className={className}
      >
        {name}
      </p>
      {
        fields.map((field) => (
          <TelemetryTableField
            key={field.label}
            {...field}
          />
        ))
      }
    </div>
  )
}
