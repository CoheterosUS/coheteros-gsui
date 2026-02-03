export const options = {
  // responsive: false,
  maintainAspectRatio: false,
  animation: false,
  normalized: true,
  hover: {
    mode: null
  },
  scales: {
    y: {
      grid: {
        drawTicks: true,
        drawOnChartArea: true,
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  plugins: {
    tooltip: {
      enabled: false
    },
    legend: {
      labels: {
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          family: `'suse', monospace`
        }
      }
    }
  },
  events: []
}

export const colors = {
  altitude: 'rgba(255, 53, 53, 1)',
  gpsAltitude: 'rgba(0, 153, 255, 1)',
  gyroscopeX: 'rgba(255, 99, 132, 1)',
  gyroscopeY: 'rgba(54, 162, 235, 1)',
  gyroscopeZ: 'rgba(255, 206, 86, 1)',
  accelerationX: 'rgba(255, 99, 132, 1)',
  accelerationY: 'rgba(54, 162, 235, 1)',
  accelerationZ: 'rgba(255, 206, 86, 1)',
  batteryVoltage: 'rgba(255, 215, 0, 1)',
  temperature: 'rgba(255, 112, 67, 1)'
}
