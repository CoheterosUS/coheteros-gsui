interface TelemetryHeaderProps {
  timestamp: number
  pressure: number
  temperature: number
}

export default function TelemetryHeader ({
  timestamp,
  pressure,
  temperature
}: TelemetryHeaderProps) {
  return (
    <div
      className='flex justify-between text-sm'
    >
      <p>
        LOCAL TIME: {new Date().toLocaleTimeString()}
      </p>
      <p
        className='text-battery'
      >
        PRESSURE: {pressure.toFixed(0)} Pa
      </p>
      <p
        className='text-temperature'
      >
        TEMPERATURE: {temperature.toFixed(2)} °C
      </p>
      <p>
        TIMESTAMP: {timestamp.toFixed(2)} s
      </p>
    </div>
  )
}
