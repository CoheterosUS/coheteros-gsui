import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import VisualizerModel from '@/components/visualizer/visualizer-model'

interface VisualizerSceneProps {
  roll: number
  pitch: number
  yaw: number
}

export default function VisualizerScene ({
  roll,
  pitch,
  yaw
}: VisualizerSceneProps) {
  return (
    <div
      className='h-full w-full min-h-0'
    >
      <Canvas
        camera={{
          position: [3, 4, 3],
        }}
      >
        <color
          attach='background'
          args={['#0a0a0a']}
        />
        <ambientLight
          intensity={2}
        />
        <VisualizerModel
          roll={roll}
          pitch={pitch}
          yaw={yaw}
        />
        <OrbitControls
          enablePan={false}
          enableDamping={false}
          enableZoom={true}
          minDistance={1}
          maxDistance={8}
        />
      </Canvas>
    </div>
  )
}
