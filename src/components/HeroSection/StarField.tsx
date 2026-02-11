// src/components/StarField.tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { makeStarTexture } from '../../utils/starTextures';

export type StarFieldProps = {
    count?: number;
    radius?: number;
    minY?: number; // filter out stars below this
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function StarField({ count = 20000, radius = 420, minY = -999 }: StarFieldProps) {
    const ref1 = useRef<THREE.Points | null>(null);
    const ref2 = useRef<THREE.Points | null>(null);

    const starTex = useMemo(() => makeStarTexture(256), []);

    // primary set
    const positions1 = useMemo(() => {
        const arr = new Float32Array(count * 3);
        let i = 0;
        while (i < count) {
            const u = Math.random(), v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = radius * (0.7 + Math.random() * 0.6);
            const y = r * Math.cos(phi);
            if (y < minY) continue;
            arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            arr[i * 3 + 1] = y;
            arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
            i++;
        }
        return arr;
    }, [count, radius, minY]);

    const colors1 = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const t = 0.8 + Math.random() * 0.4;
            arr[i * 3] = t;
            arr[i * 3 + 1] = t * (0.9 + Math.random() * 0.2);
            arr[i * 3 + 2] = t;
        }
        return arr;
    }, [count]);

    const sizes1 = useMemo(() => {
        const s = new Float32Array(count);
        for (let i = 0; i < count; i++) s[i] = rand(0.8, 2.8);
        return s;
    }, [count]);

    // secondary (smaller) set
    const positions2 = useMemo(() => {
        const n = Math.floor(count / 2);
        const arr = new Float32Array(n * 3);
        let i = 0;
        while (i < n) {
            const u = Math.random(), v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = radius * (0.5 + Math.random() * 0.9);
            const y = r * Math.cos(phi);
            if (y < minY) continue;
            arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            arr[i * 3 + 1] = y;
            arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
            i++;
        }
        return arr;
    }, [count, radius, minY]);

    const colors2 = useMemo(() => {
        const n = Math.floor(count / 2);
        const arr = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
            const b = 0.9 + Math.random() * 0.5;
            arr[i * 3] = b * 0.7;
            arr[i * 3 + 1] = b * 0.85;
            arr[i * 3 + 2] = b;
        }
        return arr;
    }, [count]);

    const sizes2 = useMemo(() => {
        const n = Math.floor(count / 2);
        const s = new Float32Array(n);
        for (let i = 0; i < s.length; i++) s[i] = rand(0.4, 1.6);
        return s;
    }, [count]);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (ref1.current) {
            ref1.current.rotation.y = Math.sin(t * 0.012) * 0.1;
            ref1.current.rotation.x = Math.sin(t * 0.008) * 0.03;
            const mat = ref1.current.material as THREE.PointsMaterial;
            mat.size = 1.4 + Math.sin(t * 2.4) * 0.3;
        }
        if (ref2.current) {
            ref2.current.rotation.y = -t * 0.009;
            ref2.current.rotation.x = Math.cos(t * 0.005) * 0.04;
            const mat = ref2.current.material as THREE.PointsMaterial;
            mat.size = 0.9 + Math.sin(t * 3.8) * 0.25;
        }
    });

    // cleanup
    useEffect(() => {
        return () => {
            try {
                starTex.dispose();
            } catch (e) {
                // ignore
            }
        };
    }, [starTex]);

    return (
        <>
            <points ref={ref1} frustumCulled={false}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions1, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors1, 3]} />
                    <bufferAttribute attach="attributes-size" args={[sizes1, 1]} />
                </bufferGeometry>
                <pointsMaterial
                    map={starTex}
                    vertexColors
                    size={1.4}
                    sizeAttenuation
                    depthWrite={false}
                    transparent
                    opacity={0.98}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            <points ref={ref2} frustumCulled={false}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions2, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors2, 3]} />
                    <bufferAttribute attach="attributes-size" args={[sizes2, 1]} />
                </bufferGeometry>
                <pointsMaterial
                    map={starTex}
                    vertexColors
                    size={0.9}
                    sizeAttenuation
                    depthWrite={false}
                    transparent
                    opacity={0.92}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </>
    );
}
