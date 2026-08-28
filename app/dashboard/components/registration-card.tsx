"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { displayOrIncomplete } from "./display-or-incomplete";
import { InfoItem } from "./info-item";

type RegistrationCardProps = {
  isRegistrationComplete: boolean;
  username: unknown;
  registrationId: unknown;
};

export function RegistrationCard({
  isRegistrationComplete,
  username,
  registrationId,
}: RegistrationCardProps) {
  const [copied, setCopied] = useState(false);
  const registrationIdText =
    typeof registrationId === "string" ? registrationId.trim() : "";

  useEffect(() => {
    if (!copied) return;

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const handleCopy = async () => {
    if (!registrationIdText) return;

    try {
      await navigator.clipboard.writeText(registrationIdText);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy registration ID", error);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent/5 shadow-sm">
      <div className="absolute left-0 top-0 h-full w-[2px] bg-blue-500" />
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Registration
            </p>
            <h2 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {isRegistrationComplete
                ? "Registration complete"
                : "Registration pending"}
            </h2>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-5">
          <InfoItem label="USERNAME">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              {displayOrIncomplete(username)}
            </span>
          </InfoItem>
          <InfoItem label="REGISTRATION ID">
            <div className="flex items-center gap-2">
              <span
                className="block max-w-[12rem] truncate font-medium text-zinc-800 dark:text-zinc-200 sm:max-w-[16rem]"
                title={registrationIdText || undefined}
              >
                {displayOrIncomplete(registrationId)}
              </span>
              <Button
                type="button"
                variant="default"
                size="icon-xs"
                onClick={handleCopy}
                disabled={!registrationIdText}
                aria-label={
                  copied ? "Registration ID copied" : "Copy registration ID"
                }
                title={copied ? "Copied" : "Copy registration ID"}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </InfoItem>
        </div>
      </div>
    </div>
  );
}
