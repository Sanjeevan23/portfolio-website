// src/Sections/ProjectsSection.tsx
'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';
import { PROJECTS } from '../data/projects';
import type { Project } from '../data/projects';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useResponsivePadding } from '../hooks/useResponsivePadding';

export default function ProjectsSection() {
    const { isMobile } = useResponsivePadding();
    const projects = useMemo(() => PROJECTS, []);
    const [openProject, setOpenProject] = useState<Project | null>(null);
    const [showAll, setShowAll] = useState(false);
    const [batchesToLoad, setBatchesToLoad] = useState(1);

    // keep a ref to clear timers on unmount
    const timersRef = useRef<number[]>([]);

    useEffect(() => {
        // clean any existing timers on mount/unmount or when showAll changes
        return () => {
            timersRef.current.forEach((id) => clearTimeout(id));
            timersRef.current = [];
        };
    }, []);

    useEffect(() => {
        // we progressively enable more batches (each batch covers 2 cards).
        // when showAll = false, limit to visibleCount (4). When showAll = true, gradually load the rest.
        const visibleCount = showAll ? projects.length : Math.min(isMobile ? 4 : 6, projects.length);
        const targetBatches = Math.max(1, Math.ceil(visibleCount / 2));
        // make sure we eventually reach the targetBatches; start from current and step up with small delays
        // small delays avoid clobbering network with many eager requests at once.
        let current = 1;
        setBatchesToLoad(1);

        // clear old timers
        timersRef.current.forEach((id) => clearTimeout(id));
        timersRef.current = [];

        for (let b = 2; b <= targetBatches; b++) {
            // ramp up at 300ms intervals (adjust if you want faster or slower)
            const id = window.setTimeout(() => {
                setBatchesToLoad((prev) => Math.max(prev, b));
            }, (b - 1) * 300);
            timersRef.current.push(id);
        }

        // if showAll is true, queue remaining batches beyond visibleCount as well
        if (showAll && projects.length > visibleCount) {
            const maxBatches = Math.ceil(projects.length / 2);
            for (let b = targetBatches + 1; b <= maxBatches; b++) {
                const id = window.setTimeout(() => {
                    setBatchesToLoad((prev) => Math.max(prev, b));
                }, (b - 1) * 300);
                timersRef.current.push(id);
            }
        }

        return () => {
            timersRef.current.forEach((id) => clearTimeout(id));
            timersRef.current = [];
        };
        // we deliberately want this to re-run when showAll or projects changes
    }, [showAll, projects]);

    const visibleProjects = showAll ? projects : projects.slice(0, isMobile ? 4 : 6);

    return (
        <section id="projects" className="relative w-full py-16 bg-[linear-gradient(180deg,#000007,#02030a)] text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-10 text-center">
                    <h2 className="no-select text-3xl md:text-4xl font-extrabold text-[#f6c85a]">Projects</h2>
                    <p className="no-select mt-3 text-white/70 max-w-3xl mx-auto">Completed works - websites, mobile apps, backend systems and design work. Click any project to view details.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleProjects.map((p, index) => {
                        // determine whether this card should be priority-loaded based on batchesToLoad
                        const batchIndex = Math.floor(index / 2) + 1; // 1-based
                        const loadPriority = batchIndex <= batchesToLoad;
                        return (
                            <div key={p.id} className="h-full">
                                <ProjectCard project={p} onOpen={(x) => setOpenProject(x)} loadPriority={loadPriority} />
                            </div>
                        );
                    })}
                </div>

                {/* view all / hide button */}
                {projects.length > (isMobile ? 4 : 6) && (
                    <div className="mt-8 flex justify-center">
                        <motion.button
                            onClick={() => setShowAll((s) => !s)}
                            initial={false}
                            animate={{ scale: 1 }}
                            whileTap={{ scale: 0.98 }}
                            className="clickable inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] border border-white/6 shadow-xl text-white text-sm font-semibold"
                            aria-pressed={showAll}
                            aria-label={showAll ? 'Hide projects' : 'View all projects'}
                            type="button"
                        >
                            <span className="flex items-center gap-2">
                                {showAll ? (
                                    <>
                                        <FiChevronUp size={16} />
                                        <span>Hide projects</span>
                                    </>
                                ) : (
                                    <>
                                        <FiChevronDown size={16} />
                                        <span>View all projects</span>
                                    </>
                                )}
                            </span>
                        </motion.button>
                    </div>
                )}
            </div>

            <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/80 to-transparent" />

        </section>
    );
}
