'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { useTheme } from 'next-themes';
import MoltenMetal from './MoltenMetal';
import NeuralBackground from './neural-background';

export default function HeroSection() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  // MoltenMetal touches window/WebGL, so it must only ever render on the
  // client, after mount — this avoids Next's separate dynamic-import chunk
  // fetch (which can hang silently) while still being SSR-safe. We also
  // need the resolved theme before first paint of the WebGL layer, so we
  // gate both on `mounted`.
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      badgeRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
    )
      .fromTo(
        titleRef.current?.querySelectorAll('.hero-word') ?? [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
        '-=0.3',
      )
      .fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4',
      )
      .fromTo(
        metaRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.35',
      )
      .fromTo(
        ctaRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3',
      );

    // Scroll cue bounce
    gsap.to(scrollCueRef.current, {
      y: 8,
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-black pt-16"
    >
      {/* Molten metal WebGL base — the primary animated background.
          Rendered only after mount since it needs window/WebGL, and its
          palette flips for light mode so it reads as a soft wash instead
          of a dark smear on a white page. */}
      <div className="absolute inset-0 w-full h-full">
        {mounted && (
          <MoltenMetal
            color1={isLight ? '#ffffff' : '#050308'}
            color2={isLight ? '#c4b5fd' : '#7c3aed'}
            color3={isLight ? '#67e8f9' : '#22d3ee'}
            speed={0.3}
            scale={4.5}
            detail={4}
            glow={1.5}
            coreSize={0.11}
            swirl={1.1}
            brightness={1.2}
            opacity={isLight ? 0.5 : 0.75}
            mouseInteraction
            mouseStrength={0.25}
          />
        )}
      </div>

      {/* Neural network nodes, layered on top of the molten glow. Screen
          blending only reads correctly against a dark backdrop, so it's
          swapped for a plain overlay (and a darker, higher-contrast
          palette) in light mode. */}
      <NeuralBackground
        className={
          isLight
            ? 'absolute inset-0 w-full h-full opacity-40'
            : 'absolute inset-0 w-full h-full opacity-60 mix-blend-screen'
        }
        colorA={isLight ? '124, 58, 237' : '168, 85, 247'}
        colorB={isLight ? '8, 145, 178' : '34, 211, 238'}
      />

      {/* Faint grid overlay, fading toward the edges */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.05]"
        style={{
          backgroundImage: isLight
            ? 'linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)'
            : 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse at center, black 0%, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-6 text-center flex flex-col items-center">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/5 px-4 py-1.5 mb-8"
        >
          <span className="text-[11px] font-mono text-purple-600 dark:text-purple-300 tracking-widest uppercase">
            IEEE JUSB Presents
          </span>
        </div>

        <h1
          ref={titleRef}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.05]"
        >
          <span className="hero-word inline-block">Machine</span>{' '}
          <span className="hero-word inline-block">Learning</span>{' '}
          <span className="hero-word inline-block">Accelerator</span>{' '}
          <span className="hero-word inline-block">
            Summit
          </span>{' '}
          <span className="hero-word inline-block bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            4.0
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-slate-400 max-w-2xl mx-auto"
        >
          Two days of hands-on workshops on LLMs, ReAct agents, LangGraph
          orchestration &amp; MCP — building toward a live autonomous-agent
          challenge. From first principles to production-grade pipelines.
        </p>

        <div
          ref={metaRef}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-zinc-600 dark:text-slate-400 uppercase tracking-widest"
        >
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            September 2026
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Jadavpur University, Kolkata
          </span>
        </div>

        <div
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-7 py-3 text-sm font-semibold text-black transition-transform hover:scale-105"
          >
            Register Now
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <a
            href="#agenda"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 px-7 py-3 text-sm font-semibold text-zinc-900 dark:text-white hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            View Agenda
          </a>
        </div>

        <p className="mt-6 text-[11px] text-zinc-500 dark:text-slate-500">
          Limited seats · Open to all engineering students
        </p>
      </div>

      {/* Scroll cue */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-zinc-400 dark:text-slate-500"
      >
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
}