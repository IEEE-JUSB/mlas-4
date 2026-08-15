"use client";

import React, {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sun, Trophy } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export type TimelineEvent = {
  id: string;
  title: string;
  description: string;
};

export type TimelineDay = {
  day: string;
  label: string;
  description: string;
  events: TimelineEvent[];
};

type AgenticTimelineProps = {
  days: TimelineDay[];
};

type TimelineEventWithDay = TimelineEvent & {
  dayIndex: number;
};

function TimelineEventCard({ event }: { event: TimelineEventWithDay }) {
  return (
    <article
      data-timeline-event
      className="
        border-b
        border-neutral-900
        py-12
        first:border-t
        sm:py-14
        lg:py-16

        hover:translate-x-2 transition-all duration-200 ease-linear cursor-pointer
      "

            style={{
        borderBottomWidth:
          event.id === "05" ? "1px" : event.id === "09" ? "0px" : undefined,
        borderBottomColor:
          event.title === "1Retrieval-Augmented Generation" ? "#777777" : "#171717",
      }}
    >
      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-[28px_minmax(0,1fr)]
          sm:gap-5
        "
      >
        <div className="sm:block flex items-center py-2">
          <span className="text-blue-600">{event.id}</span>
          {/* <span
            className="
              mt-[15px]
              block
              h-px
              w-5
              bg-blue-500/60
            "
          /> */}
          
          
        </div>

        <div>
          <h3
            className="
              text-2xl
              font-semibold
              leading-tight
              tracking-tight
              text-white
              sm:text-3xl
              lg:text-4xl
            "
          >
            {event.title}
          </h3>

          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-neutral-500
              sm:text-base
              lg:text-lg
            "
          >
            {event.description}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Timeline({
  days,
}: AgenticTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
    const scrollProgressRef = useRef<HTMLDivElement>(null);

  const allEvents = days.flatMap((day, dayIndex) =>
    day.events.map((event) => ({
      ...event,
      dayIndex,
    }))
  );


  const [activeDay, setActiveDay] = useState(0);

  const dayPanelRef = useRef<HTMLDivElement>(null);
  const dayNumberRef = useRef<HTMLDivElement>(null);
  const dayLabelRef = useRef<HTMLHeadingElement>(null);
  const dayDescriptionRef = useRef<HTMLParagraphElement>(null);

  /*
   * Smoothly change the displayed day in the left panel.
   * This fades the existing content out, updates React state
   * while hidden, then fades the new content back in. This
   * avoids a visual blink when the DOM changes in-place.
   */
  function requestDayChange(dayIndex: number) {
    const number = dayNumberRef.current;
    const label = dayLabelRef.current;
    const description = dayDescriptionRef.current;

    if (!number || !label || !description) {
      setActiveDay(dayIndex);
      return;
    }

    gsap.to([number, label, description], {
      opacity: 0,
      y: -12,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        // Update React state while the panel is hidden
        setActiveDay(dayIndex);

        // Animate new content back in
        gsap.fromTo(
          [number, label, description],
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.04,
            ease: "power3.out",
          }
        );
      },
    });
  }

  /* ============================================================
     PINNING + DAY SCROLL TRIGGERS
  ============================================================ */

  useLayoutEffect(() => {
    const timeline = timelineRef.current;
    const dayPanel = dayPanelRef.current;
    
    if (!timeline || !dayPanel) return;

    const ctx = gsap.context(() => {
      const events =
        gsap.utils.toArray<HTMLElement>("[data-timeline-event]");

      if (!events.length) return;

      /* ========================================================
         PIN THE SINGLE LEFT PANEL
      ======================================================== */

        ScrollTrigger.create({
        trigger: timeline,

        start: "top top",

        end: "bottom bottom",

        pin: dayPanel,

        pinSpacing: false,

        invalidateOnRefresh: true,

        onUpdate: (self) => {
            if (!scrollProgressRef.current) return;

            gsap.to(scrollProgressRef.current, {
            scaleX: self.progress,
            duration: 0.15,
            ease: "none",
            overwrite: true,
            });
        },
        });
      /* ========================================================
         DAY CHANGE TRIGGERS
      ======================================================== */

      /*
       * Day 1 starts at event 0.
       *
       * Day 2 starts at event 5.
       *
       * If more days are added, this automatically creates
       * the appropriate trigger for each one.
       */

      let eventOffset = 0;

    //   days.forEach((day, dayIndex) => {
    //     const firstEvent = events[eventOffset];

    //     if (!firstEvent) return;

    //     /*
    //      * Day 1 doesn't need a trigger because it is already
    //      * active when the component loads.
    //      */
    //     if (dayIndex !== 0) {
    //       ScrollTrigger.create({
    //         trigger: firstEvent,

    //         /*
    //          * The day changes when the first event of that day
    //          * reaches the centre of the viewport.
    //          */
    //         start: "center center",

    //         onEnter: () => {
    //           setActiveDay(dayIndex);
    //         },

    //         /*
    //          * When scrolling back upward through the boundary,
    //          * return to the previous day.
    //          */
    //         onLeaveBack: () => {
    //           setActiveDay(dayIndex - 1);
    //         },
    //       });
    //     }

    //     eventOffset += day.events.length;
    //   });
    days.forEach((day, dayIndex) => {
    const firstEvent = events[eventOffset];

    if (!firstEvent) return;

    if (dayIndex !== 0) {
      ScrollTrigger.create({
      trigger: firstEvent,
      start: "center center",

      onEnter: () => {
        requestDayChange(dayIndex);
      },

      onLeaveBack: () => {
        requestDayChange(dayIndex - 1);
      },
      });
    }

    eventOffset += day.events.length;
    });
      /* ========================================================
         EVENT REVEAL ANIMATIONS
      ======================================================== */

      // Older version: shared scrubbed reveal that faded all cards together.
      // events.forEach((event) => {
      //   gsap.fromTo(
      //     event,
      //     {
      //       opacity: 0.28,
      //       y: 18,
      //       filter: "brightness(0.55) saturate(0.7)",
      //     },
      //     {
      //       opacity: 1,
      //       y: 0,
      //       filter: "brightness(1) saturate(1.2)",
      //
      //       duration: 0.1,
      //       ease: "none",
      //
      //       scrollTrigger: {
      //         trigger: event,
      //         start: "top 82%",
      //         end: "bottom 25%",
      //         scrub: 0.8,
      //         toggleActions: "play none none reverse",
      //       },
      //     }
      //   );
      // });

      events.forEach((event, index) => {
        gsap.fromTo(
          event,
          {
            opacity: 0.28,
            y: 18,
            filter: "brightness(0.55) saturate(0.7)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "brightness(1) saturate(1.2)",
            duration: 0.12,
            // delay: index * 0.08,
            delay: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: event,
              start: "top 55%",
              
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      /*
       * Force ScrollTrigger to recalculate everything after
       * all triggers have been created.
       */
      ScrollTrigger.refresh();
    }, timeline);

    return () => {
      ctx.revert();
    };
  }, [days]);

    useLayoutEffect(() => {
      const number = dayNumberRef.current;
      const label = dayLabelRef.current;
      const description = dayDescriptionRef.current;

      if (!number || !label || !description) return;

      gsap.set([number, label, description], { opacity: 1, y: 0 });
    }, []);

  const currentDay = days[activeDay];

  return (
    <main
      ref={timelineRef}
      className="w-full bg-black/80 text-white"
    >
      <div
        className="
          
        mx-auto
          grid
          max-w-[1400px]
          grid-cols-1
          lg:grid-cols-[380px_minmax(0,1fr)]
          lg:gap-16
        "
      >
        {/* ======================================================
            LEFT — SINGLE PINNED DAY PANEL
        ====================================================== */}

        <aside className="hidden lg:block">
          <div
            ref={dayPanelRef}
            className="
              flex
              h-screen
              w-full
              items-center
            "
          >
            <div className="w-full px-8">

              {/* DAY LABEL */}

              <div
                className="
                  text-[18px]
                  font-medium
                  uppercase
                  tracking-[0.35em]
                  text-blue-500
                "
              >
                DAY
              </div>

              {/* DAY NUMBER */}

              <div className="mt-3 flex items-baseline gap-4">
                <div
                  ref={dayNumberRef}
                  className="
                    text-[140px]
                    font-semibold
                    leading-none
                    tracking-[-0.08em]
                    text-white
                  "
                >
                  {currentDay.day}
                </div>

                <span
                  className="
                    text-md
                    tracking-[0.2em]
                    text-neutral-600
                  "
                >
                  / {String(days.length).padStart(2, "0")}
                </span>
              </div>

              {/* DAY TITLE */}

              <h2
                ref={dayLabelRef}
                className="
                  mt-8
                  text-4xl
                  font-semibold
                  leading-none
                  tracking-tight
                  text-white
                "
              >
                {currentDay.label}
              </h2>

              {/* DAY DESCRIPTION */}

              <p
                ref={dayDescriptionRef}
                className="
                  mt-6
                  max-w-[300px]
                  text-xl
                  leading-7
                  text-neutral-500
                "
              >
                {currentDay.description}
              </p>

              {/* SCROLL INDICATOR */}

              {/* <div className="mt-10 flex items-center gap-3">
                <span className="h-px w-14 bg-blue-500" />

                <span
                  className="
                    text-[10px]
                    tracking-[0.3em]
                    text-neutral-700
                  "
                >
                  SCROLL
                </span>
              </div> */}

                <div className="mt-10 flex items-center gap-3">
                <div className="relative h-px w-20 bg-neutral-800">
                    <div
                    ref={scrollProgressRef}
                    className="
                        absolute
                        left-0
                        top-0
                        h-px
                        w-full
                        origin-left
                        scale-x-0
                        bg-blue-500
                    "
                    />
                </div>

                <span
                    className="
                    text-[16px]
                    tracking-[0.3em]
                    text-neutral-700
                    "
                >
                    PROGRESS
                </span>
                </div>
            </div>
          </div>
        </aside>

        {/* ======================================================
            RIGHT — ONE CONTINUOUS EVENT LIST
        ====================================================== */}

        <section
          className="
            px-6
            pb-24
            sm:px-10
            lg:px-0
            lg:py-0
          "
        >
        <div className="
        md:flex hidden
        items-center justify-center gap-2 rounded-xl
         border border-zinc-800/80 bg-zinc-900/90 hover:bg-zinc-800 
         transition-all duration-150 ease-in-out
         px-6 py-10 text-3xl font-bold

         mt-20 mx-10
          text-zinc-100 shadow-sm">
          <Sun className="text-purple-600"/>
          <span>Day 01</span>
        </div>

        <MobileDayDisplay day="01" label="FOUNDATIONS" 
        description="
        Build the fundamentals of modern AI agents, from LLMs and prompting to memory and retrieval.
        "/>
          {allEvents.slice(0, 5).map((event, index) => (
            <TimelineEventCard
              key={`${event.title}-${event.dayIndex}-${index}`}
              event={event}
            />
          ))}

          <div className="
          hidden
          md:flex items-center justify-center gap-2 rounded-xl
         border border-zinc-800/80 bg-zinc-900/90 hover:bg-zinc-800 
         transition-all duration-150 ease-in-out
         px-6 py-10 text-3xl font-bold

         mt-10 mx-10
          text-zinc-100 shadow-sm">
          <Sun className="text-purple-600"/>
          <span>Day 02</span>
        </div>
        <MobileDayDisplay day="02" label="AGENT SYSTEMS" description="
        Move from individual agents to production-oriented systems, orchestration, evaluation, and MCP.
        "/>
          {allEvents.slice(5, 10).map((event, index) => (
            <TimelineEventCard
              key={`${event.title}-${event.dayIndex}-${index}`}
              event={event}
            />
          ))}
        <AgentChallengeCard/>
        </section>

        {/* <section
          className="
            px-6
            pb-24
            sm:px-10
            lg:px-0
            lg:py-0
          "
        >
          
        </section> */}
      </div>
    </main>
  );
}


import { Bot, Sparkles } from "lucide-react";

function AgentChallengeCard() {
  return (
    <div className="
    flex flex-col sm:flex-row items-start justify-between gap-6 rounded-2xl border border-slate-800 
    bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/60
    p-10 shadow-xl transition-opacity duration-300 hover:opacity-80 max-w-4xl mb-20">
      {/* Left Column: Time / Duration */}

      {/* Middle Column: Event Details */}
      <div className="flex-1 space-y-3">
        {/* Title Row with Icon */}
        <div className="flex items-center gap-2.5">
          <Bot className="h-5 w-5 shrink-0 text-cyan-400" />
          <h3 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            Main Event: AI Agent Showdown
          </h3>
        </div>

        {/* Subtitle / Description */}
        <p className="text-md text-slate-400">
          Build an autonomous agent to solve a live problem statement & evaluate on custom benchmarks.
        </p>

        {/* Badges / Pill Tags */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Filled Glowing Tag */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 
          px-3 py-1 text-xs font-bold uppercase tracking-wider text-white 
          ">
            <Sparkles className="h-3 w-3" />
            Live Benchmarking
          </div>

          {/* Outlined Tag
          <div className="inline-flex items-center rounded-full border border-blue-500/40 bg-blue-950/20 px-3 py-1 text-xs font-semibold tracking-wider text-cyan-400">
            OPEN TO ALL DEVS
          </div>  this looks uh wierd*/}
        </div>
      </div>

      {/* Right Column: Trophy Accent
      <div className="shrink sm:self-start">
        <Trophy className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
      </div> this looks wierd on mobile */}
    </div>
  );
}


function MobileDayDisplay({day, label, description} : {day: string, label: string, description: string}) {

  return (
    <div
          className="
            px-6
            pb-10
            pt-20
            lg:hidden

            flex flex-col
            items-center

            text-center
          "
        >
          <div
            className="
              text-[11px]
              font-medium
              uppercase
              tracking-[0.35em]
              text-blue-500
              
            "
          >
            DAY
          </div>

          <div className="mt-3 flex items-baseline gap-4 justify-center">
            <span
              className="
                text-[100px]
                font-semibold
                leading-none
                tracking-[-0.08em]
              "
            >
              {day}
            </span>

            <span
              className="
                text-s
                tracking-[0.2em]
                text-neutral-600
              "
            >
              / {"02"}
            </span>
          </div>

          <h2
            className="
              mt-6
              text-3xl
              font-semibold
              tracking-tight
            "
          >
            {label}
          </h2>

          <p
            className="
              mt-4
              max-w-md
              text-lg
              leading-7
              text-neutral-500
            "
          >
            {description}
          </p>
        </div>
  )

}