interface TelemetryTableHeaderProps {
  batteryVoltage: number
  temperature: number
  timestamp: number
}

export default function TelemetryTableHeader ({
  timestamp,
  batteryVoltage,
  temperature
}: TelemetryTableHeaderProps) {
  return (
    <div
      className='flex justify-between text-sm'
    >
      <p>
        TIME: {new Date().toLocaleTimeString()}
      </p>
      <p
        className='text-battery'
      >
        BATTERY: {batteryVoltage.toFixed(2)} V
      </p>
      <p
        className='text-temperature'
      >
        TEMPERATURE: {temperature.toFixed(2)} °C
      </p>
      <p>
        TIMESTAMP: {timestamp.toFixed(2)}
      </p>
    </div>
  )
}
