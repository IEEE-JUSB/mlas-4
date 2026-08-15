import Image from "next/image";
import Link from "next/link";
import {ArrowUpRight,Check,CreditCard,Lock,Pencil,UserRound,} from "lucide-react";
import logoPlaceholder from "./placeholder-logo.png";
import dashboardData from "./data.json";
const { user, registration, payment } = dashboardData;
export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#060B16] text-[#F5F7FB]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#1677FF]/[0.06] blur-[140px]" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex h-14 items-center justify-between border-b border-[#17243A]">
          <div className="flex items-center">
            <Image
              src={logoPlaceholder}
              alt="MLAS 4.0"
              width={110}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </div>
          <nav className="hidden items-center gap-1 sm:flex">
            <Link href="/" className="rounded-md px-3 py-2 text-xs font-medium text-[#71819B] transition-colors hover:bg-[#101B2D] hover:text-white"
            > Home </Link>
            <Link href="/about" className="rounded-md px-3 py-2 text-xs font-medium text-[#71819B] transition-colors hover:bg-[#101B2D] hover:text-white"
            > About </Link>
            <Link href="/events" className="rounded-md px-3 py-2 text-xs font-medium text-[#71819B] transition-colors hover:bg-[#101B2D] hover:text-white"
            > Events </Link>
            <Link href="/schedule" className="rounded-md px-3 py-2 text-xs font-medium text-[#71819B] transition-colors hover:bg-[#101B2D] hover:text-white"
            > Schedule </Link>
            <Link href="/dashboard" className="rounded-md bg-[#101B2D] px-3 py-2 text-xs font-medium text-white"
            > Dashboard </Link>
          </nav>

          <button className="rounded-md border border-[#1B2A42] px-3 py-2 text-xs font-medium text-[#8493AA] transition-colors hover:border-[#285083] hover:text-white">
            Logout
          </button>
        </header>


        <section className="relative py-10 sm:py-12">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5D7190]">
                Participant Portal
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Welcome back,{" "}
              <span className="text-[#1683FF]">
                {user.name.split(" ")[0]}
              </span>
            </h1>
          </div>
        </section>


        <section className="grid gap-4 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-lg border border-[#172A45] bg-[#0A1322]">
            <div className="absolute left-0 top-0 h-full w-[2px] bg-[#1683FF]" />
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#60738F]">
                    Registration
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">
                    Registration complete
                  </h2>
                </div>
                <StatusBadge type="success">
                  CONFIRMED
                </StatusBadge>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-5">
                <InfoItem label="REGISTRATION ID">
                  <span className="font-mono text-xs text-[#C4CFDE]">
                    {registration.id}
                  </span>
                </InfoItem>
                <InfoItem label="PROFILE">
                  <span className="flex items-center gap-1.5 text-xs text-[#54D69B]">
                    <Check className="h-3.5 w-3.5" />
                    Complete
                  </span>
                </InfoItem>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-[#1C3558] bg-[#0A1322]">
            <div className="absolute left-0 top-0 h-full w-[2px] bg-[#1683FF] shadow-[0_0_14px_#1683FF]" />
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#60738F]">
                    Payment
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">
                    Secure your seat
                  </h2>
                </div>
                <StatusBadge type="warning">
                  ACTION REQUIRED
                </StatusBadge>
              </div>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#60738F]">
                    Registration fee
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    ₹{payment.amount}
                  </p>
                </div>
                <button className="group/button flex items-center gap-2 rounded-md bg-[#1677FF] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(22,119,255,0.16)] transition-all hover:bg-[#2585FF] hover:shadow-[0_0_25px_rgba(22,119,255,0.25)]">
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
          <div className="overflow-hidden rounded-lg border border-[#172A45] bg-[#0A1322]">
            <div className="grid sm:grid-cols-2">
              <ProfileField
                icon={<UserRound className="h-4 w-4" />}
                label="FULL NAME"
                value={user.name}
              />
              <ProfileField
                icon={<Lock className="h-4 w-4" />}
                label="EMAIL"
                value={user.email}
                locked
              />
              <ProfileField
                label="PHONE"
                value={user.phone}
              />
              <ProfileField
                label="COLLEGE"
                value={user.college}
              />
              <ProfileField
                label="DEPARTMENT"
                value={user.department}
              />
              <ProfileField
                label="YEAR"
                value={user.year}
              />
            </div>
            <div className="flex flex-col gap-3 border-t border-[#172A45] bg-[#08111F] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <button className="flex items-center justify-center gap-2 rounded-md border border-[#1C3558] px-3 py-2 text-xs font-medium text-[#A9B6C9] transition-colors hover:border-[#2860A0] hover:bg-[#101D31] hover:text-white">
                <Pencil className="h-3 w-3" />
                Edit Profile
              </button>
            </div>
          </div>
        </section>
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
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1683FF]">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-xs text-[#60738F]">
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
      ? "border-[#1D6247] bg-[#0B2A20] text-[#54D69B]"
      : "border-[#685322] bg-[#2A220D] text-[#E7BC55]";

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
      <p className="text-[9px] font-semibold tracking-[0.16em] text-[#536783]">
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
    <div className="border-b border-[#172A45] p-5 sm:even:border-l">
      <div className="flex items-center gap-1.5 text-[#536783]">
        {icon}

        <span className="text-[9px] font-semibold tracking-[0.16em]">
          {label}
        </span>

        {locked && (
          <Lock className="ml-auto h-3 w-3 text-[#40516A]" />
        )}
      </div>

      <p className="mt-2 text-sm font-medium text-[#D7DFEA]">
        {value}
      </p>
    </div>
  );
}