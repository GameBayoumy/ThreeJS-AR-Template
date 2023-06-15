import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Html,
  useProgress
} from "@react-three/drei";
import Scene from "./Scene";
import { ARButton } from "@react-three/xr";
import { Suspense } from "react";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <>
    <ARButton />
    <Canvas>
      <OrbitControls />
      {/* <Environment preset="city" background blur={0.6} /> */}
      <Environment background resolution={64}>
        <Striplight position={[10, 2, 0]} scale={[1, 3, 10]} />
        <Striplight position={[-10, 2, 0]} scale={[1, 3, 10]} />
        <mesh scale={100}>
          <sphereGeometry args={[1, 64, 64]} />
          <LayerMaterial side={THREE.BackSide}>
            <Base color="blue" alpha={1} mode="normal" />
            <Depth colorA="#00ffff" colorB="#ff8f00" alpha={0.5} mode="normal" near={0} far={300} origin={[100, 100, 100]} />
            <Noise mapping="local" type="cell" scale={0.5} mode="softlight" />
          </LayerMaterial>
        </mesh>
      </Environment>
      <Suspense fallback={<Loader />}>
        <Scene />
      </Suspense>
    </Canvas>
  </>
);

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}
