import Panel from '@/components/ui/panel'
import { getDistanceLabel } from '@/utils/utils'

interface MapHudProps {
  latitude: number
  longitude: number
  gpsAltitude: number
  barometricAltitude: number
  barometricVelocity: number
  satellites: number
  groundDistance: number | null
}

interface MapHudRowProps {
  label: string
  value: string
  unit?: string
  className?: string
}

function MapHudRow ({
  label,
  value,
  unit,
  className = 'text-primary-foreground'
}: MapHudRowProps) {
  return (
    <div
      className='flex items-baseline justify-between gap-4 text-sm'
    >
      <span
        className='text-primary-muted-foreground'
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${className}`}
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

export default function MapHud ({
  latitude,
  longitude,
  gpsAltitude,
  barometricAltitude,
  barometricVelocity,
  satellites,
  groundDistance
}: MapHudProps) {
  const satellitesClassName = satellites < 4
    ? 'text-negative'
    : satellites < 7
      ? 'text-warning'
      : 'text-positive'

  return (
    <Panel
      title='VEHICLE'
      accentClassName='text-position'
      className='w-full bg-background/95'
      contentClassName='flex flex-col gap-1 px-3 py-2'
    >
      <MapHudRow
        label='LATITUDE'
        value={(latitude / 1e7).toFixed(6)}
        unit='°'
      />
      <MapHudRow
        label='LONGITUDE'
        value={(longitude / 1e7).toFixed(6)}
        unit='°'
      />
      <MapHudRow
        label='BAROMETRIC ALTITUDE (AGL)'
        value={barometricAltitude.toFixed(1)}
        unit='m'
        className='text-altitude'
      />
      <MapHudRow
        label='GPS ALTITUDE (ASL)'
        value={gpsAltitude.toFixed(1)}
        unit='m'
        className='text-altitude'
      />
      <MapHudRow
        label='BAROMETRIC VELOCITY'
        value={barometricVelocity.toFixed(1)}
        unit='m/s'
      />
      <MapHudRow
        label='SATELLITES'
        value={String(satellites)}
        className={satellitesClassName}
      />
      {
        groundDistance != null && (
          <MapHudRow
            label='GROUND DISTANCE'
            {...getDistanceLabel(groundDistance)}
            className='text-downlink'
          />
        )
      }
    </Panel>
  )
}
