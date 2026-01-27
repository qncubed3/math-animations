// Scene3D.tsx
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useImperativeHandle, useRef, forwardRef } from "react";
import type { ReactNode, ForwardedRef } from 'react';
import * as THREE from "three"

interface Scene3DProps {
  children: ReactNode;
  height?: string;
}

export type CoordsCard3DRef = {
    resetView: () => void;
}

function Scene3D(
  { children, height = '500px' }: Scene3DProps, 
  ref: ForwardedRef<CoordsCard3DRef>
) {
  const controlsRef = useRef<any>(null);

  const resetView = () => {
    console.log("hi")
    if (controlsRef.current) {
      // Reset target (what the camera looks at)
      controlsRef.current.target.set(0, 0, 0);
      
      // Smoothly animate camera back to default position
      const camera = controlsRef.current.object;
      const startPos = camera.position.clone();
      const endPos = new THREE.Vector3(8, 8, 8);
      const duration = 1000; // 1 second animation
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation (ease-out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        
        camera.position.lerpVectors(startPos, endPos, eased);
        controlsRef.current.update();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  };
  
  useImperativeHandle(ref, () => ({
    resetView
  }))

  return (
    <div style={{ 
      width: '100%',
      height, 
      border: '1px solid #333',
      borderRadius: '8px',
      overflow: 'hidden',
      background: '#ffffff',
      boxSizing: 'border-box'
    }}>
      <Canvas 
        camera={{ position: [10, 10, 0], fov: 50 }}
        style={{ background: '#000000', width: '100%', height: '100%' }}
      >
        <OrbitControls 
          ref={controlsRef}
          makeDefault 
          enableDamping 
          dampingFactor={0.1}
          rotateSpeed={0.5}
          minDistance={3}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {children}
      </Canvas>
    </div>
  );
}

export default forwardRef<CoordsCard3DRef, Scene3DProps>(Scene3D);