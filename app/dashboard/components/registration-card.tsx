import { displayOrIncomplete } from "./display-or-incomplete";
import { InfoItem } from "./info-item";

type RegistrationCardProps = {
  isRegistrationComplete: boolean;
  username: unknown;
};

export function RegistrationCard({
  isRegistrationComplete,
  username,
}: RegistrationCardProps) {
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
        </div>
      </div>
    </div>
  );
}
