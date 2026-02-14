//src/Sections/ExperienceSection.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXPERIENCES } from '../data/experience';
import Button from '../components/Button';
import { FiBriefcase, FiCalendar, FiMapPin, FiExternalLink, FiCode, FiX } from 'react-icons/fi';
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFirebase,
  SiVercel,
  SiNodedotjs,
  SiNestjs,
  SiMongodb,
  SiFlutter,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiMysql,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { useResponsivePadding } from '../hooks/useResponsivePadding';

const TAG_ICON_MAP: Record<string, React.ReactNode> = {
  'Next.js': <SiNextdotjs size={14} />,
  React: <SiReact size={14} />,
  TypeScript: <SiTypescript size={14} />,
  Tailwind: <SiTailwindcss size={14} />,
  Firebase: <SiFirebase size={14} />,
  Vercel: <SiVercel size={14} />,
  'Node.js': <SiNodedotjs size={14} />,
  NestJS: <SiNestjs size={14} />,
  MongoDB: <SiMongodb size={14} />,
  Flutter: <SiFlutter size={14} />,
  HTML5: <SiHtml5 size={14} />,
  CSS3: <SiCss3 size={14} />,
  JavaScript: <SiJavascript size={14} />,
  'React Native': <SiReact size={14} />,
  AWS: <FaAws size={14} />,
  'SQL (basic)': <SiMysql size={14} />,

  // fallback will be FiCode for any tag not listed
};

export default function ExperienceSection() {
      const { isMobile } = useResponsivePadding();
  const [openId, setOpenId] = useState<string | null>(null);

  const openExperience = (id: string) => setOpenId(id);
  const closeExperience = () => setOpenId(null);

  return (
    <section id="experience" className="relative w-full py-16 bg-gradient-to-b from-[#000409] to-[#021017] text-white" style={{marginBottom: isMobile ? 0 : 10}}>
       <div className="edge-fade pointer-events-none absolute inset-0 z-0" />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="mb-8 text-center">
          <h2 className="no-select text-3xl md:text-4xl font-extrabold text-[#f6c85a]">Experience</h2>
          <p className="no-select mt-2 text-white/70 max-w-3xl mx-auto">Roles, responsibilities and impact - compact timeline with clean badges and quick references.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {EXPERIENCES.map((exp, idx) => {
            const isOpen = openId === exp.id;
            return (
              <article key={exp.id} className="relative">
                <motion.div
                  layout
                  onClick={() => openExperience(exp.id)}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 28, delay: idx * 0.06 }}
                  className="h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] border border-white/6 rounded-2xl p-5 shadow-xl hover:shadow-2xl cursor-pointer flex flex-col"
                >
                  <div className="no-select flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-white/6 to-white/2 flex items-center justify-center border border-white/6">
                        <FiBriefcase size={20} className="text-white/90" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white truncate">{exp.title}</h3>
                          <div className="text-sm text-white/70 mt-1 truncate">{exp.company}</div>

                          <div className="flex flex-wrap items-center text-xs text-white/60 mt-2 gap-x-5 gap-y-1 pr-5">

                            {/* Date */}
                            <div className="flex items-center gap-1 max-w-full">
                              <FiCalendar className="shrink-0" />
                              <span className="leading-snug whitespace-nowrap">
                                {exp.start} - {exp.end ?? 'Present'}
                              </span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1 min-w-[180px] flex-1">
                              <FiMapPin className="shrink-0" />
                              <span className="leading-snug break-words">
                                {exp.location ?? '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-white/80 leading-relaxed line-clamp-3">
                        {exp.bullets[0]}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {(exp.tech ?? []).slice(0, 6).map((t) => (
                            <span key={t} className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/6 text-white/85">
                              {TAG_ICON_MAP[t] ?? <FiCode size={14} />}
                              <span className="truncate">{t}</span>
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          {exp.link ? (
                            <Button
                              href={exp.link}
                              target="_blank"
                              rel="noreferrer"
                              size="sm"
                              variant="primary"
                              onClick={(e: React.MouseEvent) => e.stopPropagation()} // prevent card click
                              ariaLabel={`Reference for ${exp.company}`}
                            >
                              <span className="inline-flex items-center gap-2">
                                <FiExternalLink />
                                Reference
                              </span>
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {isOpen && (
                    <>
                      {/* overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.45 }}
                        exit={{ opacity: 0 }}
                        onClick={closeExperience}
                        className="fixed inset-0 z-40 bg-black"
                      />

                      {/* modal */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, rotateX: 10 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.96, rotateX: 8 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                        className="fixed z-50 inset-0 flex items-center justify-center p-4"
                      >
                        <div
                          role="dialog"
                          aria-modal="true"
                          className="w-full max-w-3xl bg-[#001018] rounded-2xl shadow-2xl border border-white/6 p-6 text-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-semibold">{exp.title}</h3>
                              <div className="text-sm text-white/70 mt-1">{exp.company}</div>
                              <div className="flex flex-wrap items-center text-xs text-white/60 mt-2 gap-x-5 gap-y-1 pr-5">

                                {/* Date */}
                                <div className="flex items-center gap-1 max-w-full">
                                  <FiCalendar className="shrink-0" />
                                  <span className="leading-snug whitespace-nowrap">
                                    {exp.start} - {exp.end ?? 'Present'}
                                  </span>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-1 min-w-[180px] flex-1">
                                  <FiMapPin className="shrink-0" />
                                  <span className="leading-snug break-words">
                                    {exp.location ?? '-'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              {exp.link && (
                                <Button
                                  href={exp.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  size="sm"
                                  variant="primary"
                                  ariaLabel={`Reference for ${exp.company}`}
                                >
                                  <span className="inline-flex items-center gap-2">
                                    <FiExternalLink /> Reference
                                  </span>
                                </Button>
                              )}
                              <Button
                                onClick={closeExperience}
                                ariaLabel="Close project"
                                variant="ghost"
                                size="sm"
                                className="clickable w-9 h-9 bg-white/6 text-white"
                              >
                                <FiX size={18} />
                              </Button>
                            </div>
                          </div>

                          <div className="mt-5 text-sm text-white/80 space-y-3">
                            <ul className="list-disc pl-5 space-y-2">
                              {exp.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>

                            <div className="mt-6 flex flex-wrap gap-2">
                              <span className="text-xs text-white/60">Role type:</span>
                              <span className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/6 text-white/85">
                                {exp.workType}</span>

                              <span className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/6 text-white/85">
                                {exp.start} - {exp.end ?? 'Present'}</span>
                              <div className="flex flex-wrap gap-2">

                                <span className="text-xs text-white/60">Tools & Platforms:</span>
                                {(exp.tech ?? []).map((t) => (
                                  <span key={t} className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/6 text-white/85">
                                    {TAG_ICON_MAP[t] ?? <FiCode size={12} />}
                                    <span>{t}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-52 bg-gradient-to-t from-black/80 to-transparent" />
    </section>
  );
}
