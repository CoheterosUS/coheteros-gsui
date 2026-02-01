interface TelemetryHeaderProps {
  timestamp: number
  batteryVoltage: number
  temperature: number
}

export default function TelemetryHeader ({
  timestamp,
  batteryVoltage,
  temperature
}: TelemetryHeaderProps) {
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
