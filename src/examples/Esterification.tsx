// @ts-nocheck
import React, { useRef, useState, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";
import Card from "../components/Card";
import ResetButton from "../components/ResetButton";

    export default function Esterification() {
        const containerRef = useRef<HTMLDivElement>(null);
        const fgRef = useRef<any>(null);
        const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
        const [reactionEnabled, setReactionEnabled] = useState(false);

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

                    return { ...prev, links: newLinks };
                });
            }, 50);

            return () => clearInterval(interval);
        }, [reactionEnabled]);

        // Reset
        const handleReset = () => {
            setGraphData({ nodes: initialNodes, links: initialLinks });
            setReactionEnabled(false);
            setTimeout(() => setReactionEnabled(true), 1500);
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
                    <ForceGraph2D
                        ref={fgRef}
                        width={dimensions.width}
                        height={dimensions.height}
                        graphData={graphData}
                        nodeVal={node => node.val}
                        nodeColor={node => node.color}
                        linkWidth={2}
                        linkColor={() => "#ffffff"}
                        enableNodeDrag={true}
                        enablePanInteraction={true}
                        enableZoomInteraction={true}
                        minZoom={0.5}
                        maxZoom={4}
                        backgroundColor="#000000"
                        d3AlphaDecay={0.02}
                        d3VelocityDecay={0.3}
                        nodeCanvasObject={(node, ctx) => {
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
