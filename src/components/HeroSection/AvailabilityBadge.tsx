'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';

type Props = {
    onClick?: () => void;
};

const TEXT = "Available for work";

export default function AvailabilityBadge({ onClick }: { onClick?: () => void }) {
    const [displayed, setDisplayed] = useState("");
    const [typingDone, setTypingDone] = useState(false);
    const controls = useAnimationControls();

    /* -------- typing effect -------- */
    useEffect(() => {
        let i = 0;
        const speed = 18;

        const interval = setInterval(() => {
            i++;
            setDisplayed(TEXT.slice(0, i));
            if (i >= TEXT.length) {
                clearInterval(interval);
                setTypingDone(true);
            }
        }, speed);

        return () => clearInterval(interval);
    }, []);

    /* -------- idle shimmer wave -------- */
    useEffect(() => {
        if (!typingDone) return;
        controls.start({
            backgroundPositionX: ['0%', '200%'],
            transition: {
                duration: 6,
                ease: 'linear',
                repeat: Infinity,
            },
        });
    }, [typingDone, controls]);

    return (
        <motion.button
            onClick={onClick}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative group mt-6 px-5 py-2 rounded-3xl glass-card overflow-hidden cursor-pointer"
            ria-label="Open contact modal"
        >
            {/* glow wave overlay */}
            <motion.div
                animate={controls}
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                    background:
                        "linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.35) 45%, rgba(255,255,255,0.25) 50%, rgba(255, 255, 255, 0.35) 55%, transparent 80%)",
                    backgroundSize: "200% 100%",
                }}
            />

            {/* hover stronger wave */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at 50% 50%, rgba(211, 198, 52, 0.25), transparent 60%)"
                }}
            />

            <div className="flex items-center gap-3 relative z-10">
                {/* status dot */}
                <span className="relative flex h-3.5 w-3.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-[0_0_14px_#34d399]" />
                </span>

                {/* typing text */}
                <span className="text-sm md:text-base text-white/90 tracking-wide whitespace-nowrap">
                    {displayed}
                    {!typingDone && <span className="ml-1 animate-pulse">|</span>}
                </span>
            </div>
        </motion.button>
    );
}
