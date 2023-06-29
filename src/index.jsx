import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useProgress } from "@react-three/drei";
import Scene from "./Scene";
import { XR, ARButton } from "@react-three/xr";
import { Suspense } from "react";
import { CircularProgress } from "@mui/joy";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <>
    <ARButton />
    <Canvas
      dpr={[1, 1.5]}
      shadows
      camera={{ position: [0, 0, 4], fov: 35 }}
      gl={{ alpha: true }}
    >
      <XR>
        <OrbitControls
          autoRotate
          autoRotateSpeed={1.2}
          enablePan={false}
          enableZoom={true}
          minDistance={0.5}
          maxDistance={3}
          minPolarAngle={Math.PI / 2.1}
          maxPolarAngle={Math.PI / 2.1}
        />
        <Suspense fallback={<Loader />}>
          <Scene />
        </Suspense>
      </XR>
    </Canvas>
    <div id="info-box">
      <div id="comment">
        <div style={{ marginBottom: 4 }}>
          Built by — <img src="/xrzone-16x16.png" /> Zone
        </div>
        <img src="tudelft-nmc-200px.png" />
      </div>
    </div>
  </>
);

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <CircularProgress
        determinate
        soft="true"
        size="lg"
        color="neutral"
        value={progress}
      >
        {Math.trunc(progress)}%
      </CircularProgress>
    </Html>
  );
}
