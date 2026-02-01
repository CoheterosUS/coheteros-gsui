import { useEffect, useRef } from 'react'
import { Quaternion, Group } from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import VisualizerLabels from '@/components/visualizer/visualizer-labels'
import { getCenteredMesh, getOrientation } from '@/utils/utils'

const MODEL_PATH = '/model/rocket.obj'
const SPHERE_RADIUS = 3

interface VisualizerModelProps {
  roll: number
  pitch: number
  yaw: number
}

export default function VisualizerModel ({
  roll,
  pitch,
  yaw
}: VisualizerModelProps) {
  const obj = useLoader(OBJLoader, MODEL_PATH)
  const groupRef = useRef<Group>(null)
  const target = useRef(new Quaternion())

  useEffect(() => {
    getCenteredMesh(obj)
  }, [obj])

  useEffect(() => {
    if (groupRef.current == null) {
      return
    }

    target.current.setFromEuler(getOrientation(roll, pitch, yaw))
  }, [roll, pitch, yaw])

  useFrame(() => {
    if (!groupRef.current) {
      return
    }

    groupRef.current.quaternion.slerp(target.current, 0.15)
  })

  return (
    <>
      <mesh>
        <sphereGeometry
          args={[SPHERE_RADIUS, 16, 16]}
        />
        <meshBasicMaterial
          color='white'
          wireframe
          opacity={0.05}
          transparent
        />
      </mesh>
      <VisualizerLabels
        radius={SPHERE_RADIUS}
      />
      <group
        ref={groupRef}
      >
        <primitive
          object={obj}
          position={[0, 0, 0]}
          scale={0.5}
        />
        <axesHelper
          args={[3]}
        />
      </group>
    </>
  )
}
