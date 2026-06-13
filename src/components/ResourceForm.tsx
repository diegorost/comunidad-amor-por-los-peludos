import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ResourceCategory } from "@/lib/types"

export type ResourceFormValues = {
  name: string
  category: ResourceCategory
  address: string
  website: string
  phone: string
  description: string
}

type ResourceFormErrors = Partial<Record<keyof ResourceFormValues, string>>

type ResourceFormProps = {
  initialValues: ResourceFormValues
  onSubmit: (values: ResourceFormValues) => Promise<boolean>
  submitLabel: string
  submittingLabel: string
}

const categoryOptions: { value: ResourceCategory; label: string }[] = [
  { value: "tienda", label: "Tienda" },
  { value: "clinica", label: "Clínica de emergencia" },
  { value: "veterinario", label: "Veterinario o especialista" },
]

export function ResourceForm({
  initialValues,
  onSubmit,
  submitLabel,
  submittingLabel,
}: ResourceFormProps) {
  const [form, setForm] = useState<ResourceFormValues>(initialValues)
  const [errors, setErrors] = useState<ResourceFormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field: keyof ResourceFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const next: ResourceFormErrors = {}
    if (!form.name.trim()) next.name = "Cuéntanos el nombre del recurso."
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
      address: form.address.trim(),
      website: form.website.trim(),
      phone: form.phone.trim(),
      description: form.description.trim(),
    })
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="border-cream-dark"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Categoría</Label>
        <select
          id="category"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="flex h-9 w-full rounded-md border border-cream-dark bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="border-cream-dark"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website">Sitio web</Label>
          <Input
            id="website"
            value={form.website}
            onChange={(e) => handleChange("website", e.target.value)}
            className="border-cream-dark"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className="border-cream-dark"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="border-cream-dark"
          placeholder="Cuéntanos por qué lo recomiendas..."
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-gold text-ink hover:bg-gold-dark"
      >
        {submitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  )
}
