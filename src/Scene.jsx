import { useHitTest, useXR } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";
import { useGLTF, AccumulativeShadows, RandomizedLight, Center, Environment } from "@react-three/drei";
import { useControls } from 'leva'
import { EffectComposer, N8AO, SMAA } from "@react-three/postprocessing";
import React, { useRef, useState, useTransition } from "react";

const fileName = '20120001-BKD-DeathMask_Low'
const materialName = 'm1.002'
const modelPath = `/death-mask/gltfjsx/${fileName}-transformed.glb`

export default function ARScene() {
  const { isPresenting } = useXR()
  const model = useRef()

  return (
    <>
      <group position={[0, -0.65, 0]}>
        {/* Disables shadows when XR isPresenting */}
        <AccumulativeShadows temporal frames={200} color="yellow" colorBlend={0.5} opacity={isPresenting ? 0 : 1} scale={10} alphaTest={0.85}>
          <RandomizedLight amount={5} radius={4} ambient={0.3} position={[5, 3, 2]} bias={0.001} />
        </AccumulativeShadows >
        <Effects isPresenting={isPresenting} />
        <Env isPresenting={isPresenting} />

        <Center top>
          <DeathMask model={model} modelPath={modelPath} isPresenting={isPresenting} />
        </Center>
      </group >
    </>
  )
}

export function DeathMask({ model, modelPath, isPresenting }) {
  const { nodes, materials } = useGLTF(modelPath)

  materials[materialName].normalMapType = 1 // 0 For Tangent & 1 For Object space

  // Used to move the model to the hit point
  useHitTest((hitMatrix) => {
    if (model.current) {
      hitMatrix.decompose(
        model.current.position,
        model.current.quaternion,
        model.current.scale
      )
    }
  })

  // Used to rotate object during XR session
  useFrame(({ clock }) => {
    const rotationSpeed = 0.1

    const rotation = Math.PI * (clock.getElapsedTime() * rotationSpeed) * Math.PI
    if (model.current && isPresenting) {
      model.current.rotation.x = Math.cos(rotation)
      model.current.rotation.z = Math.sin(rotation)
    }
  })

  return (
    <group dispose={null}>
      <mesh ref={model} castShadow receiveShadow scale={5} geometry={nodes[fileName].geometry} material={materials[materialName]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}
useGLTF.preload(modelPath)

function Env({ isPresenting }) {
  const [preset, setPreset] = useState('sunset')
  // You can use the "inTransition" boolean to react to the loading in-between state,
  // For instance by showing a message
  const [inTransition, startTransition] = useTransition()
  const { blur, background } = useControls({
    background: { value: !isPresenting, disabled: isPresenting }, // disable and invert the value based on isPresenting
    blur: { value: 0.65, min: 0, max: 1 },
    preset: {
      value: preset,
      options: ['sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby'],
      // If onChange is present the value will not be reactive, see https://github.com/pmndrs/leva/blob/main/docs/advanced/controlled-inputs.md#onchange
      // Instead we transition the preset value, which will prevents the suspense bound from triggering its fallback
      // That way we can hang onto the current environment until the new one has finished loading ...
      onChange: (value) => startTransition(() => setPreset(value))
    }
  })
  return <Environment preset={preset} background={!isPresenting && background} blur={blur} />
}

function Effects({ isPresenting }) {
  const { ambinentOcclusion, smaa } = useControls({
    ambinentOcclusion: { value: true },
    smaa: { value: true }
  })

  return <>
    {!isPresenting &&
      <EffectComposer disableNormalPass multisampling={0}>
        {ambinentOcclusion && <N8AO aoRadius={0.2} intensity={2} aoSamples={6} denoiseSamples={4} />}
        {smaa && <SMAA />}
      </EffectComposer>
    }
  </>
}