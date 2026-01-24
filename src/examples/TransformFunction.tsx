import Card from "../components/Card"
import { Polygon, Plot, Theme, useMovablePoint, Vector } from "mafs"
import { useState } from "react"
import { CoordsCard2D } from "../components/CoordsCard2D"
import "mafs/core.css"
import ResetButton from "../components/ResetButton"

export function TransformFunction() {
    const [offset, setOffset] = useState<[number, number]>([1, 1])
    
    const origin = useMovablePoint([0, 0], {
        color: Theme.pink,
    })
    
    const tipxy = useMovablePoint(
        [origin.point[0] + offset[0], origin.point[1] + offset[1]], 
        {
            color: Theme.yellow,
            constrain: (point) => {
                setOffset([
                    point[0] - origin.point[0],
                    point[1] - origin.point[1]
                ])
                return point
            }
        }
    )
    
    const handleReset = () => {
        // const startOrigin = [...origin.point] as [number, number]
        const startOrigin = [...origin.point] as [number, number]
        const startOffset = [...offset] as [number, number]
        const targetOrigin: [number, number] = [0, 0]
        const targetOffset: [number, number] = [1, 1]
        
        const duration = 500
        const startTime = performance.now()
        
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 5)
            
            const newOriginX = startOrigin[0] + (targetOrigin[0] - startOrigin[0]) * eased
            const newOriginY = startOrigin[1] + (targetOrigin[1] - startOrigin[1]) * eased
            origin.setPoint([newOriginX, newOriginY])
            
            const newOffsetX = startOffset[0] + (targetOffset[0] - startOffset[0]) * eased
            const newOffsetY = startOffset[1] + (targetOffset[1] - startOffset[1]) * eased
            setOffset([newOffsetX, newOffsetY])
            
            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }
        
        requestAnimationFrame(animate)
    }
    
    // Force yellow to follow pink
    const yellowPos: [number, number] = [
        origin.point[0] + offset[0],
        origin.point[1] + offset[1]
    ]
    
    if (Math.abs(tipxy.point[0] - yellowPos[0]) > 0.01 || Math.abs(tipxy.point[1] - yellowPos[1]) > 0.01) {
        tipxy.setPoint(yellowPos)
    }
    
    const vecx: [number, number] = [offset[0], 0]
    const vecy: [number, number] = [0, offset[1]]
    
    const transform = (x: number, y: number): [number, number] => {
        return [
            vecx[0] * x + vecy[0] * y + origin.point[0],
            vecx[1] * x + vecy[1] * y + origin.point[1]
        ]
    }
    
    const transformedFunction = (screenX: number) => {
        if (Math.abs(vecx[0]) < 0.001) return origin.point[1]
        
        const x = (screenX - origin.point[0]) / vecx[0]
        const y = 2 * Math.sin(x)
        const [, transformedY] = transform(x, y)
        return transformedY
    }

    return (
        <Card 
            title="Transform Function" 
            description="Drag the yellow point to apply dilation and reflections, and the pink point to translate"
        >
            <div className="mb-4">
                <ResetButton onClick={handleReset}/>
            </div>
            <CoordsCard2D viewBox={{ x: [-3, 3], y: [-3, 3] }}>

                {/* Draw original function and transformed function */}
                <Plot.OfX y={(x) => 2*Math.sin(x)} color={Theme.blue} opacity={0.3} />
                <Plot.OfX y={transformedFunction} color={Theme.blue} weight={5} />
                
                {/* Draw transformation rectangle */}
                <Polygon
                    points={[
                        origin.point,
                        [origin.point[0] + vecx[0], origin.point[1] + vecx[1]],
                        [origin.point[0] + vecx[0] + vecy[0], origin.point[1] + vecx[1] + vecy[1]],
                        [origin.point[0] + vecy[0], origin.point[1] + vecy[1]]
                    ]}
                    color={Theme.yellow}
                />

                {/* Draw basis vectors */}
                <Vector tail={origin.point} tip={[origin.point[0] + vecx[0], origin.point[1] + vecx[1]]} color="lime"/>
                <Vector tail={origin.point} tip={[origin.point[0] + vecy[0], origin.point[1] + vecy[1]]} color="red"/>
                
                {/* Draw control points */}
                {tipxy.element}
                {origin.element}
            </CoordsCard2D>
        </Card>
    )
}