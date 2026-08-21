"use client";

import { ArrowUpRight, CreditCard } from "lucide-react";
import { useState } from "react";

import { StatusBadge } from "./status-badge";

type PaymentCardProps = {
  status: "completed" | "pending";
  amount: number;
  isRegistrationComplete: boolean;
  isEarlyBird?: boolean;
};

export function PaymentCard({
  status,
  amount,
  isRegistrationComplete,
  isEarlyBird,
}: PaymentCardProps) {
  const isPaid = status === "completed" && isRegistrationComplete;
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!isRegistrationComplete || isLoading) return;

    setIsLoading(true);
    try {
      // Get user profile to determine membership type
      const profileResponse = await fetch("/api/profile");
      const profileData = await profileResponse.json();
      const isIeeeMember = profileData.profile?.ieeeStudentBranch && profileData.profile?.ieeeMembershipNumber;
      const membershipType = isIeeeMember ? "ieee" : "non_ieee";

      // Create Razorpay order
      const response = await fetch("/api/razorpay-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipType }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderData = await response.json();

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "MLAS 4.0",
          description: "Workshop Registration",
          order_id: orderData.order_id,
          handler: async function (response: any) {
            // Verify payment
            const verifyResponse = await fetch("/api/razorpay-payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              window.location.reload();
            } else {
              alert("Payment verification failed");
            }
          },
          prefill: {
            name: "",
            email: "",
            contact: "",
          },
          theme: {
            color: "#2563eb",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment");
    } finally {
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
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              Registration fee
            </p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              ₹{amount || "0"}
              {isEarlyBird && !isPaid && (
                <span className="ml-2 text-xs font-normal text-green-600 dark:text-green-400">
                  (Early bird offer applied)
                </span>
              )}
            </p>
          </div>
          <button
            disabled={!isRegistrationComplete || isLoading || isPaid}
            onClick={handlePayment}
            className={`group/button flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all ${
              isRegistrationComplete && !isPaid
                ? "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30"
                : "cursor-not-allowed bg-zinc-400/80 shadow-none"
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            {isLoading ? "Processing..." : isPaid ? "Paid" : "Book Your Seat"}
            {isRegistrationComplete && !isPaid && !isLoading && (
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
