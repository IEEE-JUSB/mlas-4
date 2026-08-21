"use client";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { TSHIRT_SIZES } from "../constants";
import type { FoodPreference, FormErrors, TshirtSize } from "../types";
import { ChoiceCard } from "./choice-card";

type EventPreferencesSectionProps = {
  foodPreference: FoodPreference | null;
  tShirtSize: TshirtSize | null;
  isIeeeMember: boolean;
  showIeeeSection: boolean;
  ieeeStudentBranch: string;
  ieeeMembershipNumber: string;
  errors: FormErrors;
  onFoodPreferenceChange: (value: FoodPreference) => void;
  onTshirtSizeChange: (value: TshirtSize) => void;
  onIeeeMemberToggle: () => void;
  onShowIeeeSectionToggle: () => void;
  onIeeeStudentBranchChange: (value: string) => void;
  onIeeeMembershipNumberChange: (value: string) => void;
};

export function EventPreferencesSection({
  foodPreference,
  tShirtSize,
  isIeeeMember,
  showIeeeSection,
  ieeeStudentBranch,
  ieeeMembershipNumber,
  errors,
  onFoodPreferenceChange,
  onTshirtSizeChange,
  onIeeeMemberToggle,
  onShowIeeeSectionToggle,
  onIeeeStudentBranchChange,
  onIeeeMembershipNumberChange,
}: EventPreferencesSectionProps) {
  return (
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

        <div className="space-y-3">
          <Label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            Food Preference
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <ChoiceCard
              selected={foodPreference === "VEG"}
              onClick={() => onFoodPreferenceChange("VEG")}
              title="Vegetarian"
              description="Veg"
            />
            <ChoiceCard
              selected={foodPreference === "NON_VEG"}
              onClick={() => onFoodPreferenceChange("NON_VEG")}
              title="Non-vegetarian"
              description="Non-veg"
            />
          </div>
          {errors.foodPreference && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {errors.foodPreference}
            </p>
          )}
        </div>

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
                  onClick={() => onTshirtSizeChange(size)}
                  className={cn(
                    "relative h-10 rounded-md border text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    selected
                      ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,1)]"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {errors.tShirtSize && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {errors.tShirtSize}
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex w-full items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                IEEE Membership (Optional)
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Turn this on only if you are an IEEE member. Both fields become
                required.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isIeeeMember}
              onClick={onIeeeMemberToggle}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors",
                isIeeeMember
                  ? "border-blue-500 bg-blue-500"
                  : "border-zinc-300 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800",
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  isIeeeMember ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={onShowIeeeSectionToggle}
            className={cn(
              "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-xs transition-colors",
              isIeeeMember
                ? "border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                : "cursor-not-allowed border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-500",
            )}
            disabled={!isIeeeMember}
          >
            <span>IEEE details</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-zinc-500 transition-transform",
                showIeeeSection && "rotate-180",
              )}
            />
          </button>

          {showIeeeSection && isIeeeMember && (
            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="ieeeStudentBranch"
                  className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400"
                >
                  IEEE Student Branch
                </Label>
                <Input
                  id="ieeeStudentBranch"
                  name="ieeeStudentBranch"
                  placeholder="e.g. IEEE SB Jadavpur"
                  value={ieeeStudentBranch}
                  onChange={(e) => onIeeeStudentBranchChange(e.target.value)}
                  className={cn(
                    "h-10 rounded-md dark:border-zinc-200 border-zinc-800 bg-transparent text-sm focus-visible:ring-1 focus-visible:ring-blue-500",
                    errors.ieeeStudentBranch &&
                      "border-red-500/50 focus-visible:ring-red-500/50",
                  )}
                />
                {errors.ieeeStudentBranch && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors.ieeeStudentBranch}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="ieeeMembershipNumber"
                  className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400"
                >
                  IEEE Membership Number
                </Label>
                <Input
                  id="ieeeMembershipNumber"
                  name="ieeeMembershipNumber"
                  placeholder="Enter your IEEE membership number"
                  value={ieeeMembershipNumber}
                  onChange={(e) => onIeeeMembershipNumberChange(e.target.value)}
                  className={cn(
                    "h-10 rounded-md dark:border-zinc-200 border-zinc-800 bg-transparent text-sm focus-visible:ring-1 focus-visible:ring-blue-500",
                    errors.ieeeMembershipNumber &&
                      "border-red-500/50 focus-visible:ring-red-500/50",
                  )}
                />
                {errors.ieeeMembershipNumber && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors.ieeeMembershipNumber}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
