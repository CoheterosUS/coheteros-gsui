import Sidebar from '@/components/sidebar/sidebar'
import ChartAltitude from '@/components/charts/chart-altitude'
import ChartGyroscope from '@/components/charts/chart-gyroscope'
import ChartAcceleration from '@/components/charts/chart-acceleration'
import ChartVoltageTemperature from '@/components/charts/chart-voltage-temperature'
import { useWebsocket } from '@/hooks/useWebsocket'
import SerialStatus from '@/components/serial/serial-status'
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
  const { data, status, downlink, pps } = useWebsocket()

  return (
    <div
      className='h-screen flex bg-background'
    >
      <Sidebar />
      <div
        className='h-full flex flex-col'
      >
        <div
          className='h-1/3'
        >
          {
            data.length > 0 && (
              <Telemetry
                data={data[data.length - 1]}
              />
            )
          }
        </div>
        <div
          className='h-2/3 grid grid-cols-2 grid-rows-2 gap-4 p-4'
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
        <SerialStatus
          status={status}
          downlink={downlink}
          uplink={0}
          pps={pps}
        />
      </div>
    </div>
  )
}
