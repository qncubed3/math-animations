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
    if (!convexHull || convexHull.length < 3) return;

    const getEdgeNormal = (
        from: [number, number],
        to: [number, number]
    ): [number, number] => {
        const dx = to[0] - from[0];
        const dy = to[1] - from[1];
        const len = Math.hypot(dx, dy);
        return [-buff * dy / len, buff * dx / len];
    };

    // For each edge, compute the two offset points
    const edges: { start: [number, number], end: [number, number], normal: [number, number] }[] = [];
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