import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { DashboardHeader } from "./components/dashboard-header";
import { PaymentCard } from "./components/payment-card";
import { ProfileSection } from "./components/profile-section";
import { RegistrationCard } from "./components/registration-card";
import { PerksCard } from "./components/perks-card";
import {
  type DashboardData,
  getDashboardData,
  isRegistrationPending,
} from "./data";

export const metadata: Metadata = {
  title: "Dashboard | MLAS 4.0",
  description: "Participant dashboard for MLAS 4.0",
};

async function DashboardContent() {
  const data: DashboardData | null = await getDashboardData();

  if (!data || !data.user) {
    redirect("/login");
  }

  const { user, profile } = data;
  const isIeeeMember = Boolean(data.isIeeeMember);
  const payment = data.payment ?? {
    status: "pending" as const,
    amount: 0,
    paymentId: null,
  };
  const pendingRegistration = isRegistrationPending(data);
  const isRegistrationComplete = !pendingRegistration;
  const metadata = user.user_metadata || {};
  const metadataName =
    typeof metadata.name === "string" ? metadata.name : undefined;
  const username = profile?.username || metadataName;
  const firstName = username ? username.split(" ")[0] : "Participant";

  return (
    <>
      <DashboardHeader firstName={firstName} />

      {isIeeeMember ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
          IEEE Membership approved
        </div>
      ) : null}

      {data.registration?.status === "payment completed" ? (
        <section className="mb-6 overflow-hidden rounded-lg border border-rose-200 bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 p-5 shadow-sm dark:border-rose-800/50 dark:from-rose-950/30 dark:via-red-950/20 dark:to-orange-950/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-rose-900 dark:text-rose-100">
                One More Step! Claim Your Official Event Tickets.
              </h2>
              <p className="mt-1 text-sm text-rose-800/90 dark:text-rose-200/90">
                You have successfully registered with us. Now, click below to
                finalize your booking and secure your entry passes.
              </p>
            </div>
            <Link
              href="https://antiviral.social/events/mlas-4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-md bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:bg-rose-500 dark:text-rose-950 dark:hover:bg-rose-400"
            >
              Get Event Tickets
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <RegistrationCard
          isRegistrationComplete={isRegistrationComplete}
          username={username}
          registrationId={data.registration?.id}
        />
        <PaymentCard
          status={payment.status}
          amount={payment.amount || 0}
          isRegistrationComplete={isRegistrationComplete}
          isEarlyBird={payment.isEarlyBird}
          requiresIeeeVerification={payment.requiresIeeeVerification}
          isIeeeEarlyBirdWindowExpired={payment.isIeeeEarlyBirdWindowExpired}
        />
      </section>

      <PerksCard tshirtImageSrc="/tshirt.png" />

      <ProfileSection email={user.email} profile={profile} />
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-transparent/5 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/[0.06] blur-[140px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10 mt-8">
        <Suspense
          fallback={
            <p className="mt-10 text-sm text-zinc-500">Loading dashboard...</p>
          }
        >
          <DashboardContent />
        </Suspense>
      </div>
    </main>
  );
}
