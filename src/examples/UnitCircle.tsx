import Card from "../components/Card";
import { CoordsCard2D } from "../components/CoordsCard2D";

export default function UnitCircle() {
    return (
        <Card
            title="Trigonometric Functions on the Unit Circle"
            description="Drag the point around the circle"
        >
            <CoordsCard2D
                viewBox={{ x: [-1, 1], y:[-1,1]}}
                background="white"
            >

            </CoordsCard2D>
        </Card>
    )
}