import { useRef } from "react";
import Card from "../components/Card";
import CoordsCard3D from "../components/CoordsCard3D";
import { type CoordsCard3DRef } from "../components/Scene3D";
import { Plane3D } from "../components/Plane3D";
import ResetButton from "../components/ResetButton";

export default function ThreeDAxisTest() {

    const coords= useRef<CoordsCard3DRef>(null)
    const handleReset = () => coords.current?.resetView()

    return (
        <Card title="Some 3D Axes" description="Click and drag to look around, hold down ctrl while dragging to move">
            <div className="mb-4">
                <ResetButton onClick={handleReset}/>
            </div>
            <CoordsCard3D height={600} ref={coords}>
                <Plane3D
                    a={1} b={1} c={4} d={20}
                    opacity={0.8}
                />
                <Plane3D
                    a={1} b={1} c={4} d={10}
                    color="rgb(255,230,150)"
                    opacity={0.8}
                />
            </CoordsCard3D>
        </Card>
        
    )
}