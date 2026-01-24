import { Mafs, Coordinates } from "mafs"

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
    height?: number
    background?: string

    children?: React.ReactNode
}

export function CoordsCard2D({
    viewBox,
    xAxis = { lines: 1 },
    yAxis = { lines: 1 },
    zoom = true,
    height = 400,
    background = "#000000",
    children,
}: CoordsCard2DProps) {
    return (
        <div style={{ height }} className="w-full rounded-lg overflow-hidden">
            <Mafs viewBox={viewBox} zoom={zoom}>
                <Coordinates.Cartesian
                    xAxis={xAxis}
                    yAxis={yAxis}
                />
                {children}
            </Mafs>
            <style>{`
                .MafsView {
                    background: ${background} !important;
                }
            `}</style>
        </div>
    )
}