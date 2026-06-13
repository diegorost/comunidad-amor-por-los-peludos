import { useState } from "react"
import { Link } from "react-router-dom"
import { CheckCircle2, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TipForm, type TipFormValues } from "@/components/TipForm"

const initialValues: TipFormValues = {
  title: "",
  text: "",
  image_url: null,
}

export function AddTip() {
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (values: TipFormValues) => {
    const res = await fetch("/api/tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
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
          ¡Tip añadido con éxito!
        </h1>
        <p className="mt-2 text-ink-light">
          Gracias por compartir tu consejo con la comunidad.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-gold text-ink hover:bg-gold-dark">
            <Link to="/tips">Ver tips</Link>
          </Button>
          <Button variant="outline" onClick={() => setSuccess(false)}>
            Añadir otro tip
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="space-y-2 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold/30 text-gold-dark">
          <Lightbulb className="size-6" />
        </span>
        <h1 className="text-3xl font-bold text-ink">Añadir tip</h1>
        <p className="text-ink-light">
          Comparte un consejo útil con la comunidad.
        </p>
      </div>

      <TipForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Añadir tip"
        submittingLabel="Guardando..."
      />
    </div>
  )
}
