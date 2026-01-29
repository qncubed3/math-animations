import Card from "../components/Card";
import CoordsCard3D from "../components/CoordsCard3D";
import { ParametricCurve } from "../components/ParametricCurve";
import ParametricSurface from "../components/ParametricSurface";
import Slider from "../components/Slider";

export default function VolumeOfRevolution() {
    return (
        <Card
            title="Volume of Revolution"
            description="Use the sliders to revolve the function"
        >
            <Slider
                min={0}
                max={1}
                defaultValue={0}
                onChange={() => () => 0}
                label="hi"
            />
            <CoordsCard3D
                height={600}
                xAxis={{ color: "white" }}
                yAxis={{ axis: false }}
                zAxis={{ label: "Y", color: "white", min: -8, max: 8 }}
                grid={false}
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
                <ParametricCurve 
                    x={t => 0} 
                    y={t => Math.sin(6*t)+5} 
                    z={t => 8*t-4}    
                    color="yellow"                
                />
                <ParametricSurface
                    x={(u, v) => (Math.sin(6 * u) + 5) * Math.cos(v * Math.PI * 2)}
                    y={(u, v) => (Math.sin(6 * u) + 5) * Math.sin(v * Math.PI * 2)}
                    z={(u, v) => 8 * u-4}
                    color="yellow"
                    opacity={0.5}
                />
            </CoordsCard3D>
        </Card>
    )
}