import type { TshirtSize } from "./types";

export const TSHIRT_SIZES: readonly TshirtSize[] = ["S", "M", "L", "XL", "XXL"];

export const YEARS = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
  { value: "5", label: "5th Year" },
  { value: "6", label: "6th Year" },
] as const;
