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

        // Create renderer with high-DPI support
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio); // Fixes blurriness on high-DPI screens
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
            renderer.setPixelRatio(window.devicePixelRatio); // Update pixel ratio on resize
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
        window.addEventListener("resize", handleResize);

        // Unified pointer event handlers (works for both mouse and touch)
        const getPointerPosition = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
            if ('touches' in e && e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if ('clientX' in e) {
                return { x: e.clientX, y: e.clientY };
            }
            return mouseStateRef.current.previousPosition;
        };

        const onPointerDown = (e: MouseEvent | TouchEvent) => {
            e.preventDefault(); // Prevent default touch behavior
            mouseStateRef.current.isDragging = true;
            mouseStateRef.current.dragStarted = false;
            velocityRef.current = { x: 0, y: 0 };
            mouseStateRef.current.previousPosition = getPointerPosition(e);
        };

        const onPointerUp = () => {
            mouseStateRef.current.isDragging = false;
            mouseStateRef.current.dragStarted = false;
        };

        const onPointerMove = (e: MouseEvent | TouchEvent) => {
            const position = getPointerPosition(e);
            
            if (!mouseStateRef.current.isDragging || !moleculeRef.current) {
                mouseStateRef.current.previousPosition = position;
                return;
            }

            e.preventDefault(); // Prevent scrolling while dragging

            const deltaX = position.x - mouseStateRef.current.previousPosition.x;
            const deltaY = position.y - mouseStateRef.current.previousPosition.y;

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

            mouseStateRef.current.previousPosition = position;
        };

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const zoomSpeed = 0.005;
            const delta = e.deltaY * zoomSpeed;
            
            // Limit zoom range (3 to 20 units)
            const newZ = camera.position.z + delta;
            camera.position.z = Math.max(3, Math.min(20, newZ));
        };

        // Pinch-to-zoom for touch devices
        let lastTouchDistance = 0;
        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                
                const dx = touch2.clientX - touch1.clientX;
                const dy = touch2.clientY - touch1.clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (lastTouchDistance > 0) {
                    const delta = lastTouchDistance - distance;
                    const zoomSpeed = 0.02;
                    const newZ = camera.position.z + delta * zoomSpeed;
                    camera.position.z = Math.max(3, Math.min(20, newZ));
                }
                
                lastTouchDistance = distance;
            } else {
                lastTouchDistance = 0;
                onPointerMove(e);
            }
        };

        const onTouchEnd = () => {
            lastTouchDistance = 0;
            onPointerUp();
        };

        const canvas = renderer.domElement;
        
        // Mouse events
        canvas.addEventListener("mousedown", onPointerDown);
        canvas.addEventListener("mouseup", onPointerUp);
        canvas.addEventListener("mousemove", onPointerMove);
        canvas.addEventListener("wheel", onWheel, { passive: false });
        
        // Touch events
        canvas.addEventListener("touchstart", onPointerDown, { passive: false });
        canvas.addEventListener("touchend", onTouchEnd);
        canvas.addEventListener("touchmove", onTouchMove, { passive: false });

        // Cleanup
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            resizeObserver.disconnect();
            window.removeEventListener("resize", handleResize);
            canvas.removeEventListener("mousedown", onPointerDown);
            canvas.removeEventListener("mouseup", onPointerUp);
            canvas.removeEventListener("mousemove", onPointerMove);
            canvas.removeEventListener("wheel", onWheel);
            canvas.removeEventListener("touchstart", onPointerDown);
            canvas.removeEventListener("touchend", onTouchEnd);
            canvas.removeEventListener("touchmove", onTouchMove);
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
            description="Drag to rotate, pinch/scroll to zoom"
        >
            <div className="mb-6">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="eg: glucose"
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