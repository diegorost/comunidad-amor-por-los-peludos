import { useState } from "react"
import { Link } from "react-router-dom"
import { PawPrint, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PhotoDialog } from "@/components/PhotoDialog"
import { calculateAge } from "@/lib/utils"
import type { Dog } from "@/lib/types"

export function DogCard({
  dog,
  onDeleted,
}: {
  dog: Dog
  onDeleted?: (id: string) => void
}) {
  const age = calculateAge(dog.birthdate)
  const [deleting, setDeleting] = useState(false)
  const [photoOpen, setPhotoOpen] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`¿Seguro que deseas borrar a ${dog.name}?`)) return
    setDeleting(true)
    const res = await fetch(`/api/dogs/${dog.id}`, { method: "DELETE" })
    if (res.ok) {
      onDeleted?.(dog.id)
    } else {
      setDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden border-cream-dark transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-square w-full bg-cream-dark">
        {dog.photo_url ? (
          <img
            src={dog.photo_url}
            alt={`Foto de ${dog.name}`}
            className="size-full cursor-pointer object-cover"
            onClick={() => setPhotoOpen(true)}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sage">
            <PawPrint className="size-16" />
          </div>
        )}
      </div>

      {dog.photo_url && (
        <PhotoDialog
          open={photoOpen}
          onClose={() => setPhotoOpen(false)}
          imageUrl={dog.photo_url}
          title={dog.name}
        >
          {age != null && <p className="text-sm text-ink-light">{age} años</p>}
          <Badge className="bg-sage text-white">{dog.breed}</Badge>
          {dog.personality && (
            <p className="text-sm text-ink-light">{dog.personality}</p>
          )}
          {dog.notes && <p className="text-sm text-ink-light">{dog.notes}</p>}
          <p className="text-xs text-ink-light">Dueño/a: {dog.owner_name}</p>
        </PhotoDialog>
      )}
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-ink">{dog.name}</h3>
          {age != null && (
            <span className="text-sm text-ink-light">{age} años</span>
          )}
        </div>
        <Badge className="bg-sage text-white">{dog.breed}</Badge>
        {dog.personality && (
          <p className="text-sm text-ink-light">{dog.personality}</p>
        )}
        <p className="text-xs text-ink-light">Dueño/a: {dog.owner_name}</p>

        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1 border-cream-dark">
            <Link to={`/perritos/${dog.id}/editar`}>
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
