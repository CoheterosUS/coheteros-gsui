import { useEffect, useMemo, useRef } from 'react'
import type { Chart } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useWebsocketAPI } from '@/contexts/WebsocketContext'
import { colors, options } from '@/utils/charts'
import { MAX_DATA_POINTS } from '@/utils/config'

export default function ChartAltitude () {
  const { subscribe } = useWebsocketAPI()
  const chartRef = useRef<Chart<'line'>>(null)
  
  const initialData = useMemo(() => ({
    labels: [],
    datasets: [
      {
        label: 'Altitude (m)',
        data: [],
        borderColor: colors.altitude,
        tension: 0,
        pointRadius: 0
      }
    ]
  }), [])

  useEffect(() => {
    const unsubscribe = subscribe('TELEMETRY_PACKET', (packet) => {
      const chart = chartRef.current
      if (chart == null) {
        return
      }

      const timestamp = packet.timestamp.toFixed(2)
      chart.data.labels?.push(timestamp)

      chart.data.datasets[0].data.push(packet.altitude)

      if (chart.data.labels != null && chart.data.labels.length > MAX_DATA_POINTS) {
        chart.data.labels.shift()
        chart.data.datasets[0].data.shift()
      }

      chart.update('none')
    })

    return () => {
      unsubscribe()
    }
  }, [subscribe])

  return (
    <div
      className='w-full h-full min-h-0 min-w-0'
    >
      <Line
        ref={chartRef}
        data={initialData}
        options={options}
      />
    </div>
  )
}
