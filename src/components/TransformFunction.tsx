import Card from "./Card"
import { Polygon, Plot, Theme, useMovablePoint, Vector } from "mafs"
import { useState } from "react"
import { MafsCoordsCard } from "./MafsCoordsCard"
import "mafs/core.css"

function smoothSnap(
    value: number,
    step: number,
    radius: number
) {
    const snap = Math.round(value / step) * step
    const distance = Math.abs(value - snap)
    
    // If outside radius, no snapping
    if (distance > radius) {
        return value
    }
    
    // Calculate blend factor (0 at edge, 1 at snap point)
    const blend = 1 - (distance / radius)
    
    // Apply smoothstep for nice easing
    const smoothBlend = blend * blend * (3 - 2 * blend)
    
    // Interpolate between value and snap
    return value + (snap - value) * smoothBlend
}

export function TransformFunction() {
    const [offset, setOffset] = useState<[number, number]>([1, 1])
    const [isAnimating, setIsAnimating] = useState(false)
    
    

    const origin = useMovablePoint([0, 0], {
        color: Theme.pink,
        constrain: ([x, y]) => [
            smoothSnap(x, 1, 0.5),
            smoothSnap(y, 1, 0.5)
        ]
    })
    
    const tipxy = useMovablePoint(
        [origin.point[0] + offset[0], origin.point[1] + offset[1]], 
        {
            color: Theme.yellow,
            constrain: (point) => {
                // Update offset when orange is dragged
                setOffset([
                    point[0] - origin.point[0],
                    point[1] - origin.point[1]
                ])
                return point
            }
        }
    )
    
    const handleReset = () => {
        setIsAnimating(true)
        
        const startOrigin = [...origin.point] as [number, number]
        const startOffset = [...offset] as [number, number]
        const targetOrigin: [number, number] = [0, 0]
        const targetOffset: [number, number] = [1, 1]
        
        const duration = 500 // ms
        const startTime = Date.now()
        
        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            
            // Easing function (ease-out)
            const eased = 1 - Math.pow(1 - progress, 3)
            
            // Interpolate origin
            const newOriginX = startOrigin[0] + (targetOrigin[0] - startOrigin[0]) * eased
            const newOriginY = startOrigin[1] + (targetOrigin[1] - startOrigin[1]) * eased
            origin.setPoint([newOriginX, newOriginY])
            
            // Interpolate offset
            const newOffsetX = startOffset[0] + (targetOffset[0] - startOffset[0]) * eased
            const newOffsetY = startOffset[1] + (targetOffset[1] - startOffset[1]) * eased
            setOffset([newOffsetX, newOffsetY])
            
            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                setIsAnimating(false)
            }
        }
        
        requestAnimationFrame(animate)
    }
    
    // Force orange to follow pink
    const orangePos: [number, number] = [
        origin.point[0] + offset[0],
        origin.point[1] + offset[1]
    ]
    
    // Update orange point position if it's drifted
    if (Math.abs(tipxy.point[0] - orangePos[0]) > 0.01 || Math.abs(tipxy.point[1] - orangePos[1]) > 0.01) {
        tipxy.setPoint(orangePos)
    }
    
    // Basis vectors derived from offset
    const vecx: [number, number] = [offset[0], 0]
    const vecy: [number, number] = [0, offset[1]]
    
    // Transform a point using the linear transformation + translation
    const transform = (x: number, y: number): [number, number] => {
        return [
            vecx[0] * x + vecy[0] * y + origin.point[0],
            vecx[1] * x + vecy[1] * y + origin.point[1]
        ]
    }
    
    // Apply transformation to the function
    const transformedFunction = (screenX: number) => {
        if (Math.abs(vecx[0]) < 0.001) return origin.point[1]
        
        const x = (screenX - origin.point[0]) / vecx[0]
        const y = 2 * Math.sin(x)
        const [, transformedY] = transform(x, y)
        return transformedY
    }

    return (
        <Card title="Transform Function" description="Drag the orange point to scale/reflect, pink point to translate">
            <div className="mb-4">
                <button
                    onClick={handleReset}
                    disabled={isAnimating}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isAnimating ? 'Resetting...' : 'Reset'}
                </button>
            </div>
            <MafsCoordsCard
                viewBox={{ x: [-3, 3], y: [-3, 3] }}
            >
                
                {/* Original function */}
                <Plot.OfX y={(x) => 2*Math.sin(x)} color={Theme.blue} opacity={0.3} />
                
                {/* Transformed function */}
                <Plot.OfX y={transformedFunction} color={Theme.blue} weight={5} />
                
                
                {/* Unit square showing transformation */}
                <Polygon
                    points={[
                        origin.point,
                        [origin.point[0] + vecx[0], origin.point[1] + vecx[1]],
                        [origin.point[0] + vecx[0] + vecy[0], origin.point[1] + vecx[1] + vecy[1]],
                        [origin.point[0] + vecy[0], origin.point[1] + vecy[1]]
                    ]}
                    color={Theme.yellow}
                />
                {/* Basis vectors from origin */}
                <Vector tail={origin.point} tip={[origin.point[0] + vecx[0], origin.point[1] + vecx[1]]} color="lime"/>
                <Vector tail={origin.point} tip={[origin.point[0] + vecy[0], origin.point[1] + vecy[1]]} color="red"/>
                
                {tipxy.element}
                {origin.element}
            </MafsCoordsCard>
        </Card>
    )
}