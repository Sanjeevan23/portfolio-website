//src/components/skills/RotatingRings.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Icons from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { TbBrandOffice } from 'react-icons/tb';
import {
    Smartphone,
    Globe,
    AppWindow,
    Server,
    Network,
    Users,
    MessageCircle,
    Brain,
    ClipboardList,
    PenTool,
} from 'lucide-react';

export type SkillEntry = {
    id: string;
    label: string;
    category: 'tools' | 'frontend' | 'backend' | 'platform' | 'soft';
    color?: string;
    short?: string;
};

export type SkillGroup = {
    key: string;
    title: string;
    items: SkillEntry[];
};

type Props = {
    groups: SkillGroup[];
    size?: number;
    baseRadius?: number;
    radiusStep?: number;
    isMobile?: boolean;
    reduceMotion?: boolean;
    speedMultiplier?: number;
};

const semantic: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
    mobileapp: Smartphone,
    webapp: Globe,
    rest: Network,
    apk: AppWindow,
    teamwork: Users,
    communication: MessageCircle,
    critical: Brain,
    project: ClipboardList,
    uiux: PenTool,
};

function resolveIcon(id: string): React.ComponentType<{ size?: number; color?: string }> {
    if (semantic[id]) return semantic[id];
    if (id === 'vscode') return VscVscode;
    if (id === 'msoffice') return TbBrandOffice;

    const keyMap: Record<string, string> = {
        html: 'SiHtml5',
        css: 'SiCss3',
        js: 'SiJavascript',
        react: 'SiReact',
        next: 'SiNextdotjs',
        ts: 'SiTypescript',
        tailwind: 'SiTailwindcss',
        node: 'SiNodedotjs',
        nest: 'SiNestjs',
        mongodb: 'SiMongodb',
        firebase: 'SiFirebase',
        cloudinary: 'SiCloudinary',
        cloudflare: 'SiCloudflare',
        git: 'SiGithub',
        figma: 'SiFigma',
        adobexd: 'SiAdobexd',
        canva: 'SiCanva',
        flutter: 'SiFlutter',
        android: 'SiAndroid',
        ios: 'SiApple',
        rn: 'SiReact',
    };

    const compName = keyMap[id];
    if (compName && (Icons as Record<string, unknown>)[compName]) {
        // narrow type safely
        return ((Icons as Record<string, unknown>)[compName] as unknown) as React.ComponentType<{
            size?: number;
            color?: string;
        }>;
    }
    return Server;
}

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/* --- precomputed per-item geometry to avoid repeated expensive recompute on every frame --- */
type ItemGeo = {
    key: string;
    label: string;
    Icon: React.ComponentType<{ size?: number; color?: string }>;
    color?: string;
    groupIndex: number;
    baseLon: number; // degrees
    latRad: number; // radians
    radius: number; // px
    speedFactor: number;
};

