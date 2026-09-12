const sessions = [
  //   {
  //     id: "session-1",
  //     title: "Session 1",
  //     summary:
  //       "14 notebooks by Sugandh Da from Machine Learning From Probabilistic Perspective. Twelve are already available and two will be added by the 10th.",
  //     fileName: "session-1.zip",
  //     detail: "Download the session zip from the folder below.",
  //   },
  //   {
  //     id: "session-2",
  //     title: "Session 2",
  //     summary:
  //       "First notebook only, delivered as a single zip download.",
  //     fileName: "session-2.zip",
  //     detail: "Includes the notebook in a standalone archive.",
  //   },
  //   {
  //     id: "session-3",
  //     title: "Session 3",
  //     summary:
  //       "Notebook with its project folder bundled together in one zip file.",
  //     fileName: "session-3.zip",
  //     detail: "Download the complete session archive.",
  //   },
  //   {
  //     id: "session-4",
  //     title: "Session 4",
  //     summary:
  //       "One notebook coupled with a project folder, packaged as a single zip.",
  //     fileName: "session-4.zip",
  //     detail: "Download the final session archive.",
  //   },
  {
    id: "session-1",
    title: "Session 1",
    summary:
      "Access the contents for session 1 below!",
    fileName: "Stay tuned for the next slots!",
    detail: "All hail the AI!",
    link: "https://github.com/aayush101098/Machine-Learning-From-Probabilistic-Perspective/tree/main",
  },
];

function SectionCard({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/75"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-zinc-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-zinc-300">
        {description}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function PaidContent() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/75">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-zinc-400">
          Materials index
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Session downloads
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-zinc-300">
          This page is the linkable index for the session archives.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href="#session-1"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Session 1
          </a>
          <a
            href="#session-2"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Session 2
          </a>
          <a
            href="#session-3"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Session 3
          </a>
          <a
            href="#session-4"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Session 4
          </a>
        </div>
      </section>

      {sessions.map((session) => (
        <SectionCard
          key={session.id}
          id={session.id}
          eyebrow={session.title}
          title={session.title}
          description={session.summary}
        >
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900/60 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {session.fileName}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                {session.detail}
              </p>
            </div>
            <a
              href={session.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200"
            >
              Lets go
            </a>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
