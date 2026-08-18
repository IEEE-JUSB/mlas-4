import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | MLAS 4.0",
  description: "Participant dashboard for MLAS 4.0",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}