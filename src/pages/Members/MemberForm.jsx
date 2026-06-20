import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'

// Données statiques pour la démo — pré-remplissage en mode édition
const MEMBERS_DATA = {
  1:  { first_name: 'Youssef', last_name: 'Amrani',    birth_date: '2000-03-15', phone: '0661000001', address: '12 Rue Moulay Ali, Casablanca' },
  2:  { first_name: 'Sara',    last_name: 'Benali',    birth_date: '2004-07-22', phone: '0662000002', address: '' },
  3:  { first_name: 'Amine',   last_name: 'Khalil',    birth_date: '2008-11-05', phone: '0663000003', address: '5 Boulevard Hassan II, Rabat' },
  4:  { first_name: 'Nadia',   last_name: 'Mansouri',  birth_date: '1998-01-30', phone: '0664000004', address: '' },
  5:  { first_name: 'Karim',   last_name: 'Tahiri',    birth_date: '2012-06-18', phone: '0665000005', address: '7 Rue Ibn Battouta, Fès' },
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

const inputClass = (hasError) =>
  [
    'w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition',
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100',
  ].join(' ')

const EMPTY = { first_name: '', last_name: '', birth_date: '', phone: '', address: '' }

export default function MemberForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(isEdit)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Pré-remplissage en mode édition (données statiques)
  useEffect(() => {
    if (!isEdit) return
    setTimeout(() => {
      const data = MEMBERS_DATA[parseInt(id)]
      if (data) {
        setForm(data)
      } else {
        navigate('/membres', { replace: true })
      }
      setIsLoading(false)
    }, 300)
  }, [id, isEdit, navigate])

  function set(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Validation locale basique
  function validate() {
    const errs = {}
    if (!form.first_name.trim()) errs.first_name = 'Le prénom est obligatoire.'
    if (!form.last_name.trim()) errs.last_name = 'Le nom est obligatoire.'
    if (!form.birth_date) errs.birth_date = 'La date de naissance est obligatoire.'
    if (!form.phone.trim()) {
      errs.phone = 'Le téléphone est obligatoire.'
    } else if (!/^[0-9]{8,15}$/.test(form.phone.trim())) {
      errs.phone = 'Doit contenir entre 8 et 15 chiffres.'
    }
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setIsSubmitting(true)
    // Simulation délai réseau
    await new Promise((r) => setTimeout(r, 800))
    setIsSubmitting(false)
    setSuccess(true)
    setTimeout(() => navigate('/membres'), 1200)
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={28} className="animate-spin text-orange-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/membres')}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEdit ? 'Modifier le membre' : 'Nouveau membre'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {isEdit
              ? 'Mettez à jour les informations du membre.'
              : 'Remplissez les informations du nouveau membre.'}
          </p>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="mb-5 flex items-center gap-3 rounded-xl bg-emerald-50 px-5 py-4 ring-1 ring-emerald-200">
          <CheckCircle size={20} className="text-emerald-500" />
          <p className="text-sm font-medium text-emerald-700">
            {isEdit ? 'Modifications enregistrées !' : 'Membre créé avec succès !'} Redirection…
          </p>
        </div>
      )}

      {/* Card */}
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Nom / Prénom */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Prénom *" error={errors.first_name}>
              <input
                type="text"
                value={form.first_name}
                onChange={set('first_name')}
                placeholder="Ali"
                className={inputClass(!!errors.first_name)}
              />
            </Field>
            <Field label="Nom *" error={errors.last_name}>
              <input
                type="text"
                value={form.last_name}
                onChange={set('last_name')}
                placeholder="Benali"
                className={inputClass(!!errors.last_name)}
              />
            </Field>
          </div>

          {/* Date de naissance */}
          <Field label="Date de naissance *" error={errors.birth_date}>
            <input
              type="date"
              value={form.birth_date}
              onChange={set('birth_date')}
              max={new Date().toISOString().split('T')[0]}
              className={inputClass(!!errors.birth_date)}
            />
          </Field>

          {/* Téléphone */}
          <Field label="Téléphone *" error={errors.phone}>
            <input
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="0612345678"
              className={inputClass(!!errors.phone)}
            />
          </Field>

          {/* Adresse */}
          <Field label="Adresse" error={errors.address}>
            <textarea
              value={form.address}
              onChange={set('address')}
              rows={3}
              placeholder="12 Rue des Fleurs, Casablanca"
              className={inputClass(!!errors.address)}
            />
          </Field>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/membres')}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              {isEdit ? 'Enregistrer les modifications' : 'Créer le membre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
