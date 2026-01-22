import { Canvas } from '@react-three/fiber';
import type { ReactNode } from 'react';

interface Scene3DProps {
  children: ReactNode;
  height?: string;
}

export default function Scene3D({ children, height = '500px' }: Scene3DProps) {
  return (
    <div style={{ 
      width: '100%',
      // maxWidth: '100%',
      height, 
      border: '1px solid #333',
      borderRadius: '8px',
      overflow: 'hidden',
      background: '#1a1a1a',
      boxSizing: 'border-box'
    }}>
      <Canvas 
        camera={{ position: [8, 8, 8], fov: 50 }}
        style={{ background: '#292929', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {children}
      </Canvas>
    </div>
  );
}