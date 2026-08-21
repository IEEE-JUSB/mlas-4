"use client";

import { Building2, GraduationCap, Phone } from "lucide-react";

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

import { YEARS } from "../constants";
import type { FormErrors } from "../types";

type AcademicDetailsSectionProps = {
  phone: string;
  college: string;
  department: string;
  degree: string;
  year: string;
  errors: FormErrors;
  onPhoneChange: (value: string) => void;
  onCollegeChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onDegreeChange: (value: string) => void;
  onYearChange: (value: string) => void;
};

export function AcademicDetailsSection({
  phone,
  college,
  department,
  degree,
  year,
  errors,
  onPhoneChange,
  onCollegeChange,
  onDepartmentChange,
  onDegreeChange,
  onYearChange,
}: AcademicDetailsSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
      <div className="absolute left-0 top-0 h-full w-[2px] bg-blue-500" />
      <div className="p-5 sm:p-6 space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black dark:text-zinc-400"
          >
            Phone Number
          </Label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black"
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
              onChange={(e) => onPhoneChange(e.target.value)}
              className={cn(
                "h-10 rounded-md dark:border-zinc-200 border-zinc-800 bg-transparent pl-9 text-sm focus-visible:ring-1 focus-visible:ring-blue-500",
                errors.phone &&
                  "border-red-500/50 focus-visible:ring-red-500/50",
              )}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="college"
            className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400"
          >
            College / Institution
          </Label>
          <div className="relative">
            <Building2
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <Input
              id="college"
              name="college"
              placeholder="e.g. Jadavpur University"
              required
              value={college}
              onChange={(e) => onCollegeChange(e.target.value)}
              className={cn(
                "h-10 rounded-md dark:border-zinc-200 border-zinc-800 bg-transparent pl-9 text-sm focus-visible:ring-1 focus-visible:ring-blue-500",
                errors.college &&
                  "border-red-500/50 focus-visible:ring-red-500/50",
              )}
            />
          </div>
          {errors.college && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {errors.college}
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="department"
              className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400"
            >
              Department
            </Label>
            <div className="relative">
              <GraduationCap
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <Input
                id="department"
                name="department"
                placeholder="e.g. Computer Science"
                required
                value={department}
                onChange={(e) => onDepartmentChange(e.target.value)}
                className={cn(
                  "h-10 rounded-md dark:border-zinc-200 border-zinc-800 bg-transparent pl-9 text-sm focus-visible:ring-1 focus-visible:ring-blue-500",
                  errors.department &&
                    "border-red-500/50 focus-visible:ring-red-500/50",
                )}
              />
            </div>
            {errors.department && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {errors.department}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="degree"
              className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400"
            >
              Degree
            </Label>
            <Input
              id="degree"
              name="degree"
              placeholder="e.g. B.Tech"
              required
              value={degree}
              onChange={(e) => onDegreeChange(e.target.value)}
              className={cn(
                "h-10 rounded-md dark:border-zinc-200 border-zinc-800 bg-transparent text-sm focus-visible:ring-1 focus-visible:ring-blue-500",
                errors.degree &&
                  "border-red-500/50 focus-visible:ring-red-500/50",
              )}
            />
            {errors.degree && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {errors.degree}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="year"
              className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400"
            >
              Academic Year
            </Label>
            <Select value={year} onValueChange={onYearChange}>
              <SelectTrigger
                id="year"
                className={cn(
                  "h-10 rounded-md dark:border-zinc-200 border-zinc-800 bg-transparent text-sm focus:ring-1 focus:ring-blue-500",
                  errors.year && "border-red-500/50 focus:ring-red-500/50",
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
            {errors.year && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {errors.year}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
