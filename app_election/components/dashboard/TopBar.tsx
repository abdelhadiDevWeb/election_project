"use client";

type TopBarProps = {
  onOpenMenu: () => void;
};

export function TopBar({ onOpenMenu }: TopBarProps) {
  return (
    <header className="relative sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-surface/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-surface/80 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-muted text-foreground transition hover:bg-border/60 md:hidden"
          onClick={onOpenMenu}
          aria-label="Ouvrir le menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-foreground md:text-base">
            Tableau de bord opérationnel
          </h1>
          <p className="hidden truncate text-xs text-muted sm:block">
            Suivi national des bureaux, des flux PV et de la consolidation des résultats
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface-muted px-3 py-1.5 text-xs text-muted lg:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-dz-green shadow-[0_0_0_2px_rgba(0,98,51,0.2)]" aria-hidden />
          Système nominal
        </div>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface transition hover:bg-surface-muted"
          aria-label="Notifications"
        >
          <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-dz-red ring-2 ring-surface" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted py-1 pl-1 pr-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-xs font-semibold text-white">
            AC
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-medium text-foreground">Admin. central</p>
            <p className="text-[11px] text-muted">Habilitation complète</p>
          </div>
        </div>
      </div>

      <div className="dz-flag-bar pointer-events-none absolute inset-x-0 bottom-0 h-[3px]" aria-hidden />
    </header>
  );
}
