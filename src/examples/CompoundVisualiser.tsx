import { useState, useEffect, useRef } from "react";
import Card from "../components/Card";
import { fetchCompound } from "../utils/pubchem/client";
import { createMolecule } from "../utils/molecule";
import { type CompoundData } from "../utils/pubchem/types";
import * as THREE from "three";

// Types
interface MouseState {
    isDragging: boolean;
    dragStarted: boolean;
    previousPosition: { x: number; y: number };
}

interface Velocity {
    x: number;
    y: number;
}

export default function CompoundVisualiser() {
    const [input, setInput] = useState("");
    // @ts-ignore - compoundData not used
    const [compoundData, setCompoundData] = useState<CompoundData | null>(null);
    
    // Three.js refs
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const moleculeRef = useRef<THREE.Group | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    
    // Physics refs
    const velocityRef = useRef<Velocity>({ x: 0, y: 0 });
    const mouseStateRef = useRef<MouseState>({
        isDragging: false,
        dragStarted: false,
        previousPosition: { x: 0, y: 0 }
    });

    // Initialize Three.js scene
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        sceneRef.current = scene;

        // Create camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 10;
        cameraRef.current = camera;

        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Add brighter lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(3, 4, 8);
        scene.add(mainLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
        rimLight.position.set(-2, 3, -8);
        scene.add(rimLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-4, -1, 5);
        scene.add(fillLight);

        // Animation loop
        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);

            // Apply inertia to molecule
            if (!mouseStateRef.current.isDragging && moleculeRef.current) {
                const yAxis = new THREE.Vector3(0, 1, 0);
                moleculeRef.current.rotateOnWorldAxis(yAxis, velocityRef.current.y);
                moleculeRef.current.rotation.x += velocityRef.current.x;

                // Damping
                velocityRef.current.x *= 0.85;
                velocityRef.current.y *= 0.85;

                // Stop when velocity is very small
                if (Math.abs(velocityRef.current.x) < 0.0001) velocityRef.current.x = 0;
                if (Math.abs(velocityRef.current.y) < 0.0001) velocityRef.current.y = 0;
            }

            renderer.render(scene, camera);
        };

        animate();

        // Resize handler
        const handleResize = () => {
            if (!container) return;
            
            const w = container.clientWidth;
            const h = container.clientHeight;
            
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
        window.addEventListener("resize", handleResize);

        // Mouse event handlers
        const onMouseDown = (e: MouseEvent) => {
            mouseStateRef.current.isDragging = true;
            mouseStateRef.current.dragStarted = false;
            velocityRef.current = { x: 0, y: 0 };
            mouseStateRef.current.previousPosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseUp = () => {
            mouseStateRef.current.isDragging = false;
            mouseStateRef.current.dragStarted = false;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!mouseStateRef.current.isDragging || !moleculeRef.current) {
                mouseStateRef.current.previousPosition = { x: e.clientX, y: e.clientY };
                return;
            }

            const deltaX = e.clientX - mouseStateRef.current.previousPosition.x;
            const deltaY = e.clientY - mouseStateRef.current.previousPosition.y;

            if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
                mouseStateRef.current.dragStarted = true;
            }

            const rotationSpeed = 0.01;
            const yAxis = new THREE.Vector3(0, 1, 0);
            moleculeRef.current.rotateOnWorldAxis(yAxis, deltaX * rotationSpeed);
            moleculeRef.current.rotation.x += deltaY * rotationSpeed;

            velocityRef.current = {
                x: deltaY * rotationSpeed,
                y: deltaX * rotationSpeed
            };

            mouseStateRef.current.previousPosition = { x: e.clientX, y: e.clientY };
        };

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const zoomSpeed = 0.005;
            const delta = e.deltaY * zoomSpeed;
            
            // Limit zoom range (3 to 20 units)
            const newZ = camera.position.z + delta;
            camera.position.z = Math.max(3, Math.min(20, newZ));
        };

        const canvas = renderer.domElement;
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("wheel", onWheel, { passive: false });

        // Cleanup
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            resizeObserver.disconnect();
            window.removeEventListener("resize", handleResize);
            canvas.removeEventListener("mousedown", onMouseDown);
            canvas.removeEventListener("mouseup", onMouseUp);
            canvas.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("wheel", onWheel);
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    // Handle compound search
    const handleSearch = async () => {
        if (!input.trim()) return;
        
        const data = await fetchCompound(input);
        if (!data) return;
        
        setCompoundData(data);
        
        // Create new molecule
        const newMolecule = createMolecule(data.recordData);
        
        // Remove old molecule from scene
        if (sceneRef.current && moleculeRef.current) {
            sceneRef.current.remove(moleculeRef.current);
        }
        
        // Add new molecule to scene
        if (sceneRef.current) {
            sceneRef.current.add(newMolecule);
            moleculeRef.current = newMolecule;
        }
    };

    return (
        <Card
            title="Chemical Compound Visualiser"
            description="Drag to rotate, scroll to zoom"
        >
            <div className="mb-6">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Enter compound name or CID"
                    className="border border-black rounded-sm focus:ring-2 p-1 px-2 mr-2"
                />
                <button
                    onClick={handleSearch}
                    className="rounded-lg bg-blue-500 px-4 py-[6px] text-white hover:bg-blue-600"
                >
                    Search
                </button>
                {/* {compoundData && (
                    <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
                        <div className="font-semibold">CID: {compoundData.cid}</div>
                        <div>Name: {compoundData.name}</div>
                    </div>
                )} */}
            </div>
            <div className="w-full rounded-lg overflow-hidden flex h-[600px] bg-black">
                <div ref={containerRef} className="w-full h-full" />
            </div>
        </Card>
    );
}