type Real2Function = (u: number, v: number) => number
import * as THREE from "three"
import { ParametricGeometry } from "three/examples/jsm/Addons.js"

export default function ParametricSurface({
    x, y, z, color="red", opacity=0.7
}: {
    x: Real2Function
    y: Real2Function
    z: Real2Function
    color: string
    opacity: number
}) {
    const parametricFunction = (u: number, v:number, target: THREE.Vector3) => {
        target.set(x(u, v), y(u, v), z(u, v))
    }
    const geometry = new ParametricGeometry(parametricFunction, 50, 50)
    return (
        <mesh 
            geometry={geometry}
            castShadow
            receiveShadow
        >
            <meshStandardMaterial 
                side={THREE.DoubleSide} 
                color={color}
                transparent
                opacity={opacity}
                depthWrite={false}  // Prevents z-fighting artifacts
                roughness={0.4}     // Adds more realistic surface
                metalness={0.1}     // Slight metallic quality
                // Better blending for overlapping transparent surfaces
                blending={THREE.NormalBlending}
            />
        </mesh>
    )
}