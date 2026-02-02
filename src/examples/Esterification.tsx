// @ts-nocheck
import React, { useRef, useState, useEffect } from "react";
import ForceGraph2D, { type ForceGraphMethods } from "react-force-graph-2d";
import Card from "../components/Card";
import ResetButton from "../components/ResetButton";
import { polygonHull } from 'd3-polygon';
import drawBuffedHull from "../utils/d3/drawBuffedHull";

export default function Esterification() {

    // Nodes
    const initialNodes = [
        { id: "C1", type: "carbon", color: "#555555", val: 10, symbol: "C" },
        { id: "C2", type: "carbon", color: "#555555", val: 10, symbol: "C" },
        { id: "O1", type: "oxygen", color: "#FF0000", val: 9, symbol: "O" },
        { id: "H1", type: "hydrogen", color: "#FFFFFF", val: 5, symbol: "H" },
        { id: "H2", type: "hydrogen", color: "#FFFFFF", val: 5, symbol: "H" },
        { id: "H3", type: "hydrogen", color: "#FFFFFF", val: 5, symbol: "H" },
        { id: "H4", type: "hydrogen", color: "#FFFFFF", val: 5, symbol: "H" },
        { id: "H5", type: "hydrogen", color: "#FFFFFF", val: 5, symbol: "H" },
        { id: "H6", type: "hydrogen", color: "#FFFFFF", val: 5, symbol: "H" },

        { id: "C3", type: "carbon", color: "#555555", val: 10, symbol: "C" },
        { id: "C4", type: "carbon", color: "#555555", val: 10, symbol: "C" },
        { id: "C5", type: "carbon", color: "#555555", val: 10, symbol: "C" },
        { id: "O2", type: "oxygen", color: "#FF0000", val: 9, symbol: "O" },
        { id: "O3", type: "oxygen", color: "#FF0000", val: 9, symbol: "O" },
        { id: "H7", type: "hydrogen", color: "#FFFFFF", val: 5, symbol: "H" },
        { id: "H8", type: "hydrogen", color: "#FFFFFF", val: 5, symbol: "H" },
        { id: "H9", type: "hydrogen", color: "#FFFFFF", val: 5, symbol: "H" },
        { id: "H10", type: "hydrogen", color: "#FFFFFF", val: 5, symbol: "H" },
        { id: "H11", type: "hydrogen", color: "#FFFFFF", val: 5, symbol: "H" },
        { id: "H12", type: "hydrogen", color: "#FFFFFF", val: 5, symbol: "H" },
    ];

    // Links
    const initialLinks = [
        { source: "C1", target: "H1" },
        { source: "C1", target: "H2" },
        { source: "C1", target: "H3" },
        { source: "C1", target: "C2" },
        { source: "C2", target: "H4" },
        { source: "C2", target: "H5" },
        { source: "C2", target: "O1" },
        { source: "O1", target: "H6" },

        { source: "C3", target: "H7" },
        { source: "C3", target: "H8" },
        { source: "C3", target: "H9" },
        { source: "C3", target: "C4" },
        { source: "C4", target: "H10" },
        { source: "C4", target: "H11" },
        { source: "C4", target: "C5" },
        { source: "C5", target: "O2" },
        { source: "C5", target: "O3" },
        { source: "O3", target: "H12" },
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const fgRef = useRef<ForceGraphMethods>(null);
    const labelPositions = useRef({});
    const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
    const [reactionEnabled, setReactionEnabled] = useState(false);
    const [hasReacted, setHasReacted] = useState(false)
    const [reactionProgress, setReactionProgress] = useState(0);
    const [graphData, setGraphData] = useState({ nodes: initialNodes, links: initialLinks });
    const [moleculeDist, setMoleculeDist] = useState(null)

    // Animate reactionProgress from 0 to 1 over 1000ms
    useEffect(() => {
        if (!hasReacted) return;

        const duration = 200;
        const startTime = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setReactionProgress(progress);
            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [hasReacted]);
    useEffect(() => {
        if (!fgRef.current) return;

        fgRef.current.d3Force('link')
            .distance(20)
            .strength(1);

        fgRef.current.d3Force('charge')
            .strength(-50)
            .distanceMax(100);
        
        fgRef.current.d3ReheatSimulation();
    }, []);
    
    

    // Resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                setDimensions({ width: clientWidth, height: clientHeight });
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Enable reaction after short delay
    useEffect(() => {
        const timer = setTimeout(() => setReactionEnabled(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const getId = (x: any) => (typeof x === "string" ? x : x.id);

    // Reaction
    useEffect(() => {
        if (!reactionEnabled) return;

        const interval = setInterval(() => {
            setGraphData(prev => {
                const nodeO1 = prev.nodes.find(n => n.id === "O1");
                const nodeC5 = prev.nodes.find(n => n.id === "C5");
                const nodeO3 = prev.nodes.find(n => n.id === "O3");
                const nodeH6 = prev.nodes.find(n => n.id === "H6");
                if (!nodeO1 || !nodeC5 || !nodeO3 || !nodeH6) return prev;

                const dx = nodeO1.x! - nodeC5.x!;
                const dy = nodeO1.y! - nodeC5.y!;
                const dist = Math.sqrt(dx * dx + dy * dy);
                setMoleculeDist(dist)
                const threshold = 12;
                if (dist >= threshold) return prev;

                let newLinks = [...prev.links];

                // Remove old links
                newLinks = newLinks.filter(l => {
                    const s = getId(l.source);
                    const t = getId(l.target);
                    return !(
                        (s === "O1" && t === "H6") || (s === "H6" && t === "O1") ||
                        (s === "C5" && t === "O3") || (s === "O3" && t === "C5")
                    );
                });

                // Add new links if missing
                if (!newLinks.some(l => getId(l.source) === "O1" && getId(l.target) === "C5")) {
                    newLinks.push({ source: "O1", target: "C5" });
                }
                if (!newLinks.some(l => getId(l.source) === "O3" && getId(l.target) === "H6")) {
                    newLinks.push({ source: "O3", target: "H6" });
                }

                setHasReacted(true)

                return { ...prev, links: newLinks };
            });
        }, 50);

        return () => clearInterval(interval);
    }, [reactionEnabled]);

    // Reset
    const handleReset = () => {
        setGraphData({ nodes: initialNodes, links: initialLinks });
        setReactionEnabled(false);
        setHasReacted(false)
        setReactionProgress(0);
        setMoleculeDist(100)
        setTimeout(() => setReactionEnabled(true), 1500);
    };



        // 1. Compute basic convex hull (sharp corners, no padding)

    const getConvexHull = (
        nodeList,
        targetNodeIds
    ) => {
        const nodes = nodeList.filter(n => targetNodeIds.includes(n.id))
        const points = nodes
            .filter(n => n.x !== undefined && n.y !== undefined)
            .map(n => [n.x, n.y]);
        return polygonHull(points)
    }
    
    const drawLabel = (ctx, convexHull, label, strokeColor, buff=20) => {

        if (!convexHull) return

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
    }


    const ethanol = ["C1", "C2", "O1", "H1", "H2", "H3", "H4", "H5", "H6"];
    const propanoicAcid = ["C3", "C4", "C5", "O2", "O3", "H7", "H8", "H9", "H10", "H11", "H12"];
    const water = ["O3", "H6", "H12"];
    const ethylPropanoate = ["C1", "C2", "O1", "C3", "C4", "C5", "O2", "H1", "H2", "H3", "H4", "H5", "H7", "H8", "H9", "H10", "H11"];

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
                <ForceGraph2D
                    ref={fgRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={graphData}
                    nodeVal={node => node.val}
                    nodeColor={node => node.color}
                    linkWidth={0}
                    linkColor={() => "#ffffff"}
                    linkDistance={100}
                    enableNodeDrag={true}
                    enablePanInteraction={true}
                    enableZoomInteraction={true}
                    minZoom={0.5}
                    maxZoom={4}
                    backgroundColor="#000000"
                    d3AlphaDecay={0.05}
                    d3VelocityDecay={0.3}
                    linkCanvasObject={(link, ctx) => {
                        const source = link.source;
                        const target = link.target;

                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 2;

                        const doubleBonds = [
                            ["C5", "O2"],
                        ];

                        const isDouble = doubleBonds.some(([a, b]) =>
                            (getId(source) === a && getId(target) === b) ||
                            (getId(source) === b && getId(target) === a)
                        );

                        if (!isDouble) {
                            ctx.beginPath();
                            ctx.moveTo(source.x, source.y);
                            ctx.lineTo(target.x, target.y);
                            ctx.stroke();
                            return;
                        }

                        const dx = target.x - source.x;
                        const dy = target.y - source.y;
                        const len = Math.hypot(dx, dy);

                        const offset = 2;
                        const nx = -dy / len * offset;
                        const ny = dx / len * offset;

                        ctx.beginPath();
                        ctx.moveTo(source.x + nx, source.y + ny);
                        ctx.lineTo(target.x + nx, target.y + ny);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(source.x - nx, source.y - ny);
                        ctx.lineTo(target.x - nx, target.y - ny);
                        ctx.stroke();
                    }}
                    nodeCanvasObject={(node, ctx) => {
                        
                        if (node.id === "C1") {
                            if (!hasReacted || reactionProgress < 1) {
                                // Fade out: alpha goes from 0.2 to 0
                                // Ethanol
                                const alpha = 0.2 * (1 - reactionProgress);
                                const strokeAlpha = 0.5 * (1 - reactionProgress);
                                const convexHull = getConvexHull(graphData.nodes, ethanol)
                                drawBuffedHull(ctx, convexHull, {
                                    fillColor: `rgba(236, 72, 153, ${alpha})`,
                                    strokeColor: `rgba(236, 72, 153, ${strokeAlpha})`
                                });
                                drawLabel(ctx, convexHull, 'Ethanol', `rgba(236, 72, 153, ${strokeAlpha})`)
                            }
                            if (hasReacted) {
                                // Fade in: alpha goes from 0 to 0.2
                                // Ethyl Propanoate
                                const alpha = 0.2 * reactionProgress;
                                const strokeAlpha = 0.5 * reactionProgress;
                                const convexHull = getConvexHull(graphData.nodes, ethylPropanoate)
                                drawBuffedHull(ctx, convexHull, { 
                                    fillColor: `rgba(167, 139, 250, ${alpha})`, 
                                    strokeColor: `rgba(167, 139, 250, ${strokeAlpha})` 
                                })
                                drawLabel(ctx, convexHull, 'Ethyl Propanoate', `rgba(167, 139, 250, ${strokeAlpha})`)
                            }
                        }

                        if (node.id === "C3") {
                            // Propanoic Acid
                            if (!hasReacted || reactionProgress < 1) {
                                const alpha = 0.2 * (1 - reactionProgress);
                                const strokeAlpha = 0.5 * (1 - reactionProgress);
                                const convexHull = getConvexHull(graphData.nodes, propanoicAcid)
                                drawBuffedHull(ctx, convexHull, {
                                    fillColor: `rgba(234, 179, 8, ${alpha})`,
                                    strokeColor: `rgba(234, 179, 8, ${strokeAlpha})`
                                });
                                drawLabel(ctx, convexHull, 'Propanoic Acid', `rgba(234, 179, 8, ${strokeAlpha})`)
                            }
                            if (hasReacted) {
                                // Water
                                const alpha = 0.2 * reactionProgress;
                                const strokeAlpha = 0.5 * reactionProgress;
                                const convexHull = getConvexHull(graphData.nodes, water)
                                drawBuffedHull(ctx, convexHull, {
                                    fillColor: `rgba(56, 189, 248, ${alpha})`,
                                    strokeColor: `rgba(56, 189, 248, ${strokeAlpha})`
                                });
                                drawLabel(ctx, convexHull, "Water", `rgba(56, 189, 248, ${strokeAlpha})`)
                            }
                            if (reactionEnabled && moleculeDist !== null && moleculeDist < 50 && !hasReacted) {
                                const strokeAlpha = Math.min(0.3, 0.02 * (50 - moleculeDist));
                                const alpha = 0.05 * strokeAlpha;
                                const convexHull = getConvexHull(graphData.nodes, water)
                                drawBuffedHull(ctx, convexHull, {
                                    fillColor: `rgba(56, 189, 248, ${alpha})`,
                                    strokeColor: `rgba(56, 189, 248, ${strokeAlpha})`,
                                    isDashed: true,
                                    buff: 15
                                });
                                drawLabel(ctx, convexHull, "Water", `rgba(56, 189, 248, ${strokeAlpha})`)
                            }
                        }
                        
                        
                        const radius = node.val!;
                        ctx.beginPath();
                        ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
                        ctx.fillStyle = node.color!;
                        ctx.fill();

                        ctx.fillStyle = node.type === "hydrogen" ? "#000000" : "#ffffff";
                        ctx.font = `${radius}px Sans-Serif`;
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(node.id!, node.x!, node.y!);
                    }}
                />
            </div>
        </Card>
    );
}
