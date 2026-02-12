// src/Sections/HeroScreen.tsx
'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import ContactModal from './../components/ContactModal';

import { makeTorusGlowTexture } from './../utils/starTextures'; // used by HorizonSilhouette below
import StarField from '../components/HeroSection/StarField';
import SoftShootingStars from '../components/HeroSection/SoftShootingStars';
import Bird from '../components/HeroSection/Bird';
import Button from '../components/Button';
import { useResponsivePadding } from '../hooks/useResponsivePadding';

/* ---------- MAXIMUM ANIMATION CONFIG ---------- */
const STAR_COUNT = 20000;
const SHOOTING_STAR_COUNT = 30;
const DPR_MAX = 1.6;

/* ---------- A small ground scene inside the world: tiny person + laptop + bird ---------- */
function GroundScene({ x = 0 }: { x?: number }) {
    // human-scale ground position so the small person and bird are visible to the camera
    const groundY = -2.2;
    return (
        <group position={[x, groundY, -8]}>
            <Bird radius={2.4} height={1.6} speed={1.8} />
        </group>
    );
}

/* ---------- HorizonSilhouette (bottom circle) with glow texture ---------- */
function HorizonSilhouette({ radius = 140, thickness = 0.18, yOffset = -28 }: { radius?: number; thickness?: number; yOffset?: number }) {
    const { isMobile } = useResponsivePadding();
    const glowTex = useMemo(() => makeTorusGlowTexture(1024, 64), []);
    // dispose glow tex on unmount
    useEffect(() => {
        return () => {
            try { glowTex.dispose(); } catch (e) { /* ignore */ }
        };
    }, [glowTex]);

    return (
        <group position={[0, -radius + yOffset, isMobile? -32:-30]} rotation={[Math.PI * 0.005, 0, 0]}>
            <mesh renderOrder={300} receiveShadow>
                <torusGeometry args={[radius, thickness, 24, 200, Math.PI * 1.8]} />
                <meshStandardMaterial color="#04060a" roughness={1} metalness={0.02} depthTest={false} />
            </mesh>

            <mesh renderOrder={310}>
                <torusGeometry args={[radius + 0.03, thickness * 1.12, 16, 200, Math.PI * 1.8]} />
                <meshBasicMaterial map={glowTex} transparent opacity={0.95} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthTest={false} />
            </mesh>

            <mesh renderOrder={320}>
                <torusGeometry args={[radius + 0.07, thickness * 0.12, 12, 200, Math.PI * 1.8]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.12} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthTest={false} />
            </mesh>
        </group>
    );
}

/* ---------- Moving decorative light for subtle animation ---------- */
function MovingLight() {
    const ref = useRef<THREE.PointLight | null>(null);
    useFrame((state) => {
        const t = state.clock.elapsedTime * 0.25;
        if (!ref.current) return;
        ref.current.position.set(Math.sin(t * 0.7) * 8, 3 + Math.cos(t * 1.2) * 1, -4 + Math.cos(t * 0.4) * 2);
        ref.current.intensity = 0.8 + Math.sin(t * 0.9) * 0.2;
        const hue = 0.55 + Math.sin(t * 0.6) * 0.02;
        ref.current.color.setHSL(hue, 0.7, 0.6);
    });
    return <pointLight ref={ref} distance={200} decay={2} />;
}

/* ---------- DYNAMIC CAMERA ---------- */
function SurfaceCamera({ planetRadius = 1.62, heightOffset = 0.08 }: { planetRadius?: number; heightOffset?: number }) {
    const { camera } = useThree();
    useEffect(() => {
        const cam = camera as THREE.PerspectiveCamera;
        cam.position.set(0, planetRadius + heightOffset, 2.4);
        cam.fov = 50;
        cam.updateProjectionMatrix();
    }, [camera, planetRadius, heightOffset]);

    useFrame((state) => {
        const t = state.clock.elapsedTime * 0.3;
        const orbitX = Math.sin(t * 0.4) * 0.18;
        const orbitZ = 2.4 + Math.cos(t * 0.4) * 0.1;
        camera.position.x = orbitX;
        camera.position.z = orbitZ;
        camera.position.y = planetRadius + heightOffset + Math.sin(t * 0.9) * 0.02;
        camera.lookAt(0, 0.1, -1.2);
    });
    return null;
}

