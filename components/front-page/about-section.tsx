export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full bg-transparent dark:bg-transparent border-t border-zinc-200 dark:border-zinc-900 py-24"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 font-merriweather text-purple-600 dark:text-purple-300 tracking-wider">
          {/* <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
          </span> */}
          About
        </div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          About MLAS 4.0
        </h2>
        <p className="mt-5 text-zinc-600 dark:text-slate-400 leading-relaxed">
          Sign in with Google to register for the workshop, access event passes, and manage your participant profile.
        </p>
      </div>
    </section>
  );
}
