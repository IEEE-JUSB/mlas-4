// app/not-found.tsx
"use client";

import { ArrowUpRight, Home, SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen text-zinc-900 dark:text-zinc-100 transition-colors mt-10">
      {/* Background Effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/[0.06] blur-[140px]" />
      </div>

      <div className="relative mx-auto w-full max-w-2xl px-5 py-6 sm:px-8 lg:px-10 mt-8">
        <section className="relative pb-8 sm:pb-10 text-center">
          <div className="mb-3 flex items-center pt-20 justify-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Error 404
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Page not found
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            The page you&apos;re looking for doesn&apos;t exist or may have
            been moved.
          </p>
        </section>

        <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-[2px] bg-blue-500" />
          <div className="p-5 sm:p-6 flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800">
              <SearchX
                className="h-5 w-5 text-blue-500"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Double-check the URL, or head back to a page that exists.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center pt-6">
          <Link
            href="/"
            className="group/button flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-blue-500/30"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Home
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}