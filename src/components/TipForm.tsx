import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type TipFormValues = {
  title: string
  text: string | null
  image_url: string | null
}

type TipFormErrors = Partial<Record<keyof TipFormValues, string>>

type TipFormProps = {
  initialValues: TipFormValues
  onSubmit: (values: TipFormValues) => Promise<boolean>
  submitLabel: string
  submittingLabel: string
}

export function TipForm({
  initialValues,
  onSubmit,
  submitLabel,
  submittingLabel,
}: TipFormProps) {
  const [form, setForm] = useState<TipFormValues>(initialValues)
  const [errors, setErrors] = useState<TipFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleChange = (field: keyof TipFormValues, value: string) => {
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
      setForm((prev) => ({ ...prev, image_url: data.url }))
    } else {
      setUploadError("No se pudo subir la imagen. Intenta nuevamente.")
    }
  }

  const validate = () => {
    const next: TipFormErrors = {}
    if (!form.title.trim()) next.title = "Escribe un título."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    await onSubmit({
      ...form,
      title: form.title.trim(),
      text: form.text?.trim() || null,
    })
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="image">Foto</Label>
        {form.image_url && (
          <img
            src={form.image_url}
            alt="Imagen del tip"
            className="aspect-video w-full rounded-card object-cover"
          />
        )}
        <Input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          className="border-cream-dark"
        />
        {uploading && <p className="text-sm text-ink-light">Subiendo foto...</p>}
        {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="border-cream-dark"
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="text">Descripción</Label>
        <Textarea
          id="text"
          value={form.text ?? ""}
          onChange={(e) => handleChange("text", e.target.value)}
          className="border-cream-dark"
          placeholder="Comparte tu consejo con la comunidad..."
        />
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
