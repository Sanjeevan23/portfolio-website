// src/utils/starTextures.ts
'use client';

import * as THREE from 'three';

/**
 * Create a circular star sprite texture (CanvasTexture).
 * Caller should dispose the returned texture when done.
 */
export function makeStarTexture(size = 256): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.2, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.6, 'rgba(200,230,255,0.6)');
  g.addColorStop(1, 'rgba(180,230,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Create a trail texture (long gradient) used for shooting star trails.
 * Caller should dispose the returned texture when done.
 */
export function makeTrailTexture(w = 1024, h = 96): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.1, 'rgba(255,255,255,0.96)');
  g.addColorStop(0.5, 'rgba(220,250,255,1)');
  g.addColorStop(0.9, 'rgba(255,255,255,0.96)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const img = ctx.getImageData(0, 0, w, h);
  for (let y = 0; y < h; y++) {
    const fade = 1 - Math.abs((y - h / 2) / (h / 2));
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4 + 3;
      img.data[idx] = Math.round(img.data[idx] * fade * 0.9);
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Torus glow (optional) — useful if you later want consistent torus glow
 */
export function makeTorusGlowTexture(w = 1024, h = 64): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, 'rgba(246,200,90,0.95)');
  g.addColorStop(0.35, 'rgba(196,139,40,0.75)');
  g.addColorStop(0.55, 'rgba(124,225,255,0.5)');
  g.addColorStop(1, 'rgba(124,225,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const img = ctx.getImageData(0, 0, w, h);
  for (let y = 0; y < h; y++) {
    const v = 1 - Math.abs((y - h / 2) / (h / 2));
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4 + 3;
      img.data[idx] = Math.round(img.data[idx] * v);
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}