/* ---------- Overlay text — will re-mount on refresh to force animation ---------- */
function HeroOverlay({ onContact }: { onContact: () => void }) {
    const [keyStamp] = useState(() => Date.now());
    const triggerBurst = () => window.dispatchEvent(new Event('emitFromName'));
    const [hover,] = useState(false);
    const [clicked, setClicked] = useState(false);

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            <div className="max-w-4xl px-6 lg:px-12 text-center pointer-events-auto">
                <motion.h1
                    key={keyStamp}
                    initial={{ opacity: 0, y: 36, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.06, duration: 0.9, ease: 'easeOut' }}
                    className="text-4xl md:text-6xl font-extrabold leading-tight text-white"
                >
                    Hi, I’m{' '}
                    <motion.span
                        id="hero-name"
                        initial={{ scale: 0.98, y: 6 }}
                        animate={{ scale: [1, 1.06, 1], y: [0, -6, 0] }}
                        // transition={{ repeat: Infinity, repeatDelay: 3, duration: 2.8, ease: 'easeInOut' }}
                        className="text-[#f6c85a]"
                        onClick={triggerBurst}
                        style={{ display: 'inline-block' }}
                    >
                        Sanjeevan
                    </motion.span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.9 }}
                    className="mt-4 text-lg md:text-xl text-white/85 max-w-2xl mx-auto"
                >
                    Full-stack engineer crafting refined web and mobile experiences. Always learning, adapting, and focused on creating products with thoughtful UI/UX design that feel as good as they work.
                </motion.p>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36, duration: 0.9 }} className="mt-8 flex items-center justify-center gap-4">
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => { setClicked(true); onContact(); setTimeout(() => setClicked(false), 550); }}
                        leftIcon={
                            <motion.span
                                animate={{
                                    rotate: hover ? [0, -10, 10, -10, 0] : 0,
                                    scale: clicked ? [1, 1.25, 1] : 1,
                                }}
                                transition={{ duration: 0.6, ease: 'easeInOut' }}
                                className="flex items-center justify-center"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M21 12c0 4.418-4.03 8-9 8a9.93 9.93 0 0 1-4.19-.9L3 21l1.96-3.68A7.44 7.44 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
                                        stroke="#000"
                                        strokeWidth="1.6"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </motion.span>
                        }
                        transition={{ duration: 0.25 }}
                    >
                        Get in Touch
                    </Button>
                    <Button
                        variant="outline"
                        size="md"
                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                        rightIcon={
                            <motion.span
                                initial={{ rotate: 0 }}
                                whileTap={{ rotate: 120 }}
                                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                                className="relative flex items-center justify-center w-8 h-8"
                            >
                                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-white/20 blur-[0px]" />
                                <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-black/70">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14M13 5l7 7-7 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </motion.span>
                        }
                    >
                        View Projects
                    </Button>

                </motion.div>
            </div>
        </div>
    );
}

export default function HeroScreen() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const horizonRadius = 140;
    const horizonYOffset = -28;
    const horizonThickness = 0.18;
    const horizonTopY = -horizonRadius + horizonYOffset + horizonThickness * 0.5; // slightly above the torus centre

    return (
        <section id="about" className="relative h-screen w-full overflow-hidden">
            <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#020204] via-[#04131a] to-[#031016]" />

            {!mounted ? (
                <div className="absolute inset-0 z-0" />
            ) : (
                <Canvas
                    className="absolute inset-0 z-0 hero-canvas"
                    camera={{ position: [0, 2.3, 2.3], fov: 50 }}
                    dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, DPR_MAX)]}
                    gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
                    shadows
                    onCreated={(s) => {
                        s.gl.toneMapping = THREE.ACESFilmicToneMapping;
                        s.gl.toneMappingExposure = 1.0;
                        s.scene.fog = new THREE.FogExp2('#000009', 0.0022);
                        s.gl.setClearColor(new THREE.Color('#000007'));
                    }}
                >
                    <ambientLight intensity={0.45} />
                    <directionalLight castShadow position={[10, 30, 10]} intensity={0.6} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
                    <hemisphereLight args={[new THREE.Color('#071a25'), new THREE.Color('#001213'), 0.65]} />

                    <Suspense fallback={null}>
                        <HorizonSilhouette radius={horizonRadius} thickness={horizonThickness} yOffset={horizonYOffset} />
                        {/* Reusable star components */}
                        <StarField count={STAR_COUNT} radius={420} minY={horizonTopY} />
                        <SoftShootingStars amount={SHOOTING_STAR_COUNT} />

                        <GroundScene />
                        <MovingLight />
                        <SurfaceCamera planetRadius={1.62} heightOffset={0.08} />
                        <OrbitControls enablePan={false} enableRotate={false} enableZoom={false} />
                    </Suspense>
                </Canvas>
            )}
            <HeroOverlay onContact={() => setOpen(true)} />
            <ContactModal open={open} onClose={() => setOpen(false)} />
        </section>
    );
}
