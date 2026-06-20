import { Link } from 'react-router'
import {
  Users, ShieldHalf, Wallet, AlertTriangle,
  CalendarCheck, ArrowRight, TrendingUp,
} from 'lucide-react'

// ─── Données statiques ────────────────────────────────────────────────────────
const STATS = {
  scope: 'global',
  total_members: 47,
  total_teams: 3,
  monthly_revenue: 7050,
  late_payments_count: 5,
  upcoming_trainings: 8,
  period: 'Juin 2026',
}

const RECENT_MEMBERS = [
  { id: 1, initials: 'YA', name: 'Youssef Amrani',   category: 'Sénior',   date: '12/06/2026' },
  { id: 2, initials: 'SB', name: 'Sara Benali',      category: 'Junior',   date: '10/06/2026' },
  { id: 3, initials: 'AK', name: 'Amine Khalil',     category: 'Cadet',    date: '08/06/2026' },
  { id: 4, initials: 'NM', name: 'Nadia Mansouri',   category: 'Sénior',   date: '05/06/2026' },
  { id: 5, initials: 'KT', name: 'Karim Tahiri',     category: 'Benjamin', date: '01/06/2026' },
]

const UPCOMING_TRAININGS = [
  { id: 1, title: 'Entraînement cardio',      team: 'Équipe Seniors',  date: '22 Juin', time: '18:30', location: 'Gymnase Central' },
  { id: 2, title: 'Travail technique',        team: 'Équipe Juniors',  date: '23 Juin', time: '17:00', location: 'Terrain B' },
  { id: 3, title: 'Préparation physique',     team: 'Équipe Cadets',   date: '24 Juin', time: '16:00', location: 'Salle de sport' },
]

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, icon: Icon, iconBg, iconColor, sub, subColor, to, alert }) {
  const inner = (
    <div className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 transition-shadow hover:shadow-md ${alert ? 'ring-red-200' : 'ring-slate-200'}`}>
      {alert && <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-red-400" />}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={`mt-2 text-3xl font-bold ${alert ? 'text-red-600' : 'text-navy-700'}`}>{value}</p>
          {sub && <p className={`mt-1 text-xs ${subColor ?? 'text-slate-400'}`}>{sub}</p>}
        </div>
        <span className={`shrink-0 rounded-xl p-3 ${iconBg}`}>
          <Icon size={22} className={iconColor} />
        </span>
      </div>
      {to && (
        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-orange-500">
          Voir le détail <ArrowRight size={12} />
        </div>
      )}
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const stats = STATS
  const hasLate = stats.late_payments_count > 0

  const cards = [
    {
      label: 'Membres actifs',
      value: stats.total_members,
      icon: Users,
      iconBg: 'bg-navy-50',
      iconColor: 'text-navy-700',
      sub: 'Total du club',
      to: '/membres',
    },
    {
      label: 'Équipes',
      value: stats.total_teams,
      icon: ShieldHalf,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      sub: 'Équipes actives',
    },
    {
      label: 'Revenus du mois',
      value: `${stats.monthly_revenue.toLocaleString('fr-FR')} MAD`,
      icon: Wallet,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      sub: `Période ${stats.period}`,
      subColor: 'text-emerald-500',
    },
    {
      label: 'Retards de paiement',
      value: stats.late_payments_count,
      icon: AlertTriangle,
      iconBg: hasLate ? 'bg-red-100' : 'bg-slate-100',
      iconColor: hasLate ? 'text-red-500' : 'text-slate-400',
      sub: hasLate ? 'Action requise' : 'Tout est à jour',
      subColor: hasLate ? 'text-red-500 font-semibold' : 'text-slate-400',
      alert: hasLate,
    },
    {
      label: 'Entraînements à venir',
      value: stats.upcoming_trainings,
      icon: CalendarCheck,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-500',
      sub: 'Séances planifiées',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-700">Tableau de bord</h1>
          <p className="mt-1 text-sm text-slate-500">Vue globale du club</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 ring-1 ring-emerald-200">
          <TrendingUp size={16} className="text-emerald-500" />
          <span className="text-sm font-medium text-emerald-700">
            {stats.monthly_revenue.toLocaleString('fr-FR')} MAD encaissés en {stats.period}
          </span>
        </div>
      </div>

      {/* Alert retards */}
      {hasLate && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="shrink-0 text-red-500" />
            <p className="text-sm font-medium text-red-700">
              {stats.late_payments_count} paiements en retard dans le club
            </p>
          </div>
          <ArrowRight size={16} className="shrink-0 text-red-400" />
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {cards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>

      {/* Deux colonnes : membres récents + entraînements à venir */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Membres récemment inscrits */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-navy-700">Derniers membres inscrits</h2>
            <Link to="/membres" className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:underline">
              Voir tous <ArrowRight size={12} />
            </Link>
          </div>
          <ul className="divide-y divide-slate-50">
            {RECENT_MEMBERS.map((m) => (
              <li key={m.id} className="flex items-center gap-4 px-6 py-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-bold text-navy-700">
                  {m.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">{m.name}</p>
                  <p className="text-xs text-slate-400">Inscrit le {m.date}</p>
                </div>
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                  {m.category}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prochains entraînements */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-navy-700">Prochaines séances</h2>
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-600">
              {stats.upcoming_trainings} planifiées
            </span>
          </div>
          <ul className="divide-y divide-slate-50">
            {UPCOMING_TRAININGS.map((t) => (
              <li key={t.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{t.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{t.team} · {t.location}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-semibold text-navy-700">{t.date}</p>
                    <p className="text-xs text-slate-400">{t.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
