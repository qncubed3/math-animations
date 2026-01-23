import { OrbitControls } from "@react-three/drei";
import Scene3D from "./Scene3D";

type CoordsCardThreeDProps = {
    height?: number,
    children?: React.ReactNode
}

function Axes() {
    const axisLength = 10;
    
    return (
        <group>
            {/* X axis - red */}
            <mesh position={[axisLength / 2, 0, 0]}>
                <boxGeometry args={[axisLength, 0.05, 0.05]} />
                <meshBasicMaterial color="red" />
            </mesh>
            {/* Y axis - green */}
            <mesh position={[0, axisLength / 2, 0]}>
                <boxGeometry args={[0.05, axisLength, 0.05]} />
                <meshBasicMaterial color="green" />
            </mesh>
            {/* Z axis - blue */}
            <mesh position={[0, 0, axisLength / 2]}>
                <boxGeometry args={[0.05, 0.05, axisLength]} />
                <meshBasicMaterial color="blue" />
            </mesh>
        </group>
    );
}

export default function CoordsCardThreeD({
    height = 400,
    children
}: CoordsCardThreeDProps) {
    return (
        <div style={{ height }} className="w-full rounded-lg overflow-hidden">
            <Scene3D>
                <Axes/>
                <OrbitControls 
                    makeDefault 
                    enableDamping 
                    dampingFactor={0.1}
                    rotateSpeed={0.5}
                />
                {children}
            </Scene3D>
        </div>
    )
}