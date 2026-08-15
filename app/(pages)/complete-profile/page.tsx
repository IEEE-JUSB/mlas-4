"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Building2,
  Check,
  ChevronRight,
  GraduationCap,
  Loader2,
  Phone,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FoodPreference = "VEG" | "NON_VEG";

const TSHIRT_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
] as const;

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

  const [foodPreference, setFoodPreference] =
    useState<FoodPreference | null>(null);

  const [tShirtSize, setTshirtSize] =
    useState<(typeof TSHIRT_SIZES)[number] | null>(null);

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
      newErrors.foodPreference =
        "Please select a food preference.";
    }

    if (!tShirtSize) {
      newErrors.tShirtSize =
        "Please select your T-shirt size.";
    }

    return newErrors;
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
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
        headers: {
          "Content-Type": "application/json",
        },
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
        throw new Error(
          data.error || "Failed to update profile."
        );
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
    <main
      className="
        min-h-screen
        w-full
        bg-gradient-to-br
        from-background
        via-background
        to-primary/10
        px-4
        py-10
        sm:px-6
      "
    >
      <div className="mx-auto w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6"
        >

          <Card
            className="
              border-border/60
              bg-card/80
              shadow-xl
              backdrop-blur-xl
            "
          >
            <CardHeader className="space-y-2 px-6 pb-6 pt-7 sm:px-7">
              <CardTitle
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-foreground
                  sm:text-4xl
                "
              >
                Complete your profile
              </CardTitle>

              <CardDescription
                className="
                  max-w-xl
                  text-base
                  leading-6
                  text-foreground/70
                "
              >
                Just a few details before you continue. This
                information will be used for workshop
                registration and event logistics.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-7 sm:px-7">
              {/* Phone */}

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-base font-medium"
                >
                  Phone Number
                </Label>

                <div className="relative">
                  <Phone
                    className="
                      absolute
                      left-3
                      top-1/2
                      h-5
                      w-5
                      -translate-y-1/2
                      text-foreground/60
                    "
                    aria-hidden="true"
                  />

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

                      if (errors.phone) {
                        setErrors((prev) => ({
                          ...prev,
                          phone: undefined,
                        }));
                      }
                    }}
                    className={cn(
                      `
                        h-12
                        rounded-xl
                        pl-11
                        text-base
                        transition-all
                        focus-visible:ring-2
                      `,
                      errors.phone &&
                        `
                          border-destructive
                          focus-visible:ring-destructive/20
                        `
                    )}
                  />
                </div>

                {errors.phone && (
                  <p
                    className="
                      text-sm
                      font-medium
                      text-destructive
                    "
                    role="alert"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* College */}

              <div className="space-y-2">
                <Label
                  htmlFor="college"
                  className="text-base font-medium"
                >
                  College / Institution
                </Label>

                <div className="relative">
                  <Building2
                    className="
                      absolute
                      left-3
                      top-1/2
                      h-5
                      w-5
                      -translate-y-1/2
                      text-foreground/60
                    "
                    aria-hidden="true"
                  />

                  <Input
                    id="college"
                    name="college"
                    placeholder="e.g. Jadavpur University"
                    required
                    value={college}
                    onChange={(e) => {
                      setCollege(e.target.value);

                      if (errors.college) {
                        setErrors((prev) => ({
                          ...prev,
                          college: undefined,
                        }));
                      }
                    }}
                    className={cn(
                      `
                        h-12
                        rounded-xl
                        pl-11
                        text-base
                        transition-all
                        focus-visible:ring-2
                      `,
                      errors.college &&
                        `
                          border-destructive
                          focus-visible:ring-destructive/20
                        `
                    )}
                  />
                </div>

                {errors.college && (
                  <p
                    className="
                      text-sm
                      font-medium
                      text-destructive
                    "
                    role="alert"
                  >
                    {errors.college}
                  </p>
                )}
              </div>

              {/* Department + Academic Year */}

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Department */}

                <div className="space-y-2">
                  <Label
                    htmlFor="department"
                    className="text-base font-medium"
                  >
                    Department
                  </Label>

                  <div className="relative">
                    <GraduationCap
                      className="
                        absolute
                        left-3
                        top-1/2
                        h-5
                        w-5
                        -translate-y-1/2
                        text-foreground/60
                      "
                      aria-hidden="true"
                    />

                    <Input
                      id="department"
                      name="department"
                      placeholder="e.g. Computer Science"
                      required
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);

                        if (errors.department) {
                          setErrors((prev) => ({
                            ...prev,
                            department: undefined,
                          }));
                        }
                      }}
                      className={cn(
                        `
                          h-12
                          rounded-xl
                          pl-11
                          text-base
                          transition-all
                          focus-visible:ring-2
                        `,
                        errors.department &&
                          `
                            border-destructive
                            focus-visible:ring-destructive/20
                          `
                      )}
                    />
                  </div>

                  {errors.department && (
                    <p
                      className="
                        text-sm
                        font-medium
                        text-destructive
                      "
                      role="alert"
                    >
                      {errors.department}
                    </p>
                  )}
                </div>

                {/* Academic Year */}

                <div className="space-y-2">
                  <Label
                    htmlFor="year"
                    className="text-base font-medium"
                  >
                    Academic Year
                  </Label>

                  <Select
                    value={year}
                    onValueChange={(value) => {
                      setYear(value);

                      if (errors.year) {
                        setErrors((prev) => ({
                          ...prev,
                          year: undefined,
                        }));
                      }
                    }}
                  >
                    <SelectTrigger
                      id="year"
                      className={cn(
                        `
                          h-12
                          rounded-xl
                          text-base
                          transition-all
                          focus:ring-2
                        `,
                        errors.year &&
                          `
                            border-destructive
                            focus:ring-destructive/20
                          `
                      )}
                    >
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>

                    <SelectContent>
                      {YEARS.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.year && (
                    <p
                      className="
                        text-sm
                        font-medium
                        text-destructive
                      "
                      role="alert"
                    >
                      {errors.year}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="
              border-border/60
              bg-card/80
              shadow-xl
              backdrop-blur-xl
            "
          >
            <CardHeader className="space-y-1.5 px-6 pb-5 pt-6 sm:px-7">
              <CardTitle className="text-xl font-semibold">
                Workshop Details
              </CardTitle>

              <CardDescription
                className="
                  text-sm
                  text-foreground/70
                "
              >
                These details help us prepare for the event.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-7 px-6 pb-7 sm:px-7">
              {/* Food Preference */}

              <div className="space-y-3">
                <div>
                  <Label className="text-base font-medium">
                    Food Preference
                  </Label>

                  <p className="mt-1 text-sm text-foreground/70">
                    Select the option that applies to you.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <ChoiceCard
                    selected={foodPreference === "VEG"}
                    onClick={() => {
                      setFoodPreference("VEG");

                      if (errors.foodPreference) {
                        setErrors((prev) => ({
                          ...prev,
                          foodPreference: undefined,
                        }));
                      }
                    }}
                    title="Vegetarian"
                    description="Veg"
                  />

                  <ChoiceCard
                    selected={foodPreference === "NON_VEG"}
                    onClick={() => {
                      setFoodPreference("NON_VEG");

                      if (errors.foodPreference) {
                        setErrors((prev) => ({
                          ...prev,
                          foodPreference: undefined,
                        }));
                      }
                    }}
                    title="Non-vegetarian"
                    description="Non-veg"
                  />
                </div>

                {errors.foodPreference && (
                  <p
                    className="
                      text-sm
                      font-medium
                      text-destructive
                    "
                    role="alert"
                  >
                    {errors.foodPreference}
                  </p>
                )}
              </div>

              {/* T-shirt Size */}

              <div className="space-y-3">
                <div>
                  <Label className="text-base font-medium">
                    T-shirt Size
                  </Label>

                  <p className="mt-1 text-sm text-foreground/70">
                    Select your preferred T-shirt size.
                  </p>
                </div>

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

                          if (errors.tShirtSize) {
                            setErrors((prev) => ({
                              ...prev,
                              tShirtSize: undefined,
                            }));
                          }
                        }}
                        className={cn(
                          `
                            relative
                            h-12
                            rounded-xl
                            border
                            text-base
                            font-medium
                            transition-all
                            hover:border-primary/50
                            hover:bg-primary/5
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary
                            focus-visible:ring-offset-2
                            focus-visible:ring-offset-background
                          `,
                          selected &&
                            `
                              border-primary
                              bg-primary/10
                              text-primary
                              shadow-[0_0_0_1px_hsl(var(--primary))]
                            `
                        )}
                      >
                        {size}

                        {selected && (
                          <span className="absolute right-1.5 top-1.5">
                            <Check
                              className="h-4 w-4 text-primary"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {errors.tShirtSize && (
                  <p
                    className="
                      text-sm
                      font-medium
                      text-destructive
                    "
                    role="alert"
                  >
                    {errors.tShirtSize}
                  </p>
                )}
              </div>

              {/* General Error */}

              {errors.general && (
                <div
                  className="
                    rounded-xl
                    border
                    border-destructive/30
                    bg-destructive/10
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-destructive
                  "
                  role="alert"
                >
                  {errors.general}
                </div>
              )}

              {/* Submit */}

              <Button
                type="submit"
                disabled={loading}
                className="
                  h-12
                  w-full
                  rounded-xl
                  text-base
                  font-semibold
                  shadow-lg
                  shadow-primary/20
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-primary/30
                  focus-visible:ring-2
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      className="mr-2 h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight
                      className="ml-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-foreground/70">
                You can update these details later if needed.
              </p>
            </CardContent>
          </Card>
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
        `
          group
          relative
          min-h-[76px]
          rounded-xl
          border
          p-4
          text-left
          transition-all
          hover:border-primary/50
          hover:bg-primary/5
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary
          focus-visible:ring-offset-2
          focus-visible:ring-offset-background
        `,
        selected &&
          `
            border-primary
            bg-primary/10
            shadow-[0_0_0_1px_hsl(var(--primary))]
          `
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              "text-base font-semibold",
              selected
                ? "text-primary"
                : "text-foreground"
            )}
          >
            {title}
          </p>

          <p className="mt-1 text-sm text-foreground/70">
            {description}
          </p>
        </div>

        <div
          className={cn(
            `
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              border
            `,
            selected
              ? "border-primary bg-primary"
              : "border-foreground/40"
          )}
        >
          {selected && (
            <Check
              className="h-3 w-3 text-primary-foreground"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </button>
  );
}