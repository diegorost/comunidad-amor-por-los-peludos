import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { PawPrint, Search, HeartHandshake, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CommunityHighlight } from "@/lib/types"
import logo from "@/assets/logo.png"

export function Home() {
  const [highlights, setHighlights] = useState<CommunityHighlight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetch("/api/community-highlights")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setHighlights(data ?? [])
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-12 text-center md:py-20">
        <img
          src={logo}
          alt="Comunidad Amor por los Peludos"
          className="size-[12.5rem] object-contain md:size-[17.5rem]"
        />
        <div className="space-y-3">
          <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-ink md:text-5xl">
            <PawPrint className="size-8 text-gold-dark md:size-12" />
            Comunidad Amor por los Peludos
            <PawPrint className="size-8 text-gold-dark md:size-12" />
          </h1>
          <p className="mx-auto max-w-xl text-ink-light md:text-lg">
            Una comunidad cálida para dueños de perros (Golden Retrievers o
            no!), donde compartir el perfil de tu peludo y descubrir recursos
            de confianza cerca de ti.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="xl" className="bg-gold text-ink hover:bg-gold-dark">
            <Link to="/perritos">
              <Search className="mr-1" /> Explora nuestros Peludos
            </Link>
          </Button>
          <Button asChild size="xl" className="bg-sky-dark text-white hover:bg-sky-dark/90">
            <Link to="/recursos">
              <PawPrint className="mr-1" /> Recursos
            </Link>
          </Button>
          <Button asChild size="xl" className="bg-sage-dark text-white hover:bg-sage-dark/90">
            <Link to="/tips">
              <Lightbulb className="mr-1" /> Tips/Reglas
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center gap-2">
          <HeartHandshake className="size-6 text-sage-dark" />
          <h2 className="text-2xl font-bold text-ink">
            Conoce a los Peludos mejor
          </h2>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-card bg-cream-dark"
              />
            ))}
          </div>
        ) : highlights.length === 0 ? (
          <div className="mt-6 rounded-card border border-dashed border-cream-dark bg-white/60 p-8 text-center text-ink-light">
            Pronto compartiremos historias y momentos especiales de la
            comunidad. ¡Vuelve más tarde!
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {highlights.map((h) => (
              <Card key={h.id} className="overflow-hidden border-cream-dark">
                {h.image_url && (
                  <img
                    src={h.image_url}
                    alt={h.title}
                    className="aspect-video w-full object-cover"
                  />
                )}
                <CardContent className="space-y-1 p-4">
                  <h3 className="font-bold text-ink">{h.title}</h3>
                  <p className="text-sm text-ink-light">{h.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
