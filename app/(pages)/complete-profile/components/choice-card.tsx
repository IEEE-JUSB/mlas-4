"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ChoiceCardProps = {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
};

export function ChoiceCard({
  selected,
  onClick,
  title,
  description,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "group relative min-h-[76px] rounded-lg border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-blue-500 bg-blue-500/5 shadow-[0_0_0_1px_rgba(59,130,246,1)]"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              "text-sm font-semibold",
              selected
                ? "text-blue-600 dark:text-blue-400"
                : "text-zinc-900 dark:text-zinc-100",
            )}
          >
            {title}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>
        <div
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
            selected
              ? "border-blue-500 bg-blue-500"
              : "border-zinc-300 dark:border-zinc-700",
          )}
        >
          {selected && (
            <Check className="h-2.5 w-2.5 text-white" aria-hidden="true" />
          )}
        </div>
      </div>
    </button>
  );
}
