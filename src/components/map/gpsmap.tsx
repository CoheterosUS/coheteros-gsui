import { useEffect, useMemo, useRef, useState } from 'react'
import Map, { type MapRef, Source, Layer } from 'react-map-gl/maplibre'
import type { FeatureCollection } from 'geojson'
import { useWebsocketAPI } from '@/contexts/WebsocketContext'
import { useLocation } from '@/hooks/useLocation'
import ControlsButton from '@/components/controls/controls-button'
import MapHud from '@/components/map/map-hud'
import { getDistanceMeters } from '@/utils/utils'
import { pointLayer, groundStationLayer, groundStationLabelLayer, satelliteStyle, streetStyle } from '@/utils/charts'
import 'maplibre-gl/dist/maplibre-gl.css'

interface GPSMapProps {
  initial: WebsocketTelemetryData
}

export default function GPSMap ({
  initial
}: GPSMapProps) {
  const { subscribe } = useWebsocketAPI()
  const location = useLocation()
  const mapRef = useRef<MapRef>(null)
  const [anchored, setAnchored] = useState(true)
  const [satellite, setSatellite] = useState(true)
  const [readout, setReadout] = useState<WebsocketTelemetryData>(initial)
  const anchoredRef = useRef(true)
  const lastUpdateRef = useRef(0)

  const initialViewState = useMemo(() => ({
    longitude: initial.longitude / 1e7,
    latitude: initial.latitude / 1e7,
    zoom: 15,
    pitch: 60,
    bearing: 0
  }), [initial])

  // React owns the source data so a basemap swap cannot wipe the position
  const gpsGeoJson: FeatureCollection = useMemo(() => ({
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [readout.longitude / 1e7, readout.latitude / 1e7]
      },
      properties: {
        barometricAltitude: readout.barometricAltitude.toFixed(1),
        gpsAltitude: readout.gpsAltitude.toFixed(1)
      }
    }]
  }), [readout])

  const groundStationLocation: FeatureCollection | null = useMemo(() => {
    if (location == null) {
      return null
    }

    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        },
        properties: {}
      }]
    }
  }, [location])

  const groundDistance = useMemo(() => {
    if (location == null) {
      return null
    }

    return getDistanceMeters(
      location.latitude,
      location.longitude,
      readout.latitude / 1e7,
      readout.longitude / 1e7
    )
  }, [location, readout])

  useEffect(() => {
    anchoredRef.current = anchored
  }, [anchored])

  useEffect(() => {
    const unsubscribe = subscribe('TELEMETRY_PACKET', (packet) => {
      const map = mapRef.current?.getMap()
      if (map == null) {
        return
      }

      const { latitude, longitude } = packet

      const now = Date.now()

      // TODO: Implement refresh rate selection, settings
      if (now - lastUpdateRef.current > 250) {
        setReadout(packet)

        if (anchoredRef.current) {
          map.jumpTo({
            center: [longitude / 1e7, latitude / 1e7]
          })
        }

        lastUpdateRef.current = now
      }
    })

    return () => {
      unsubscribe()
    }
  }, [subscribe])

  return (
    <div
      className='relative w-full h-full flex flex-col'
    >
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle={satellite ? satelliteStyle : streetStyle}
        maxPitch={85}
        dragRotate
        pitchWithRotate
        touchPitch
      >
        <Source
          id='gps'
          type='geojson'
          data={gpsGeoJson}
        >
          {/* @ts-expect-error */}
          <Layer
            {...pointLayer}
          />
        </Source>
        {
          groundStationLocation != null && (
            <Source
              id='ground-station'
              type='geojson'
              data={groundStationLocation}
            >
              {/* @ts-expect-error */}
              <Layer
                {...groundStationLayer}
              />
              {/* @ts-expect-error */}
              <Layer
                {...groundStationLabelLayer}
              />
            </Source>
          )
        }
      </Map>
      <div
        className='absolute bottom-4 left-4'
      >
        <MapHud
          latitude={readout.latitude}
          longitude={readout.longitude}
          gpsAltitude={readout.gpsAltitude}
          barometricAltitude={readout.barometricAltitude}
          barometricVelocity={readout.barometricVelocity}
          satellites={readout.satellites}
          groundDistance={groundDistance}
        />
      </div>
      <div
        className='absolute top-4 right-4 flex gap-2'
      >
        <ControlsButton
          label={satellite ? 'SATELLITE' : 'STREET'}
          active={satellite}
          onClick={() => setSatellite(!satellite)}
        />
        <ControlsButton
          label={anchored ? 'ANCHORED' : 'FREE'}
          active={anchored}
          onClick={() => setAnchored(!anchored)}
        />
      </div>
    </div>
  )
}
