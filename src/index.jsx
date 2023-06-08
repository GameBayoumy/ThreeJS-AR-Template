import "./style.css"
import ReactDOM from "react-dom/client"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, Html, useProgress } from "@react-three/drei"
import Scene from "./Scene"
import { ARButton } from "@react-three/xr"
import { Suspense } from "react"

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <>
        <ARButton />
        <Canvas>
            <OrbitControls />
            <Environment preset="city" background blur={0.6} />
            <Suspense fallback={<Loader />}>
                <Scene />
            </Suspense>
        </Canvas>
    </>
)


function Loader() {
    const { progress } = useProgress()
    return <Html center>{progress} % loaded</Html>
}