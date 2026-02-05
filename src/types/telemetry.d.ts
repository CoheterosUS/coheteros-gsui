interface TelemetryTableStructure {
  name: string
  className: string
  fields: TelemetryTableStructureField[]
}

interface TelemetryTableStructureField {
  label: string
  value: (data: WebsocketTelemetryData) => string | number
  unit?: string
  className?: string
}

interface TelemetryTableFieldProps {
  label: string
  value: string | number
  unit?: string
  className?: string
}
