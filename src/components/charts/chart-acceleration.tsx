import { colors, options } from '@/utils/charts'
import type { Chart } from 'chart.js'
import { useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'

export default function ChartAcceleration ({
  data
}: ChartComponentProps) {
  const chartRef = useRef<Chart<'line'>>(null)

  const points = {
    labels: data.map(data => data.timestamp.toFixed(2)),
    datasets: [
      {
        label: 'Acceleration X (m/s²)',
        data: data.map(data => data.accelerationX),
        borderColor: colors.accelerationX,
        tension: 0,
        pointRadius: 0
      },
      {
        label: 'Acceleration Y (m/s²)',
        data: data.map(data => data.accelerationY),
        borderColor: colors.accelerationY,
        tension: 0,
        pointRadius: 0
      },
      {
        label: 'Acceleration Z (m/s²)',
        data: data.map(data => data.accelerationZ),
        borderColor: colors.accelerationZ,
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