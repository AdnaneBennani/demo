import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Plus, Search, Pencil, Trash2, UserX, ChevronLeft, ChevronRight } from 'lucide-react'

// ─── Données statiques ────────────────────────────────────────────────────────
const STATIC_MEMBERS = [
  { id: 1,  first_name: 'Youssef',  last_name: 'Amrani',    full_name: 'Youssef Amrani',    birth_date: '2000-03-15', category: 'Sénior',   phone: '0661000001' },
  { id: 2,  first_name: 'Sara',     last_name: 'Benali',    full_name: 'Sara Benali',       birth_date: '2004-07-22', category: 'Junior',   phone: '0662000002' },
  { id: 3,  first_name: 'Amine',    last_name: 'Khalil',    full_name: 'Amine Khalil',      birth_date: '2008-11-05', category: 'Cadet',    phone: '0663000003' },
  { id: 4,  first_name: 'Nadia',    last_name: 'Mansouri',  full_name: 'Nadia Mansouri',    birth_date: '1998-01-30', category: 'Sénior',   phone: '0664000004' },
  { id: 5,  first_name: 'Karim',    last_name: 'Tahiri',    full_name: 'Karim Tahiri',      birth_date: '2012-06-18', category: 'Benjamin', phone: '0665000005' },
  { id: 6,  first_name: 'Imane',    last_name: 'Chraibi',   full_name: 'Imane Chraibi',     birth_date: '2005-09-12', category: 'Junior',   phone: '0666000006' },
  { id: 7,  first_name: 'Hassan',   last_name: 'Ouali',     full_name: 'Hassan Ouali',      birth_date: '2001-04-25', category: 'Sénior',   phone: '0667000007' },
  { id: 8,  first_name: 'Fatima',   last_name: 'Ziane',     full_name: 'Fatima Ziane',      birth_date: '2009-02-14', category: 'Minime',   phone: '0668000008' },
  { id: 9,  first_name: 'Omar',     last_name: 'Berrada',   full_name: 'Omar Berrada',      birth_date: '2003-12-03', category: 'Junior',   phone: '0669000009' },
  { id: 10, first_name: 'Layla',    last_name: 'Saadi',     full_name: 'Layla Saadi',       birth_date: '1997-08-20', category: 'Sénior',   phone: '0660000010' },
  { id: 11, first_name: 'Mehdi',    last_name: 'Alaoui',    full_name: 'Mehdi Alaoui',      birth_date: '2007-05-08', category: 'Cadet',    phone: '0661100011' },
  { id: 12, first_name: 'Rim',      last_name: 'Fassi',     full_name: 'Rim Fassi',         birth_date: '2010-10-17', category: 'Pupille',  phone: '0662200012' },
  { id: 13, first_name: 'Zakaria',  last_name: 'Moussaoui', full_name: 'Zakaria Moussaoui', birth_date: '2002-07-01', category: 'Sénior',   phone: '0663300013' },
  { id: 14, first_name: 'Hajar',    last_name: 'Idrissi',   full_name: 'Hajar Idrissi',     birth_date: '2006-03-29', category: 'Cadet',    phone: '0664400014' },
  { id: 15, first_name: 'Rida',     last_name: 'Bakkali',   full_name: 'Rida Bakkali',      birth_date: '1999-11-11', category: 'Sénior',   phone: '0665500015' },
]

const PER_PAGE = 8

// ─── Confirm dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-slate-800">Supprimer ce membre ?</h3>
        <p className="mb-6 text-sm text-slate-500">
          <span className="font-medium text-slate-700">{name}</span> sera archivé. Cette action est
          réversible côté base de données.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Category badge colors ─────────────────────────────────────────────────────

const CAT_COLOR = {
  'Sénior':   'bg-blue-100 text-blue-700',
  'Junior':   'bg-purple-100 text-purple-700',
  'Cadet':    'bg-orange-100 text-orange-700',
  'Minime':   'bg-emerald-100 text-emerald-700',
  'Benjamin': 'bg-pink-100 text-pink-700',
  'Pupille':  'bg-yellow-100 text-yellow-700',
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MembersList() {
  const navigate = useNavigate()
  const [members, setMembers] = useState(STATIC_MEMBERS)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [toDelete, setToDelete] = useState(null)

  // Filtrage par recherche
  const filtered = members.filter((m) => {
    const q = search.toLowerCase()
    return (
      m.full_name.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.category.toLowerCase().includes(q)
    )
  })

  // Pagination
  
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function handleSearch(e) {
    setSearch(e.target.value)
    setPage(1)
  }

  function handleDelete() {
    setMembers((prev) => prev.filter((m) => m.id !== toDelete.id))
    setToDelete(null)
    // Revenir à la page précédente si vide
    const newFiltered = members.filter((m) => m.id !== toDelete.id && (() => {
      const q = search.toLowerCase()
      return m.full_name.toLowerCase().includes(q) || m.phone.includes(q)
    })())
    const newTotal = Math.ceil(newFiltered.length / PER_PAGE)
    if (page > newTotal) setPage(Math.max(1, newTotal))
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Membres</h1>
          <p className="mt-1 text-sm text-slate-500">
            {filtered.length} membre{filtered.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Link
          to="/membres/creer"
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
        >
          <Plus size={16} />
          Ajouter un membre
        </Link>
      </div>

      {/* Search bar */}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
        <Search size={16} className="shrink-0 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, catégorie ou téléphone…"
          value={search}
          onChange={handleSearch}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        {paginated.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
            <UserX size={32} />
            <p className="text-sm">Aucun membre trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 text-left">Membre</th>
                  <th className="px-5 py-3 text-left">Catégorie</th>
                  <th className="px-5 py-3 text-left">Téléphone</th>
                  <th className="px-5 py-3 text-left">Date de naissance</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-bold text-navy-700">
                          {m.first_name[0]}{m.last_name[0]}
                        </div>
                        <span className="font-medium text-slate-800">{m.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${CAT_COLOR[m.category] ?? 'bg-slate-100 text-slate-600'}`}>
                        {m.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{m.phone}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {new Date(m.birth_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/membres/${m.id}/modifier`)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-navy-50 hover:text-navy-700"
                          title="Modifier"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setToDelete({ id: m.id, name: m.full_name })}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                          title="Supprimer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>Page {page} / {totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      {toDelete && (
        <ConfirmDialog
          name={toDelete.name}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  )
}
