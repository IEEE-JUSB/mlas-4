'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AgendaItem {
  id: string;
  day: string;
  title: string;
  blurb: string;
}

const AGENDA_DATA: AgendaItem[] = [
  // Day 1
  {
    id: 'd1-1',
    day: 'Day 1',
    title: 'Introductory Lectures',
    blurb: 'Python, LLM, Tokens and Prompting Fundamentals.',
  },
  {
    id: 'd1-2',
    day: 'Day 1',
    title: 'LLM APIs & AI Loops',
    blurb: 'Introduction to LLM APIs and the perceive-reason-act-observe loop of AI Agents.',
  },
  {
    id: 'd1-3',
    day: 'Day 1',
    title: 'ReAct Agent from Scratch',
    blurb: 'Building a reasoning-and-acting agent from scratch.',
  },
  {
    id: 'd1-4',
    day: 'Day 1',
    title: 'Agent Memory Systems',
    blurb: 'Short-term conversation buffers vs long-term vector memory.',
  },
  {
    id: 'd1-5',
    day: 'Day 1',
    title: 'Retrieval-Augmented Generation',
    blurb: 'Introduction to Retrieval-Augmented Generation (RAG).',
  },
  // Day 2
  {
    id: 'd2-1',
    day: 'Day 2',
    title: 'Agent Frameworks & Tools',
    blurb: 'LangGraph walkthrough, tool-using agents, and coding tools like OpenCode.',
  },
  {
    id: 'd2-2',
    day: 'Day 2',
    title: 'Multi-Agent & Guardrails',
    blurb: 'Multi-agent orchestration, Guardrails and evaluation via benchmarks.',
  },
  {
    id: 'd2-3',
    day: 'Day 2',
    title: 'End-to-End Case Study',
    blurb: 'Applied case study: building an end-to-end agentic workflow.',
  },
  {
    id: 'd2-4',
    day: 'Day 2',
    title: 'Model Context Protocol (MCP)',
    blurb: 'Connecting agents & skills via Model Context Protocol.',
  },
  {
    id: 'd2-5',
    day: 'Day 2',
    title: 'Live Agentic Competition',
    blurb: 'Building an agent to solve a live problem statement and benchmark evaluation.',
  },
];

export default function AgendaSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const line = lineRef.current;
      if (!line) return;

      const pathLength = line.getTotalLength();

      // Set initial line state (hidden)
      gsap.set(line, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // ScrollTrigger animation drawing the central line as you scroll
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 0.5,
        },
      });

      // Reveal cards as scroll progresses
      const nodes = gsap.utils.toArray<HTMLElement>('.timeline-card');
      nodes.forEach((node) => {
        gsap.fromTo(
          node,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: node,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="timeline" className="w-full py-20 sm:py-32 overflow-hidden relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-24">
          <span className="font-merriweather text-purple-600 dark:text-purple-300 tracking-wider text-xs sm:text-sm font-semibold uppercase">
            Timeline
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Event Schedule
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            A continuous journey through Day 1 and Day 2 AI concepts.
          </p>
        </div>

        {/* Path & Schedule Timeline Container */}
        <div ref={containerRef} className="relative my-8">
          {/* Central Vertical Animated SVG Line */}
          <svg
            className="absolute top-0 left-6 md:left-1/2 -translate-x-1/2 w-1 h-full pointer-events-none z-0"
            style={{ overflow: 'visible' }}
          >
            {/* Background dimmed line */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-zinc-200 dark:stroke-zinc-800"
              strokeWidth="2"
            />
            {/* Animated foreground line */}
            <line
              ref={lineRef}
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-purple-600 dark:stroke-purple-400"
              strokeWidth="3"
            />
          </svg>

          {/* Sequential Alternating Cards */}
          <div className="flex flex-col gap-12 sm:gap-16 relative z-10">
            {AGENDA_DATA.map((item, index) => {
              const isEven = index % 2 === 0;
              const isFirstOfDay2 = index === 5;

              return (
                <div key={item.id} className="flex flex-col">
                  {/* Day Divider Badge */}
                  {(index === 0 || isFirstOfDay2) && (
                    <div className="self-start md:self-center bg-purple-600 text-white font-merriweather text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-10 shadow-md ml-1 md:ml-0 z-20">
                      {item.day}
                    </div>
                  )}

                  {/* Alternating Row */}
                  <div
                    className={`relative flex items-center w-full ${
                      isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Content Card Side (Left on Even, Right on Odd for Desktop) */}
                    <div className="w-full md:w-1/2 pl-14 md:pl-0 cursor-pointer">
                      <div
                        className={`timeline-card p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-purple-500/50 ${
                          isEven
                            ? 'md:mr-10 md:text-right'
                            : 'md:ml-10 md:text-left'
                        }`}
                      >
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                          {item.day} • Step {index + 1}
                        </span>
                        <h3 className="mt-1 text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {item.blurb}
                        </p>
                      </div>
                    </div>

                    {/* Empty Desktop Column Spacer */}
                    <div className="hidden md:block md:w-1/2" />

                    {/* Central Node Dot */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                      <div className="w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-4 border-purple-600 dark:border-purple-400 shadow-md" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}