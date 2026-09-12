import { DashboardData, getDashboardData } from "@/app/dashboard/data";
import PaidContent from "./components/PaidContent";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const instant = false;

export const metadata: Metadata = {
  title: "Materials | MLAS 4.0",
  description: "Materials for MLAS 4.0",
};

export default async function MaterialsPage() {
  const data: DashboardData | null = await getDashboardData();

  if (!data || !data.user) {
    redirect("/login");
  }

  const payment = data.payment?.status ?? "pending";

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
      {payment !== "completed" ? (
        <div className="mb-4 rounded-lg border border-rose-200 bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 p-5 text-sm font-medium text-rose-900 dark:text-rose-200 dark:border-rose-800/50 dark:from-rose-950/30 dark:via-red-950/20 dark:to-orange-950/30">
          <p>
            You need to complete your payment to access the materials. Please
            visit the{" "}
            <a
              href="/dashboard"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              dashboard to pay
            </a>
            .
          </p>
        </div>
      ) : (
        <PaidContent />
      )}
    </div>
  );
}
