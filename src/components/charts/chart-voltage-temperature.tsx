import { useEffect, useMemo, useRef } from 'react'
import type { Chart } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useWebsocketAPI } from '@/contexts/WebsocketContext'
import { colors, options } from '@/utils/charts'
import { MAX_DATA_POINTS } from '@/utils/config'

export default function ChartVoltageTemperature () {
  const { subscribe } = useWebsocketAPI()
  const voltageRef = useRef<Chart<'line'>>(null)
  const temperatureRef = useRef<Chart<'line'>>(null)

  const voltageInitialData = useMemo(() => ({
    labels: [],
    datasets: [
      {
        label: 'Battery Voltage (V)',
        data: [],
        borderColor: colors.batteryVoltage,
        tension: 0,
        pointRadius: 0
      }
    ]
  }), [])

  const temperatureInitialData = useMemo(() => ({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: colors.temperature,
        tension: 0,
        pointRadius: 0
      }
    ]
  }), [])

  useEffect(() => {
    const unsubscribe = subscribe((packet) => {
      const voltageChart = voltageRef.current
      const temperatureChart = temperatureRef.current

      const timestamp = packet.timestamp.toFixed(2)
      if (voltageChart != null) {
        voltageChart.data.labels?.push(timestamp)
        voltageChart.data.datasets[0].data.push(packet.batteryVoltage)

        if (voltageChart.data.labels != null && voltageChart.data.labels.length > MAX_DATA_POINTS) {
          voltageChart.data.labels.shift()
          voltageChart.data.datasets[0].data.shift()
        }

        voltageChart.update('none')
      }

      if (temperatureChart != null) {
        temperatureChart.data.labels?.push(timestamp)
        temperatureChart.data.datasets[0].data.push(packet.temperature)

        if (temperatureChart.data.labels != null && temperatureChart.data.labels.length > MAX_DATA_POINTS) {
          temperatureChart.data.labels.shift()
          temperatureChart.data.datasets[0].data.shift()
        }

        temperatureChart.update('none')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [subscribe])

  return (
    <div
      className='w-full h-full min-h-0 min-w-0 flex gap-2'
    >
      <div
        className='flex-1 min-w-0'
      >
        <Line
          ref={voltageRef}
          data={voltageInitialData}
          options={options}
        />
      </div>
      <div
        className='flex-1 min-w-0'
      >
        <Line
          ref={temperatureRef}
          data={temperatureInitialData}
          options={options}
        />
      </div>
    </div>
  )
}
