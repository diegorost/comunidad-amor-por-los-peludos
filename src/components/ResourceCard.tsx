import { useState } from "react"
import { Link } from "react-router-dom"
import { MapPin, Phone, Globe, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Resource } from "@/lib/types"

export function ResourceCard({
  resource,
  onDeleted,
}: {
  resource: Resource
  onDeleted?: (id: string) => void
}) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`¿Seguro que deseas borrar "${resource.name}"?`)) return
    setDeleting(true)
    const res = await fetch(`/api/resources/${resource.id}`, { method: "DELETE" })
    if (res.ok) {
      onDeleted?.(resource.id)
    } else {
      setDeleting(false)
    }
  }

  return (
    <Card className="border-cream-dark">
      <CardContent className="space-y-2 p-4">
        <h3 className="text-base font-bold text-ink">{resource.name}</h3>
        {resource.description && (
          <p className="text-sm text-ink-light">{resource.description}</p>
        )}
        <div className="space-y-1 text-sm text-ink-light">
          {resource.address && (
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-sage-dark" />
              {resource.address}
            </p>
          )}
          {resource.phone && (
            <p className="flex items-center gap-2">
              <Phone className="size-4 text-sage-dark" />
              {resource.phone}
            </p>
          )}
          {resource.website && (
            <a
              href={resource.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sky-dark hover:underline"
            >
              <Globe className="size-4" />
              Sitio web
            </a>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1 border-cream-dark">
            <Link to={`/recursos/${resource.id}/editar`}>
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
