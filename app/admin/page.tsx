"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminIeeeVerificationClient } from "./ieee-verification-client";

export type PendingIeeeRequest = {
  id: string;
  name: string | null;
  ieee_student_branch: string | null;
  ieee_membership_no: string | null;
  ieee_membership_proof_url: string | null;
  updated_at: string | null;
};

export default function AdminPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<PendingIeeeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAdminPage() {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      const { data: actor, error: actorError } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", user.id)
        .single();

      if (!isMounted) return;

      if (actorError || actor?.user_type !== "admin") {
        router.replace("/dashboard");
        return;
      }

      const { data: pendingRows, error: pendingError } = await supabase
        .from("users")
        .select(
          "id, name, ieee_student_branch, ieee_membership_no, ieee_membership_proof_url, updated_at",
        )
        .not("ieee_student_branch", "is", null)
        .not("ieee_membership_no", "is", null)
        .eq("is_ieee_member", false)
        .order("updated_at", { ascending: false });

      if (!isMounted) return;

      if (pendingError) {
        console.error(
          "Failed to load IEEE verification requests:",
          pendingError,
        );
        setError("Failed to load IEEE verification requests.");
        setLoading(false);
        return;
      }

      setRequests(
        (pendingRows ?? []).map((row) => ({
          id: row.id,
          name: row.name,
          ieee_student_branch: row.ieee_student_branch,
          ieee_membership_no: row.ieee_membership_no,
          ieee_membership_proof_url: row.ieee_membership_proof_url,
          updated_at: row.updated_at,
        })),
      );
      setLoading(false);
    }

    loadAdminPage();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent/5 px-5 py-10 text-zinc-900 dark:text-zinc-100">
        <div className="mx-auto max-w-4xl rounded-xl border border-zinc-200 bg-white/40 p-8 text-center text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-300">
          Loading admin queue...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-transparent/5 px-5 py-10 text-zinc-900 dark:text-zinc-100">
        <div className="mx-auto max-w-4xl rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      </main>
    );
  }

  return <AdminIeeeVerificationClient initialRequests={requests} />;
}
