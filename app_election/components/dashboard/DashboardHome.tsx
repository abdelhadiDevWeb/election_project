import { StatCard } from "./StatCard";

const rows = [
  {
    wilaya: "Alger",
    operation: "Ouverture des bureaux — tour unique",
    statut: "Conforme",
    heure: "07:12",
    tone: "success" as const,
  },
  {
    wilaya: "Oran",
    operation: "Remontée PV — agrégation wilaya",
    statut: "En cours",
    heure: "21:40",
    tone: "warning" as const,
  },
  {
    wilaya: "Constantine",
    operation: "Contrôle signatures — lot 12",
    statut: "Conforme",
    heure: "20:05",
    tone: "success" as const,
  },
  {
    wilaya: "Tizi Ouzou",
    operation: "Synchronisation centre de collecte",
    statut: "À surveiller",
    heure: "19:52",
    tone: "warning" as const,
  },
  {
    wilaya: "Sétif",
    operation: "Consolidation résultats provisoires",
    statut: "Conforme",
    heure: "22:18",
    tone: "success" as const,
  },
];

const rowDelayClasses = ["row-delay-1", "row-delay-2", "row-delay-3", "row-delay-4", "row-delay-5"] as const;

export function DashboardHome() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-enter-fade">
      <div className="animate-enter">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Vue nationale
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Pilotage de la journée électorale
        </h2>
        <div className="dz-underline-wave mt-3 w-28 max-w-full" aria-hidden />
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          Indicateurs agrégés à partir des remontées des wilayas. Les chiffres illustrés sont
          fictifs et servent à valider l’ergonomie du portail.
        </p>
      </div>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Indicateurs clés"
      >
        <StatCard
          className="animate-enter delay-1"
          label="Wilayas connectées"
          value="58 / 58"
          hint="Couverture territoire"
          trend="neutral"
          trendLabel="Synchronisation complète"
        />
        <StatCard
          className="animate-enter delay-2"
          label="Bureaux ouverts (jour J)"
          value="24 180"
          hint="Dernier lot intégré il y a 3 min"
          trend="up"
          trendLabel="+412 vs référentiel"
        />
        <StatCard
          className="animate-enter delay-3"
          label="Taux de participation (estim.)"
          value="48,2 %"
          hint="Mise à jour progressive"
          trend="neutral"
          trendLabel="Stable sur 15 min"
        />
        <StatCard
          className="animate-enter delay-4"
          label="PV transmis & horodatés"
          value="98,6 %"
          hint="Périphérie + centres de collecte"
          trend="up"
          trendLabel="+0,4 pt / 30 min"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section
          className="animate-enter delay-3 rounded-xl border border-border bg-surface p-5 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md lg:col-span-1"
          aria-labelledby="actions-title"
        >
          <h3 id="actions-title" className="text-sm font-semibold text-foreground">
            Actions rapides
          </h3>
          <p className="mt-1 text-xs text-muted">
            Raccourcis vers les workflows les plus sollicités par les opérateurs habilités.
          </p>
          <ul className="mt-4 space-y-2">
            {[
              "Importer un référentiel de bureaux (CSV / SIG)",
              "Lancer un contrôle qualité sur un lot de PV",
              "Publier un communiqué de synthèse wilaya",
              "Exporter la consolidation nationale (PDF / XML)",
            ].map((label) => (
              <li key={label}>
                <button
                  type="button"
                  className="group flex w-full items-start gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left text-sm text-foreground transition duration-200 hover:border-dz-green/25 hover:bg-surface-muted"
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-dz-green/20 to-dz-red/15 text-dz-green transition duration-300 group-hover:from-dz-green group-hover:to-dz-red group-hover:text-white"
                    aria-hidden
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                  <span className="leading-snug">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="animate-enter delay-4 overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md lg:col-span-2"
          aria-labelledby="flux-title"
        >
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h3 id="flux-title" className="text-sm font-semibold text-foreground">
                Flux opérationnels récents
              </h3>
              <p className="mt-0.5 text-xs text-muted">
                Journal consolidé — filtrable par wilaya dans la version connectée.
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground transition duration-200 hover:border-dz-green/35 hover:bg-dz-green/5"
            >
              Exporter le journal
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/80 text-xs font-medium uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Wilaya</th>
                  <th className="px-5 py-3 font-medium">Opération</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium text-right">Heure</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={`${row.wilaya}-${row.heure}`}
                    className={`animate-row-in border-b border-border/80 transition-colors last:border-0 hover:bg-surface-muted/50 ${rowDelayClasses[i] ?? ""}`}
                  >
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-foreground">
                      {row.wilaya}
                    </td>
                    <td className="max-w-[14rem] truncate px-5 py-3 text-muted md:max-w-none">
                      {row.operation}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.tone === "success"
                            ? "bg-dz-green/10 text-dz-green ring-1 ring-dz-green/20"
                            : "bg-amber-50 text-warning ring-1 ring-amber-600/20"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            row.tone === "success" ? "bg-dz-green" : "bg-warning"
                          }`}
                          aria-hidden
                        />
                        {row.statut}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right font-mono text-xs text-muted tabular-nums">
                      {row.heure}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <footer className="animate-enter delay-5 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Données de démonstration — conformité RGPD / habilitations à brancher sur votre annuaire
          d’identité.
        </p>
        <p className="font-mono text-[11px] text-muted/80">Build UI — Portail élections DZ</p>
      </footer>
    </div>
  );
}
