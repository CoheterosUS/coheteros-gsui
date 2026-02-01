import { colors, options } from '@/utils/charts'
import { getPaddedMinMax, paddings } from '@/utils/utils'
import { Chart } from 'chart.js'
import { useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'

export default function ChartGyroscope ({
  data
}: ChartComponentProps) {
  const chartRef = useRef<Chart<'line'>>(null)

  const points = {
    labels: data.map(data => data.timestamp.toFixed(2)),
    datasets: [
      {
        label: 'Gyroscope X (°/s)',
        data: data.map(data => data.gyroscopeX),
        borderColor: colors.gyroscopeX,
        tension: 0,
        pointRadius: 0
      },
      {
        label: 'Gyroscope Y (°/s)',
        data: data.map(data => data.gyroscopeY),
        borderColor: colors.gyroscopeY,
        tension: 0,
        pointRadius: 0
      },
      {
        label: 'Gyroscope Z (°/s)',
        data: data.map(data => data.gyroscopeZ),
        borderColor: colors.gyroscopeZ,
        tension: 0,
        pointRadius: 0
      }
    ]
  }

  const { min, max } = getPaddedMinMax(
    data,
    ['gyroscopeX', 'gyroscopeY', 'gyroscopeZ'],
    paddings.gyroscope
  )

  const gyroscopeCustom = {
    ...options,
    scales: {
      y: {
        ...options.scales.y,
        min,
        max
      }
    }
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
        options={gyroscopeCustom}
      />
    </div>
  )
}
