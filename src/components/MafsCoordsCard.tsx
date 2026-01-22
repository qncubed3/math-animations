import { Mafs, Coordinates } from "mafs"

type AxisConfig = {
    lines?: number
}

type MafsCoordsCardProps = {
    viewBox: {
        x: [number, number]
        y: [number, number]
        padding?: number
    }

    xAxis?: AxisConfig
    yAxis?: AxisConfig
    zoom?: boolean
    height?: number

    children?: React.ReactNode
}

export function MafsCoordsCard({
    viewBox,
    xAxis = { lines: 1 },
    yAxis = { lines: 1 },
    zoom = true,
    height = 400,
    children,
}: MafsCoordsCardProps) {
    return (
        <div style={{ height }} className="w-full rounded-lg overflow-hidden">
            <Mafs viewBox={viewBox} zoom={zoom}>
                <Coordinates.Cartesian
                    xAxis={xAxis}
                    yAxis={yAxis}
                />

                {children}
            </Mafs>
        </div>
    )
}
