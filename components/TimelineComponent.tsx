'use client'
import AgenticTimeline from "@/components/Timeline";
import GradientWaves from '@/components/GradientWaves';

const days = [
  {
    day: "01",
    label: "FOUNDATIONS",
    description:
      "Build the fundamentals of modern AI agents, from LLMs and prompting to memory and retrieval.",
    events: [
      {
        id: "01",
        title: "Python, LLMs, Tokens & Prompting",
        description:
          "Introduction to Python, large language models, tokens, and prompting fundamentals.", 
      },
      {
        id: "02",
        title: "LLM APIs & Agent Architecture",
        description:
          "Understand LLM APIs and the architecture behind perception, reasoning, tools, and actions.",
      },
      {
        id: "03",
        title: "Building a Reasoning-and-Acting Agent",
        description:
          "Build an agent from scratch that can reason about a problem and take actions using external tools.",
      },
      {
        id: "04",
        title: "Agent Memory",
        description:
          "Explore short-term conversation buffers and long-term vector memory for persistent context.",
      },
      {
        id: "05",
        title: "Retrieval-Augmented Generation",
        description:
          "Introduction to RAG and how retrieval systems allow agents to work with external knowledge.",
      },
    ],
  },

  {
    day: "02",
    label: "AGENT SYSTEMS",
    description:
      "Move from individual agents to production-oriented systems, orchestration, evaluation, and MCP.",
    events: [
      {
        id: "06",
        title: "Agent Frameworks & Tool-Using Agents",
        description:
          "Walkthrough of LangGraph and building tool-using agents.",
      },
      {
        id: "07",
        title: "Multi-Agent Orchestration",
        description:
          "Coordinate multiple agents while exploring guardrails and evaluation.",
      },
      {
        id: "08",
        title: "End-to-End Agentic Workflow",
        description:
          "Design and implement a complete agentic workflow.",
      },
      {
        id: "09",
        title: "Model Context Protocol",
        description:
          "Introduction to MCP and how it connects agents with external systems.",
      },
    ],
  },
];

export default function TimelineComponent() {
  return (
    <div className="
    w-screen min-h-screen relative border-t
    ">
    {/* <div className="fixed inset-0 -z-10 pointer-events-none hidden">
    <GradientWaves
    horizonColor="#5227FF"
    waveColor="#FF9FFC"
    crestColor="#FFFFFF"
    speed={0.4}
    amplitude={2.5}
    waveScale={0.6}
    waveRatio={0.9}
    swell={35}
    turbulence={20}
    tilt={1.11}
    zoom={1}
    height={5.5}
    fogDepth={15}
    detail="medium"
    brightness={1}
    opacity={1}
    mouseInteraction
    parallaxStrength={0.5}
    grain
    grainIntensity={0.05}
    />
    </div> */}
      <div className="relative z-10">
        <AgenticTimeline days={days} />
      </div>
    </div>

);
}