import { colors, options } from '@/utils/charts'
import { getPaddedMinMax, paddings } from '@/utils/utils'
import type { Chart } from 'chart.js'
import { useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'

export default function ChartVoltageTemperature ({
  data
}: ChartComponentProps) {
  const voltageRef = useRef<Chart<'line'>>(null)
  const temperatureRef = useRef<Chart<'line'>>(null)

  const voltage = {
    labels: data.map(data => data.timestamp.toFixed(2)),
    datasets: [
      {
        label: 'Battery Voltage (V)',
        data: data.map(data => data.batteryVoltage),
        borderColor: colors.batteryVoltage,
        tension: 0,
        pointRadius: 0
      }
    ]
  }

  const temperature = {
    labels: data.map(data => data.timestamp.toFixed(2)),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.map(data => data.temperature),
        borderColor: colors.temperature,
        tension: 0,
        pointRadius: 0
      }
    ]
  }

  const { min: voltageMin, max: voltageMax } = getPaddedMinMax(
    data,
    ['batteryVoltage'],
    paddings.voltage
  )

  const { min: tempMin, max: tempMax } = getPaddedMinMax(
    data,
    ['temperature'],
    paddings.temperature
  )

  const voltageCustom = {
    ...options,
    scales: {
      y: {
        ...options.scales.y,
        min: voltageMin,
        max: voltageMax
      }
    }
  }

  const temperatureCustom = {
    ...options,
    scales: {
      y: {
        ...options.scales.y,
        min: tempMin,
        max: tempMax
      }
    }
  }

  useEffect(() => {
    if (voltageRef.current != null) {
      voltageRef.current.reset()
    }

    if (temperatureRef.current != null) {
      temperatureRef.current.reset()
    }
  }, [data])

  return (
    <div
      className='w-1/2 flex gap-2'
    >
      <Line
        ref={voltageRef}
        data={voltage}
        options={voltageCustom}
      />
      <Line
        ref={temperatureRef}
        data={temperature}
        options={temperatureCustom}
      />
    </div>
  )
}
