import Card from "../components/Card";
import { CoordsCard2D } from "../components/CoordsCard2D";

export default function GraphTest() {
    return (
        <Card title={"Graph Test"} description={"testing"}>
            <CoordsCard2D viewBox={{
                x: [-4,4],
                y: [-4,4],
                padding: undefined
            }}>
                
            </CoordsCard2D>
        </Card>
        
    )
}