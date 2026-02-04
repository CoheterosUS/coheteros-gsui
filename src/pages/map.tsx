import GPSMap from '@/components/map/gpsmap'
import TelemetryEmpty from '@/components/telemetry/telemetry-empty'
import { useWebsocketContext } from '@/contexts/WebsocketContext'

export default function MapPage () {
  const { data } = useWebsocketContext()

  return data.length > 0 ? (
    <div
      className='h-full flex flex-col justify-center items-center gap-6'
    >
      <GPSMap
        gpsLatitude={data[data.length - 1].gpsLatitude}
        gpsLongitude={data[data.length - 1].gpsLongitude}
        gpsAltitude={data[data.length - 1].gpsAltitude}
      />
    </div>
  ) : (
    <TelemetryEmpty />
  )
}
