import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DogCard } from "@/components/DogCard"
import { EmptyState } from "@/components/EmptyState"
import type { Dog } from "@/lib/types"

export function Dogs() {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    let active = true
    fetch("/api/dogs")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setDogs(data ?? [])
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = dogs.filter((dog) => {
    const term = query.trim().toLowerCase()
    if (!term) return true
    return (
      dog.name.toLowerCase().includes(term) ||
      dog.breed.toLowerCase().includes(term)
    )
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-ink">Peludos de la comunidad</h1>
        <p className="text-ink-light">
          Conoce a los peludos que forman parte de nuestra comunidad.
        </p>
        <Button asChild className="bg-gold text-ink hover:bg-gold-dark">
          <Link to="/anadir">
            <Plus className="size-4" />
            Añadir Peludo
          </Link>
        </Button>
      </div>

      <div className="mx-auto mt-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-light" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca por nombre o raza..."
            className="h-12 rounded-full border-transparent bg-white pl-9 shadow-lg"
          />
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-card bg-cream-dark"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={
              dogs.length === 0
                ? "Aún no hay peludos en la comunidad"
                : "No encontramos peludos con esa búsqueda"
            }
            description={
              dogs.length === 0
                ? "Sé la primera persona en presentar a tu mejor amigo y dar la bienvenida a la comunidad."
                : "Intenta con otro nombre o raza."
            }
            action={
              dogs.length === 0 ? (
                <Button asChild className="bg-gold text-ink hover:bg-gold-dark">
                  <Link to="/anadir">Añadir Peludo</Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                onDeleted={(id) => setDogs((prev) => prev.filter((d) => d.id !== id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
