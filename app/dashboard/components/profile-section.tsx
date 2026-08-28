import Link from "next/link";
import { Lock, Pencil } from "lucide-react";

import { displayOrIncomplete } from "./display-or-incomplete";
import { NotApplicableMarker } from "./not-applicable-marker";
import { ProfileField } from "./profile-field";
import { SectionHeading } from "./section-heading";

type ProfileSectionProps = {
  email: unknown;
  profile: {
    phone?: unknown;
    college?: unknown;
    department?: unknown;
    year?: unknown;
    degree?: unknown;
    foodPreference?: unknown;
    tshirtSize?: unknown;
    ieeeStudentBranch?: unknown;
    ieeeMembershipNumber?: unknown;
    ieeeMembershipProofUrl?: unknown;
  } | null;
};

function isMissing(value: unknown) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

export function ProfileSection({ email, profile }: ProfileSectionProps) {
  const hasIeeeDetails =
    !isMissing(profile?.ieeeStudentBranch) ||
    !isMissing(profile?.ieeeMembershipNumber) ||
    !isMissing(profile?.ieeeMembershipProofUrl);

  return (
    <section className="mt-10 pb-12">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeading
          eyebrow="Participant"
          title="Your Profile"
          description=""
        />
        <Link
          href="/complete-profile"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Pencil className="h-3 w-3" />
          Edit Profile
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5">
        <div className="grid sm:grid-cols-2">
          <ProfileField
            icon={<Lock className="h-4 w-4" />}
            label="EMAIL"
            value={displayOrIncomplete(email)}
            locked
          />
          <ProfileField
            label="PHONE"
            value={displayOrIncomplete(profile?.phone)}
          />
          <ProfileField
            label="COLLEGE"
            value={displayOrIncomplete(profile?.college)}
          />
          <ProfileField
            label="DEPARTMENT"
            value={displayOrIncomplete(profile?.department)}
          />
          <ProfileField
            label="YEAR"
            value={displayOrIncomplete(profile?.year)}
          />
          <ProfileField
            label="DEGREE"
            value={displayOrIncomplete(profile?.degree)}
          />
          <ProfileField
            label="FOOD PREFERENCE"
            value={displayOrIncomplete(profile?.foodPreference)}
          />
          <ProfileField
            label="T-SHIRT SIZE"
            value={displayOrIncomplete(profile?.tshirtSize)}
          />
          <ProfileField
            label="IEEE STUDENT BRANCH"
            value={
              hasIeeeDetails ? (
                displayOrIncomplete(profile?.ieeeStudentBranch)
              ) : (
                <NotApplicableMarker />
              )
            }
          />
          <ProfileField
            label="IEEE MEMBERSHIP NUMBER"
            value={
              hasIeeeDetails ? (
                displayOrIncomplete(profile?.ieeeMembershipNumber)
              ) : (
                <NotApplicableMarker />
              )
            }
          />
          <ProfileField
            label="IEEE MEMBERSHIP PROOF URL"
            value={
              hasIeeeDetails ? (
                displayOrIncomplete(profile?.ieeeMembershipProofUrl)
              ) : (
                <NotApplicableMarker />
              )
            }
          />
        </div>
      </div>
    </section>
  );
}
