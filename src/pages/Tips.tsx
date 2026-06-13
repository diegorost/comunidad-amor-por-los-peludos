import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TipCard } from "@/components/TipCard"
import { EmptyState } from "@/components/EmptyState"
import type { Tip } from "@/lib/types"

export function Tips() {
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<"newest" | "oldest">("newest")
  const [query, setQuery] = useState("")

  useEffect(() => {
    let active = true
    fetch("/api/tips")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setTips(data ?? [])
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = tips.filter((tip) => {
    const term = query.trim().toLowerCase()
    if (!term) return true
    return (
      tip.title.toLowerCase().includes(term) ||
      (tip.text?.toLowerCase().includes(term) ?? false)
    )
  })

  const sortedTips = [...filtered].sort((a, b) => {
    const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    return order === "oldest" ? diff : -diff
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-ink">
          Reglas de la Comunidad y Tips para tu Peludo
        </h1>
        <p className="text-ink-light">
          Consejos compartidos por la comunidad para el cuidado de tu mejor amigo.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="bg-gold text-ink hover:bg-gold-dark">
            <Link to="/tips/anadir">
              <Plus className="size-4" />
              Añadir tip
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-cream-dark"
            onClick={() => setOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
          >
            {order === "newest" ? (
              <ArrowDownNarrowWide className="size-4" />
            ) : (
              <ArrowUpNarrowWide className="size-4" />
            )}
            {order === "newest" ? "Más nuevas primero" : "Más antiguas primero"}
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-light" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca por título o descripción..."
            className="rounded-full border-cream-dark bg-white pl-9"
          />
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-card bg-cream-dark"
              />
            ))}
          </div>
        ) : sortedTips.length === 0 ? (
          <EmptyState
            title={
              tips.length === 0
                ? "Aún no hay tips en la comunidad"
                : "No encontramos tips con esa búsqueda"
            }
            description={
              tips.length === 0
                ? "Sé la primera persona en compartir un consejo con la comunidad."
                : "Intenta con otro título o descripción."
            }
            action={
              tips.length === 0 ? (
                <Button asChild className="bg-gold text-ink hover:bg-gold-dark">
                  <Link to="/tips/anadir">Añadir tip</Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {sortedTips.map((tip) => (
              <TipCard
                key={tip.id}
                tip={tip}
                onDeleted={(id) => setTips((prev) => prev.filter((t) => t.id !== id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
