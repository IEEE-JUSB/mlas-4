import { ArrowUpRight, CreditCard } from "lucide-react";

import { StatusBadge } from "./status-badge";

type PaymentCardProps = {
  status: "completed" | "pending";
  amount: number;
  isRegistrationComplete: boolean;
};

export function PaymentCard({
  status,
  amount,
  isRegistrationComplete,
}: PaymentCardProps) {
  const isPaid = status === "completed" && isRegistrationComplete;

  return (
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
          <StatusBadge type={isPaid ? "success" : "warning"}>
            {isPaid ? "PAID" : "ACTION REQUIRED"}
          </StatusBadge>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              Registration fee
            </p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              ₹{amount || "0"}
            </p>
          </div>
          <button
            disabled={!isRegistrationComplete}
            className={`group/button flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all ${
              isRegistrationComplete
                ? "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30"
                : "cursor-not-allowed bg-zinc-400/80 shadow-none"
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            Book Your Seat
            {isRegistrationComplete && (
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
