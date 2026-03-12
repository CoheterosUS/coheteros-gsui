import { useEffect, useState } from 'react'
import { useWebsocketAPI } from '@/contexts/WebsocketContext'
import ChartAltitude from '@/components/charts/chart-altitude'
import ChartGyroscope from '@/components/charts/chart-gyroscope'
import ChartAcceleration from '@/components/charts/chart-acceleration'
import ChartVoltageTemperature from '@/components/charts/chart-voltage-temperature'
import Telemetry from '@/components/telemetry/telemetry'
import TelemetryEmpty from '@/components/telemetry/telemetry-empty'

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
      className='h-full flex flex-col overflow-hidden'
    >
      <Telemetry />
      <div
        className='min-h-0 flex-1 grid grid-cols-2 grid-rows-2 gap-4 px-2'
      >
        <ChartAltitude />
        <ChartGyroscope />
        <ChartAcceleration />
        <ChartVoltageTemperature />
      </div>
    </div>
  ) : (
    <TelemetryEmpty />
  )
}
