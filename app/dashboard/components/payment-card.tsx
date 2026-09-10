"use client";

import { ArrowUpRight, CreditCard } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import type { CreatePaymentLinkResponse } from "@/types/payment";
import { StatusBadge } from "./status-badge";

// WhatsApp SVG icon
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/IWaydneUS3FJLARd75GIAn?s=cl&p=a&mlu=4";

type PaymentCardProps = {
  status: "completed" | "pending";
  amount: number;
  isRegistrationComplete: boolean;
  isEarlyBird?: boolean;
  requiresIeeeVerification?: boolean;
  isIeeeEarlyBirdWindowExpired?: boolean;
};

export function PaymentCard({
  status,
  amount,
  isRegistrationComplete,
  isEarlyBird,
  requiresIeeeVerification,
  isIeeeEarlyBirdWindowExpired,
}: PaymentCardProps) {
  const isPaid = status === "completed" && isRegistrationComplete;
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!isRegistrationComplete || requiresIeeeVerification || isLoading)
      return;

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
              {isRegistrationComplete && !requiresIeeeVerification
                ? "Registration fee"
                : "Payment status"}
            </p>
            {!isRegistrationComplete ? (
              <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Complete your profile to view payment options.
              </p>
            ) : requiresIeeeVerification ? (
              <p className="mt-1 text-sm font-medium text-amber-700 dark:text-amber-300">
                Your IEEE membership is awaiting admin verification. Payment
                will unlock after approval.
              </p>
            ) : (
              <>
                <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                  ₹{amount}
                  {isEarlyBird && !isPaid && (
                    <span className="ml-2 text-xs font-normal text-green-600 dark:text-green-400">
                      (Early bird offer applied)
                    </span>
                  )}
                </p>
                {isIeeeEarlyBirdWindowExpired && !isPaid && (
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Your two-day IEEE early-bird window has ended; regular IEEE
                    pricing applies.
                  </p>
                )}
              </>
            )}
          </div>
          <button
            disabled={
              !isRegistrationComplete ||
              requiresIeeeVerification ||
              isLoading ||
              isPaid
            }
            onClick={handlePayment}
            className={`group/button flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all ${
              isRegistrationComplete && !requiresIeeeVerification && !isPaid
                ? "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30"
                : "cursor-not-allowed bg-zinc-400/80 shadow-none"
            }`}
          >
            <CreditCard
              className="h-3.5 w-3.5 shrink-0"
              style={{ minWidth: "0.875rem", minHeight: "0.875rem" }}
            />
            <span className="truncate">
              {isLoading
                ? "Processing..."
                : isPaid
                  ? "Paid"
                  : requiresIeeeVerification
                    ? "Awaiting IEEE Approval"
                    : isRegistrationComplete
                      ? "Book Your Seat"
                      : "Complete Profile First"}
            </span>
            {isRegistrationComplete &&
              !requiresIeeeVerification &&
              !isPaid &&
              !isLoading && (
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
              )}
          </button>
        </div>

        {isPaid && (
          <div className="mt-5 border-t border-zinc-100 dark:border-zinc-800 pt-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400 mb-3">
              Next step
            </p>
            <Link
              href={WHATSAPP_GROUP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group/wa inline-flex items-center gap-2.5 rounded-md bg-[#25D366] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#25D366]/20 transition-all hover:bg-[#1ebe5d] hover:shadow-[#25D366]/30"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
              <span>Join the WhatsApp group</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover/wa:-translate-y-0.5 group-hover/wa:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}