import { XR, RayGrab, useHitTest } from "@react-three/xr";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import React from "react";

export function HitTest(props) {
  const modelRef = React.useRef();

  // Used to move the model to the hit point
  useHitTest((hitMatrix) => {
    if (modelRef.current) {
      console.log(modelRef.current.position);
      hitMatrix.decompose(
        modelRef.current.position,
        modelRef.current.quaternion,
        modelRef.current.scale
      );
    }
  });

  return <primitive ref={modelRef} {...props} scale={0.05} />;
}

export default function ARScene() {
  const gl = useThree((state) => state.gl);
  const model = useGLTF(
    "/death-mask/compressed/20120001-BKD-DeathMask_Low_Compressed.gltf",
    true,
    true,
    (loader) => {
      const ktx2Loader = new KTX2Loader().setTranscoderPath("/basis/");
      ktx2Loader.detectSupport(gl);
      loader.setKTX2Loader(ktx2Loader);
      console.log(ktx2Loader);
    }
  );

  return (
    <>
      <directionalLight intensity={0.5} position={[1, 2, 3]} />
      <ambientLight intensity={0.2} />
      <XR>
        <RayGrab>
          <HitTest object={model.scene} />
        </RayGrab>
      </XR>
    </>
  );
}
