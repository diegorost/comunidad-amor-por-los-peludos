import { useState } from "react"
import { Link } from "react-router-dom"
import { MapPin, Phone, Globe, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Resource, ResourceCategory } from "@/lib/types"

const categoryLabels: Record<ResourceCategory, string> = {
  tienda: "Tienda",
  clinica: "Clínica",
  veterinario: "Veterinario",
}

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
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-ink">{resource.name}</h3>
          <span className="shrink-0 rounded-full bg-cream-dark px-2 py-0.5 text-xs font-medium text-ink-light">
            {categoryLabels[resource.category]}
          </span>
        </div>
        {resource.description && (
          <p className="text-sm text-ink-light">{resource.description}</p>
        )}
        <div className="space-y-1 text-sm text-ink-light">
          {resource.address && (
            resource.maps_url ? (
              <a
                href={resource.maps_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sky-dark hover:underline"
              >
                <MapPin className="size-4" />
                {resource.address}
              </a>
            ) : (
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-sage-dark" />
                {resource.address}
              </p>
            )
          )}
          {resource.maps_url && (
            <a
              href={resource.maps_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sky-dark hover:underline"
            >
              <MapPin className="size-4" />
              Link Google Maps: {resource.maps_url}
            </a>
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
              {resource.website}
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
