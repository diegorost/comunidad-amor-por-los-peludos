import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { calculateAge } from "@/lib/utils"

export type DogFormValues = {
  name: string
  breed: string
  birthdate: string
  personality: string
  notes: string
  owner_name: string
  photo_url: string | null
}

type DogFormErrors = Partial<Record<keyof DogFormValues, string>>

type DogFormProps = {
  initialValues: DogFormValues
  onSubmit: (values: DogFormValues) => Promise<boolean>
  submitLabel: string
  submittingLabel: string
}

export function DogForm({
  initialValues,
  onSubmit,
  submitLabel,
  submittingLabel,
}: DogFormProps) {
  const [form, setForm] = useState<DogFormValues>(initialValues)
  const [errors, setErrors] = useState<DogFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleChange = (field: keyof DogFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", { method: "POST", body: formData })
    setUploading(false)

    if (res.ok) {
      const data = (await res.json()) as { url: string }
      setForm((prev) => ({ ...prev, photo_url: data.url }))
    } else {
      setUploadError("No se pudo subir la imagen. Intenta nuevamente.")
    }
  }

  const validate = () => {
    const next: DogFormErrors = {}
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
    await onSubmit({
      ...form,
      name: form.name.trim(),
      breed: form.breed.trim(),
      personality: form.personality.trim(),
      notes: form.notes.trim(),
      owner_name: form.owner_name.trim(),
    })
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="photo">Foto</Label>
        {form.photo_url && (
          <img
            src={form.photo_url}
            alt="Foto del perro"
            className="size-32 rounded-card object-cover"
          />
        )}
        <Input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          className="border-cream-dark"
        />
        {uploading && <p className="text-sm text-ink-light">Subiendo foto...</p>}
        {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
      </div>

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
        disabled={submitting || uploading}
        className="w-full bg-gold text-ink hover:bg-gold-dark"
      >
        {submitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  )
}
