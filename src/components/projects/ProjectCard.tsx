// src/components/projects/ProjectCard.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Project } from '../../data/projects';
import type { IconType } from 'react-icons';
import {
    SiNextdotjs,
    SiTypescript,
    SiTailwindcss,
    SiReact,
    SiFirebase,
    SiVercel,
    SiNodedotjs,
    SiNestjs,
    SiMongodb,
    SiFigma,
    SiGithub,
    SiFlutter,
    SiCloudinary,
    SiBrevo,
} from 'react-icons/si';
import { FiArrowRight } from 'react-icons/fi';

type Props = {
    project: Project;
    onOpen: (p: Project) => void;
    /**
     * When true the central preview image will be loaded with higher priority/eager.
     * ProjectsSection will pass this based on batching rules.
     */
    loadPriority?: boolean;
};

/**
 * Tiny icon map for tags. Extend as needed.
 */
const ICON_MAP: Record<string, IconType> = {
    'Next.js': SiNextdotjs,
    TypeScript: SiTypescript,
    Tailwind: SiTailwindcss,
    'Tailwind CSS': SiTailwindcss,
    React: SiReact,
    'React Native': SiReact,
    Firebase: SiFirebase,
    Vercel: SiVercel,
    'Node.js': SiNodedotjs,
    NestJS: SiNestjs,
    MongoDB: SiMongodb,
    Figma: SiFigma,
    GitHub: SiGithub,
    Flutter: SiFlutter,
    Cloudinary: SiCloudinary,
    Brevo: SiBrevo,
};

export default function ProjectCard({ project, onOpen, loadPriority = false }: Props) {
    const images = project.images ?? [];
    const preview = images[0] ?? '/images/placeholder.png';

    const [isHover, setIsHover] = useState(false);

    // image load state for skeleton/blur
    const [previewLoaded, setPreviewLoaded] = useState(false);

    const deck = images.slice(0, 5);
    const middle = (deck.length - 1) / 2;

    // central preview uses 'cover' when there are multiple images (fills area),
    // and 'contain' when single image so single screenshots remain fully visible.
    const centralFit: 'contain' | 'cover' = images.length > 1 ? 'cover' : 'contain';

    return (
        <button
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={() => onOpen(project)}
            className="no-select no-drag img clickable group relative w-full h-full p-4 md:p-6 rounded-2xl shadow-2xl bg-gradient-to-b from-white/3 to-white/2 border border-white/6 transform-gpu"
            style={{ perspective: 1200 }}
            aria-label={`Open project ${project.title}`}
            type="button"
        >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/60">
                <div className="w-full h-44 md:h-48 relative bg-[#050507] flex items-center justify-center">
                    {/* central preview - only this image scales on hover (no card movement) */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 1 }}
                        animate={{ scale: isHover ? 0.8 : 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                    >
                        {/* wrapper for skeleton/blur */}
                        <div className="relative w-full h-full">
                            {/* skeleton/blur overlay shown until image load */}
                            {!previewLoaded && (
                                <div
                                    aria-hidden
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div
                                        className="w-full h-full rounded-md animate-pulse"
                                        style={{
                                            background:
                                                'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.02) 100%)',
                                            filter: 'blur(6px)',
                                        }}
                                    />
                                </div>
                            )}

                            <Image
                                src={preview}
                                alt={project.title}
                                fill
                                style={{ objectFit: centralFit }}
                                sizes="(max-width: 768px) 100vw, 40vw"
                                draggable={false}
                                // priority makes Next.js preload; use it for first/batched images
                                priority={Boolean(loadPriority)}
                                // next/image supports loading prop but priority overrides it; when not priority use lazy
                                loading={loadPriority ? 'eager' : 'lazy'}
                                onLoadingComplete={() => setPreviewLoaded(true)}
                            />
                        </div>
                    </motion.div>

                    {/* deck / layered thumbnails - centered and larger, expands outside the preview when hovered */}
                    {deck.length > 1 && (
                        <div
                            className="absolute left-1/2 -translate-x-1/2 bottom-2 pointer-events-none"
                            aria-hidden
                        >
                            {/* larger container so thumbnails can extend outside preview */}
                            <div className="relative" style={{ width: 220, height: 128 }}>
                                {deck.map((src, i) => {
                                    const offsetIndex = i - middle;

                                    const baseX = offsetIndex * 22;
                                    const baseY = -Math.abs(offsetIndex) * 6;
                                    const baseRot = offsetIndex * 10;

                                    const hoverX = offsetIndex * 48;
                                    const hoverY = offsetIndex === 0 ? -18 : -6 + (Math.abs(offsetIndex) * 2);
                                    const hoverRot = offsetIndex * 22;
                                    const hoverScale = offsetIndex === 0 ? 1.12 : 1.06;

                                    const zBase = 30 + i;
                                    const zHover = 300 - Math.abs(offsetIndex) * 8;

                                    // don't mark thumbnails as priority even if central is, keep them lazy to save bandwidth
                                    const thumbLoadPriority = false;

                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ x: baseX, y: baseY, rotate: baseRot, scale: 0.98, opacity: 1 }}
                                            animate={{
                                                x: isHover ? hoverX : baseX,
                                                y: isHover ? hoverY : baseY,
                                                rotate: isHover ? hoverRot : baseRot,
                                                scale: isHover ? hoverScale : 0.98,
                                                opacity: 1,
                                            }}
                                            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-hidden border border-white/6 bg-[#000] shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
                                            style={{
                                                width: 176,
                                                height: 108,
                                                zIndex: isHover ? zHover : zBase,
                                                transformStyle: 'preserve-3d',
                                                willChange: 'transform, opacity',
                                                pointerEvents: 'none',
                                                backfaceVisibility: 'hidden',
                                            }}
                                        >
                                            <Image
                                                src={src}
                                                alt={`${project.title} thumbnail ${i + 1}`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                draggable={false}
                                                loading={thumbLoadPriority ? 'eager' : 'lazy'}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Base section */}
                <div className="p-4 md:p-5 relative mb-10">
                    <h4 className="text-lg font-semibold text-white truncate">{project.title}</h4>
                    <p className="mt-2 text-sm text-white/70 leading-snug overflow-hidden">{project.short}</p>

                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                        {project.tags.slice(0, 6).map((t) => {
                            const Icon = ICON_MAP[t] ?? null;
                            return (
                                <span key={t} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/6 text-white/80">
                                    {Icon ? <Icon size={14} className="inline-block" /> : <span className="w-2 h-2 rounded-full bg-white/60 inline-block" />}
                                    <span>{t}</span>
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* footer overlay: year on left, consistent View button on right (keeps gold style) */}
                <div className="absolute left-0 right-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between">
                    <div className="text-xs text-white/70">{project.year ?? ''}</div>
                    <div>
                        <div
                            className="clickable inline-flex items-center gap-2 px-2 py-2 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] border border-white/6 shadow-xl rounded-full text-white text-sm font-semibold shadow-md"
                            aria-label={`View ${project.title}`}
                        >
                            <FiArrowRight size={16} />
                        </div>
                    </div>
                </div>

                {/* subtle hover shine (non-interfering) */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute -left-20 top-0 w-56 h-56 rounded-full bg-gradient-to-tr from-white/6 to-transparent blur-3xl mix-blend-screen" />
                </div>
            </div>
        </button>
    );
}