export default function RotatingRings({
    groups,
    size = 420,
    radiusStep = 48,
    isMobile = false,
    reduceMotion = false,
    speedMultiplier = 1,
}: Props) {
    // world scale & focal
    const worldScale = 1.5;
    const FOCAL = size * 2.2;
    const cx = size / 2;
    const cy = size / 2;

    const latRangeDeg = 120; // -60..+60
    const totalRings = Math.max(1, groups.length);
    const baseSphereR = Math.max(80, Math.round((size / 3.6) * worldScale));
    const centerDisplayBase = isMobile ? 96 : 140;
    const centerDisplaySize = Math.round(centerDisplayBase * worldScale);

    // tuned calm speeds
    const baseSpeeds = [10, -8, 12, -9, 7];
    const ringSpeed = (i: number) => (baseSpeeds[i % baseSpeeds.length] || 8) * speedMultiplier;

    // precompute base longitudes & geometry whenever groups change
    const items = useMemo<ItemGeo[]>(() => {
        const arr: ItemGeo[] = [];
        groups.forEach((g, gi) => {
            const latDeg = totalRings === 1 ? 0 : -latRangeDeg / 2 + (gi * latRangeDeg) / Math.max(1, totalRings - 1);
            const latRad = (latDeg * Math.PI) / 180;
            const radius = baseSphereR + gi * (radiusStep * 0.42);
            const speed = ringSpeed(gi);
            const speedFactor = Math.abs(speed) / 30;
            const count = Math.max(1, g.items.length);

            g.items.forEach((it, idx) => {
                const baseLon = (360 * idx) / count;
                arr.push({
                    key: `${g.key}-${it.id}`,
                    label: it.label,
                    Icon: resolveIcon(it.id),
                    color: it.color,
                    groupIndex: gi,
                    baseLon,
                    latRad,
                    radius,
                    speedFactor,
                });
            });
        });
        return arr;
    }, [groups, totalRings, baseSphereR, radiusStep]);

    // refs for DOM elements (not for React re-render)
    const elMap = useRef<Map<string, HTMLDivElement | null>>(new Map());
    const containerRef = useRef<HTMLDivElement | null>(null);

    // animation loop state
    const angleRef = useRef<number>(0);
    const lastRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    // small mounted flag for fade-in
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (reduceMotion) return;
        let mountedLocal = true;

        const step = (ts: number) => {
            if (!mountedLocal) return;
            if (lastRef.current == null) lastRef.current = ts;
            const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
            lastRef.current = ts;
            angleRef.current += dt * 22 * speedMultiplier;

            // update DOM directly for each item (avoids React rerenders)
            for (let i = 0; i < items.length; i++) {
                const it = items[i];
                const el = elMap.current.get(it.key);
                if (!el) continue;

                const lonDeg = (it.baseLon + angleRef.current * it.speedFactor) % 360;
                const lonRad = (lonDeg * Math.PI) / 180;

                const x = it.radius * Math.cos(it.latRad) * Math.cos(lonRad);
                const y = it.radius * Math.sin(it.latRad);
                const z = it.radius * Math.cos(it.latRad) * Math.sin(lonRad);

                const scale = FOCAL / (FOCAL - z);
                const screenX = cx + x * scale;
                const screenY = cy + y * scale * 0.85;

                const depthNormalized = (z + it.radius) / (2 * it.radius);
                const opacity = clamp(0.4 + depthNormalized * 0.7, 0.08, 1);

                const horizDist = Math.hypot(x, y);
                const isBehind = z < 0;
                const globeOcclusionThreshold = baseSphereR * 0.6;
                const isOccluded = isBehind && horizDist < globeOcclusionThreshold;

                const finalOpacity = isOccluded ? 0.14 : opacity * (isBehind ? 0.7 : 1);
                const finalScale = isOccluded ? clamp(scale * 0.78, 0.2, 2) : clamp(scale * (isBehind ? 0.92 : 1), 0.2, 2);

                // translate3d + scale for GPU acceleration
                el.style.transform = `translate3d(${screenX}px, ${screenY - 40}px, 0) translate(-50%, -50%) scale(${finalScale})`;
                el.style.opacity = String(finalOpacity);
                el.style.zIndex = String(Math.round(z + 100000));
                el.style.pointerEvents = isOccluded ? 'none' : 'auto';

                if (isOccluded) {
                    el.style.filter = 'blur(2px) brightness(0.9)';
                } else {
                    el.style.filter = 'none';
                }
            }
            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);

        return () => {
            mountedLocal = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            lastRef.current = null;
        };
    }, [items, reduceMotion, speedMultiplier, FOCAL, cx, cy, baseSphereR]);

    // cleanup refs when items change
    useEffect(() => {
        // clear map and leave element nodes to GC if not reused
        elMap.current = new Map();
    }, [items.length]);

    return (
        <div
            ref={containerRef}
            aria-hidden
            style={{ width: size, height: size, perspective: `${FOCAL}px`, WebkitPerspective: `${FOCAL}px`, position: 'relative', marginTop: isMobile ? 40 : 0,}}
        >
            {/* center globe */}
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '48%',
                    transform: 'translate(-50%,-50%)',
                    width: centerDisplaySize,
                    height: centerDisplaySize,
                    borderRadius: 9999,
                    background:
                        'radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.56), rgba(6,10,14,0.72)), linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.01))',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: 'inset 0 8px 40px rgba(2,6,23,0.8), 0 20px 60px rgba(0,0,0,0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#e1e4ff',
                    fontWeight: 700,
                    fontSize: isMobile ? 12 : 16,
                    zIndex: 5000,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                }}
            >
                <svg width="86%" height="86%" viewBox="0 0 100 100" style={{ opacity: 0.18, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.45))' }}>
                    <defs>
                        <linearGradient id="g1" x1="0" x2="1">
                            <stop offset="0" stopColor="#f6c85a" stopOpacity="0.35" />
                            <stop offset="1" stopColor="#c48b28" stopOpacity="0.08" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="none" stroke="url(#g1)" strokeWidth="0.9" />
                    <ellipse cx="50" cy="50" rx="40" ry="11" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <ellipse cx="50" cy="50" rx="36" ry="8" fill="none" stroke="currentColor" strokeWidth="0.35" />
                    <path d="M10 50 A40 40 0 0 0 90 50" fill="none" stroke="currentColor" strokeWidth="0.45" />
                    <path d="M16 66 A34 34 0 0 0 84 34" fill="none" stroke="currentColor" strokeWidth="0.35" />
                    <g opacity="0.16">
                        {Array.from({ length: 12 }).map((_, i) => {
                            const a = (i / 12) * Math.PI * 2;
                            const x1 = 50 + Math.cos(a) * 42;
                            const y1 = 50 + Math.sin(a) * 42;
                            const x2 = 50 + Math.cos(a) * 30;
                            const y2 = 50 + Math.sin(a) * 30;
                            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.25" />;
                        })}
                    </g>
                </svg>
            </div>

            {/* items rendered once; DOM updated directly for smooth animation */}
            {items.map((it) => {
                const base = isMobile ? 35 : 46;
                const iconSize = Math.round(base * 0.62);

                return (
                    <div
                        key={it.key}
                        ref={(el) => {
                            elMap.current.set(it.key, el);
                        }}
                        title={it.label}
                        role="button"
                        onClick={() => {
                            const el = document.getElementById(it.key.split('-').slice(1).join('-'));
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            transform: 'translate3d(0,0,0)',
                            transformOrigin: '50% 50%',
                            willChange: 'transform, opacity',
                            transition: mounted ? 'opacity 260ms ease' : 'none',
                            opacity: mounted ? 1 : 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0,
                            pointerEvents: 'auto',
                        }}
                    >
                        <div
                            style={{
                                width: base,
                                height: base,
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(180deg, rgba(212, 179, 17, 0.06), rgba(196, 166, 18, 0.01))',
                                border: '1px solid rgba(255,255,255,0.04)',
                                boxShadow: '0 10px 26px rgba(0,0,0,0.62)',
                                transform: 'translateZ(0)',
                                cursor: 'pointer',
                            }}
                        >
                            <it.Icon size={iconSize} color={it.color ?? '#fff'} />
                        </div>
                        <div
                            style={{
                                marginTop: 0,
                                fontSize: isMobile ? 9 : 12,
                                color: '#fff',
                                opacity: 0.95,
                                background: 'rgba(0,0,0,0.12)',
                                padding: '2px 4px',
                                borderRadius: 999,
                                border: '1px solid rgba(255,255,255,0.02)',
                                backdropFilter: 'blur(6px)',
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                            }}
                        >
                            {it.label}
                        </div>
                    </div>
                );
            })}

            <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .ring-anim {
            animation: none !important;
          }
        }
      `}</style>
        </div>
    );
}
