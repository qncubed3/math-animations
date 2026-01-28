import { Mafs, Coordinates } from "mafs"
import { useEffect, useId } from "react"

type AxisConfig = {
    lines?: number | false
    axis?: boolean
}

type CoordsCard2DProps = {
    viewBox: {
        x: [number, number]
        y: [number, number]
        padding?: number
    }

    xAxis?: AxisConfig
    yAxis?: AxisConfig
    zoom?: boolean
    pan?: boolean
    height?: number
    background?: string

    children?: React.ReactNode
}

export function CoordsCard2D({
    viewBox,
    xAxis = { lines: 1 },
    yAxis = { lines: 1 },
    zoom = true,
    pan=true,
    height = 400,
    background = "#000000",
    children,
}: CoordsCard2DProps) {
    const id = useId()
    const containerId = `coords-${id}`
    
    useEffect(() => {
        const container = document.getElementById(containerId)
        if (container) {
            const mafsView = container.querySelector('.MafsView')
            if (mafsView instanceof HTMLElement) {
                mafsView.style.background = background
            }
        }
    }, [background, containerId])

    return (
        <div id={containerId} style={{ height, background }} className="w-full rounded-lg overflow-hidden">
            <Mafs viewBox={viewBox} zoom={zoom} pan={pan}>
                <Coordinates.Cartesian
                    xAxis={xAxis}
                    yAxis={yAxis}
                />
                {children}
            </Mafs>
        </div>
    )
}