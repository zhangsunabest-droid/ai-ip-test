import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { ContactShadows, Environment, Float, RoundedBox } from "@react-three/drei"

function Dancer({ color = "#67e8f9", x = 0, z = 0, seed = 0 }) {
  const group = useRef(null)
  const leftArm = useRef(null)
  const rightArm = useRef(null)
  const leftLeg = useRef(null)
  const rightLeg = useRef(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 2 + seed
    if (!group.current) return
    group.current.position.y = 0.02 + Math.sin(t) * 0.08
    group.current.rotation.y = Math.sin(t * 0.5) * 0.25

    if (leftArm.current) leftArm.current.rotation.z = Math.sin(t) * 0.6
    if (rightArm.current) rightArm.current.rotation.z = -Math.sin(t) * 0.6
    if (leftLeg.current) leftLeg.current.rotation.x = -Math.sin(t) * 0.4
    if (rightLeg.current) rightLeg.current.rotation.x = Math.sin(t) * 0.4
  })

  return (
    <group ref={group} position={[x, 0, z]}>
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshToonMaterial color="#ffe4ef" />
      </mesh>

      <mesh position={[0, 0.92, 0]} castShadow>
        <capsuleGeometry args={[0.24, 0.48, 12, 24]} />
        <meshToonMaterial color={color} />
      </mesh>

      <mesh ref={leftArm} position={[-0.34, 0.96, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.3, 8, 16]} />
        <meshToonMaterial color="#f8d2e1" />
      </mesh>
      <mesh ref={rightArm} position={[0.34, 0.96, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.3, 8, 16]} />
        <meshToonMaterial color="#f8d2e1" />
      </mesh>

      <mesh ref={leftLeg} position={[-0.12, 0.37, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.36, 8, 16]} />
        <meshToonMaterial color="#c4b5fd" />
      </mesh>
      <mesh ref={rightLeg} position={[0.12, 0.37, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.36, 8, 16]} />
        <meshToonMaterial color="#c4b5fd" />
      </mesh>

      <mesh position={[-0.1, 1.5, 0.25]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
      <mesh position={[0.1, 1.5, 0.25]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
    </group>
  )
}

function StageScene() {
  const dancers = useMemo(
    () => [
      { x: -1.4, z: 0.2, color: "#67e8f9", seed: 0.2 },
      { x: 0, z: 0, color: "#f9a8d4", seed: 1.1 },
      { x: 1.4, z: 0.15, color: "#a5b4fc", seed: 2.2 },
    ],
    []
  )

  return (
    <>
      <ambientLight intensity={0.85} />
      <spotLight position={[0, 6, 2]} intensity={2.2} color="#67e8f9" angle={0.45} penumbra={0.6} castShadow />
      <spotLight position={[3, 5, -1]} intensity={1.6} color="#f472b6" angle={0.55} penumbra={0.75} />

      <Float floatIntensity={0.35} speed={1.2}>
        <RoundedBox args={[6.4, 0.35, 3.6]} radius={0.18} smoothness={4} position={[0, 0, 0]}>
          <meshToonMaterial color="#1e1b4b" />
        </RoundedBox>
      </Float>

      {dancers.map((dancer) => (
        <Dancer key={dancer.x} {...dancer} />
      ))}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.48} scale={8} blur={2.4} far={3} />
      <Environment preset="city" />
    </>
  )
}

function CuteStage3D() {
  return (
    <div className="cute-stage-wrap absolute inset-0 z-[6] pointer-events-none" aria-hidden>
      <Canvas camera={{ position: [0, 2.2, 5.6], fov: 34 }} shadows dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <StageScene />
      </Canvas>
      <div className="cute-stage-vignette absolute inset-0" />
    </div>
  )
}

export default CuteStage3D

