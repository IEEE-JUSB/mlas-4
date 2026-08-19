import { Suspense } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowUpRight, Check, CreditCard, Lock, LogOut, Pencil, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

async function DashboardContent() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // ====================================================================
  // ADD ONLY WHEN IT IS FIGURED OUT HOW USERS IN SUPABASE IS FILLED PLS
  // ====================================================================
  
  // const { data: profile } = await supabase
  //   .from("users") 
  //   .select("bio, username, phone") // Fields required for a "complete" profile
  //   .eq("id", user.id)
  //   .single();

  // // 2. Check if the required fields are empty
  // const isProfileIncomplete = !profile?.username || !profile?.bio;

  // // 3. Redirect them if incomplete
  // if (isProfileIncomplete) {
  //   redirect("/complete-profile");
  // }

  const { data: registration } = await supabase
    .from("registrations")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const metadata = user.user_metadata || {};
  const firstName = metadata.name ? metadata.name.split(" ")[0] : "Participant";

  // Next.js Server Action for handling logout
  const handleLogout = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/"); // or "/login" depending on your preference
  };

  return (
    <>
      <section className="relative py-10 sm:py-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Participant Portal
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Welcome back,{" "}
            <span className="text-blue-600 dark:text-blue-500">
              {firstName}
            </span>
          </h1>
        </div>

        <form action={handleLogout}>
          <button 
            type="submit" 
            className="group inline-flex items-center gap-2 rounded-full border border-zinc-500 bg-red-500 px-6 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-white dark:hover:bg-red-900/50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-[2px] bg-blue-500" />
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  Registration
                </p>
                <h2 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {registration ? "Registration complete" : "Registration pending"}
                </h2>
              </div>
              <StatusBadge type={registration ? "success" : "warning"}>
                {registration ? "CONFIRMED" : "PENDING"}
              </StatusBadge>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-5">
              <InfoItem label="REGISTRATION ID">
                <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {registration?.id || "N/A"}
                </span>
              </InfoItem>
              <InfoItem label="PROFILE">
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                  Complete
                </span>
              </InfoItem>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-[2px] bg-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.5)]" />
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  Payment
                </p>
                <h2 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Secure your seat
                </h2>
              </div>
              <StatusBadge type={payment?.status === "completed" ? "success" : "warning"}>
                {payment?.status === "completed" ? "PAID" : "ACTION REQUIRED"}
              </StatusBadge>
            </div>
            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                  Registration fee
                </p>
                <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                  ₹{payment?.amount || "0"}
                </p>
              </div>
              <button className="group/button flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-blue-500/30">
                <CreditCard className="h-3.5 w-3.5" />
                Book Your Seat
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 pb-12">
        <SectionHeading
          eyebrow="Participant"
          title="Your Profile"
          description=""
        />
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5">
          <div className="grid sm:grid-cols-2">
            <ProfileField
              icon={<UserRound className="h-4 w-4" />}
              label="FULL NAME"
              value={metadata.name || "N/A"}
            />
            <ProfileField
              icon={<Lock className="h-4 w-4" />}
              label="EMAIL"
              value={user.email || "N/A"}
              locked
            />
            <ProfileField
              label="PHONE"
              value={metadata.phone || "N/A"}
            />
            <ProfileField
              label="COLLEGE"
              value={metadata.college || "N/A"}
            />
            <ProfileField
              label="DEPARTMENT"
              value={metadata.department || "N/A"}
            />
            <ProfileField
              label="YEAR"
              value={metadata.year || "N/A"}
            />
          </div>
          <div className="flex flex-col gap-3 border-t border-zinc-200 dark:border-zinc-800 bg-black/5 dark:bg-white/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <button className="flex items-center justify-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100">
              <Pencil className="h-3 w-3" />
              Edit Profile
            </button>
          </div>
        </div>
      </section>
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
        <Suspense fallback={<p className="mt-10 text-sm text-zinc-500">Loading dashboard...</p>}>
          <DashboardContent />
        </Suspense>
      </div>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      )}
    </div>
  );
}

function StatusBadge({
  type,
  children,
}: {
  type: "success" | "warning";
  children: React.ReactNode;
}) {
  const styles =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
      : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400";

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.12em] ${styles}`}
    >
      {children}
    </span>
  );
}

function InfoItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      <div className="mt-1.5">
        {children}
      </div>
    </div>
  );
}

function ProfileField({
  icon,
  label,
  value,
  locked = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  locked?: boolean;
}) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 p-5 sm:even:border-l">
      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
        {icon}

        <span className="text-[9px] font-semibold tracking-[0.16em]">
          {label}
        </span>

        {locked && (
          <Lock className="ml-auto h-3 w-3 text-zinc-400 dark:text-zinc-500" />
        )}
      </div>

      <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  );
}