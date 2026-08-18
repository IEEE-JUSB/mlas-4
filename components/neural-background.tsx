'use client';

import { useEffect, useRef } from 'react';

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type Connection = {
  a: number;
  b: number;
  opacity: number;
  targetOpacity: number;
};

type Pulse = {
  key: string;
  t: number; // 0..1 progress along the connection
  speed: number; // progress per second
  reverse: boolean;
};

/**
 * Lightweight canvas "neural network" backdrop — drifting nodes whose
 * connections form and dissolve over time like synapses, with occasional
 * pulses of light traveling along active connections. Pure canvas, no deps.
 * Respects prefers-reduced-motion by rendering a single static frame.
 */
export default function NeuralBackground({
  className = '',
  density = 0.00009, // nodes per px^2, tuned for readability
  maxDistance = 140,
  colorA = '168, 85, 247', // purple-500, connection lines
  colorB = '34, 211, 238', // cyan-400, nodes + pulses
}: {
  className?: string;
  density?: number;
  maxDistance?: number;
  colorA?: string;
  colorB?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let connections: Map<string, Connection> = new Map();
    let pulses: Pulse[] = [];
    let rafId = 0;
    let lastT = 0;

    // Tuning: how eagerly synapses form/dissolve. Kept low so the network
    // rewires gradually instead of flickering.
    const SPAWN_CHANCE = 0.02; // per in-range pair, per frame
    const PRUNE_CHANCE = 0.0006; // per active connection, per frame
    const PULSE_CHANCE = 0.003; // per active connection, per frame
    const FADE_RATE = 0.06;

    // Throttle drawing to ~30fps — still ticks requestAnimationFrame every
    // native frame, but skips the actual canvas redraw on frames inside
    // the same ~33ms window, cutting CPU cost roughly in half on 60Hz
    // screens (more on high-refresh phones) without visibly choppier motion.
    let lastRenderTime = 0;
    const frameInterval = 1000 / 30;

    function resize() {
      const parent = canvas!.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(60, Math.max(20, Math.floor(width * height * density)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
      connections = new Map();
      pulses = [];
    }

    function step(t: number) {
      if (t - lastRenderTime < frameInterval) {
        if (!prefersReducedMotion) {
          rafId = requestAnimationFrame(step);
        }
        return;
      }
      const dtMs = lastRenderTime ? t - lastRenderTime : frameInterval;
      lastRenderTime = t;
      lastT = t;

      ctx!.clearRect(0, 0, width, height);

      // Drift nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      // Update connection lifecycle: spark new synapses between nearby
      // nodes, and occasionally let even in-range ones dissolve so the
      // network keeps rewiring rather than settling into a fixed mesh.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const key = `${i}-${j}`;
          const existing = connections.get(key);

          if (dist < maxDistance) {
            if (!existing) {
              if (Math.random() < SPAWN_CHANCE) {
                connections.set(key, {
                  a: i,
                  b: j,
                  opacity: 0,
                  targetOpacity: 0.15 + Math.random() * 0.35,
                });
              }
            } else if (existing.targetOpacity > 0 && Math.random() < PRUNE_CHANCE) {
              existing.targetOpacity = 0;
            }
          } else if (existing) {
            existing.targetOpacity = 0;
          }
        }
      }

      // Animate opacities, prune fully-faded connections, occasionally
      // fire a signal pulse along a healthy connection.
      for (const [key, c] of connections) {
        c.opacity += (c.targetOpacity - c.opacity) * FADE_RATE;
        if (c.targetOpacity === 0 && c.opacity < 0.01) {
          connections.delete(key);
          continue;
        }
        if (c.opacity > 0.12 && Math.random() < PULSE_CHANCE) {
          pulses.push({
            key,
            t: 0,
            speed: 0.9 + Math.random() * 0.6,
            reverse: Math.random() < 0.5,
          });
        }
      }

      // Draw connections
      for (const c of connections.values()) {
        const a = nodes[c.a];
        const b = nodes[c.b];
        if (!a || !b) continue;
        ctx!.strokeStyle = `rgba(${colorA}, ${c.opacity})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }

      // Advance + draw pulses (signals traveling along active synapses)
      pulses = pulses.filter((p) => {
        const c = connections.get(p.key);
        if (!c) return false;
        p.t += (dtMs / 1000) * p.speed;
        if (p.t >= 1) return false;

        const a = nodes[c.a];
        const b = nodes[c.b];
        if (!a || !b) return false;
        const progress = p.reverse ? 1 - p.t : p.t;
        const px = a.x + (b.x - a.x) * progress;
        const py = a.y + (b.y - a.y) * progress;
        const fade = Math.sin(p.t * Math.PI); // fade in, peak, fade out

        ctx!.beginPath();
        ctx!.arc(px, py, 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${colorB}, ${fade})`;
        ctx!.fill();
        return true;
      });

      // Draw nodes
      for (const n of nodes) {
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${colorB}, 0.6)`;
        ctx!.fill();
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(step);
      }
    }

    resize();
    rafId = requestAnimationFrame(step);

    const handleResize = () => {
      cancelAnimationFrame(rafId);
      lastT = 0;
      resize();
      rafId = requestAnimationFrame(step);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [density, maxDistance, colorA, colorB]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}