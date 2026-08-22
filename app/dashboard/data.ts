import { headers } from "next/headers";
import { z } from "zod";

export const dashboardResponseSchema = z.object({
  user: z
    .object({
      email: z.string().nullable().optional(),
      user_metadata: z.record(z.string(), z.unknown()).optional(),
    })
    .passthrough(),
  profile: z
    .object({
      username: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
      college: z.string().nullable().optional(),
      department: z.string().nullable().optional(),
      degree: z.string().nullable().optional(),
      year: z.number().nullable().optional(),
      foodPreference: z.string().nullable().optional(),
      tshirtSize: z.string().nullable().optional(),
      ieeeStudentBranch: z.string().nullable().optional(),
      ieeeMembershipNumber: z.string().nullable().optional(),
    })
    .nullable(),
  registration: z
    .object({
      id: z.string(),
      status: z.string().nullable().optional(),
    })
    .nullable(),
  payment: z
    .object({
      status: z.enum(["completed", "pending"]),
      amount: z.number().optional(),
      isEarlyBird: z.boolean().optional(),
      requiresIeeeVerification: z.boolean().optional(),
      isIeeeEarlyBirdWindowExpired: z.boolean().optional(),
      ieeeEarlyBirdDeadline: z.string().nullable().optional(),
      paymentId: z.string().nullable().optional(),
    })
    .optional(),
  isProfileIncomplete: z.boolean().optional(),
});

export type DashboardData = z.infer<typeof dashboardResponseSchema>;

export function isRegistrationPending(data: DashboardData): boolean {
  const isProfileIncomplete = Boolean(data.isProfileIncomplete);
  const status = data.registration?.status;

  return status !== "registration completed" || isProfileIncomplete;
}

export async function getDashboardData(): Promise<DashboardData | null> {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/profile`, {
    headers: {
      cookie: headersList.get("cookie") || "",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  try {
    const payload: unknown = await res.json();
    const parsed = dashboardResponseSchema.safeParse(payload);
    if (!parsed.success) return null;
    return parsed.data;
  } catch {
    return null;
  }
}
