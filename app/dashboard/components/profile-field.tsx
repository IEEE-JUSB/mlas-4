import { Lock } from "lucide-react";

type ProfileFieldProps = {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  locked?: boolean;
};

export function ProfileField({
  icon,
  label,
  value,
  locked = false,
}: ProfileFieldProps) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 p-5 sm:even:border-l">
      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
        {icon}
        <span className="text-[9px] font-semibold tracking-[0.16em]">
          {label}
        </span>
        {locked && (
          <Lock className="ml-auto h-3 w-3 text-zinc-400 dark:text-zinc-500" />
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  );
}
