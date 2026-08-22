type InfoItemProps = {
  label: string;
  children: React.ReactNode;
};

export function InfoItem({ label, children }: InfoItemProps) {
  return (
    <div>
      <p className="text-[9px] font-semibold tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
