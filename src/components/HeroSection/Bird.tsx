// src/components/HeroSection/Bird.tsx
'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

type BirdProps = {
  radius?: number;   // orbit radius
  height?: number;   // absolute world Y position (center of orbit)
  speed?: number;    // speed multiplier
};

export default function Bird({ radius = 2.4, height = 0.6, speed = 1.6 }: BirdProps) {
  const ref = useRef<THREE.Group | null>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (!ref.current) return;
    const x = Math.cos(t) * radius;
    // keep z a bit behind the main overlay so it sits visually above the horizon
    const z = Math.sin(t * 0.8) * (radius * 0.6) - 8;
    const y = height + Math.sin(t * 2.2) * 0.25; // much smaller wing bob so the bird doesn't fly away
    ref.current.position.set(x, y, z);
    ref.current.rotation.y = Math.atan2(-z, x) * 0.02;

    const wingL = ref.current.getObjectByName('wingL') as THREE.Mesh | undefined;
    const wingR = ref.current.getObjectByName('wingR') as THREE.Mesh | undefined;
    if (wingL && wingR) {
      // faster flapping relative to speed but constrained amplitude
      wingL.rotation.z = Math.sin(t * 8) * 0.6;
      wingR.rotation.z = -Math.sin(t * 8) * 0.6;
    }
  });

  return (
    <group ref={ref}>
      <group>
        <mesh position={[0, 0, 0]}> <sphereGeometry args={[0.08, 8, 8]} /> <meshStandardMaterial color="#ffffff" /> </mesh>
        <mesh name="wingL" position={[-0.12, 0, 0]}> <boxGeometry args={[0.22, 0.02, 0.6]} /> <meshStandardMaterial color="#ffffff" /> </mesh>
        <mesh name="wingR" position={[0.12, 0, 0]}> <boxGeometry args={[0.22, 0.02, 0.6]} /> <meshStandardMaterial color="#ffffff" /> </mesh>
      </group>
    </group>
  );
}
