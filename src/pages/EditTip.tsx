import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Lightbulb } from "lucide-react"
import { TipForm, type TipFormValues } from "@/components/TipForm"
import type { Tip } from "@/lib/types"

export function EditTip() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState<TipFormValues | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true
    fetch("/api/tips")
      .then((res) => res.json())
      .then((data: Tip[]) => {
        if (!active) return
        const tip = data.find((t) => t.id === id)
        if (!tip) {
          setNotFound(true)
          return
        }
        setInitialValues({
          title: tip.title,
          text: tip.text,
          image_url: tip.image_url,
        })
      })
    return () => {
      active = false
    }
  }, [id])

  const handleSubmit = async (values: TipFormValues) => {
    const res = await fetch(`/api/tips/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    if (res.ok) navigate("/tips")
    return res.ok
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">Tip no encontrado</h1>
        <p className="mt-2 text-ink-light">
          No pudimos encontrar este tip. Es posible que ya haya sido eliminado.
        </p>
        <Link to="/tips" className="mt-4 inline-block text-sky-dark hover:underline">
          Volver a tips
        </Link>
      </div>
    )
  }

  if (!initialValues) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="h-64 animate-pulse rounded-card bg-cream-dark" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="space-y-2 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold/30 text-gold-dark">
          <Lightbulb className="size-6" />
        </span>
        <h1 className="text-3xl font-bold text-ink">Editar tip</h1>
        <p className="text-ink-light">Actualiza este consejo para la comunidad.</p>
      </div>

      <TipForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
        submittingLabel="Guardando..."
      />
    </div>
  )
}
