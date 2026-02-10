// MoleculeForceGraph.tsx

import { useRef, useState, useEffect } from "react";
import ForceGraph2D, { type ForceGraphMethods, type NodeObject, type LinkObject } from "react-force-graph-2d";
import { getAtomById } from "../utils/d3/atoms";
import { shuoldUseBlackText } from "../utils/color";

interface GraphNode {
    id: string;
    element: number;
    x?: number;
    y?: number;
}

interface GraphLink {
    source: string;
    target: string;
    order?: number;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

type ForceGraphNode = NodeObject<GraphNode>;
type ForceGraphLink = LinkObject<GraphNode, GraphLink>;

interface ForceGraphProps {
    graphData: GraphData;
    fgRef?: React.MutableRefObject<ForceGraphMethods<GraphNode, GraphLink> | undefined>;
    containerRef?: React.RefObject<HTMLDivElement>;
    width?: number;
    height?: number;
    linkWidth?: number;
    linkColor?: string | ((link: ForceGraphLink) => string);
    linkDistance?: number;
    linkStrength?: number;
    chargeMaxDistance?: number;
    chargeStrength?: number;
    enableNodeDrag?: boolean;
    enablePanInteraction?: boolean;
    enableZoomInteraction?: boolean;
    minZoom?: number;
    maxZoom?: number;
    backgroundColor?: string;
    d3AlphaDecay?: number;
    d3VelocityDecay?: number;
    linkCanvasObject?: (link: ForceGraphLink, ctx: CanvasRenderingContext2D) => void;
    nodeCanvasObject?: (node: ForceGraphNode, ctx: CanvasRenderingContext2D) => void;
    onRenderFramePre?: (ctx: CanvasRenderingContext2D, globalScale: number) => void;
}

const defaultNodeCanvasObject = (node: ForceGraphNode, ctx: CanvasRenderingContext2D) => {
    const atom = getAtomById(node.element);
    if (!atom) return;

    const radius = atom.radius / 2;
    const color = atom.color;

    ctx.beginPath();
    ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.fillStyle = shuoldUseBlackText(color) ? "#000000" : "#ffffff";
    ctx.font = `${radius}px Sans-Serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.id!, node.x!, node.y!);
};

const defaultLinkCanvasObject = (link: ForceGraphLink, ctx: CanvasRenderingContext2D): void => {
    const source = link.source as { x: number; y: number };
    const target = link.target as { x: number; y: number };
    const order = link.order ?? 1; // Default to single bond

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    // Calculate bond direction
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const len = Math.hypot(dx, dy);

    // Perpendicular offset vector
    const offset = 2.5;
    const nx = -dy / len * offset;
    const ny = dx / len * offset;

    if (order === 1) {
        // Single bond - single line
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
    } else if (order === 2) {
        // Double bond - two parallel lines
        ctx.beginPath();
        ctx.moveTo(source.x + nx, source.y + ny);
        ctx.lineTo(target.x + nx, target.y + ny);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(source.x - nx, source.y - ny);
        ctx.lineTo(target.x - nx, target.y - ny);
        ctx.stroke();
    } else if (order === 3) {
        // Triple bond - three parallel lines
        // Center line
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();

        // Top line
        ctx.beginPath();
        ctx.moveTo(source.x + nx * 1.5, source.y + ny * 1.5);
        ctx.lineTo(target.x + nx * 1.5, target.y + ny * 1.5);
        ctx.stroke();

        // Bottom line
        ctx.beginPath();
        ctx.moveTo(source.x - nx * 1.5, source.y - ny * 1.5);
        ctx.lineTo(target.x - nx * 1.5, target.y - ny * 1.5);
        ctx.stroke();
    } else if (order === 4) {
        // Quadruple bond - four parallel lines
        ctx.beginPath();
        ctx.moveTo(source.x + nx * 2, source.y + ny * 2);
        ctx.lineTo(target.x + nx * 2, target.y + ny * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(source.x + nx * 0.66, source.y + ny * 0.66);
        ctx.lineTo(target.x + nx * 0.66, target.y + ny * 0.66);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(source.x - nx * 0.66, source.y - ny * 0.66);
        ctx.lineTo(target.x - nx * 0.66, target.y - ny * 0.66);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(source.x - nx * 2, source.y - ny * 2);
        ctx.lineTo(target.x - nx * 2, target.y - ny * 2);
        ctx.stroke();
    } else {
        // Fallback for unknown order - draw single bond
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
    }
};

export default function MoleculeForceGraph({
    graphData,
    containerRef: externalContainerRef,
    width: externalWidth,
    height: externalHeight,
    linkWidth = 0,
    linkColor = "#ffffff",
    linkDistance = 20,
    linkStrength = 1,
    chargeMaxDistance = 100,
    chargeStrength = -50,
    enableNodeDrag = true,
    enablePanInteraction = true,
    enableZoomInteraction = true,
    minZoom = 0.5,
    maxZoom = 4,
    backgroundColor = "#000000",
    d3AlphaDecay = 0.05,
    d3VelocityDecay = 0.3,
    linkCanvasObject = defaultLinkCanvasObject,
    nodeCanvasObject = defaultNodeCanvasObject,
    onRenderFramePre,
}: ForceGraphProps) {
    const internalContainerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

    const fgRef = useRef<ForceGraphMethods<GraphNode, GraphLink>>(undefined);
    const containerRef = externalContainerRef || internalContainerRef;

    // Use external dimensions if provided, otherwise use internal state
    const width = externalWidth ?? dimensions.width;
    const height = externalHeight ?? dimensions.height;

    useEffect(() => {
        if (!fgRef.current) return;

        const linkForce = fgRef.current.d3Force('link');
        if (linkForce) {
            linkForce
                .distance(linkDistance)
                .strength(linkStrength);
        }

        const chargeForce = fgRef.current.d3Force('charge');
        if (chargeForce) {
            chargeForce
                .strength(chargeStrength)
                .distanceMax(chargeMaxDistance);
        }

        fgRef.current.d3ReheatSimulation();
    }, [linkDistance, linkStrength, chargeStrength, chargeMaxDistance]);

    // Auto-resize based on container
    useEffect(() => {
        // Only auto-resize if external dimensions are not provided
        if (externalWidth !== undefined && externalHeight !== undefined) {
            return;
        }

        const handleResize = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                setDimensions({ width: clientWidth, height: clientHeight });
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [externalWidth, externalHeight, containerRef]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <ForceGraph2D<GraphNode, GraphLink>
                ref={fgRef}
                width={width}
                height={height}
                graphData={graphData}
                linkWidth={linkWidth}
                linkColor={linkColor}
                nodeVal={node => (getAtomById(node.element)?.radius ?? 8) / 2}
                enableNodeDrag={enableNodeDrag}
                enablePanInteraction={enablePanInteraction}
                enableZoomInteraction={enableZoomInteraction}
                minZoom={minZoom}
                maxZoom={maxZoom}
                backgroundColor={backgroundColor}
                d3AlphaDecay={d3AlphaDecay}
                d3VelocityDecay={d3VelocityDecay}
                linkCanvasObject={linkCanvasObject}
                nodeCanvasObject={nodeCanvasObject}
                onRenderFramePre={onRenderFramePre}
            />
        </div>
    );
}