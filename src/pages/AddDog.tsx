import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { CheckCircle2, PawPrint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { calculateAge } from "@/lib/utils"

type FormState = {
  name: string
  breed: string
  birthdate: string
  personality: string
  notes: string
  owner_name: string
}

const initialState: FormState = {
  name: "",
  breed: "",
  birthdate: "",
  personality: "",
  notes: "",
  owner_name: "",
}

export function AddDog() {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const next: Partial<FormState> = {}
    if (!form.name.trim()) next.name = "Cuéntanos el nombre de tu perro."
    if (!form.breed.trim()) next.breed = "Indica la raza de tu perro."
    if (!form.owner_name.trim()) next.owner_name = "Indica tu nombre."
    if (form.birthdate && new Date(form.birthdate) > new Date()) {
      next.birthdate = "La fecha de cumpleaños no puede ser futura."
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    const res = await fetch("/api/dogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        breed: form.breed.trim(),
        birthdate: form.birthdate || null,
        personality: form.personality.trim() || null,
        notes: form.notes.trim() || null,
        owner_name: form.owner_name.trim(),
      }),
    })
    setSubmitting(false)

    if (res.ok) {
      setSuccess(true)
      setForm(initialState)
    }
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

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre del perro</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border-cream-dark"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="breed">Raza</Label>
            <Input
              id="breed"
              value={form.breed}
              onChange={(e) => handleChange("breed", e.target.value)}
              className="border-cream-dark"
              placeholder="Golden Retriever"
            />
            {errors.breed && <p className="text-sm text-destructive">{errors.breed}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="birthdate">Fecha de cumpleaños</Label>
            <Input
              id="birthdate"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={form.birthdate}
              onChange={(e) => handleChange("birthdate", e.target.value)}
              className="border-cream-dark"
            />
            {errors.birthdate && (
              <p className="text-sm text-destructive">{errors.birthdate}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="age">Edad</Label>
          <Input
            id="age"
            disabled
            value={
              form.birthdate
                ? `${calculateAge(form.birthdate)} años`
                : "Se calcula a partir del cumpleaños"
            }
            className="border-cream-dark text-ink-light"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="personality">Personalidad</Label>
          <Input
            id="personality"
            value={form.personality}
            onChange={(e) => handleChange("personality", e.target.value)}
            className="border-cream-dark"
            placeholder="Juguetón, cariñoso, tranquilo..."
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="border-cream-dark"
            placeholder="Cuéntanos algo especial sobre tu perro..."
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="owner_name">Tu nombre</Label>
          <Input
            id="owner_name"
            value={form.owner_name}
            onChange={(e) => handleChange("owner_name", e.target.value)}
            className="border-cream-dark"
          />
          {errors.owner_name && (
            <p className="text-sm text-destructive">{errors.owner_name}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold text-ink hover:bg-gold-dark"
        >
          {submitting ? "Guardando..." : "Añadir perro"}
        </Button>
      </form>
    </div>
  )
}
