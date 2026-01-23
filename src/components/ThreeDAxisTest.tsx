import Card from "./Card";
import CoordsCardThreeD from "./CoordsCardThreeD";

export default function ThreeDAxisTest() {
    return (
        <Card title="Some 3D Axes" description="Click and drag to look around, hold down ctrl while dragging to move">
            <CoordsCardThreeD/>
        </Card>
        
    )
}