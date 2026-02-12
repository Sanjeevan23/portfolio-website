// src/Sections/Skills.tsx
'use client';

import { useMemo } from 'react';
import RotatingRings, { SkillGroup, SkillEntry } from '../components/skills/RotatingRings';
import { SKILLS } from '../data/skills';
import { useResponsivePadding } from '../hooks/useResponsivePadding';

/* map categories to human-friendly headings and order */
const CATEGORY_ORDER: { key: string; title: string }[] = [
    { key: 'frontend', title: 'Languages & UI' },
    { key: 'backend', title: 'Backend & APIs' },
    { key: 'platform', title: 'Platforms' },
    { key: 'tools', title: 'Tools & Services' },
    { key: 'soft', title: 'Soft & Design' },
];

export default function SkillsSection() {
    const { isMobile } = useResponsivePadding();

    const groups = useMemo<SkillGroup[]>(() => {
        const map = new Map<string, SkillEntry[]>();
        CATEGORY_ORDER.forEach((c) => map.set(c.key, [] as SkillEntry[]));
        SKILLS.forEach((s) => {
            if (!map.has(s.category)) map.set(s.category, []);
            (map.get(s.category) as SkillEntry[]).push(s);
        });
        return CATEGORY_ORDER
            .map((c) => ({ key: c.key, title: c.title, items: (map.get(c.key) as SkillEntry[]) || [] }))
            .filter((g) => g.items.length > 0);
    }, []);

    /* visual config */
    const containerSize = isMobile ? 300 : 420;
    const baseRadius = isMobile ? 60 : 120;
    const radiusStep = isMobile ? 45 : 48;

    return (
        <section id="skills" className="relative w-full bg-gradient-to-b from-[#020204] via-[#04131a] to-[#031016] text-white relative" style={{ paddingTop: isMobile ? 0 : 40, paddingBottom: 60 }}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#f6c85a]">My Skills</h2>
                    <p className="mt-2 max-w-3xl mx-auto text-sm text-white/70">
                        Technologies I use to design, build and scale real products - from mobile apps to full-stack platforms.
                    </p>
                </div>

                <div
                    className="relative rounded-2xl overflow-visible bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] border border-white/6 shadow-xl p-6 md:p-10" >
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* left column */}
                        <div className="w-full md:w-2/4">
                            <h3 className="text-lg font-semibold text-[#ffff]">Engineering with clarity and purpose</h3>
                            <p className="mt-3 text-sm text-white/70">
                                I focus on building reliable applications, not just writing code. From planning and UI/UX thinking to scalable architecture, I approach projects by understanding the user first, then choosing the right technologies to support performance, clarity and maintainability.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <span className="chip">User-Focused • Scalable • Maintainable</span>
                                <span className="chip">Clean Code • Performance Driven</span>
                                <span className="chip">Modern • Adaptive • Continuously Learning</span>
                            </div>
                        </div>

                        {/* right: rings area */}
                        <div className="w-full md:w-2/3 flex justify-center">
                            <RotatingRings
                                groups={groups}
                                size={containerSize}
                                baseRadius={baseRadius}
                                radiusStep={radiusStep}
                                isMobile={isMobile}
                            />
                        </div>
                    </div>
                </div>

                {/* bottom chips */}
                <div className="mt-6 flex flex-wrap gap-3">
                    <div className="chip">Website • React • Next.js • TypeScript • Tailwind</div>
                    <div className="chip">Mobile • React Native • Flutter</div>
                    <div className="chip">Backend • Node.js • NestJS • REST APIs • CRUD Functions • Firebase</div>
                    <div className="chip">Database • Firestore • MongoDB • Storage</div>
                    <div className="chip">Design • Figma • UI/UX • Adobe XD</div>
                </div>
            </div>

            <style jsx>{`
        .chip {
          background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 13px;
          color: #f7ecd6;
          border: 1px solid rgba(255,255,255,0.04);
        }
        @media (prefers-reduced-motion: reduce) {
          .ring-anim { animation: none !important; transform: none !important; }
        }
      `}</style>
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent" />

        </section>
    );
}
