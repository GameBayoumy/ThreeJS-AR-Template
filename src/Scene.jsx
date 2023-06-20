import { RayGrab, useHitTest, useInteraction, useXR } from "@react-three/xr";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { useThree, useFrame } from "@react-three/fiber";
import { useGLTF, AccumulativeShadows, RandomizedLight, Center, MeshReflectorMaterial, Environment, Gltf } from "@react-three/drei";
import { useControls } from 'leva'
import { EffectComposer, N8AO, SMAA } from "@react-three/postprocessing";
import React, { useEffect, useRef, useState, useTransition } from "react";

export default function ARScene() {
  const gl = useThree((state) => state.gl)
  const { isPresenting } = useXR()
  const modelRef = useRef()

  const [startX, setStartX] = useState(0)
  const [endX, setEndX] = useState(0)

  const modelPath = "/death-mask/compressed/20120001-BKD-DeathMask_Low_Compressed.gltf"

  if (isPresenting) {
    gl.setClearColor("#17171b", 0)
  }
  else {
    gl.setClearColor("#17171b", 1)
  }

  // Used to rotate object during XR session
  useFrame(({ clock }) => {
    if (modelRef.current && isPresenting) {
      modelRef.current.rotation.y = Math.sin(Math.PI * (clock.getElapsedTime() * 0.2)) * Math.PI
    }
  })

  const model = useGLTF(
    modelPath,
    true,
    true,
    (loader) => {
      const ktx2Loader = new KTX2Loader().setTranscoderPath("/basis/");
      ktx2Loader.detectSupport(gl);
      loader.setKTX2Loader(ktx2Loader);
    }
  )

  return (
    <>
      <group position={[0, -0.65, 0]}>
        <Center top>
          <RayGrab>
            <HitTest modelRef={modelRef} modelPath={modelPath} />
          </RayGrab>
        </Center>

        {/* Disables shadows when XR isPresenting */}
        <AccumulativeShadows temporal frames={200} color="purple" colorBlend={0.5} opacity={isPresenting ? 0 : 1} scale={10} alphaTest={0.85}>
          <RandomizedLight amount={5} radius={4} ambient={0.3} position={[5, 3, 2]} bias={0.001} />
        </AccumulativeShadows >

        <Env isPresenting={isPresenting} />
      </group>
    </>
  )
}

export function HitTest({ modelRef, modelPath }) {

  // Used to move the model to the hit point
  useHitTest((hitMatrix) => {
    if (modelRef.current) {
      hitMatrix.decompose(
        modelRef.current.position,
        modelRef.current.quaternion,
        modelRef.current.scale
      )
    }
  })
  return <Gltf ref={modelRef} castShadow receiveShadow src={modelPath} scale={5} />
}

function Env({ isPresenting }) {
  const [preset, setPreset] = useState('sunset')
  // You can use the "inTransition" boolean to react to the loading in-between state,
  // For instance by showing a message
  const [inTransition, startTransition] = useTransition()
  console.log(isPresenting)
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