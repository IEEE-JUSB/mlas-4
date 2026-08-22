export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full bg-transparent dark:bg-transparent border-t border-zinc-200 dark:border-zinc-900 py-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* Left Column: Image Container */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <img
              src="/hero.webp"
              alt="MLAS 4.0 Overview"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>

          {/* Right Column: Text Content */}
          <div className="flex flex-col text-left space-y-4">
            

            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              About MLAS 4.0
            </h2>

            <p className="text-lg font-medium text-purple-600 dark:text-purple-400">
              From just prompting AI to actually building AI agents.
            </p>

            <div className="space-y-3 text-sm text-zinc-600 dark:text-slate-400 leading-relaxed">
              <p>
                MLAS 4.0 is a two-day, hands-on dive into LLMs, ReAct agents, LangGraph, and MCP, taking you from first principles to production-grade agentic pipelines.
              </p>
              <p>
                Think you&apos;ve mastered AI through prompting? Put it to the test in our live autonomous-agent challenge.
              </p>
            </div>

            <div className="pt-2 text-xs sm:text-sm font-semibold tracking-wide text-zinc-800 dark:text-zinc-200 uppercase">
              Learn. Build. Orchestrate. Deploy. <br />
              <span className="text-purple-600 dark:text-purple-400">
                And then let your agents take the flight.
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}