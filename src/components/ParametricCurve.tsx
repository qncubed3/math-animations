import * as THREE from "three"

type RealFunction = (t: number) => number

type ParametricCurveProps = {
    x: RealFunction
    y: RealFunction
    z: RealFunction
    color?: string
    lineWidth?: number
    segments?: number
    tMin?: number
    tMax?: number
}

export function ParametricCurve({ 
    x, 
    y, 
    z,
    color = "red",
    lineWidth = 0.05,
    segments = 100,
    tMin = 0,
    tMax = 1
}: ParametricCurveProps) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const t = tMin + (i / segments) * (tMax - tMin)
        points.push(new THREE.Vector3(x(t), y(t), z(t)))
    }
    
    const curve = new THREE.CatmullRomCurve3(points)
    const tubeGeometry = new THREE.TubeGeometry(curve, segments, lineWidth, 8, false)
    
    return (
        <mesh geometry={tubeGeometry}>
            <meshStandardMaterial color={color} />
        </mesh>
    )
}