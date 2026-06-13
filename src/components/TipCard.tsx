import { useState } from "react"
import { Link } from "react-router-dom"
import { Lightbulb, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Tip } from "@/lib/types"

export function TipCard({
  tip,
  onDeleted,
}: {
  tip: Tip
  onDeleted?: (id: string) => void
}) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`¿Seguro que deseas borrar "${tip.title}"?`)) return
    setDeleting(true)
    const res = await fetch(`/api/tips/${tip.id}`, { method: "DELETE" })
    if (res.ok) {
      onDeleted?.(tip.id)
    } else {
      setDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden border-cream-dark">
      <div className="aspect-video w-full bg-cream-dark">
        {tip.image_url ? (
          <img
            src={tip.image_url}
            alt={tip.title}
            className="mx-auto size-full w-3/4 object-contain"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sage">
            <Lightbulb className="size-12" />
          </div>
        )}
      </div>
      <CardContent className="space-y-2 p-4">
        <h3 className="text-lg font-bold text-ink">{tip.title}</h3>
        {tip.text && <p className="text-sm text-ink-light">{tip.text}</p>}

        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1 border-cream-dark">
            <Link to={`/tips/${tip.id}/editar`}>
              <Pencil className="size-4" />
              Editar
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-cream-dark text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="size-4" />
            Borrar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
