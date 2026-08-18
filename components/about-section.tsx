export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full bg-transparent dark:bg-transparent border-t border-zinc-200 dark:border-zinc-900 py-24"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 tracking-widest uppercase">
          About
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          About MLAS 4.0
        </h2>
        <p className="mt-5 text-zinc-600 dark:text-slate-400 leading-relaxed">
          Placeholder text 
        </p>
      </div>
    </section>
  );
}