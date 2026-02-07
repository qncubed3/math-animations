import React, { useRef, useState, useEffect } from "react";
import Card from "../components/Card";
import ResetButton from "../components/ResetButton";
import { polygonHull } from 'd3-polygon';
import drawBuffedHull from "../utils/d3/drawBuffedHull";
import type { AtomNode, BondLink } from "../utils/pubchem/client";
import MoleculeForceGraph from "../components/CompoundForceGraph";

interface ReactionBondLink extends BondLink {
    phase?: 'shared' | 'reactant' | 'product';
}

interface MoleculeAnnotation {
    name: string;
    atomIds: string[];
    color: [number, number, number];
    phase?: 'reactant' | 'product' | 'toproduct'
}

const initialNodes: AtomNode[] = [
    { id: "C1", element: 6 },
    { id: "C2", element: 6 },
    { id: "O1", element: 8 },
    { id: "H1", element: 1 },
    { id: "H2", element: 1 },
    { id: "H3", element: 1 },
    { id: "H4", element: 1 },
    { id: "H5", element: 1 },
    { id: "H6", element: 1 },

    { id: "C3", element: 6 },
    { id: "C4", element: 6 },
    { id: "C5", element: 6 },
    { id: "O2", element: 8 },
    { id: "O3", element: 8 },
    { id: "H7", element: 1 },
    { id: "H8", element: 1 },
    { id: "H9", element: 1 },
    { id: "H10", element: 1 },
    { id: "H11", element: 1 },
    { id: "H12", element: 1 },
];

const reactingNodeIds: [string, string] = ["O1", "C5"];


const allLinks: ReactionBondLink[] = [
    // Shared bonds
    { source: "C1", target: "H1", order: 1, phase: 'shared' },
    { source: "C1", target: "H2", order: 1, phase: 'shared' },
    { source: "C1", target: "H3", order: 1, phase: 'shared' },
    { source: "C1", target: "C2", order: 1, phase: 'shared' },
    { source: "C2", target: "H4", order: 1, phase: 'shared' },
    { source: "C2", target: "H5", order: 1, phase: 'shared' },
    { source: "C2", target: "O1", order: 1, phase: 'shared' },
    { source: "C3", target: "H7", order: 1, phase: 'shared' },
    { source: "C3", target: "H8", order: 1, phase: 'shared' },
    { source: "C3", target: "H9", order: 1, phase: 'shared' },
    { source: "C3", target: "C4", order: 1, phase: 'shared' },
    { source: "C4", target: "H10", order: 1, phase: 'shared' },
    { source: "C4", target: "H11", order: 1, phase: 'shared' },
    { source: "C4", target: "C5", order: 1, phase: 'shared' },
    { source: "C5", target: "O2", order: 2, phase: 'shared' },
    { source: "O3", target: "H12", order: 1, phase: 'shared' },

    // Reactant-only bonds (broken during reaction)
    { source: "O1", target: "H6", order: 1, phase: 'reactant' },
    { source: "C5", target: "O3", order: 1, phase: 'reactant' },

    // Product-only bonds (formed during reaction)
    { source: "O1", target: "C5", order: 1, phase: 'product' },
    { source: "O3", target: "H6", order: 1, phase: 'product' },
];


const ethanol: MoleculeAnnotation = {
    name: "Ethanol",
    atomIds: ["C1", "C2", "O1", "H1", "H2", "H3", "H4", "H5", "H6"],
    color: [236, 72, 153],
    phase: "reactant"
};

const propanoicAcid: MoleculeAnnotation = {
    name: 'Propanoic Acid',
    atomIds: ["C3", "C4", "C5", "O2", "O3", "H7", "H8", "H9", "H10", "H11", "H12"],
    color: [234, 179, 8],
    phase: "reactant"
};

const water: MoleculeAnnotation = {
    name: "Water",
    atomIds: ["O3", "H6", "H12"],
    color: [56, 189, 248],
    phase: "toproduct"
};

const ethylPropanoate: MoleculeAnnotation = {
    name: "Ethyl Propanoate",
    atomIds: ["C1", "C2", "O1", "C3", "C4", "C5", "O2", "H1", "H2", "H3", "H4", "H5", "H7", "H8", "H9", "H10", "H11"],
    color: [167, 139, 250],
    phase: "product"
};

const moleculeAnnotations: MoleculeAnnotation[] = [ethanol, propanoicAcid, water, ethylPropanoate];


