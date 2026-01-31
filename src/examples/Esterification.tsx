// @ts-nocheck
import React, { useRef, useState, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";
import Card from "../components/Card";
import ResetButton from "../components/ResetButton";
import { ConvexHull } from "three/examples/jsm/Addons.js";
import { polygonHull } from 'd3-polygon';

    export default function Esterification() {
        const containerRef = useRef<HTMLDivElement>(null);
        const fgRef = useRef<any>(null);
        const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
        const [reactionEnabled, setReactionEnabled] = useState(false);
        const [hasReacted, setHasReacted] = useState(false)
        const [reactionProgress, setReactionProgress] = useState(0);

        // Animate reactionProgress from 0 to 1 over 1000ms
        useEffect(() => {
            if (!hasReacted) return;

            const duration = 100;
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

        const [graphData, setGraphData] = useState({ nodes: initialNodes, links: initialLinks });

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
                    const threshold = 20;
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
            setTimeout(() => setReactionEnabled(true), 1500);
        };



            // 1. Compute basic convex hull (sharp corners, no padding)
        const drawBuffedHull = (nodeIds, ctx, fillColor, strokeColor) => {
            const nodes = graphData.nodes.filter(n => nodeIds.includes(n.id));
            const points = nodes
                .filter(n => n.x !== undefined && n.y !== undefined)
                .map(n => [n.x, n.y]);
            
            const convexHull = polygonHull(points);
            
            if (!convexHull || convexHull.length < 3) return;

            const buff = 25;

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
        };                      


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
                        linkWidth={2}
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
                        nodeCanvasObject={(node, ctx) => {
                            
                            if (node.id === "C1") {
                                if (!hasReacted || reactionProgress < 1) {
                                    // Fade out: alpha goes from 0.2 to 0
                                    const alpha = 0.2 * (1 - reactionProgress);
                                    const strokeAlpha = 0.5 * (1 - reactionProgress);
                                    drawBuffedHull(ethanol, ctx, `rgba(236, 72, 153, ${alpha})`, `rgba(236, 72, 153, ${strokeAlpha})`, 'Ethanol');
                                }
                                if (hasReacted) {
                                    // Fade in: alpha goes from 0 to 0.2
                                    const alpha = 0.2 * reactionProgress;
                                    const strokeAlpha = 0.5 * reactionProgress;
                                    drawBuffedHull(ethylPropanoate, ctx, `rgba(167, 139, 250, ${alpha})`, `rgba(167, 139, 250, ${strokeAlpha})`, 'Ethyl Propanoate');
                                }
                            }

                            if (node.id === "C3") {
                                if (!hasReacted || reactionProgress < 1) {
                                    const alpha = 0.2 * (1 - reactionProgress);
                                    const strokeAlpha = 0.5 * (1 - reactionProgress);
                                    drawBuffedHull(propanoicAcid, ctx, `rgba(234, 179, 8, ${alpha})`, `rgba(234, 179, 8, ${strokeAlpha})`, 'Propanoic Acid');
                                }
                                if (hasReacted) {
                                    const alpha = 0.2 * reactionProgress;
                                    const strokeAlpha = 0.5 * reactionProgress;
                                    drawBuffedHull(water, ctx, `rgba(56, 189, 248, ${alpha})`, `rgba(56, 189, 248, ${strokeAlpha})`, 'Water');
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
