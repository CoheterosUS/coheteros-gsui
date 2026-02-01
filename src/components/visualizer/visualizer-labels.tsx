import { Html } from '@react-three/drei'

interface VisualizerLabelsProps {
  radius: number
}

const rollAngles = [0, -90, 180, 90]
const pitchAngles = [90, -90]

export default function VisualizerLabels ({
  radius
}: VisualizerLabelsProps) {
  const customRadius = radius * 1.1

  return (
    <>
      {
        pitchAngles.map((angle, index) => {
          const y = index === 0 ? customRadius : -customRadius

          return (
            <Html
              key={angle}
              position={[0, y, 0]}
              className='text-sm text-pitch select-none opacity-70'
              center
            >
              {angle}°
            </Html>
          )
        })
      }
      {
        rollAngles.map((angle) => {
          const angleRad = (angle * Math.PI) / 180
          const x = customRadius * Math.cos(angleRad)
          const z = customRadius * Math.sin(angleRad)

          return (
            <Html
              key={angle}
              position={[x, 0, z]}
              className='text-sm text-roll select-none opacity-70'
              center
            >
              {angle}°
            </Html>
          )
        })
      }
    </>
  )
}
