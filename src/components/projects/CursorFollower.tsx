// src/components/projects/CursorFollower.tsx
// -----------------------------

'use client';

import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorFollower() {
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const springX = useSpring(mouseX, { stiffness: 160, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 160, damping: 28 });

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const onLeave = () => {
      mouseX.set(-9999);
      mouseY.set(-9999);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ translateX: springX, translateY: springY }}
      className="pointer-events-none fixed left-0 top-0 z-50"
    >
      <div className="-translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-[#f6c85a]" style={{ boxShadow: '0 0 30px rgba(246,200,90,0.22)' }} />
      </div>
    </motion.div>
  );
}
