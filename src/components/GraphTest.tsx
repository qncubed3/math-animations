import Card from "./Card";
import { MafsCoordsCard } from "./MafsCoordsCard";

export default function GraphTest() {
    return (
        <Card title={"Graph Test"} description={"testing"}>
            <MafsCoordsCard viewBox={{
                x: [-4,4],
                y: [-4,4],
                padding: undefined
            }}>
                
            </MafsCoordsCard>
        </Card>
        
    )
}