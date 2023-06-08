import { XR, RayGrab, useHitTest } from "@react-three/xr"
import { useFBX } from "@react-three/drei"
import React from "react"

export function HitTest(props) {
    const modelRef = React.useRef()

    // Used to move the model to the hit point
    useHitTest((hitMatrix) => {
        if (modelRef.current) {
            console.log(modelRef.current.position)
            hitMatrix.decompose(modelRef.current.position, modelRef.current.quaternion, modelRef.current.scale)
        }
    })

    return <primitive ref={modelRef} {...props} scale={0.01} />
}

export default function ARScene() {
    const model = useFBX('/building/build_001.fbx')

    return (
        <>
            <directionalLight intensity={1} position={[1, 2, 3]} />
            <ambientLight intensity={0.2} />
            <XR>
                <RayGrab>
                    <HitTest object={model} />
                </RayGrab>
            </XR>
        </>
    )
}