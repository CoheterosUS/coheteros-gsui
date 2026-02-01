import { Line } from 'react-chartjs-2'
import { colors, options } from '@/utils/charts'
import { useEffect, useRef } from 'react'
import type { Chart } from 'chart.js'

export default function ChartAltitude ({
  data
}: ChartComponentProps) {
  const chartRef = useRef<Chart<'line'>>(null)
  
  const points = {
    labels: data.map(data => data.timestamp.toFixed(2)),
    datasets: [
      {
        label: 'Barometric Altitude (m)',
        data: data.map(data => data.altitude),
        borderColor: colors.altitude,
        tension: 0,
        pointRadius: 0
      },
      {
        label: 'GPS Altitude (m)',
        data: data.map(data => data.gpsAltitude),
        borderColor: colors.gpsAltitude,
        tension: 0,
        pointRadius: 0
      }
    ]
  }

  useEffect(() => {
    if (chartRef.current != null) {
      chartRef.current.reset()
    }
  }, [data])

  return (
    <div
      className='w-full'
    >
      <Line
        ref={chartRef}
        data={points}
        options={options}
      />
    </div>
  )
}
