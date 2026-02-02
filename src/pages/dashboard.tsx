import { useWebsocketContext } from '@/components/contexts/WebsocketContext'
import ChartAltitude from '@/components/charts/chart-altitude'
import ChartGyroscope from '@/components/charts/chart-gyroscope'
import ChartAcceleration from '@/components/charts/chart-acceleration'
import ChartVoltageTemperature from '@/components/charts/chart-voltage-temperature'
import Telemetry from '@/components/telemetry/telemetry'

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
  const { data } = useWebsocketContext()

  return data.length > 0 ? (
    <div
      className='h-full flex flex-col'
    >
      <Telemetry
        data={data[data.length - 1]}
      />
      <div
        className='flex-1 grid grid-cols-2 grid-rows-2 gap-4 px-2'
      >
        <ChartAltitude
          data={data}
        />
        <ChartGyroscope
          data={data}
        />
        <ChartAcceleration
          data={data}
        />
        <ChartVoltageTemperature
          data={data}
        />
      </div>
    </div>
  ) : (
    <div
      className='h-full flex items-center justify-center text-primary-foreground'
    >
      NO TELEMETRY DATA RECEIVED YET
    </div>
  )
}
