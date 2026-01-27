//CoordsCard3D.tsx
import { Grid, Text, Billboard } from "@react-three/drei";
import { forwardRef, type Ref } from "react";
import Scene3D, { type CoordsCard3DRef } from "./Scene3D";
import * as THREE from "three"

type CoordsCard3DProps = {
    height?: number,
    children?: React.ReactNode
}

function Axes() {
    const axisLength = 10;
    const labelOffset = 0.6;

    return (
        <group>
            {/* y-axis */}
            <mesh position={[axisLength / 2, 0, 0]}>
                <boxGeometry args={[axisLength, 0.15, 0.15]} />
                <meshBasicMaterial color="red" />
            </mesh>
            <Billboard position={[axisLength + labelOffset, 0, 0]}>
                <Text color="red" fontSize={0.8}>Y</Text>
            </Billboard>

            {/* z-axis */}
            <mesh position={[0, axisLength / 2, 0]}>
                <boxGeometry args={[0.15, axisLength, 0.15]} />
                <meshBasicMaterial color="green" />
            </mesh>
            <Billboard position={[0, axisLength + labelOffset, 0]}>
                <Text color="green" fontSize={0.8}>Z</Text>
            </Billboard>

            {/* x-axis */}
            <mesh position={[0, 0, axisLength / 2]}>
                <boxGeometry args={[0.15, 0.15, axisLength]} />
                <meshBasicMaterial color="#3366FF" />
            </mesh>
            <Billboard position={[0, 0, axisLength + labelOffset]}>
                <Text color="#3366FF" fontSize={0.8}>X</Text>
            </Billboard>

            {/* Origin */}
            <mesh>
                <boxGeometry args={[0.151, 0.151, 0.151]} />
                <meshBasicMaterial color="grey" />
            </mesh>
        </group>
    );
}

function CoordsCard3D({
    height = 400,
    children
}: CoordsCard3DProps, ref: Ref<CoordsCard3DRef>) {

    return (
        <div style={{ height }} className="w-full rounded-lg overflow-hidden flex">
            <Scene3D height={`${height}px`} ref={ref}>
                <Grid 
                    args={[20, 20]} 
                    cellSize={1} 
                    cellThickness={1} 
                    cellColor="#6e6e6e"
                    sectionSize={5}
                    sectionThickness={1}
                    sectionColor="#6e6e6e"
                    fadeDistance={40}
                    fadeStrength={1}
                    side={THREE.DoubleSide}
                />
                <Axes/>
                {children}
            </Scene3D>
        </div>
    )
}

export default forwardRef(CoordsCard3D)