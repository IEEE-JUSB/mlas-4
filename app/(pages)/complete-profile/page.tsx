"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Building2,
  Check,
  ArrowUpRight,
  GraduationCap,
  Loader2,
  Phone,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FoodPreference = "VEG" | "NON_VEG";

const TSHIRT_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

const YEARS = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
];

type FormErrors = {
  phone?: string;
  college?: string;
  year?: string;
  department?: string;
  foodPreference?: string;
  tShirtSize?: string;
  general?: string;
};

export default function CompleteProfilePage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [foodPreference, setFoodPreference] = useState<FoodPreference | null>(null);
  const [tShirtSize, setTshirtSize] = useState<(typeof TSHIRT_SIZES)[number] | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validateForm(): FormErrors {
    const newErrors: FormErrors = {};

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (phone.trim().length < 10) {
      newErrors.phone = "Please enter a valid phone number.";
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

    if (!foodPreference) {
      newErrors.foodPreference = "Please select a food preference.";
    }

    if (!tShirtSize) {
      newErrors.tShirtSize = "Please select your T-shirt size.";
    }

    return newErrors;
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
      const response = await fetch("/api/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          college,
          year,
          department,
          foodPreference,
          tShirtSize,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile.");
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
        </section>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 pb-12">
          {/* Academic Details Section */}
          <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
            <div className="absolute left-0 top-0 h-full w-[2px] bg-blue-500" />
            <div className="p-5 sm:p-6 space-y-6">
              
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black dark:text-zinc-400">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" aria-hidden="true" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="Enter your phone number"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    className={cn(
                      "h-10 rounded-md dark:border-zinc-200 border-zinc-800 bg-transparent pl-9 text-sm focus-visible:ring-1 focus-visible:ring-blue-500",
                      errors.phone && "border-red-500/50 focus-visible:ring-red-500/50"
                    )}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 dark:text-red-400">{errors.phone}</p>}
              </div>

              {/* College */}
              <div className="space-y-2">
                <Label htmlFor="college" className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                  College / Institution
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                  <Input
                    id="college"
                    name="college"
                    placeholder="e.g. Jadavpur University"
                    required
                    value={college}
                    onChange={(e) => {
                      setCollege(e.target.value);
                      if (errors.college) setErrors((prev) => ({ ...prev, college: undefined }));
                    }}
                    className={cn(
                      "h-10 rounded-md dark:border-zinc-200 border-zinc-800 bg-transparent pl-9 text-sm focus-visible:ring-1 focus-visible:ring-blue-500",
                      errors.college && "border-red-500/50 focus-visible:ring-red-500/50"
                    )}
                  />
                </div>
                {errors.college && <p className="text-xs text-red-500 dark:text-red-400">{errors.college}</p>}
              </div>

              {/* Department + Year */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                    Department
                  </Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                    <Input
                      id="department"
                      name="department"
                      placeholder="e.g. Computer Science"
                      required
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        if (errors.department) setErrors((prev) => ({ ...prev, department: undefined }));
                      }}
                      className={cn(
                        "h-10 rounded-md dark:border-zinc-200 border-zinc-800 bg-transparent pl-9 text-sm focus-visible:ring-1 focus-visible:ring-blue-500",
                        errors.department && "border-red-500/50 focus-visible:ring-red-500/50"
                      )}
                    />
                  </div>
                  {errors.department && <p className="text-xs text-red-500 dark:text-red-400">{errors.department}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                    Academic Year
                  </Label>
                  <Select
                    value={year}
                    onValueChange={(value) => {
                      setYear(value);
                      if (errors.year) setErrors((prev) => ({ ...prev, year: undefined }));
                    }}
                  >
                    <SelectTrigger
                      id="year"
                      className={cn(
                        "h-10 rounded-md dark:border-zinc-200 border-zinc-800 bg-transparent text-sm focus:ring-1 focus:ring-blue-500",
                        errors.year && "border-red-500/50 focus:ring-red-500/50"
                      )}
                    >
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.year && <p className="text-xs text-red-500 dark:text-red-400">{errors.year}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
            <div className="p-5 sm:p-6 space-y-7">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  Workshop Logistics
                </p>
                <h2 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Event Preferences
                </h2>
              </div>

              {/* Food Preference */}
              <div className="space-y-3">
                <Label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                  Food Preference
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <ChoiceCard
                    selected={foodPreference === "VEG"}
                    onClick={() => {
                      setFoodPreference("VEG");
                      if (errors.foodPreference) setErrors((prev) => ({ ...prev, foodPreference: undefined }));
                    }}
                    title="Vegetarian"
                    description="Veg"
                  />
                  <ChoiceCard
                    selected={foodPreference === "NON_VEG"}
                    onClick={() => {
                      setFoodPreference("NON_VEG");
                      if (errors.foodPreference) setErrors((prev) => ({ ...prev, foodPreference: undefined }));
                    }}
                    title="Non-vegetarian"
                    description="Non-veg"
                  />
                </div>
                {errors.foodPreference && <p className="text-xs text-red-500 dark:text-red-400">{errors.foodPreference}</p>}
              </div>

              {/* T-shirt Size */}
              <div className="space-y-3">
                <Label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                  T-shirt Size
                </Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {TSHIRT_SIZES.map((size) => {
                    const selected = tShirtSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          setTshirtSize(size);
                          if (errors.tShirtSize) setErrors((prev) => ({ ...prev, tShirtSize: undefined }));
                        }}
                        className={cn(
                          "relative h-10 rounded-md border text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          selected
                            ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,1)]"
                            : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {errors.tShirtSize && <p className="text-xs text-red-500 dark:text-red-400">{errors.tShirtSize}</p>}
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500 dark:text-red-400" role="alert">
                  {errors.general}
                </div>
              )}

              {/* Submit */}
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
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

/* =========================================================
   Choice Card
========================================================= */

function ChoiceCard({
  selected,
  onClick,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "group relative min-h-[76px] rounded-lg border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-blue-500 bg-blue-500/5 shadow-[0_0_0_1px_rgba(59,130,246,1)]"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-sm font-semibold", selected ? "text-blue-600 dark:text-blue-400" : "text-zinc-900 dark:text-zinc-100")}>
            {title}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
        </div>
        <div
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
            selected ? "border-blue-500 bg-blue-500" : "border-zinc-300 dark:border-zinc-700"
          )}
        >
          {selected && <Check className="h-2.5 w-2.5 text-white" aria-hidden="true" />}
        </div>
      </div>
    </button>
  );
}