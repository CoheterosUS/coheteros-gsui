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
  gpsAltitude: 'rgba(147, 112, 219, 1)',
  gyroscopeX: 'rgba(255, 99, 132, 1)',
  gyroscopeY: 'rgba(54, 162, 235, 1)',
  gyroscopeZ: 'rgba(255, 206, 86, 1)',
  accelerationX: 'rgba(255, 99, 132, 1)',
  accelerationY: 'rgba(54, 162, 235, 1)',
  accelerationZ: 'rgba(255, 206, 86, 1)',
  pressure: 'rgba(255, 215, 0, 1)',
  temperature: 'rgba(255, 112, 67, 1)'
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
    'text-field': [
      'concat',
      'BARO ', ['to-string', ['get', 'barometricAltitude']], ' m AGL\n',
      'GPS ', ['to-string', ['get', 'gpsAltitude']], ' m ASL'
    ],
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

export const groundStationLayer = {
  id: 'ground-station-point',
  type: 'circle',
  source: 'ground-station',
  paint: {
    'circle-radius': 7,
    'circle-color': '#60a5fa',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#000'
  }
}

export const groundStationLabelLayer = {
  id: 'ground-station-label',
  type: 'symbol',
  source: 'ground-station',
  layout: {
    'text-field': 'Ground Station',
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
