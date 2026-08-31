"use client";

import { ArrowUpRight, Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AcademicDetailsSection } from "./components/academic-details-section";
import { EventPreferencesSection } from "./components/event-preferences-section";
import type {
  FoodPreference,
  FormErrors,
  ProfileApiResponse,
  TshirtSize,
} from "./types";

export default function CompleteProfilePage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [degree, setDegree] = useState("");
  const [foodPreference, setFoodPreference] = useState<FoodPreference | null>(
    null,
  );
  const [tShirtSize, setTshirtSize] = useState<TshirtSize | null>(null);
  const [isIeeeMember, setIsIeeeMember] = useState(false);
  const [showIeeeSection, setShowIeeeSection] = useState(false);
  const [ieeeStudentBranch, setIeeeStudentBranch] = useState("");
  const [ieeeMembershipNumber, setIeeeMembershipNumber] = useState("");
  const [ieeeMembershipProofUrl, setIeeeMembershipProofUrl] = useState("");

  const [prefillLoading, setPrefillLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    let mounted = true;

    async function hydrateProfile() {
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });

        if (!response.ok) return;

        const data: ProfileApiResponse = await response.json();
        const profile = data?.profile;

        if (!mounted || !profile) return;

        setPhone(profile.phone ?? "");
        setCollege(profile.college ?? "");
        setYear(profile.year ? String(profile.year) : "");
        setDepartment(profile.department ?? "");
        setDegree(profile.degree ?? "");
        setFoodPreference(profile.foodPreference ?? null);
        setTshirtSize(profile.tshirtSize ?? null);
        setIeeeStudentBranch(profile.ieeeStudentBranch ?? "");
        setIeeeMembershipNumber(profile.ieeeMembershipNumber ?? "");
        setIeeeMembershipProofUrl(profile.ieeeMembershipProofUrl ?? "");

        const hasIeeeData = Boolean(
          (profile.ieeeStudentBranch && profile.ieeeStudentBranch.trim()) ||
          (profile.ieeeMembershipNumber &&
            profile.ieeeMembershipNumber.trim()) ||
          (profile.ieeeMembershipProofUrl &&
            profile.ieeeMembershipProofUrl.trim()),
        );

        if (hasIeeeData) {
          setIsIeeeMember(true);
          setShowIeeeSection(true);
        }
      } catch {
        // Keep form usable even if prefill fails.
      } finally {
        if (mounted) {
          setPrefillLoading(false);
        }
      }
    }

    hydrateProfile();

    return () => {
      mounted = false;
    };
  }, []);

  function validateForm(): FormErrors {
    const newErrors: FormErrors = {};

    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
      newErrors.phone = "Phone number is required.";
    } else if (
      trimmedPhone.startsWith("+91") ||
      (trimmedPhone.startsWith("91") && trimmedPhone.length === 12)
    ) {
      newErrors.phone = "Please remove +91 or country code. Enter 10 digits only.";
    } else if (trimmedPhone.length === 11 && trimmedPhone.startsWith("0")) {
      newErrors.phone = "Please remove leading zero. Enter 10 digits only.";
    } else if (!/^\d{10}$/.test(trimmedPhone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number without spaces or symbols.";
    }

    if (!college.trim()) {
      newErrors.college = "College / Institution is required.";
    }

    if (!year) {
      newErrors.year = "Please select your academic year.";
    }

    if (!department.trim()) {
      newErrors.department = "Department is required.";
    }

    if (!degree.trim()) {
      newErrors.degree = "Degree is required.";
    }

    if (!foodPreference) {
      newErrors.foodPreference = "Please select a food preference.";
    }

    if (!tShirtSize) {
      newErrors.tShirtSize = "Please select your T-shirt size.";
    }

    if (isIeeeMember) {
      if (!ieeeStudentBranch.trim()) {
        newErrors.ieeeStudentBranch = "IEEE Student Branch is required.";
      }
      if (!ieeeMembershipNumber.trim()) {
        newErrors.ieeeMembershipNumber = "IEEE Membership Number is required.";
      }
      if (!ieeeMembershipProofUrl.trim()) {
        newErrors.ieeeMembershipProofUrl =
          "Please share a public link to your IEEE membership card or proof.";
      } else if (!/^https?:\/\//i.test(ieeeMembershipProofUrl.trim())) {
        newErrors.ieeeMembershipProofUrl = "Please enter a valid public URL.";
      }
    }

    return newErrors;
  }

  function clearError(key: keyof FormErrors) {
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          college,
          year,
          department,
          degree,
          foodPreference,
          tshirtSize: tShirtSize,
          ...(isIeeeMember
            ? {
              ieeeStudentBranch,
              ieeeMembershipNumber,
              ieeeMembershipProofUrl: ieeeMembershipProofUrl.trim(),
            }
            : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || "Failed to update profile.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen  text-zinc-900 dark:text-zinc-100 transition-colors mt-10">
      {/* Background Effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/[0.06] blur-[140px]" />
      </div>

      <div className="relative mx-auto w-full max-w-2xl px-5 py-6 sm:px-8 lg:px-10 mt-8">
        <section className="relative pb-8 sm:pb-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Account Setup
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Complete your profile
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Just a few details before you continue. This information will be
            used for workshop registration and event logistics.
          </p>
          {prefillLoading && (
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Loading your existing details...
            </p>
          )}
        </section>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 pb-12">
          <AcademicDetailsSection
            phone={phone}
            college={college}
            department={department}
            degree={degree}
            year={year}
            errors={errors}
            onPhoneChange={(value) => {
              setPhone(value);
              clearError("phone");
            }}
            onCollegeChange={(value) => {
              setCollege(value);
              clearError("college");
            }}
            onDepartmentChange={(value) => {
              setDepartment(value);
              clearError("department");
            }}
            onDegreeChange={(value) => {
              setDegree(value);
              clearError("degree");
            }}
            onYearChange={(value) => {
              setYear(value);
              clearError("year");
            }}
          />

          <EventPreferencesSection
            foodPreference={foodPreference}
            tShirtSize={tShirtSize}
            isIeeeMember={isIeeeMember}
            showIeeeSection={showIeeeSection}
            ieeeStudentBranch={ieeeStudentBranch}
            ieeeMembershipNumber={ieeeMembershipNumber}
            ieeeMembershipProofUrl={ieeeMembershipProofUrl}
            errors={errors}
            onFoodPreferenceChange={(value) => {
              setFoodPreference(value);
              clearError("foodPreference");
            }}
            onTshirtSizeChange={(value) => {
              setTshirtSize(value);
              clearError("tShirtSize");
            }}
            onIeeeMemberToggle={() => {
              const nextValue = !isIeeeMember;
              setIsIeeeMember(nextValue);
              if (!nextValue) {
                setErrors((prev) => ({
                  ...prev,
                  ieeeStudentBranch: undefined,
                  ieeeMembershipNumber: undefined,
                  ieeeMembershipProofUrl: undefined,
                }));
              } else {
                setShowIeeeSection(true);
              }
            }}
            onShowIeeeSectionToggle={() => setShowIeeeSection((prev) => !prev)}
            onIeeeStudentBranchChange={(value) => {
              setIeeeStudentBranch(value);
              clearError("ieeeStudentBranch");
            }}
            onIeeeMembershipNumberChange={(value) => {
              setIeeeMembershipNumber(value);
              clearError("ieeeMembershipNumber");
            }}
            onIeeeMembershipProofUrlChange={(value) => {
              setIeeeMembershipProofUrl(value);
              clearError("ieeeMembershipProofUrl");
            }}
          />
          {errors.general && (
            <div
              className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500 dark:text-red-400"
              role="alert"
            >
              {errors.general}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              You can update this later if needed.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="group/button flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-blue-500/30 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
