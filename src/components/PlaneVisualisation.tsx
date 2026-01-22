import { OrbitControls, Grid } from '@react-three/drei';
import { useState, useMemo } from 'react';
import * as THREE from 'three';
import Scene3D from './Scene3D';

function Axes() {
  const axisLength = 10;
  
  return (
    <group>
      {/* X axis - red */}
      <mesh position={[axisLength / 2, 0, 0]}>
        <boxGeometry args={[axisLength, 0.05, 0.05]} />
        <meshBasicMaterial color="red" />
      </mesh>
      {/* Y axis - green */}
      <mesh position={[0, axisLength / 2, 0]}>
        <boxGeometry args={[0.05, axisLength, 0.05]} />
        <meshBasicMaterial color="green" />
      </mesh>
      {/* Z axis - blue */}
      <mesh position={[0, 0, axisLength / 2]}>
        <boxGeometry args={[0.05, 0.05, axisLength]} />
        <meshBasicMaterial color="blue" />
      </mesh>
    </group>
  );
}

function Plane({ k }: { k: number }) {
  const geometry = useMemo(() => {
    const size = 8;
    const segments = 50;
    
    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments - 0.5) * size;
        const y = (j / segments - 0.5) * size;
        const z = k - x - y;
        vertices.push(x, y, z);
      }
    }
    
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = a + segments + 1;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    
    return geo;
  }, [k]);
  
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial 
        color="#9fccff" 
        side={THREE.DoubleSide} 
        transparent 
        opacity={0.7}
      />
    </mesh>
  );
}

export default function PlaneVisualization() {
  const [k, setK] = useState(3);
  
  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ marginBottom: '10px', color: 'white' }}>
        Plane Equation: x + y + z = k
      </h2>
      <p style={{ marginBottom: '20px', color: '#aaa' }}>
        Adjust the slider to change the value of k and see how the plane moves through 3D space.
      </p>
      
      <div style={{ 
        marginBottom: '15px',
        padding: '15px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '8px'
      }}>
        <div style={{ marginBottom: '10px', fontSize: '18px', color: 'white' }}>
          k = {k.toFixed(1)}
        </div>
        <input
          type="range"
          min="-5"
          max="10"
          step="0.1"
          value={k}
          onChange={(e) => setK(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
          <span style={{ color: 'red' }}>Red: X</span> | {' '}
          <span style={{ color: 'green' }}>Green: Y</span> | {' '}
          <span style={{ color: 'blue' }}>Blue: Z</span>
        </div>
      </div>
      
      <Scene3D>
        <Axes />
        <Plane k={k} />
        <Grid 
          args={[20, 20]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#6e6e6e"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1}
        />
        <OrbitControls 
          makeDefault 
          enableDamping 
          dampingFactor={0.1}
          rotateSpeed={0.5}
        />
      </Scene3D>
    </div>
  );
}