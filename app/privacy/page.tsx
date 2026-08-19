"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              Legal & Compliance
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Last updated: August 2026. Learn how MLAS 4.0 collects, uses, and safeguards your information.
          </p>
        </section>

        {/* Policy Content Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
            <div className="absolute left-0 top-0 h-full w-[2px] bg-blue-500" />
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  1. Information We Collect
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                To facilitate workshop registration and event logistics for MLAS 4.0, we collect the following personal details provided directly by you:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 pl-2">
                <li><strong className="text-zinc-800 dark:text-zinc-200">Account Credentials:</strong> Name, email address, and profile picture (via Google OAuth authentication).</li>
                <li><strong className="text-zinc-800 dark:text-zinc-200">Contact Details:</strong> Phone number.</li>
                <li><strong className="text-zinc-800 dark:text-zinc-200">Academic Info:</strong> Institution/College, Department, and Academic Year.</li>
                <li><strong className="text-zinc-800 dark:text-zinc-200">Event Logistics:</strong> Dietary preference (Veg/Non-veg) and T-shirt size.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-zinc-400" />
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  2. How We Use Your Data
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Your information is used strictly for organizing and conducting MLAS 4.0. Specific uses include:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 pl-2">
                <li>Verifying workshop registration and issue event access passes.</li>
                <li>Coordinating catering services and preparing merchandise (T-shirts).</li>
                <li>Communicating event schedules, updates, and emergency notifications.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-zinc-400" />
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  3. Data Protection & Sharing
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                We respect your privacy. We do <strong>not</strong> sell, rent, or trade your personal data to third parties. Data is stored securely via Supabase database infrastructure and accessed exclusively by authorized event administrators.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-zinc-400" />
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  4. Contact Us
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                If you have questions regarding this Privacy Policy or wish to request data deletion, please reach out to the IEEE Jadavpur University team at:
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