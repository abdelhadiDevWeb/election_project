type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  className?: string;
};

export function StatCard({
  label,
  value,
  hint,
  trend,
  trendLabel,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-10px_rgba(0,98,51,0.18),0_4px_16px_-4px_rgba(210,16,52,0.08)] ${className}`}
    >
      <div
        className="dz-stat-strip pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        aria-hidden
      />
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      {(hint || trendLabel) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
          {hint && <span>{hint}</span>}
          {trend && trendLabel && (
            <span
              className={
                trend === "up"
                  ? "text-dz-green"
                  : trend === "down"
                    ? "text-dz-red"
                    : "text-muted"
              }
            >
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
