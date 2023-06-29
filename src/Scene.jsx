import { useHitTest, useXR } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";
import {
  useGLTF,
  AccumulativeShadows,
  RandomizedLight,
  Center,
  Environment,
  Lightformer,
  PerformanceMonitor,
  Float,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import { useControls } from "leva";
import { EffectComposer, N8AO, SMAA } from "@react-three/postprocessing";
import React, { useRef, useState, useTransition } from "react";

const useGltfjsx = true;
const fileName = "Vase_Low";
const materialName = "Default OBJ";
const modelPath = `/models/${
  useGltfjsx ? "gltfjsx/" + fileName + "-transformed.glb" : fileName + ".gltf"
}`;

export default function ARScene() {
  const { isPresenting } = useXR();
  const model = useRef();

  return (
    <>
      <group position={[0, -0.3, 0]}>
        {/* Disables shadows when XR isPresenting */}
        {!isPresenting && (
          <GizmoHelper
            alignment={"bottom-right"}
            margin={[80, 80]}
            renderPriority={2}
          >
            {/* <GizmoViewport
              axisColors={["red", "green", "blue"]}
              labelColor={"black"}
            /> */}
          </GizmoHelper>
        )}
        <AccumulativeShadows
          temporal
          frames={200}
          color="yellow"
          colorBlend={0.5}
          opacity={isPresenting ? 0 : 1}
          scale={10}
          alphaTest={0.85}
        >
          <RandomizedLight
            amount={5}
            radius={4}
            ambient={0.3}
            position={[5, 3, 2]}
            bias={0.001}
          />
        </AccumulativeShadows>
        <Effects isPresenting={isPresenting} />
        <Env isPresenting={isPresenting} />

        <Center top>
          <Model
            model={model}
            modelPath={modelPath}
            isPresenting={isPresenting}
          />
        </Center>
      </group>
    </>
  );
}

export function Model({ model, modelPath, isPresenting }) {
  const { nodes, materials } = useGLTF(modelPath);
  const [wireframe, setWireframe] = useState(false);
  const [roughness, setRoughness] = useState(materials[materialName].roughness);
  const [metallic, setMetallic] = useState(materials[materialName].metalness);
  const scale = 1;

  useControls({
    roughness: {
      value: roughness,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (value) => {
        setRoughness(value);
      },
    },
    metallic: {
      value: metallic,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (value) => {
        setMetallic(value);
      },
    },
    wireframe: {
      value: wireframe,
      onChange: (value) => {
        setWireframe(value);
      },
    },
  });

  // Used to move the model to the hit point
  useHitTest((hitMatrix) => {
    if (model.current) {
      hitMatrix.decompose(
        model.current.position,
        model.current.quaternion,
        model.current.scale
      );

      model.current.scale.addScalar(scale);
    }
  });

  // Used to rotate object during XR session
  useFrame(({ clock }) => {
    const rotationSpeed = 0.1;

    const rotation =
      Math.PI * (clock.getElapsedTime() * rotationSpeed) * Math.PI;
    if (model.current && isPresenting) {
      model.current.rotation.x = Math.cos(rotation);
      model.current.rotation.z = Math.sin(rotation);
    }
  });

  return (
    <group dispose={null}>
      <mesh
        ref={model}
        castShadow
        receiveShadow
        scale={scale}
        geometry={nodes[fileName].geometry}
        material={materials[materialName]}
        material-roughness={roughness}
        material-metalness={metallic}
        material-normalMapType={1}
        material-wireframe={wireframe}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}
useGLTF.preload(modelPath);

function Env({ isPresenting }) {
  const [preset, setPreset] = useState("sunset");
  const [degraded, degrade] = useState(false);
  // You can use the "inTransition" boolean to react to the loading in-between state,
  // For instance by showing a message
  const [inTransition, startTransition] = useTransition();
  const { blur } = useControls({
    blur: { value: 0.65, min: 0, max: 1 },
    preset: {
      value: preset,
      options: [
        "sunset",
        "dawn",
        "night",
        "warehouse",
        "forest",
        "apartment",
        "studio",
        "city",
        "park",
        "lobby",
      ],
      onChange: (value) => startTransition(() => setPreset(value)),
    },
  });
  return (
    <>
      <PerformanceMonitor onDecline={() => degrade(true)} />
      <Environment
        frames={degraded ? 1 : Infinity}
        resolution={256}
        preset={preset}
        background={!isPresenting}
        blur={blur}
      >
        {!isPresenting && <Lightformers />}
      </Environment>
    </>
  );
}

function Lightformers({ positions = [2, 0, 2, 0, 2, 0, 2, 0] }) {
  const group = useRef();
  useFrame(
    (state, delta) =>
      (group.current.position.z += delta * 10) > 20 &&
      (group.current.position.z = -60)
  );
  return (
    <>
      {/* Ceiling */}
      <group rotation={[0, 0, 0]}>
        <group ref={group}>
          {positions.map((x, i) => (
            <Lightformer
              key={i}
              form="circle"
              intensity={2}
              rotation={[Math.PI / 2, 0, 0]}
              position={[x, 4, i * 4]}
              scale={[1, 1, 1]}
            />
          ))}
        </group>
        {/* Sides */}
        <Float speed={1} floatIntensity={2} rotationIntensity={2}>
          <Lightformer
            intensity={20}
            rotation={[0, Math.PI / 2, 0]}
            position={[-4, 1, 0]}
            scale={[20, 0.1, 1]}
          />
          <Lightformer
            intensity={20}
            rotation={[0, Math.PI / 2, 0]}
            position={[4, 1, 0]}
            scale={[20, 1, 1]}
          />
        </Float>
      </group>
    </>
  );
}

function Effects({ isPresenting }) {
  const { ambinentOcclusion, smaa } = useControls({
    ambinentOcclusion: { value: true },
    smaa: { value: true },
  });

  return (
    <>
      {!isPresenting && (
        <EffectComposer disableNormalPass multisampling={0}>
          {ambinentOcclusion && (
            <N8AO
              aoRadius={0.2}
              intensity={2}
              aoSamples={6}
              denoiseSamples={4}
            />
          )}
          {smaa && <SMAA />}
        </EffectComposer>
      )}
    </>
  );
}
