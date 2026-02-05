type ToastCategory = 'INFO' | 'SUCCESS' | 'ERROR'

interface ChartComponentProps {
  data: WebsocketTelemetryData[]
}

interface ControlsResponse {
  ports: {
    port_in_use?: SerialPort
    available_ports: SerialPort[]
  }
  fake_telemetry_enabled: boolean
  csv_recording_enabled: boolean
}

interface SerialPort {
  name: string
  description?: string
  baudrate: string
}
