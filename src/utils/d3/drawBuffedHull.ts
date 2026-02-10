// drawBuffedHull.ts

export interface drawBuffedHullOptions {
    fillColor: string;
    strokeColor: string;
    isDashed?: boolean;
    buff?: number;
}

export default function drawBuffedHull(
    ctx: CanvasRenderingContext2D,
    convexHull: [number, number][] | null,
    {
        fillColor = "rgba(255, 255, 255, 0.5)",
        strokeColor = "rgba(255, 255, 255, 1)",
        isDashed = false,
        buff = 20
    }: drawBuffedHullOptions
){
    

    const getEdgeNormal = (
        from: [number, number],
        to: [number, number]
    ): [number, number] => {
        const dx = to[0] - from[0];
        const dy = to[1] - from[1];
        const len = Math.hypot(dx, dy);
        return [-buff * dy / len, buff * dx / len];
    };

    if (!convexHull) return

    const edges: { start: [number, number], end: [number, number], normal: [number, number] }[] = [];

    if (convexHull.length == 1) {
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.setLineDash(isDashed ? [5, 5] : []);
        ctx.beginPath();
        const center = convexHull[0];

        ctx.arc(center[0], center[1], buff, 0, Math.PI * 2);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
        return convexHull;
    } else if (convexHull.length == 2) {
        const curr = convexHull[0];
        const next = convexHull[1];
        const normal = getEdgeNormal(curr, next);

        // Edge on one side
        edges.push({
            start: [curr[0] + normal[0], curr[1] + normal[1]],
            end: [next[0] + normal[0], next[1] + normal[1]],
            normal
        });

        // Edge on the opposite side
        edges.push({
            start: [next[0] - normal[0], next[1] - normal[1]],
            end: [curr[0] - normal[0], curr[1] - normal[1]],
            normal: [-normal[0], -normal[1]]
        });
    } else {
        // For each edge, compute the two offset points
        
        for (let i = 0; i < convexHull.length; i++) {
            const curr = convexHull[i];
            const next = convexHull[(i + 1) % convexHull.length];
            const normal = getEdgeNormal(curr, next);
            edges.push({
                start: [curr[0] + normal[0], curr[1] + normal[1]],
                end: [next[0] + normal[0], next[1] + normal[1]],
                normal
            });
        }
    };

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.setLineDash(isDashed ? [5, 5] : []);
    ctx.beginPath();

    for (let i = 0; i < convexHull.length; i++) {
        const prevEdge = edges[(i - 1 + edges.length) % edges.length];
        const currEdge = edges[i];
        const corner = convexHull[i]; // Arc center

        // Arc from end of previous edge to start of current edge, centered on the original hull vertex
        const startAngle = Math.atan2(prevEdge.end[1] - corner[1], prevEdge.end[0] - corner[0]);
        const endAngle = Math.atan2(currEdge.start[1] - corner[1], currEdge.start[0] - corner[0]);

        ctx.arc(corner[0], corner[1], buff, startAngle, endAngle, true);

        // Line along the current offset edge
        ctx.lineTo(currEdge.end[0], currEdge.end[1]);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    return convexHull;
};  