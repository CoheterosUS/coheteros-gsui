import { useEffect, useState } from 'react'
import { getStateName, getStateStyle } from '@/utils/utils'

interface TelemetryHeaderProps {
  sync: number
  tick: number
  state: number
  pressurePa: number
  temperatureC: number
  batteryVoltage: number
}

interface TelemetryHeaderItemProps {
  label: string
  value: string
  unit?: string
  className?: string
}

function TelemetryHeaderItem ({
  label,
  value,
  unit,
  className = 'text-primary-foreground'
}: TelemetryHeaderItemProps) {
  return (
    <div
      className='flex items-baseline gap-2 border-l-2 border-primary pl-2'
    >
      <span
        className='text-xs tracking-widest text-primary-muted-foreground'
      >
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${className}`}
      >
        {value}
        {unit && (
          <span
            className='ml-1 text-xs text-primary-muted-foreground'
          >
            {unit}
          </span>
        )}
      </span>
    </div>
  )
}

export default function TelemetryHeader ({
  sync,
  tick,
  state,
  pressurePa,
  temperatureC,
  batteryVoltage
}: TelemetryHeaderProps) {
  const [clock, setClock] = useState(() => new Date().toLocaleTimeString())

  // the clock is wall time, it must keep ticking between telemetry packets
  useEffect(() => {
    const interval = setInterval(() => setClock(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(interval)
  }, [])

  const syncLabel = `0x${sync.toString(16).toUpperCase().padStart(4, '0')}`
  const batteryClassName = batteryVoltage < 7 ? 'text-negative' : 'text-battery'

  return (
    <div
      className='flex flex-wrap items-center gap-x-4 gap-y-2 border-2 border-primary bg-primary/40 px-3 py-2'
    >
      <div
        className={`border-2 border-dashed px-3 py-1 text-sm tracking-widest ${getStateStyle(state)}`}
      >
        {getStateName(state)}
      </div>
      <div
        className='flex flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2'
      >
        <TelemetryHeaderItem
          label='LOCAL'
          value={clock}
        />
        <TelemetryHeaderItem
          label='TICK'
          value={tick.toString()}
        />
        <TelemetryHeaderItem
          label='SYNC'
          value={syncLabel}
        />
        <TelemetryHeaderItem
          label='BATTERY'
          value={batteryVoltage.toFixed(2)}
          unit='V'
          className={batteryClassName}
        />
        <TelemetryHeaderItem
          label='PRESSURE'
          value={pressurePa.toFixed(0)}
          unit='Pa'
        />
        <TelemetryHeaderItem
          label='TEMPERATURE'
          value={temperatureC.toFixed(2)}
          unit='°C'
          className='text-temperature'
        />
      </div>
    </div>
  )
}
