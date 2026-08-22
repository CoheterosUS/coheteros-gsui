interface TelemetryTableStructure {
  name: string
  className: string
  accentClassName: string
  fields: TelemetryTableStructureField[]
}

interface TelemetryTableStructureField {
  label: string
  value: (data: WebsocketTelemetryData) => string | number
  unit?: string
  className?: string
  getClassName?: (value: string | number) => string
}

interface TelemetryTableFieldProps {
  label: string
  value: string | number
  unit?: string
  className?: string
}

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
}
