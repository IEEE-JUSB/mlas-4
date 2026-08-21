import { LogOut } from "lucide-react";

type DashboardHeaderProps = {
  firstName: string;
};

export function DashboardHeader({ firstName }: DashboardHeaderProps) {
  return (
    <section className="relative py-10 sm:py-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            Participant Portal
          </span>
        </div>

        <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Welcome,{" "}
          <span className="text-blue-600 dark:text-blue-500">{firstName}</span>
        </h1>
      </div>

      <form action="/api/logout" method="POST">
        <button
          type="submit"
          className="group inline-flex items-center gap-2 rounded-full border border-zinc-500 bg-red-500 px-6 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-white dark:hover:bg-red-900/50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </form>
    </section>
  );
}
