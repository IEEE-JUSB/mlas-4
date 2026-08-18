"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

export default function HeroSection() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      badgeRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
    )
      .fromTo(
        titleRef.current?.querySelectorAll(".hero-word") ?? [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
        "-=0.3",
      )
      .fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4",
      )
      .fromTo(
        metaRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.35",
      )
      .fromTo(
        ctaRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.3",
      );

    // Scroll cue bounce
    gsap.to(scrollCueRef.current, {
      y: 8,
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent pt-16"
    >
      {/* Background (molten metal + neural network + grid) now lives in
          <SiteBackground />, mounted once in the root layout so it's
          shared across Hero/About/Agenda instead of restarting per
          section. This section stays transparent so it shows through. */}

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
          <span className="hero-word inline-block">Machine</span>{" "}
          <span className="hero-word inline-block">Learning</span>{" "}
          <span className="hero-word inline-block">Accelerator</span>{" "}
          <span className="hero-word inline-block">Summit</span>{" "}
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
          <Link
            href="#agenda"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 px-7 py-3 text-sm font-semibold text-zinc-900 dark:text-white hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            View Agenda
          </Link>
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
