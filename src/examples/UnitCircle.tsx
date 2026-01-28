// @ts-nocheck
import { Circle, Theme, useMovablePoint, Line, Plot, Text } from "mafs";
import Card from "../components/Card";
import { CoordsCard2D } from "../components/CoordsCard2D";

export default function UnitCircle() {
    const point = useMovablePoint([-1, 0], {
        constrain: ([x, y]) => {
            // Keep point on circle centered at (-3, 0)
            const dx = x + 3
            const dy = y
            const length = Math.sqrt(dx * dx + dy * dy)
            return [-3 + 2*dx / length, 2*dy / length]
        },
        color: "blue"
    })
    
    // Calculate angle from positive x-axis (relative to center at (-3, 0))
    const dx = point.x + 3
    const dy = point.y
    let angle = Math.atan2(dy, dx)
    
    // Normalize angle to be between 0 and 4π
    if (angle < 0) {
        angle = angle + 2 * Math.PI
    }
    
    return (
        <Card
            title="Trigonometric Functions on the Unit Circle"
            description="Drag the point around the circle"
        >
            <CoordsCard2D
                viewBox={{
                    x: [-5, 6],
                    y: [-2, 1]
                }}
                xAxis={{ axis: false, lines: false, labels: false }}
                yAxis={{ axis: false, lines: false, labels: false }}
                zoom={false}
                pan={false}
                background="white"
            >
                {/* Circle centered at (-3, 0) */}
                <Circle 
                    center={[-3, 0]} 
                    radius={2} 
                    color={"black"} 
                    fillOpacity={0} 
                    weight={5}
                />
                
                {/* Black center point */}
                <Circle center={[-3, 0]} radius={0.08} color="black" />
                
                {/* Movable point on circle */}
                {point.element}
                
                {/* Red horizontal line from center to base of green line */}
                <Line.Segment 
                    point1={[-3, 0]} 
                    point2={[point.x, 0]} 
                    color="red" 
                    style="solid"
                    weight={3}
                />
                <Plot.OfX 
                    y={(x) => (0<x && x<2*Math.PI) ?  0 : undefined} 
                    color="black" 
                    opacity={0.7}
                    minSamplingDepth={10}
                    maxSamplingDepth={15}
                />
                
                {/* Green vertical line from x-axis to point */}
                <Line.Segment 
                    point1={[point.x, 0]} 
                    point2={[point.x, point.y]} 
                    color="green" 
                    style="solid"
                    weight={3}
                />
                
                {/* Radius line from center to point */}
                <Line.Segment 
                    point1={[-3, 0]} 
                    point2={[point.x, point.y]} 
                    color="black" 
                    opacity={0.5}
                />
                
                {/* Sin function plot from 0 to 4π */}
                <Plot.OfX 
                    y={(x) => (0<x && x<2*Math.PI) ?  2 * Math.sin(x) : undefined} 
                    color="green" 
                    opacity={0.7}
                    minSamplingDepth={10}
                    maxSamplingDepth={15}
                />
                
                {/* Cos function plot from 0 to 4π */}
                <Plot.OfX 
                    y={(x) => (0<x && x<2*Math.PI) ?  2 * Math.cos(x) : undefined} 
                    color="red" 
                    opacity={0.7}
                    minSamplingDepth={10}
                    maxSamplingDepth={15}
                />
                
                {/* Vertical line showing current angle on sine curve */}
                <Line.Segment 
                    point1={[angle-0.02, 0]} 
                    point2={[angle-0.02, 2 * Math.sin(angle)]} 
                    color="green" 
                    style="solid"
                    opacity={0.5}
                    weight={3}
                />
                
                {/* Vertical line showing current angle on cosine curve */}
                <Line.Segment 
                    point1={[angle+0.02, 0]} 
                    point2={[angle+0.02, 2 * Math.cos(angle)]} 
                    color="red" 
                    style="solid"
                    opacity={0.5}
                    weight={3}
                />
                
                {/* Point on sine curve */}
                <Circle center={[angle, 2 * Math.sin(angle)]} radius={0.08} color="green" />
                
                {/* Point on cosine curve */}
                <Circle center={[angle, 2 * Math.cos(angle)]} radius={0.08} color="red" />
            </CoordsCard2D>
        </Card>
    )
}