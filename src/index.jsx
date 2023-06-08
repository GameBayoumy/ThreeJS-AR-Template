import "./style.css"
import ReactDOM from "react-dom/client"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Html, useProgress } from "@react-three/drei"
import Scene from "./Scene"
import { XR, ARButton } from "@react-three/xr"
import { Suspense } from "react"

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <>
        <ARButton sessionInit={{ requiredFeatures: ['hit-test'] }} />
        <Canvas>
            <XR>
                <OrbitControls />
                <Suspense fallback={<Loader />}>
                    <Scene />
                </Suspense>
            </XR>
        </Canvas>
    </>
)


function Loader() {
    const { progress } = useProgress()
    return <Html center>{progress} % loaded</Html>
}