import { useEffect, useState } from 'react'
import { useWebsocketAPI } from '@/contexts/WebsocketContext'
import ChartAltitude from '@/components/charts/chart-altitude'
import ChartGyroscope from '@/components/charts/chart-gyroscope'
import ChartAcceleration from '@/components/charts/chart-acceleration'
import Telemetry from '@/components/telemetry/telemetry'
import TelemetryEmpty from '@/components/telemetry/telemetry-empty'
import Panel from '@/components/ui/panel'
import MapPanel from '@/components/map/map-panel'

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend
)

export default function DashboardPage () {
  const { subscribe } = useWebsocketAPI()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribe('TELEMETRY_PACKET', () => setLoaded((prev) => prev ? prev : true))
    return () => unsubscribe()
  }, [subscribe])

  return loaded ? (
    <div
      className='min-h-full flex'
    >
      <div
        className='min-w-0 flex-1 flex flex-col'
      >
        <Telemetry />
        <div
          className='min-h-0 flex-1 grid grid-cols-2 grid-rows-[repeat(2,minmax(12rem,1fr))] gap-2 px-2 pb-2'
        >
          <Panel
            title='ALTITUDE'
            accentClassName='text-altitude'
            contentClassName='p-2'
            className='col-span-2'
          >
            <ChartAltitude />
          </Panel>
          <Panel
            title='GYROSCOPE'
            accentClassName='text-gyroscope'
            contentClassName='p-2'
          >
            <ChartGyroscope />
          </Panel>
          <Panel
            title='ACCELERATION'
            accentClassName='text-acceleration'
            contentClassName='p-2'
          >
            <ChartAcceleration />
          </Panel>
        </div>
      </div>
      <div
        className='sticky top-0 self-start h-[calc(100vh_-_1.75rem_-_2px)] w-[28rem] shrink-0 py-2 pr-2'
      >
        <MapPanel />
      </div>
    </div>
  ) : (
    <TelemetryEmpty />
  )
}
