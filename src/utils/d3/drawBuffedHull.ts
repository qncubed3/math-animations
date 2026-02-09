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
        const center = convexHull[0];
        const numSegments = 16; // More segments = smoother circle

        for (let i = 0; i < numSegments; i++) {
            const angle = (i / numSegments) * 2 * Math.PI;
            const nextAngle = ((i + 1) / numSegments) * 2 * Math.PI;

            const x1 = center[0] + buff * Math.cos(angle);
            const y1 = center[1] + buff * Math.sin(angle);
            const x2 = center[0] + buff * Math.cos(nextAngle);
            const y2 = center[1] + buff * Math.sin(nextAngle);

            edges.push({
                start: [x1, y1],
                end: [x2, y2],
                normal: [0, 0] // Not used for circle case
            });

            // Also duplicate the point in convexHull so the loop has the right number of iterations
            if (i > 0) convexHull.push(center);
        }
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