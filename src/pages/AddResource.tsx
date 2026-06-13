import { useState } from "react"
import { Link } from "react-router-dom"
import { CheckCircle2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResourceForm, type ResourceFormValues } from "@/components/ResourceForm"

const initialValues: ResourceFormValues = {
  name: "",
  category: "tienda",
  address: "",
  maps_url: "",
  website: "",
  phone: "",
  description: "",
}

export function AddResource() {
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (values: ResourceFormValues) => {
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        address: values.address || null,
        maps_url: values.maps_url || null,
        website: values.website || null,
        phone: values.phone || null,
        description: values.description || null,
      }),
    })

    if (res.ok) setSuccess(true)
    return res.ok
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage/20 text-sage-dark">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-ink">
          ¡Recurso añadido con éxito!
        </h1>
        <p className="mt-2 text-ink-light">
          Gracias por ayudar a la comunidad a encontrar lugares de confianza.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-gold text-ink hover:bg-gold-dark">
            <Link to="/recursos">Ver recursos</Link>
          </Button>
          <Button variant="outline" onClick={() => setSuccess(false)}>
            Añadir otro recurso
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="space-y-2 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold/30 text-gold-dark">
          <ShoppingBag className="size-6" />
        </span>
        <h1 className="text-3xl font-bold text-ink">Añadir recurso</h1>
        <p className="text-ink-light">
          Recomienda una tienda, clínica o veterinario de confianza a la
          comunidad.
        </p>
      </div>

      <ResourceForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Añadir recurso"
        submittingLabel="Guardando..."
      />
    </div>
  )
}
