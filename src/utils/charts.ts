import type { StyleSpecification } from 'maplibre-gl'

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
    x: {
      grid: {
        display: false
      },
      border: {
        color: 'rgba(255, 255, 255, 0.15)'
      },
      ticks: {
        color: 'rgba(204, 204, 204, 0.7)',
        maxTicksLimit: 6,
        maxRotation: 0,
        autoSkip: true,
        font: {
          family: `'suse', monospace`,
          size: 10
        }
      }
    },
    y: {
      grid: {
        drawTicks: true,
        drawOnChartArea: true,
        color: 'rgba(255, 255, 255, 0.06)'
      },
      border: {
        color: 'rgba(255, 255, 255, 0.15)',
        dash: [4, 4]
      },
      ticks: {
        color: 'rgba(204, 204, 204, 0.7)',
        maxTicksLimit: 6,
        font: {
          family: `'suse', monospace`,
          size: 10
        }
      }
    }
  },
  layout: {
    padding: {
      top: 4,
      right: 8
    }
  },
  elements: {
    line: {
      borderWidth: 1.5
    }
  },
  plugins: {
    tooltip: {
      enabled: false
    },
    legend: {
      align: 'end' as const,
      labels: {
        boxWidth: 10,
        boxHeight: 2,
        padding: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          family: `'suse', monospace`,
          size: 11
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
  accelerationZ: 'rgba(255, 206, 86, 1)'
}

// Esri World Imagery needs no API key, only attribution
export const satelliteStyle: StyleSpecification = {
  version: 8,
  // raster imagery ships no glyphs, without these the label layer draws nothing
  sources: {
    'esri-imagery': {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      maxzoom: 19,
      attribution: 'Imagery © Esri, Maxar, Earthstar Geographics'
    }
  },
  layers: [
    {
      id: 'esri-imagery',
      type: 'raster',
      source: 'esri-imagery'
    }
  ]
}

export const streetStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

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
    'text-field': 'GROUND STATION',
    // bold caps over noisy satellite imagery, both basemaps serve this font
    'text-font': ['Open Sans Bold'],
    'text-max-width': 20,
    'text-size': 14,
    'text-letter-spacing': 0.08,
    'text-offset': [0, -2],
    'text-anchor': 'top',
    'text-allow-overlap': true,
    'text-ignore-placement': true,
    'text-optional': true
  },
  paint: {
    'text-color': '#fff',
    'text-halo-color': '#000',
    'text-halo-width': 2
  }
}

export const groundLinkCasingLayer = {
  id: 'ground-link-casing',
  type: 'line',
  source: 'ground-link',
  layout: {
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#000',
    'line-width': 6,
    'line-opacity': 0.8
  }
}

export const groundLinkLayer = {
  id: 'ground-link-line',
  type: 'line',
  source: 'ground-link',
  layout: {
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#f00',
    'line-width': 3,
    'line-dasharray': [2, 2]
  }
}

export const groundLinkLabelLayer = {
  id: 'ground-link-label',
  type: 'symbol',
  source: 'ground-link',
  layout: {
    'text-field': ['get', 'distance'],
    'symbol-placement': 'line-center',
    'text-pitch-alignment': 'viewport',
    'text-font': ['Open Sans Bold'],
    'text-size': 12,
    'text-letter-spacing': 0.08,
    'text-allow-overlap': true,
    'text-ignore-placement': true,
    'text-optional': true
  },
  paint: {
    'text-color': '#fff',
    'text-halo-color': '#000',
    'text-halo-width': 2
  }
}
