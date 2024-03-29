import { Canvas } from '@react-three/fiber'

export function Thwrapper(props: { component: JSX.Element }) {
  return (
    <>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        {props.component}
      </Canvas>
    </>
  )
}
