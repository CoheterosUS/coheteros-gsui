interface TelemetryHeaderProps {
  sync: number
  tick: number
  pressurePa: number
  temperatureC: number
  batteryVoltage: number
}

export default function TelemetryHeader ({
  sync,
  tick,
  pressurePa,
  temperatureC,
  batteryVoltage
}: TelemetryHeaderProps) {
  const syncLabel = `0x${sync.toString(16).toUpperCase().padStart(4, '0')}`

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
        BATTERY: {batteryVoltage.toFixed(2)} V
      </p>
      <p>
        SYNC: {syncLabel}
      </p>
      <p
        className='text-temperature'
      >
        PRESSURE: {pressurePa.toFixed(0)} Pa
      </p>
      <p
        className='text-temperature'
      >
        TEMPERATURE: {temperatureC.toFixed(2)} °C
      </p>
      <p>
        TICK: {tick}
      </p>
    </div>
  )
}
