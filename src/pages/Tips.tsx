import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TipCard } from "@/components/TipCard"
import { EmptyState } from "@/components/EmptyState"
import type { Tip } from "@/lib/types"

export function Tips() {
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-ink">Tips para tu peludo</h1>
        <p className="text-ink-light">
          Consejos compartidos por la comunidad para el cuidado de tu mejor amigo.
        </p>
        <Button asChild className="bg-gold text-ink hover:bg-gold-dark">
          <Link to="/tips/anadir">
            <Plus className="size-4" />
            Añadir tip
          </Link>
        </Button>
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
        ) : tips.length === 0 ? (
          <EmptyState
            title="Aún no hay tips en la comunidad"
            description="Sé la primera persona en compartir un consejo con la comunidad."
            action={
              <Button asChild className="bg-gold text-ink hover:bg-gold-dark">
                <Link to="/tips/anadir">Añadir tip</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {tips.map((tip) => (
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
