// src/components/Footer.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from 'react-icons/fa';
import StarField from './HeroSection/StarField';
import SoftShootingStars from './HeroSection/SoftShootingStars';
import { contact } from '../data/contact';
import Image from 'next/image';

const BRAND_COLORS: Record<string, string> = {
  github: '#ffffffe2',
  linkedin: '#2a7ccf',
  facebook: '#064faf',
  instagram: '#e1306c',
  whatsapp: '#25D366',
};

/* Simple colored social icon with matching glow */
function SocialIcon({
  href,
  color,
  aria,
  Icon,
}: {
  href: string;
  color: string;
  aria: string;
  Icon: React.ComponentType<any>;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.98 }}
      className="social-icon w-10 h-10 rounded-full flex items-center justify-center"
      aria-label={aria}
      style={{
        boxShadow: `0 14px 40px ${color}33, 0 0 30px ${color}22`,
      }}
    >
      <Icon style={{ color, width: 18, height: 18 }} />
    </motion.a>
  );
}

/* NavItem: scale 2x on hover/focus, no dot/underline, arrow slides in and has gold glow */
function NavItem({ label, onClick }: { id: string; label: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const scale = hover ? 1.3 : 1;
  const weight = hover ? 600 : 400;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="nav-item group relative p-1 md:p-2 focus:outline-none"
      aria-label={`Scroll to ${label}`}
    >
      <motion.span
        animate={{ scale }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        style={{ fontWeight: weight }}
        className="text-white text-sm md:text-base leading-none"
      >
        {label}
      </motion.span>
    </button>
  );
}

function OrbitSystem({ size = 120 }: { size?: number }) {
  const baseColors = ['#ffd57a', '#f6c85a', '#cfa24a', '#ffd98a', '#ffb86b', '#590707', '#032364'];
  const orbits = Array.from({ length: 7 }).map((_, i) => ({
    r: Math.round((size / 2) * (0.2 + i * 0.09)),
    dur: 7 + i * 1.8,
    delay: i * 0.14,
    color: baseColors[i % baseColors.length],
    size: 5 + i * 2,
    isSaturn: i === 3,
  }));

  return (
    <div className="orbit-wrap-mobile" aria-hidden>
      <div className="orbit-center-mobile" style={{ width: size, height: size }}>
        {orbits.map((o, idx) => (
          <div
            key={idx}
            className="orbit-mobile"
            style={{
              width: size,
              height: size,
              animationDuration: `${o.dur}s`,
              animationDelay: `${o.delay}s`,
            }}
          >
            <div
              className="orbit-path"
              style={{
                width: size,
                height: size,
                borderColor: '#ffffff0e',
                borderWidth: 0.1,
              }}
            />

            <div
              className={`planet-mobile ${o.isSaturn ? 'planet-saturn' : ''}`}
              style={{
                width: o.size,
                height: o.size,
                background: `radial-gradient(circle at 30% 30%, #ffffffcc, ${o.color})`,
                borderColor: `${o.color}bb`,
                transform: `translateX(${o.r}px) translateY(0px)`,
                boxShadow: `0 16px 48px ${o.color}66, 0 0 40px ${o.color}44`,
              }}
            >
              {o.isSaturn && <div className="saturn-ring" />}
            </div>
          </div>
        ))}

        <div
          className="sun-mobile"
          style={{
            boxShadow: '0 0 36px #f8e6be, 0 0 110px #eadfc8',
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 72, 0, 0.6), #e6a210)',
          }}
        />
      </div>
    </div>
  );
}


export default function Footer() {
  useEffect(() => {
    // no-op placeholder for accessibility/hooks
  }, []);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Portfolio' },
    { id: 'experience', label: 'Experience' },
  ];

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const headerEl = document.querySelector('header');
    const headerHeight = headerEl ? Math.ceil((headerEl as HTMLElement).getBoundingClientRect().height) : 80;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.6) : 1;

  return (
    <footer id="contact" className="relative w-full text-white select-none">
      <div className="absolute inset-0 -z-10 bg-black hero-canvas">
        <Canvas
          dpr={[1, dpr]}
          camera={{ position: [0, 2.2, 3.4], fov: 50 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <ambientLight intensity={0.7} />
          <pointLight intensity={0.8} position={[10, 10, 10]} />
          <StarField count={12000} radius={380} minY={-999} />
          <SoftShootingStars amount={18} />
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-start">
          {/* LEFT */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-white/6 to-white/2 flex items-center justify-center border border-white/6 overflow-hidden">
                <div className="w-7 h-7 pointer-events-none select-none">
                  <Image
                    src="/logo.png"
                    alt="Sanjeevan logo"
                    width={28}
                    height={28}
                    draggable={false}
                    priority
                    className="object-contain pointer-events-none select-none"
                  />
                </div>
              </div>

              <div>
                <div className="text-lg font-extrabold text-[#f6c85a]">Sanjeevan</div>
                <div className="text-xs text-white/70">Full-stack Engineer</div>
              </div>
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <FaEnvelope className="w-4 h-4 text-white/90" />
                <a href={`mailto:${contact.email.address}`} className="text-sm text-white/80 hover:text-white transition">
                  {contact.email.address}
                </a>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <FaPhone className="w-4 h-4 text-white/90" />
                <a href={contact.phone.tel} className="text-sm text-white/80 hover:text-white transition">
                  {contact.phone.pretty}
                </a>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <SocialIcon href={contact.social.github} color={BRAND_COLORS.github} aria="GitHub" Icon={FaGithub} />
              <SocialIcon href={contact.social.linkedin} color={BRAND_COLORS.linkedin} aria="LinkedIn" Icon={FaLinkedin} />
              <SocialIcon href={contact.social.facebook} color={BRAND_COLORS.facebook} aria="Facebook" Icon={FaFacebook} />
              <SocialIcon href={contact.social.instagram} color={BRAND_COLORS.instagram} aria="Instagram" Icon={FaInstagram} />
              <SocialIcon href={`https://wa.me/${contact.whatsapp.number}`} color={BRAND_COLORS.whatsapp} aria="WhatsApp" Icon={FaWhatsapp} />
            </div>
          </div>

          {/* MIDDLE */}
          <div className="flex flex-col items-start md:items-center gap-2">
            <div className="flex flex-col gap-2">
              {navItems.map((n) => (
                <NavItem key={n.id} id={n.id} label={n.label} onClick={() => scrollToId(n.id)} />
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-start md:items-end gap-2 relative">
            <ul className="text-white/80 text-sm space-y-3">
              <li>Cross-platform mobile apps</li>
              <li>Responsive websites & webapps</li>
              <li>SEO-driven designs for brands</li>
              <li>Smooth UI designs</li>
              <li>Backend & APIs & CRUD </li>
            </ul>

            {/* MOBILE-ONLY ORBIT: centered and fully inside column */}
            <div className="mobile-orbit-absolute md:hidden" aria-hidden>
              <OrbitSystem size={100} />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/14 pt-6 flex items-center justify-center">
          <div className="text-sm text-white/70">© {new Date().getFullYear()} Sanjeevan. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
