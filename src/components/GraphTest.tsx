import Card from "./Card";
import { CoordsCardTwoD } from "./CoordsCardTwoD";

export default function GraphTest() {
    return (
        <Card title={"Graph Test"} description={"testing"}>
            <CoordsCardTwoD viewBox={{
                x: [-4,4],
                y: [-4,4],
                padding: undefined
            }}>
                
            </CoordsCardTwoD>
        </Card>
        
    )
}