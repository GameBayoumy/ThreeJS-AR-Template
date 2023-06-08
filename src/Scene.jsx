import { RayGrab, useHitTest } from "@react-three/xr"
import { useFBX } from "@react-three/drei"
import React from "react"

export default function ARScene() {

    // ========== CHANGE THESE LINES ==========

    // Replace the path with the path to your own uploaded FBX file
    const model = useFBX('/building/build_001.fbx')

    // Replace this number to scale your model
    const scale = 0.01

    // ======================================

    const modelRef = React.useRef()

    // Used to move the model to the hit point
    useHitTest((hitMatrix, hit) => {
        if (modelRef.current) {
            hitMatrix.decompose(modelRef.current.position, modelRef.current.quaternion, modelRef.current.scale)
            modelRef.current.scale.multiplyScalar(scale)
        }

        console.log(modelRef.current.quaternion)
    })

    return (
        <>
            <directionalLight intensity={1} position={[1, 2, 3]} />
            <ambientLight intensity={0.2} />
            <RayGrab>
                <primitive ref={modelRef} object={model} scale={scale} />
            </RayGrab>
        </>
    )
}