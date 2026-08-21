type StatusBadgeProps = {
  type: "success" | "warning";
  children: React.ReactNode;
};

export function StatusBadge({ type, children }: StatusBadgeProps) {
  const styles =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
      : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400";

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.12em] ${styles}`}
    >
      {children}
    </span>
  );
}
