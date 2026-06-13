import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Search } from "lucide-react"
import { ResourceCard } from "@/components/ResourceCard"
import { EmptyState } from "@/components/EmptyState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Resource, ResourceCategory } from "@/lib/types"

const sections: {
  category: ResourceCategory
  title: string
  emoji: string
  iconBg: string
}[] = [
  {
    category: "veterinario",
    title: "Veterinarios y Especialidades",
    emoji: "🩺",
    iconBg: "bg-sage/30",
  },
  {
    category: "clinica",
    title: "Clínicas de Emergencia",
    emoji: "🚑",
    iconBg: "bg-sky/30",
  },
  {
    category: "tienda",
    title: "Tiendas Recomendadas",
    emoji: "🛍️",
    iconBg: "bg-gold/30",
  },
]

export function Resources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    let active = true
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setResources(data ?? [])
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-ink">Recursos para tu peludo</h1>
        <p className="text-ink-light">
          Encuentra ayuda cuando la necesites: tiendas, clínicas y veterinarios
          de confianza recomendados por la comunidad.
        </p>
        <Button asChild className="bg-gold text-ink hover:bg-gold-dark">
          <Link to="/recursos/anadir">
            <Plus className="size-4" />
            Añadir recurso
          </Link>
        </Button>
      </div>

      <div className="mx-auto mt-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-light" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca por nombre o descripción..."
            className="rounded-full border-cream-dark bg-white pl-9"
          />
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {sections.map(({ category, title, emoji, iconBg }) => {
          const term = query.trim().toLowerCase()
          const items = resources.filter(
            (r) =>
              r.category === category &&
              (!term ||
                r.name.toLowerCase().includes(term) ||
                (r.description?.toLowerCase().includes(term) ?? false))
          )
          return (
            <section key={category}>
              <div className="mb-4 flex items-center gap-2">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-lg ${iconBg}`}>
                  {emoji}
                </span>
                <h2 className="text-2xl font-bold text-ink">{title}</h2>
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-32 animate-pulse rounded-card bg-cream-dark"
                    />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <EmptyState
                  title={
                    term
                      ? "No encontramos resultados con esa búsqueda"
                      : "Aún no hay recomendaciones"
                  }
                  description={
                    term
                      ? "Intenta con otro nombre o descripción."
                      : "Pronto añadiremos opciones de confianza en esta categoría."
                  }
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {items.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      onDeleted={(id) =>
                        setResources((prev) => prev.filter((r) => r.id !== id))
                      }
                    />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
