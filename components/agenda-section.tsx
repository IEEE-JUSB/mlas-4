const PLACEHOLDER_AGENDA = [
  { day: 'Day 1', title: 'Foundations', blurb: 'Placeholder ' },
  { day: 'Day 1', title: 'ReAct Agents', blurb: 'Placeholder' },
  { day: 'Day 2', title: 'LangGraph', blurb: 'Placeholder ' },
  { day: 'Day 2', title: 'Live Challenge', blurb: 'Placeholder ' },
];

export default function AgendaSection() {
  return (
    <section
      id="agenda"
      className="w-full bg-transparent dark:bg-transparent border-t border-zinc-200 dark:border-zinc-900 py-24"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 tracking-widest uppercase">
            Agenda
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
           Placeholder
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-slate-400 max-w-2xl mx-auto">
            Placeholder 
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PLACEHOLDER_AGENDA.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-6"
            >
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 tracking-widest uppercase">
                {item.day}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-slate-400">
                {item.blurb}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}