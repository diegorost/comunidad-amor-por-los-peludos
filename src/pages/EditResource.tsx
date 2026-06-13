import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ShoppingBag } from "lucide-react"
import { ResourceForm, type ResourceFormValues } from "@/components/ResourceForm"
import type { Resource } from "@/lib/types"

export function EditResource() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState<ResourceFormValues | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data: Resource[]) => {
        if (!active) return
        const resource = data.find((r) => r.id === id)
        if (!resource) {
          setNotFound(true)
          return
        }
        setInitialValues({
          name: resource.name,
          category: resource.category,
          address: resource.address ?? "",
          website: resource.website ?? "",
          phone: resource.phone ?? "",
          description: resource.description ?? "",
        })
      })
    return () => {
      active = false
    }
  }, [id])

  const handleSubmit = async (values: ResourceFormValues) => {
    const res = await fetch(`/api/resources/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        address: values.address || null,
        website: values.website || null,
        phone: values.phone || null,
        description: values.description || null,
      }),
    })

    if (res.ok) navigate("/recursos")
    return res.ok
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">Recurso no encontrado</h1>
        <p className="mt-2 text-ink-light">
          No pudimos encontrar este recurso. Es posible que ya haya sido eliminado.
        </p>
        <Link to="/recursos" className="mt-4 inline-block text-sky-dark hover:underline">
          Volver a recursos
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
          <ShoppingBag className="size-6" />
        </span>
        <h1 className="text-3xl font-bold text-ink">Editar recurso</h1>
        <p className="text-ink-light">Actualiza la información de este recurso.</p>
      </div>

      <ResourceForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
        submittingLabel="Guardando..."
      />
    </div>
  )
}
