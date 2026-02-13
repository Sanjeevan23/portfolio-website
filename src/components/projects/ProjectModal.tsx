// src/components/projects/ProjectModal.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
    SiCloudinary
} from 'react-icons/si';
import { FiX, FiExternalLink, FiChevronLeft, FiChevronRight, FiGithub as FiGithubIcon } from 'react-icons/fi';
import Button from '../Button';

type Props = {
    project: Project | null;
    onClose: () => void;
};

/** same icon map as ProjectCard so stacks look identical */
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
};

export default function ProjectModal({ project, onClose }: Props) {
    const [index, setIndex] = useState<number>(0);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    useEffect(() => {
        if (!project) return;
        setIndex(0);
    }, [project]);

    useEffect(() => {
        if (!project) return;
        // lock body scroll while modal open
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [project]);

    // keyboard handlers
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (!project) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project, index]);

    if (!project) return null;

    const images = project.images ?? [];
    const hasImages = images.length > 0;

    const goNext = () => {
        if (!hasImages) return;
        setIndex((i) => (i + 1) % images.length);
    };
    const goPrev = () => {
        if (!hasImages) return;
        setIndex((i) => (i - 1 + images.length) % images.length);
    };

    // touch handlers for swipe
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchEndX.current = null;
    };
    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
        if (touchStartX.current == null || touchEndX.current == null) return;
        const delta = touchStartX.current - touchEndX.current;
        const threshold = 40;
        if (delta > threshold) {
            // swiped left -> next
            goNext();
        } else if (delta < -threshold) {
            // swiped right -> prev
            goPrev();
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    // click zones: clicking left half or right half of image navigates
    const onImageClick = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 2) goPrev();
        else goNext();
    };

    return (
        <AnimatePresence>
            <motion.div
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="no-select no-drag img fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6"
            >
                {/* backdrop */}
                <div className="absolute inset-0 bg-black/72 backdrop-blur-sm" onClick={onClose} />

                <motion.div
                    initial={{ y: 24, scale: 0.98 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 12, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="relative z-10 w-full max-w-6xl bg-gradient-to-b from-[#031016] to-[#000409] border border-white/6 rounded-2xl shadow-2xl overflow-hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${project.title} details`}
                >
                    {/* Close (top-right) */}
                    <Button
                        onClick={onClose}
                        ariaLabel="Close project"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-3 z-20 clickable w-9 h-9 !p-0 bg-white/6 text-white"
                    >
                        <FiX size={18} />
                    </Button>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* LEFT: carousel / images */}
                        <div
                            className="w-full md:h-[560px] relative bg-black/60 flex items-center justify-center overflow-hidden"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            {hasImages ? (
                                <>
                                    {/* arrows for larger screens */}
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center bg-white/6 p-3 rounded-full"
                                                aria-label="previous image"
                                            >
                                                <FiChevronLeft size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                                                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center bg-white/6 p-3 rounded-full"
                                                aria-label="next image"
                                            >
                                                <FiChevronRight size={18} />
                                            </button>
                                        </>
                                    )}

                                    {/* clickable overlay for tap navigation */}
                                    <div
                                        onClick={onImageClick}
                                        className="absolute inset-0 z-10 cursor-pointer"
                                        aria-hidden
                                    />

                                    {/* sliding track: each slide is minWidth 100% and transform uses -index*100% */}
                                    <div
                                        className="absolute inset-0 flex transition-transform duration-400 ease-out"
                                        style={{
                                            transform: `translateX(-${index * 100}%)`,
                                        }}
                                    >
                                        {images.map((src, i) => (
                                            <div
                                                key={i}
                                                className="flex-none w-full h-full relative flex items-center justify-center"
                                                style={{ minWidth: '100%' }}
                                            >
                                                <Image
                                                    src={src}
                                                    alt={`${project.title} ${i + 1}`}
                                                    fill
                                                    style={{ objectFit: 'contain' }}
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    draggable={false}
                                                />
                                                {/* index badge */}
                                                <div className="absolute left-4 bottom-4 text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
                                                    {i + 1}/{images.length}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/70">No images</div>
                            )}
                        </div>

                        {/* RIGHT: content */}
                        <div className="p-6 md:p-8 flex flex-col gap-4 max-h-[560px]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                                    {project.subtitle && <div className="text-sm text-white/70 mt-1">{project.subtitle}</div>}
                                </div>

                                {/* small role / year */}
                            </div>

                            <div className="text-sm text-white/85 leading-relaxed flex-1 overflow-auto pr-2">
                                {project.long}
                            </div>
                            <div className="text-xs text-white/60 ml-0">Project year - {project.year ?? project.role}</div>


                            {/* Stack with icons */}
                            <div className="mt-2">
                                <div className="text-xs text-white/70">Stack</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {project.tags.map((t) => {
                                        const Icon = ICON_MAP[t] ?? null;
                                        return (
                                            <span
                                                key={t}
                                                className="flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-white/6 text-white/80"
                                            >
                                                {Icon ? <Icon size={14} /> : <span className="w-2 h-2 rounded-full bg-white/60 inline-block" />}
                                                <span>{t}</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* bottom actions: Visit primary, Code secondary */}
                            <div className="mt-4 flex items-center justify-between gap-3">
                                <div className="flex-1" >
                                    {project.website ? (
                                        <Button
                                            href={project.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            ariaLabel="Visit project"
                                            variant="primary"
                                            size="sm"
                                            leftIcon={<FiExternalLink size={16} />}
                                            className="inline-flex w-full gap-2 px-4 py-2 "
                                        >
                                            Visit
                                        </Button>
                                    ) : (
                                        <div className="text-xs text-white/60">No live demo</div>
                                    )}
                                </div>

                                <div>
                                    {project.repo ? (
                                        <Button
                                            href={project.repo}
                                            target="_blank"
                                            rel="noreferrer"
                                            ariaLabel="View code"
                                            variant="ghost"
                                            size="sm"
                                            leftIcon={<FiGithubIcon size={14} />}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/6 text-white/90"
                                        >
                                            Code
                                        </Button>
                                    ) : null}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                                <div>{project.role}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
