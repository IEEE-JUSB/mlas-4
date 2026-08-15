"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

const tshirtOptions = ["XS", "S", "M", "L", "XL", "XXL"];
const foodOptions = ["Vegetarian", "Non-Vegetarian", "Vegan"];

function isValidPhone(phone: string) {
  return /^[+]?[(]?[0-9]{1,4}[)]?[-\s0-9]{7,15}$/.test(phone.trim());
}

export function CompleteProfileForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    college: "",
    department: "",
    year: "",
    tshirt_size: "",
    food_preference: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone is required.";
    else if (!isValidPhone(form.phone)) {
      nextErrors.phone = "Please enter a valid phone number.";
    }
    if (!form.college.trim()) nextErrors.college = "College is required.";
    if (!form.department.trim()) nextErrors.department = "Department is required.";
    if (!form.year.trim()) nextErrors.year = "Year is required.";
    if (!form.tshirt_size.trim()) nextErrors.tshirt_size = "Please select a T-shirt size.";
    if (!form.food_preference.trim()) nextErrors.food_preference = "Please select a food preference.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/auth/login");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          name: form.name.trim(),
          phone: form.phone.trim(),
          college: form.college.trim(),
          department: form.department.trim(),
          year: form.year.trim(),
          tshirt_size: form.tshirt_size,
          food_preference: form.food_preference,
          registered: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      router.push("/protected");
      router.refresh();
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save your profile right now.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Fill in the required profile details to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div> */}

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="college">College</Label>
              <Input
                id="college"
                value={form.college}
                onChange={(e) => handleChange("college", e.target.value)}
                aria-invalid={Boolean(errors.college)}
              />
              {errors.college && <p className="text-sm text-red-500">{errors.college}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
                aria-invalid={Boolean(errors.department)}
              />
              {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={form.year}
                onChange={(e) => handleChange("year", e.target.value)}
                aria-invalid={Boolean(errors.year)}
              />
              {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tshirt_size">T-Shirt Size</Label>
              <select
                id="tshirt_size"
                value={form.tshirt_size}
                onChange={(e) => handleChange("tshirt_size", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-invalid={Boolean(errors.tshirt_size)}
              >
                <option value="">Select</option>
                {tshirtOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.tshirt_size && <p className="text-sm text-red-500">{errors.tshirt_size}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="food_preference">Food Preference</Label>
              <select
                id="food_preference"
                value={form.food_preference}
                onChange={(e) => handleChange("food_preference", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-invalid={Boolean(errors.food_preference)}
              >
                <option value="">Select</option>
                {foodOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.food_preference && <p className="text-sm text-red-500">{errors.food_preference}</p>}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save & Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}