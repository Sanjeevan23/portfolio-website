// src/components/Header/Header.tsx
'use client';

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import { motion, LayoutGroup, useReducedMotion } from 'framer-motion';

const TABS = [
  { id: 'about', label: 'About', icon: 'About' },
  { id: 'skills', label: 'Skills', icon: 'Skills' },
  { id: 'projects', label: 'Projects', icon: 'Projects' },
  { id: 'experience', label: 'Experience', icon: 'Experience' },
  { id: 'contact', label: 'Contact', icon: 'Contact' },
];

export default function Header() {
  const shouldReduceMotion = useReducedMotion();

  const [active, setActive] = useState<string>('about');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // refs for measurement
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const mountedRef = useRef(false);

  // pill visual state
  const [pill, setPill] = useState({ x: 0, w: 0, visible: false });

  // suppress observer while manual scroll animates
  const suppressObserverRef = useRef<number | null>(null);

  // long press state for mobile bubble (and explicit show on focus)
  const longPressTimers = useRef<Record<string, number | null>>({});
  const [showLabelFor, setShowLabelFor] = useState<string | null>(null);

  // when bubble would be off-screen above, show below instead
  const [bubbleBelow, setBubbleBelow] = useState<Record<string, boolean>>({});

  // header top safe area
  const headerTop = useMemo(() => `calc(env(safe-area-inset-top, 0px) + 12px)`, []);

  /* ---------- responsive ---------- */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ---------- IntersectionObserver scroll-spy (non-aggressive) ---------- */
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const sections = TABS.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: `-28% 0px -45% 0px`,
      threshold: [0, 0.1, 0.4, 0.6, 0.9, 1],
    };

    const onIntersect: IntersectionObserverCallback = (entries) => {
      if (suppressObserverRef.current) return;

      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        const id = visible.target.id;
        if (id && id !== active) {
          setActive(id);
        }
      }
    };

    const io = new IntersectionObserver(onIntersect, observerOptions);
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- suppress observer helper ---------- */
  const suppressObserver = (ms = 900) => {
    if (suppressObserverRef.current) {
      window.clearTimeout(suppressObserverRef.current);
      suppressObserverRef.current = null;
    }
    suppressObserverRef.current = window.setTimeout(() => {
      suppressObserverRef.current = null;
    }, ms);
  };

  /* ---------- scrollTo with immediate visual feedback ---------- */
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    // set active immediately so pill moves instantly
    setActive(id);
    suppressObserver(900);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  /* ---------- measure pill position & bubble direction ---------- */
  const measure = useCallback(() => {
    const nav = navContainerRef.current;
    if (!nav) return;

    // measure active tab button
    const activeBtn = tabRefs.current[active];
    if (activeBtn && nav) {
      const navRect = nav.getBoundingClientRect();
      const b = activeBtn.getBoundingClientRect();
      const x = Math.round(b.left - navRect.left);
      const w = Math.round(b.width);
      setPill({ x, w, visible: true });
    } else {
      setPill((p) => ({ ...p, visible: false }));
    }

    // compute bubbleBelow per visible icon (mobile)
    const newBubbleBelow: Record<string, boolean> = {};
    TABS.forEach((t) => {
      const btn = tabRefs.current[t.id];
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      // if the top of the icon is too close to top viewport (e.g., < 80px), show bubble below
      const shouldShowBelow = rect.top < 88;
      newBubbleBelow[t.id] = shouldShowBelow;
    });
    setBubbleBelow(newBubbleBelow);
  }, [active]);

  /* measure on mount, on active change, on resize & on scroll (rAF throttled) */
  useLayoutEffect(() => {
    // initial measure
    measure();

    let raf = 0;
    const onResizeOrScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        measure();
        raf = 0;
      });
    };

    window.addEventListener('resize', onResizeOrScroll, { passive: true });
    window.addEventListener('scroll', onResizeOrScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResizeOrScroll);
      window.removeEventListener('scroll', onResizeOrScroll);
    };
  }, [measure]);

  /* ---------- mobile long-press handlers (show label only on long-press or focus) ---------- */
  const handlePointerDown = (tabId: string) => {
    if (longPressTimers.current[tabId]) window.clearTimeout(longPressTimers.current[tabId]!);
    longPressTimers.current[tabId] = window.setTimeout(() => {
      setShowLabelFor(tabId);
      longPressTimers.current[tabId] = null;
    }, 300);
  };
  const handlePointerUpOrLeave = (tabId: string) => {
    if (longPressTimers.current[tabId]) {
      window.clearTimeout(longPressTimers.current[tabId]!);
      longPressTimers.current[tabId] = null;
    }
    if (showLabelFor === tabId && tabId !== active) {
      window.setTimeout(() => setShowLabelFor((prev) => (prev === tabId ? null : prev)), 150);
    }
  };

  /* ---------- icon src helper ---------- */
  const iconSrc = useCallback((icon: string) => `/icons/${icon}.svg`, []);

  /* ---------- motion settings ---------- */
  const motionConfig = useMemo(
    () => ({
      type: 'spring' as const,
      stiffness: 520,
      damping: 46,
    }),
    []
  );
  const pillTransition = shouldReduceMotion ? { duration: 0.06 } : motionConfig;
  const tapScale = shouldReduceMotion ? 0.98 : 0.94;

  return (
    <header style={{ top: headerTop }} className="fixed left-4 right-4 z-50 pointer-events-auto">
      <div className="mx-auto max-w-7xl">
        <div className="relative">
          {/* GLASS CARD */}
          <div
            className="glass-card flex items-center justify-between px-4 md:px-6 py-3 rounded-2xl border"
            style={{ willChange: 'transform' }}
          >
            {/* LEFT: BRAND */}
            <div className="flex items-center gap-3 shrink-0">
              {!isMobile ? (
                <motion.button
                  onClick={() => {
                    setActive('about');
                    scrollTo('about');
                  }}
                  whileTap={{ scale: tapScale }}
                  transition={{ duration: 0.08 }}
                  className="flex items-center gap-3 focus:outline-none"
                  aria-label="Go to top"
                >
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                    className="select-none text-white text-lg md:text-xl font-semibold tracking-tight"
                  >
                    Sanjeevan
                  </motion.span>
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => {
                    setActive('about');
                    scrollTo('about');
                  }}
                  whileTap={{ scale: tapScale }}
                  className="w-10 h-10 rounded-full bg-white/6 flex items-center justify-center backdrop-blur-sm focus:outline-none"
                  aria-label="logo"
                >
                  <motion.span
                    initial={{ scale: 0.9, rotate: -6 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                    className="text-white font-bold"
                  >
                    S
                  </motion.span>
                </motion.button>
              )}
            </div>

            {/* RIGHT NAV */}
            <div style={{ minWidth: 320 }} className="flex items-center gap-2 ml-4">
              <LayoutGroup>
                {!isMobile ? (
                  <nav ref={navContainerRef} className="relative flex items-center" aria-label="Primary">
                    <div className="flex gap-3 z-10">
                      {TABS.map((tab) => {
                        const isActive = tab.id === active;
                        return (
                          <div key={tab.id} className="relative">
                            <button
                              ref={(el) => { tabRefs.current[tab.id] = el; }}
                              onClick={() => {
                                // set active & scroll; measurement + animation will follow
                                setActive(tab.id);
                                suppressObserver(900);
                                scrollTo(tab.id);
                              }}
                              onFocus={() => {
                                // show label for keyboard users
                                setShowLabelFor(tab.id);
                              }}
                              onBlur={() => {
                                setShowLabelFor((prev) => (prev === tab.id ? null : prev));
                              }}
                              className="w-[130px] h-12 flex items-center justify-center rounded-lg text-sm font-medium text-white/90 focus:outline-none"
                              aria-current={isActive ? 'page' : undefined}
                            >
                              <span className={`select-none ${isActive ? 'text-white' : 'text-white/85'}`}>
                                {tab.label}
                              </span>
                            </button>
                          </div>
                        );
                      })}

                      {/* measured pill written absolutely in nav container so it always animates to measured x/w */}
                      {pill.visible && (
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 rounded-lg pointer-events-none"
                          initial={false}
                          animate={{ x: pill.x, width: pill.w }}
                          transition={pillTransition}
                          style={{
                            height: 44,
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                            border: '1px solid rgba(255,255,255,0.06)',
                            boxShadow: '0 6px 18px rgba(2,6,23,0.36)',
                            willChange: 'transform, width',
                            left: 0,
                          }}
                        />
                      )}
                    </div>
                  </nav>
                ) : (
                  <nav ref={navContainerRef} className="flex items-center gap-3" aria-label="Primary mobile">
                    {TABS.map((tab) => {
                      const isActive = tab.id === active;
                      const showBubble = showLabelFor === tab.id || isActive;
                      const below = !!bubbleBelow[tab.id];

                      return (
                        <div key={tab.id} className="relative">
                          <motion.button
                            ref={(el) => { tabRefs.current[tab.id] = el; }}
                            onPointerDown={() => handlePointerDown(tab.id)}
                            onPointerUp={() => handlePointerUpOrLeave(tab.id)}
                            onPointerLeave={() => handlePointerUpOrLeave(tab.id)}
                            onClick={() => {
                              setActive(tab.id);
                              suppressObserver(900);
                              scrollTo(tab.id);
                            }}
                            onFocus={() => setShowLabelFor(tab.id)}
                            onBlur={() => setShowLabelFor((prev) => (prev === tab.id ? null : prev))}
                            whileTap={{ scale: tapScale }}
                            className={`w-11 h-11 rounded-xl flex items-center justify-center focus:outline-none transition-transform ${isActive ? 'active-icon' : 'inactive-icon'}`}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={tab.label}
                          >
                            <Image src={iconSrc(tab.icon)} alt={tab.label} width={22} height={22} draggable={false} />
                          </motion.button>

                          {/* Bubble - either above or below depending on space */}
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={showBubble ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 6, scale: 0.98 }}
                            transition={shouldReduceMotion ? { duration: 0.06 } : { type: 'spring', stiffness: 700, damping: 46 }}
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-40"
                            style={below ? { top: 'calc(100% + 8px)' } : { top: '-44px' }}
                          >
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium select-none ${isActive ? 'bg-white/10 text-white' : 'bg-white/6 text-white/85'}`}
                              style={{ backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.04)' }}
                            >
                              {tab.label}
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </nav>
                )}
              </LayoutGroup>
            </div>
          </div>

          {/* subtle bottom glow */}
          <div className="absolute inset-x-0 -bottom-6 flex justify-center pointer-events-none">
            <div className="w-72 h-5 rounded-full blur-xl opacity-18 glass-glow" />
          </div>
        </div>
      </div>
    </header>
  );
}
