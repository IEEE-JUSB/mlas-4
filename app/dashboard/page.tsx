import { Suspense } from "react";
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

      <section className="grid gap-4 lg:grid-cols-2">
        <RegistrationCard
          isRegistrationComplete={isRegistrationComplete}
          username={username}
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

      <PerksCard tshirtImageSrc="/dashboard/coming-soon.webp" />

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
