// src/components/SoftShootingStars.tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { makeStarTexture, makeTrailTexture } from '../../utils/starTextures';

const rand = (a: number, b: number) => a + Math.random() * (b - a);

type ShootingProps = {
    amount?: number;
};

export default function SoftShootingStars({ amount = 30 }: ShootingProps) {
    const headRef = useRef<THREE.InstancedMesh | null>(null);
    const trailThinRef = useRef<THREE.InstancedMesh | null>(null);
    const trailWideRef = useRef<THREE.InstancedMesh | null>(null);

    const starTex = useMemo(() => makeStarTexture(128), []);
    const trailTex = useMemo(() => makeTrailTexture(1024, 96), []);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    type PoolItem = {
        active: boolean;
        pos: THREE.Vector3;
        vel: THREE.Vector3;
        age: number;
        life: number;
        len: number;
        wob: number;
        curve: number;
    };

    const pool = useMemo<PoolItem[]>(
        () =>
            new Array(amount).fill(0).map(() => ({
                active: false,
                pos: new THREE.Vector3(),
                vel: new THREE.Vector3(),
                age: 0,
                life: rand(1.2, 2.6),
                len: rand(3.2, 9.0),
                wob: rand(0.04, 0.12),
                curve: Math.random() * Math.PI * 2,
            })),
        [amount]
    );

    useEffect(() => {
        const spawn = () => {
            for (let tries = 0; tries < 3; tries++) {
                if (Math.random() < 0.92) {
                    const p = pool.find((x) => !x.active);
                    if (!p) return;
                    p.active = true;
                    p.pos.set(rand(15, 45), rand(10, 28), rand(-10, -40));
                    const speed = rand(22, 48);
                    const angleH = rand(-0.7, -0.2);
                    const angleV = rand(-0.3, 0.2);
                    p.vel.set(Math.cos(angleH) * -speed, Math.sin(angleV) * rand(1, 6), rand(-0.5, -3.0));
                    p.life = rand(1.2, 2.6);
                    p.age = 0;
                    p.len = rand(4.0, 11.0);
                    p.wob = rand(0.04, 0.15);
                    p.curve = Math.random() * Math.PI * 2;
                }
            }
        };

        spawn();
        const id = setInterval(spawn, 180);
        return () => clearInterval(id);
    }, [pool]);

    useFrame((_, delta) => {
        const heads = headRef.current,
            thin = trailThinRef.current,
            wide = trailWideRef.current;
        if (!heads || !thin || !wide) return;

        for (let i = 0; i < pool.length; i++) {
            const p = pool[i];
            if (!p.active) {
                dummy.position.set(0, -9999, 0);
                dummy.updateMatrix();
                heads.setMatrixAt(i, dummy.matrix);
                thin.setMatrixAt(i, dummy.matrix);
                wide.setMatrixAt(i, dummy.matrix);
                continue;
            }

            p.age += delta;
            if (p.age >= p.life) {
                p.active = false;
                dummy.position.set(0, -9999, 0);
                dummy.updateMatrix();
                heads.setMatrixAt(i, dummy.matrix);
                thin.setMatrixAt(i, dummy.matrix);
                wide.setMatrixAt(i, dummy.matrix);
                continue;
            }

            const t = p.age / p.life;
            p.pos.addScaledVector(p.vel, delta);
            p.pos.y += Math.sin(t * Math.PI * 3 + p.curve) * p.wob * p.len * 0.2;
            p.pos.x += Math.cos(t * Math.PI * 1.5) * p.wob * 0.8;

            // head
            dummy.position.copy(p.pos);
            dummy.scale.set(1.0, 1.0, 1.0);
            dummy.updateMatrix();
            heads.setMatrixAt(i, dummy.matrix);

            const back = p.pos.clone().sub(p.vel.clone().normalize().multiplyScalar(p.len * 0.5));
            const dir = p.vel.clone().normalize();
            const angle = Math.atan2(dir.y, dir.x);

            // thin trail
            dummy.position.copy(back);
            dummy.rotation.set(0, 0, -angle + Math.sin(t * 8) * 0.05);
            dummy.scale.set(p.len, Math.max(0.2, p.len * 0.14), 1);
            dummy.updateMatrix();
            thin.setMatrixAt(i, dummy.matrix);

            // wide trail
            const back2 = p.pos.clone().sub(p.vel.clone().normalize().multiplyScalar(p.len * 0.8));
            dummy.position.copy(back2);
            dummy.rotation.set(0, 0, -angle + Math.cos(t * 7) * 0.08);
            dummy.scale.set(p.len * 1.6, Math.max(0.6, p.len * 0.3), 1);
            dummy.updateMatrix();
            wide.setMatrixAt(i, dummy.matrix);
        }

        heads.instanceMatrix.needsUpdate = true;
        thin.instanceMatrix.needsUpdate = true;
        wide.instanceMatrix.needsUpdate = true;
    });

    // cleanup textures
    useEffect(() => {
        return () => {
            try {
                starTex.dispose();
            } catch (e) { }
            try {
                trailTex.dispose();
            } catch (e) { }
        };
    }, [starTex, trailTex]);

    return (
        <>
            <instancedMesh ref={headRef} args={[undefined, undefined, pool.length]} frustumCulled={false}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshBasicMaterial map={starTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
            </instancedMesh>

            <instancedMesh ref={trailThinRef} args={[undefined, undefined, pool.length]} frustumCulled={false}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial map={trailTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </instancedMesh>

            <instancedMesh ref={trailWideRef} args={[undefined, undefined, pool.length]} frustumCulled={false}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial map={trailTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.3} side={THREE.DoubleSide} />
            </instancedMesh>
        </>
    );
}