export default function Esterification() {

    const containerRef = useRef<HTMLDivElement>(null);
    const labelPositions = useRef<Record<string, { x: number; y: number }>>({});

    const [graphData, setGraphData] = useState({
        nodes: initialNodes,
        links: allLinks.filter(link => link.phase !== "product") // only shared and reactant
    });
    const [hasReacted, setHasReacted] = useState<boolean>(false);
    const [moleculeDist, setMoleculeDist] = useState<number | null>(null);
    const [reactionEnabled, setReactionEnabled] = useState<boolean>(false);
    const [reactionProgress, setReactionProgress] = useState<number>(0);

    // Enable reaction after short delay
    useEffect(() => {
        const timer = setTimeout(() => setReactionEnabled(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Animate reactionProgress from 0 to 1
    useEffect(() => {
        if (!hasReacted) return;

        const duration = 200;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setReactionProgress(progress);
            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [hasReacted]);

    // Test for reaction
    useEffect(() => {
        if (!reactionEnabled) return;

        const interval = setInterval(() => {
            setGraphData(prev => {
                const threshold = 12;

                const reactingNode1 = prev.nodes.find(node => node.id === reactingNodeIds[0]);
                const reactingNode2 = prev.nodes.find(node => node.id === reactingNodeIds[1]);

                if (!reactingNode1 || !reactingNode2) return prev;

                const dx = reactingNode1.x! - reactingNode2.x!;
                const dy = reactingNode1.y! - reactingNode2.y!;
                const dist = Math.sqrt(dx * dx + dy * dy);
                setMoleculeDist(dist);

                if (dist >= threshold) return prev;
                setHasReacted(true);
                return { ...prev, links: allLinks.filter(link => link.phase !== "reactant") };
            });
        }, 50);

        return () => clearInterval(interval);
    }, [reactionEnabled]);

    // Reset lesson
    const handleReset = () => {
        setGraphData({
            nodes: initialNodes,
            links: allLinks.filter(link => link.phase !== "product") // only shared and reactant
        });
        setReactionEnabled(false);
        setHasReacted(false);
        setReactionProgress(0);
        setMoleculeDist(100);
        setTimeout(() => setReactionEnabled(true), 1500);
    };

    // Compute convex hull for molecule annotation
    function getConvexHull(nodeList: AtomNode[], targetNodeIds: string[]): [number, number][] | null {
        const nodes = nodeList.filter(n => targetNodeIds.includes(n.id));
        const points = nodes
            .filter(n => n.x !== undefined && n.y !== undefined)
            .map(n => [n.x!, n.y!] as [number, number]);
        return polygonHull(points);
    }

    // Draw label for molecule annotation
    const drawLabel = (
        ctx: CanvasRenderingContext2D,
        convexHull: [number, number][] | null,
        label: string,
        strokeColor: string,
        buff: number = 20
    ): void => {

        if (!convexHull) return;

        const centerX = convexHull.reduce((sum, p) => sum + p[0], 0) / convexHull.length;
        const topY = Math.min(...convexHull.map(p => p[1]));
        const targetLabelY = topY - buff - 10;

        // Smooth the position with lerp
        if (!labelPositions.current[label]) {
            labelPositions.current[label] = { x: centerX, y: targetLabelY };
        }

        const smoothing = 0.1; // Lower = smoother but more lag, higher = snappier
        labelPositions.current[label].x += (centerX - labelPositions.current[label].x) * smoothing;
        labelPositions.current[label].y += (targetLabelY - labelPositions.current[label].y) * smoothing;

        ctx.fillStyle = strokeColor;
        ctx.font = '14px Sans-Serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(label, labelPositions.current[label].x, labelPositions.current[label].y);
    };

    // Draw molecule annotation depending on phase of reaction
    const onRenderFramePre = (ctx: CanvasRenderingContext2D): void => {

        moleculeAnnotations.forEach(moleculeAnnotation => {
            const phase = moleculeAnnotation.phase;
            const [r, g, b] = moleculeAnnotation.color;

            if (phase === "reactant") {
                if (!hasReacted || reactionProgress < 1) {
                    const alpha = 0.2 * (1 - reactionProgress);
                    const strokeAlpha = 0.5 * (1 - reactionProgress);
                    const convexHull = getConvexHull(graphData.nodes, moleculeAnnotation.atomIds);
                    drawBuffedHull(ctx, convexHull, {
                        fillColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
                        strokeColor: `rgba(${r}, ${g}, ${b}, ${strokeAlpha})`
                    });
                    drawLabel(ctx, convexHull, moleculeAnnotation.name, `rgba(${r}, ${g}, ${b}, ${strokeAlpha})`);
                }
            } else if (phase === "product" || phase === "toproduct") {
                if (hasReacted) {
                    const alpha = 0.2 * reactionProgress;
                    const strokeAlpha = 0.5 * reactionProgress;
                    const convexHull = getConvexHull(graphData.nodes, moleculeAnnotation.atomIds);
                    drawBuffedHull(ctx, convexHull, {
                        fillColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
                        strokeColor: `rgba(${r}, ${g}, ${b}, ${strokeAlpha})`
                    });
                    drawLabel(ctx, convexHull, moleculeAnnotation.name, `rgba(${r}, ${g}, ${b}, ${strokeAlpha})`);
                }
                if (phase === "toproduct" && reactionEnabled && moleculeDist !== null && moleculeDist < 50 && !hasReacted) {
                    const strokeAlpha = Math.min(0.3, 0.02 * (50 - moleculeDist));
                    const alpha = 0.05 * strokeAlpha;
                    const convexHull = getConvexHull(graphData.nodes, moleculeAnnotation.atomIds);
                    drawBuffedHull(ctx, convexHull, {
                        fillColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
                        strokeColor: `rgba(${r}, ${g}, ${b}, ${strokeAlpha})`,
                        isDashed: true,
                        buff: 15
                    });
                    drawLabel(ctx, convexHull, moleculeAnnotation.name, `rgba(${r}, ${g}, ${b}, ${strokeAlpha})`);
                }
            }
        });
    };


    return (
        <Card title="Esterification" description="Click and drag to pan, scroll to zoom. Drag atom O1 onto atom C5 to complete reaction. To turn this into a lesson, provide some compounds, students to identify reactive atoms for a given reaction.">
            <ResetButton
                onClick={handleReset}
            />
            <div
                className="rounded-lg overflow-hidden mt-6"
                ref={containerRef}
                style={{ width: "100%", height: "600px" }}
            >
                <MoleculeForceGraph
                    graphData={graphData}
                    onRenderFramePre={onRenderFramePre}
                />
            </div>
        </Card>
    );
}