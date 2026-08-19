"use client";

import Link from "next/link";
import { ArrowLeft, FileText, UserCheck, AlertCircle, HelpCircle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen text-zinc-900 dark:text-zinc-100 transition-colors mt-10">
      {/* Background Effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/[0.06] blur-[140px]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-5 py-6 sm:px-8 lg:px-10 mt-8 mb-12">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>

        {/* Header */}
        <section className="relative pb-8 sm:pb-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Legal & Terms
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Last updated: August 2026. Rules and guidelines for participating in MLAS 4.0.
          </p>
        </section>

        {/* Terms Content Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
            <div className="absolute left-0 top-0 h-full w-[2px] bg-blue-500" />
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  1. Acceptance of Terms
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                By registering or signing into the MLAS 4.0 portal, you agree to comply with these Terms of Service. If you do not agree to these terms, please do not complete account registration or participate in event activities.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-zinc-400" />
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  2. User Registration & Accuracy
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                When completing your profile, you agree to provide true, accurate, and complete information regarding your phone number, academic institution, department, and logistics selections. Providing deliberate misrepresentations may result in cancellation of event participation.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-zinc-400" />
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  3. Event Conduct & Modifications
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                All participants are expected to maintain professional conduct during workshops. Event organizers reserve the right to alter workshop logistics, timing, or speaker line-ups if operational requirements demand it.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-zinc-400" />
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  4. Contact & Inquiries
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                For queries regarding terms or event participation, contact the organizing team:
              </p>
              <a
                href="mailto:jaduniv.ieee@gmail.com"
                className="inline-block text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                jaduniv.ieee@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}