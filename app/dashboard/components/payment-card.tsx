"use client";

import { ArrowUpRight, CreditCard } from "lucide-react";
import { useState } from "react";

import type { CreatePaymentLinkResponse } from "@/types/payment";
import { StatusBadge } from "./status-badge";

type PaymentCardProps = {
  status: "completed" | "pending";
  amount: number;
  isRegistrationComplete: boolean;
  isEarlyBird?: boolean;
  requiresIeeeVerification?: boolean;
};

export function PaymentCard({
  status,
  amount,
  isRegistrationComplete,
  isEarlyBird,
  requiresIeeeVerification,
}: PaymentCardProps) {
  const isPaid = status === "completed" && isRegistrationComplete;
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!isRegistrationComplete || requiresIeeeVerification || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/razorpay-payment", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create payment link");
      }

      const paymentLink: CreatePaymentLinkResponse = await response.json();
      window.location.assign(paymentLink.paymentLinkUrl);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment");
      setIsLoading(false);
    }
  };

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
          <div className="max-w-sm">
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              {isRegistrationComplete && !requiresIeeeVerification ? "Registration fee" : "Payment status"}
            </p>
            {!isRegistrationComplete ? (
              <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Complete your profile to view payment options.
              </p>
            ) : requiresIeeeVerification ? (
              <p className="mt-1 text-sm font-medium text-amber-700 dark:text-amber-300">
                Your IEEE membership is awaiting admin verification. Payment will unlock after approval.
              </p>
            ) : (
              <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                ₹{amount}
                {isEarlyBird && !isPaid && (
                <span className="ml-2 text-xs font-normal text-green-600 dark:text-green-400">
                  (Early bird offer applied)
                </span>
                )}
              </p>
            )}
          </div>
          <button
            disabled={!isRegistrationComplete || requiresIeeeVerification || isLoading || isPaid}
            onClick={handlePayment}
            className={`group/button flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all ${
              isRegistrationComplete && !requiresIeeeVerification && !isPaid
                ? "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30"
                : "cursor-not-allowed bg-zinc-400/80 shadow-none"
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            {isLoading
              ? "Processing..."
              : isPaid
                ? "Paid"
                : requiresIeeeVerification
                  ? "Awaiting IEEE Approval"
                  : isRegistrationComplete
                    ? "Book Your Seat"
                    : "Complete Profile First"}
            {isRegistrationComplete && !requiresIeeeVerification && !isPaid && !isLoading && (
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
