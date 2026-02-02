import { useWebsocketContext } from '@/components/contexts/WebsocketContext'
import Sidebar from '@/components/sidebar/sidebar'
import ChartAltitude from '@/components/charts/chart-altitude'
import ChartGyroscope from '@/components/charts/chart-gyroscope'
import ChartAcceleration from '@/components/charts/chart-acceleration'
import ChartVoltageTemperature from '@/components/charts/chart-voltage-temperature'
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
  const { data, status, downlink, pps } = useWebsocketContext()

  return (
    <div
      className='w-full h-screen flex bg-background'
    >
      <Sidebar />
      <div
        className='w-full h-full flex flex-col'
      >
        {
          data.length > 0 ? (
            <>
              <div
                className='h-fit'
              >
                <Telemetry
                  data={data[data.length - 1]}
                />
              </div>
              <div
                className='h-full grid grid-cols-2 grid-rows-2 gap-4 px-2 pb-6'
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
            </>
          ) : (
            <div
              className='h-full flex items-center justify-center text-primary-foreground'
            >
              NO TELEMETRY DATA RECEIVED YET
            </div>
          )
        }
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
