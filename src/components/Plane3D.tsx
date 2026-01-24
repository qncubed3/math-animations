import * as THREE from "three";
import { useMemo } from "react";

type PlaneProps = {
    a: number; // coefficient for logical x
    b: number; // coefficient for logical y
    c: number; // coefficient for logical z
    d: number;
    size?: number;
    segments?: number;
    color?: string;
    opacity?: number;
    borderWidth?: number;
};

// Your mapping function: logical → Three.js
const toThreeJS = ([x, y, z]: [number, number, number]): [number, number, number] => {
    // x → Z, y → X, z → Y
    return [y, z, x];
};

export function Plane3D({
    a,
    b,
    c,
    d,
    size = 10,
    segments = 50,
    color = "#9fccff",
    opacity = 0.7,
    borderWidth = 0.05
}: PlaneProps) {
    // Compute plane vertices in logical coordinates
    const logicalGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const vertices: number[] = [];
        const indices: number[] = [];

        // Pick dominant axis for solving plane
        const solveFor = Math.abs(c) > 0.0001 ? "z" : Math.abs(b) > 0.0001 ? "y" : "x";

        for (let i = 0; i <= segments; i++) {
            for (let j = 0; j <= segments; j++) {
                const u = (i / segments - 0.5) * size;
                const v = (j / segments - 0.5) * size;

                let x = 0, y = 0, z = 0;

                switch (solveFor) {
                    case "z":
                        x = u;
                        y = v;
                        z = (d - a * x - b * y) / c;
                        break;
                    case "y":
                        x = u;
                        z = v;
                        y = (d - a * x - c * z) / b;
                        break;
                    case "x":
                        y = u;
                        z = v;
                        x = (d - b * y - c * z) / a;
                        break;
                }

                // Save logical coordinates for now
                vertices.push(x, y, z);
            }
        }

        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const aIndex = i * (segments + 1) + j;
                const bIndex = aIndex + segments + 1;

                indices.push(aIndex, bIndex, aIndex + 1);
                indices.push(bIndex, bIndex + 1, aIndex + 1);
            }
        }

        geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geo.setIndex(indices);
        geo.computeVertexNormals();

        return geo;
    }, [a, b, c, d, size, segments]);

    // Convert to Three.js coordinates only at render time
    const threeJSGeometry = useMemo(() => {
        const geo = logicalGeometry.clone();
        const pos = geo.getAttribute("position");

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);
            const [tx, ty, tz] = toThreeJS([x, y, z]);
            pos.setXYZ(i, tx, ty, tz);
        }

        return geo;
    }, [logicalGeometry]);

    // Create border edges as cylinders
    const borderEdges = useMemo(() => {
        const solveFor = Math.abs(c) > 0.0001 ? "z" : Math.abs(b) > 0.0001 ? "y" : "x";

        const getPoint = (i: number, j: number): THREE.Vector3 => {
            // Use exact same u,v calculation as the plane
            const u = (i / segments - 0.5) * size;
            const v = (j / segments - 0.5) * size;
            
            let x = 0, y = 0, z = 0;

            switch (solveFor) {
                case "z":
                    x = u;
                    y = v;
                    z = (d - a * x - b * y) / c;
                    break;
                case "y":
                    x = u;
                    z = v;
                    y = (d - a * x - c * z) / b;
                    break;
                case "x":
                    y = u;
                    z = v;
                    x = (d - b * y - c * z) / a;
                    break;
            }
            
            const [tx, ty, tz] = toThreeJS([x, y, z]);
            return new THREE.Vector3(tx, ty, tz);
        };

        // Get the four corners
        const corners = [
            getPoint(0, 0),              // bottom-left
            getPoint(segments, 0),       // bottom-right
            getPoint(segments, segments), // top-right
            getPoint(0, segments),       // top-left
        ];

        // Create 4 edges
        const edges = [
            [corners[0], corners[1]], // bottom
            [corners[1], corners[2]], // right
            [corners[2], corners[3]], // top
            [corners[3], corners[0]], // left
        ];

        return edges.map(([start, end]) => {
            const direction = new THREE.Vector3().subVectors(end, start);
            const length = direction.length();
            const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            
            // Create a quaternion to rotate the cylinder to point along the edge
            const orientation = new THREE.Quaternion();
            orientation.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0), // cylinder default orientation (along Y axis)
                direction.clone().normalize()
            );

            return { midpoint, orientation, length };
        });
    }, [a, b, c, d, size, segments]);

    return (
        <group>
            {/* Main plane */}
            <mesh geometry={threeJSGeometry}>
                <meshStandardMaterial
                    color={color}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={opacity}
                />
            </mesh>
            
            {/* Border cylinders */}
            {borderEdges.map((edge, i) => (
                <mesh 
                    key={i} 
                    position={edge.midpoint}
                    quaternion={edge.orientation}
                >
                    <cylinderGeometry args={[borderWidth, borderWidth, edge.length, 8]} />
                    <meshStandardMaterial
                        color={color}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
}