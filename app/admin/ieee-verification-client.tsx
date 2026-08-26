"use client";

import { useMemo, useState } from "react";
import type { PendingIeeeRequest } from "./page";

export function AdminIeeeVerificationClient({
  initialRequests,
}: {
  initialRequests: PendingIeeeRequest[];
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedId, setSelectedId] = useState(initialRequests[0]?.id ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? null,
    [requests, selectedId],
  );

  async function handleApprove() {
    if (!selectedRequest) return;

    const confirmed = window.confirm(
      `Approve IEEE membership for ${selectedRequest.name || "this participant"}?`,
    );

    if (!confirmed) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/verify-ieee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: selectedRequest.id }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Unable to approve IEEE membership");
      }

      setRequests((current) =>
        current.filter((request) => request.id !== selectedRequest.id),
      );
      const nextSelection = requests.filter(
        (request) => request.id !== selectedRequest.id,
      )[0];
      setSelectedId(nextSelection?.id ?? "");
      setMessage("IEEE Membership approved");
    } catch (error) {
      console.error("Failed to approve IEEE membership:", error);
      setMessage(error instanceof Error ? error.message : "Approval failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-transparent/5 px-5 py-10 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Admin panel
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              IEEE Verification Queue
            </h1>
          </div>
        </div>

        {message ? (
          <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
            {message}
          </div>
        ) : null}

        {requests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white/30 p-10 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/20 dark:text-zinc-300">
            No pending IEEE verification requests.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-xl border border-zinc-200 bg-white/40 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Requests
              </h2>
              <div className="space-y-3">
                {requests.map((request) => (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => setSelectedId(request.id)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      selectedId === request.id
                        ? "border-blue-500 bg-blue-500/5 shadow-sm"
                        : "border-zinc-200 bg-transparent hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                          {request.name || "Unnamed participant"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {request.ieee_student_branch || "Branch not set"}
                        </p>
                      </div>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {request.ieee_membership_no || "No membership number"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white/40 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30">
              {selectedRequest ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Selected request
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {selectedRequest.name || "Unnamed participant"}
                  </h3>

                  <dl className="mt-5 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <div>
                      <dt className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                        Branch
                      </dt>
                      <dd className="mt-1">
                        {selectedRequest.ieee_student_branch || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                        Membership no.
                      </dt>
                      <dd className="mt-1">
                        {selectedRequest.ieee_membership_no || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                        Submitted
                      </dt>
                      <dd className="mt-1">
                        {selectedRequest.updated_at
                          ? new Date(selectedRequest.updated_at).toLocaleString(
                              "en-IN",
                            )
                          : "Unknown"}
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? "Processing..." : "Approve IEEE Membership"}
                  </button>
                </>
              ) : (
                <p className="text-sm text-zinc-500">
                  Select a request to review it.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
