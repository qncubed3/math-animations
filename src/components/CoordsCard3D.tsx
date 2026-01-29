//CoordsCard3D.tsx
import { Grid, Text, Billboard } from "@react-three/drei";
import { forwardRef, type Ref } from "react";
import Scene3D, { type CoordsCard3DRef } from "./Scene3D";
import * as THREE from "three"

type AxisConfig = {
    lines?: number | false
    axis?: boolean
    label?: string
    min?: number
    max?: number
    color?: string
}

type CoordsCard3DProps = {
    height?: number,
    xAxis?: AxisConfig
    yAxis?: AxisConfig
    zAxis?: AxisConfig
    grid? :boolean
    children?: React.ReactNode
}

function Axes({
    xAxis, yAxis, zAxis
}: {
    xAxis: AxisConfig, yAxis: AxisConfig, zAxis: AxisConfig
}) {
    const labelOffset = 0.6;

    const xMin = xAxis.min ?? -10
    const xMax = xAxis.max ?? 10
    const xLen = xMax - xMin
    const xCenter = (xMin + xMax) / 2
    const xColor = xAxis.color ?? "#3366FF"

    const yMin = yAxis.min ?? -10
    const yMax = yAxis.max ?? 10
    const yLen = yMax - yMin
    const yCenter = (yMin + yMax) / 2
    const yColor = yAxis.color ?? "red"

    const zMin = zAxis.min ?? -10
    const zMax = zAxis.max ?? 10
    const zLen = zMax - zMin
    const zCenter = (zMin + zMax) / 2
    const zColor = zAxis.color ?? "green"

    return (
        <group>
            {/* y-axis (red) - extends along X in Three.js space */}
            {(yAxis.axis ?? true) &&
                <>
                    <mesh position={[yCenter, 0, 0]}>
                        <boxGeometry args={[yLen, 0.15, 0.15]} />
                        <meshBasicMaterial color={yColor} />
                    </mesh>
                    <Billboard position={[yMax + labelOffset, 0, 0]}>
                        <Text color={yColor} fontSize={0.8}>{yAxis.label ?? "Y"}</Text>
                    </Billboard>
                </>
            }

            {/* z-axis (green) - extends along Y in Three.js space */}
            {(zAxis.axis ?? true) &&
                <>
                    <mesh position={[0, zCenter, 0]}>
                        <boxGeometry args={[0.15, zLen, 0.15]} />
                        <meshBasicMaterial color={zColor} />
                    </mesh>
                    <Billboard position={[0, zMax + labelOffset, 0]}>
                        <Text color={zColor} fontSize={0.8}>{zAxis.label ?? "Z"}</Text>
                    </Billboard>
                </>
            }

            {/* x-axis (blue) - extends along Z in Three.js space */}
            {(xAxis.axis ?? true) &&
                <>
                    <mesh position={[0, 0, xCenter]}>
                        <boxGeometry args={[0.15, 0.15, xLen]} />
                        <meshBasicMaterial color={xColor} />
                    </mesh>
                    <Billboard position={[0, 0, xMax + labelOffset]}>
                        <Text color={xColor} fontSize={0.8}>{xAxis.label ?? "X"}</Text>
                    </Billboard>
                </>
            }
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
    children,
    xAxis = { lines: 1, label: "X" },
    yAxis = { lines: 1, label: "Y" },
    zAxis = { lines: 1, label: "Z" },
    grid = true
}: CoordsCard3DProps, ref: Ref<CoordsCard3DRef>) {

    return (
        <div style={{ height }} className="w-full rounded-lg overflow-hidden flex">
            <Scene3D height={`${height}px`} ref={ref}>
                {grid && 
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
                }
                <Axes xAxis={xAxis} yAxis={yAxis} zAxis={zAxis}/>
                {children}
            </Scene3D>
        </div>
    )
}

export default forwardRef(CoordsCard3D)