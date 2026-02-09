import { useRef, useState, useEffect } from "react";
import Card from "../components/Card";
import ResetButton from "../components/ResetButton";
import { polygonHull } from 'd3-polygon';
import drawBuffedHull from "../utils/d3/drawBuffedHull";
import type { AtomNode, BondLink } from "../utils/pubchem/client";
import MoleculeForceGraph from "./MoleculeForceGraph";

export interface ReactionBondLink extends BondLink {
    phase?: 'shared' | 'reactant' | 'product';
}

export interface MoleculeAnnotation {
    name: string;
    atomIds: string[];
    color: [number, number, number];
    phase?: 'reactant' | 'product' | 'toproduct' | 'none'
}

export interface MoleculeReactionData {
    name: string;
    description: string;
    atoms: AtomNode[];
    bonds: ReactionBondLink[];
    reactingNodeIds: [string, string];
    moleculeAnnotations: MoleculeAnnotation[];
}

export default function MoleculeReaction(reactionData: MoleculeReactionData) {

    const containerRef = useRef<HTMLDivElement>(null);
    const labelPositions = useRef<Record<string, { x: number; y: number }>>({});

    const [graphData, setGraphData] = useState({
        nodes: reactionData.atoms,
        links: reactionData.bonds.filter(link => link.phase !== "product") // only shared and reactant
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

                const reactingNode1 = prev.nodes.find(node => node.id === reactionData.reactingNodeIds[0]);
                const reactingNode2 = prev.nodes.find(node => node.id === reactionData.reactingNodeIds[1]);

                if (!reactingNode1 || !reactingNode2) return prev;

                const dx = reactingNode1.x! - reactingNode2.x!;
                const dy = reactingNode1.y! - reactingNode2.y!;
                const dist = Math.sqrt(dx * dx + dy * dy);
                setMoleculeDist(dist);

                if (dist >= threshold) return prev;
                setHasReacted(true);
                return { ...prev, links: reactionData.bonds.filter(link => link.phase !== "reactant") };
            });
        }, 50);

        return () => clearInterval(interval);
    }, [reactionEnabled]);

    // Reset lesson
    const handleReset = () => {
        setGraphData({
            nodes: reactionData.atoms,
            links: reactionData.bonds.filter(link => link.phase !== "product") // only shared and reactant
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
        if (points.length == 2) return points
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

        reactionData.moleculeAnnotations.forEach(moleculeAnnotation => {
            const { phase, color: [r, g, b], atomIds, name } = moleculeAnnotation;

            let alpha = 0, strokeAlpha = 0, isDashed = false, buff = undefined;

            if (phase === "none") {
                alpha = 0.2;
                strokeAlpha = 0.5;
            } else if (phase === "reactant" && (!hasReacted || reactionProgress < 1)) {
                alpha = 0.2 * (1 - reactionProgress);
                strokeAlpha = 0.5 * (1 - reactionProgress);
            } else if ((phase === "product" || phase === "toproduct") && hasReacted) {
                alpha = 0.2 * reactionProgress;
                strokeAlpha = 0.5 * reactionProgress;
            } else if (phase === "toproduct" && reactionEnabled && moleculeDist !== null && moleculeDist < 50 && !hasReacted) {
                strokeAlpha = Math.min(0.3, 0.02 * (50 - moleculeDist));
                alpha = 0.05 * strokeAlpha;
                isDashed = true;
                buff = 15;
            } else {
                return;
            }

            const convexHull = getConvexHull(graphData.nodes, atomIds);
            const color = `rgba(${r}, ${g}, ${b}`;

            drawBuffedHull(ctx, convexHull, {
                fillColor: `${color}, ${alpha})`,
                strokeColor: `${color}, ${strokeAlpha})`,
                ...(isDashed && { isDashed, buff })
            });

            drawLabel(ctx, convexHull, name, `${color}, ${strokeAlpha})`);
        });
    };


    return (
        <Card title={reactionData.name} description={reactionData.description}>
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