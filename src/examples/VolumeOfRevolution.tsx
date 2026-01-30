import { useState } from "react";
import Card from "../components/Card";
import CoordsCard3D from "../components/CoordsCard3D";
import { ParametricCurve } from "../components/ParametricCurve";
import ParametricSurface from "../components/ParametricSurface";

export default function VolumeOfRevolution() {
    const [showCurve, setShowCurve] = useState(true);
    const [showSurface, setShowSurface] = useState(false);
    const [showCylinders, setShowCylinders] = useState(true);

    return (
        <Card
            title="Volume of Revolution"
            description="TODO: Sliders to show/animate revolution and control number of cylinders."
        >
            <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
                <button 
                    onClick={() => setShowCurve(!showCurve)}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: showCurve ? "#4CAF50" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Function Curve
                </button>
                <button 
                    onClick={() => setShowSurface(!showSurface)}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: showSurface ? "#4CAF50" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Rotated Body
                </button>
                <button 
                    onClick={() => setShowCylinders(!showCylinders)}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: showCylinders ? "#4CAF50" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Cylinders
                </button>
            </div>
            <CoordsCard3D
                height={600}
                xAxis={{ color: "white" }}
                yAxis={{ axis: false }}
                zAxis={{ label: "Y", color: "white", min: -8, max: 8 }}
                grid={false}
                camera={{ position: [-15, 5, 8]}}
            >
                <directionalLight 
                    position={[10, 10, 10]} 
                    intensity={1.5}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-far={50}
                    shadow-camera-left={-20}
                    shadow-camera-right={20}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                />
                {/* Ambient light for general illumination */}
                <ambientLight intensity={0.4} />
                
                {showCurve && (
                    <ParametricCurve 
                        // @ts-ignore
                        x={t => 0} 
                        y={t => Math.sin(6*t)+5} 
                        z={t => 8*t-4}    
                        color="yellow"                
                    />
                )}
                
                {showSurface && (
                    <ParametricSurface
                        x={(u, v) => (Math.sin(6 * u) + 5) * Math.cos(v * Math.PI * 2)}
                        y={(u, v) => (Math.sin(6 * u) + 5) * Math.sin(v * Math.PI * 2)}
                        // @ts-ignore
                        z={(u, v) => 8 * u-4}
                        color="yellow"
                        opacity={0.5}
                    />
                )}
                
                {/* 8 cylinders with width 1 */}
                {showCylinders && Array.from({ length: 8 }, (_, i) => {
                    const z = -4 + i + 0.5; // Center of each cylinder: -3.5, -2.5, -1.5, ..., 3.5
                    const t = (z + 4) / 8; // Convert back to parametric t (0 to 1)
                    const radius = Math.sin(6 * t) + 5;
                    
                    return (
                        <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[radius, radius, 1, 32]} />
                            <meshStandardMaterial 
                                color="red" 
                                transparent 
                                opacity={0.8} 
                            />
                        </mesh>
                    );
                })}
            </CoordsCard3D>
        </Card>
    )
}