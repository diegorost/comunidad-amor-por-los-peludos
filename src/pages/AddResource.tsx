import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { CheckCircle2, LogIn, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useSession } from "@/hooks/useSession"
import type { ResourceCategory } from "@/lib/types"

type FormState = {
  name: string
  category: ResourceCategory
  address: string
  website: string
  phone: string
  description: string
}

const initialState: FormState = {
  name: "",
  category: "tienda",
  address: "",
  website: "",
  phone: "",
  description: "",
}

const categoryOptions: { value: ResourceCategory; label: string }[] = [
  { value: "tienda", label: "Tienda" },
  { value: "clinica", label: "Clínica de emergencia" },
  { value: "veterinario", label: "Veterinario o especialista" },
]

export function AddResource() {
  const { session, loading } = useSession()
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const next: Partial<FormState> = {}
    if (!form.name.trim()) next.name = "Cuéntanos el nombre del recurso."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    const { error } = await supabase.from("resources").insert({
      name: form.name.trim(),
      category: form.category,
      address: form.address.trim() || null,
      website: form.website.trim() || null,
      phone: form.phone.trim() || null,
      description: form.description.trim() || null,
    })
    setSubmitting(false)

    if (!error) {
      setSuccess(true)
      setForm(initialState)
    }
  }

  const handleMagicLink = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    await supabase.auth.signInWithOtp({ email: email.trim() })
    setMagicLinkSent(true)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-ink-light">
        Cargando...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <Card className="border-cream-dark">
          <CardContent className="space-y-4 p-6 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-sky/30 text-sky-dark">
              <LogIn className="size-6" />
            </span>
            <h1 className="text-2xl font-bold text-ink">Inicia sesión</h1>
            <p className="text-ink-light">
              Para añadir un recurso, primero inicia sesión con tu correo. Te
              enviaremos un enlace mágico.
            </p>
            {magicLinkSent ? (
              <p className="rounded-card bg-sage/20 p-3 text-sage-dark">
                Revisa tu correo y haz clic en el enlace para continuar.
              </p>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-3">
                <Input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-cream-dark"
                />
                <Button type="submit" className="w-full bg-gold text-ink hover:bg-gold-dark">
                  Enviar enlace mágico
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    )
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
          {submitting ? "Guardando..." : "Añadir recurso"}
        </Button>
      </form>
    </div>
  )
}
