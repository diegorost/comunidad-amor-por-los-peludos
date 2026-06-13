import { useState } from "react"
import { Link } from "react-router-dom"
import { CheckCircle2, PawPrint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DogForm, type DogFormValues } from "@/components/DogForm"

const initialValues: DogFormValues = {
  name: "",
  breed: "",
  birthdate: "",
  personality: "",
  notes: "",
  owner_name: "",
  photo_url: null,
}

export function AddDog() {
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (values: DogFormValues) => {
    const res = await fetch("/api/dogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        birthdate: values.birthdate || null,
        personality: values.personality || null,
        notes: values.notes || null,
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
          ¡Tu perro fue añadido con éxito!
        </h1>
        <p className="mt-2 text-ink-light">
          Gracias por presentar a tu mejor amigo a la comunidad.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-gold text-ink hover:bg-gold-dark">
            <Link to="/perritos">Ver comunidad</Link>
          </Button>
          <Button variant="outline" onClick={() => setSuccess(false)}>
            Añadir otro perro
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="space-y-2 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold/30 text-gold-dark">
          <PawPrint className="size-6" />
        </span>
        <h1 className="text-3xl font-bold text-ink">Añadir perro</h1>
        <p className="text-ink-light">
          Cuéntanos sobre tu peludo para presentarlo a la comunidad.
        </p>
      </div>

      <DogForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Añadir perro"
        submittingLabel="Guardando..."
      />
    </div>
  )
}
