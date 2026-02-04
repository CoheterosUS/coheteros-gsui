export const options = {
  // responsive: false,
  maintainAspectRatio: false,
  animation: {
    duration: 0
  },
  normalized: true,
  hover: {
    mode: undefined
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

export const initialViewport = {
  longitude: 0,
  latitude: 0,
  zoom: 16,
  pitch: 60,
  bearing: 0
}

export const pointLayer = {
  id: 'point-layer',
  type: 'circle',
  source: 'gps',
  paint: {
    'circle-radius': 6,
    'circle-color': '#f00',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#000'
  }
}

export const labelLayer = {
  id: 'gps-label',
  type: 'symbol',
  source: 'gps',
  layout: {
    'text-field': ['concat', ['to-string', ['get', 'altitude']], ' m'],
    'text-size': 16,
    'text-offset': [0, -2],
    'text-anchor': 'top',
    'text-allow-overlap': true,
    'text-ignore-placement': true,
    'text-optional': true
  },
  paint: {
    'text-color': '#000',
  }
}
