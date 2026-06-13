import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { PawPrint } from "lucide-react"
import { DogForm, type DogFormValues } from "@/components/DogForm"
import type { Dog } from "@/lib/types"

export function EditDog() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState<DogFormValues | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true
    fetch("/api/dogs")
      .then((res) => res.json())
      .then((data: Dog[]) => {
        if (!active) return
        const dog = data.find((d) => d.id === id)
        if (!dog) {
          setNotFound(true)
          return
        }
        setInitialValues({
          name: dog.name,
          breed: dog.breed,
          birthdate: dog.birthdate ?? "",
          personality: dog.personality ?? "",
          notes: dog.notes ?? "",
          owner_name: dog.owner_name,
          photo_url: dog.photo_url,
        })
      })
    return () => {
      active = false
    }
  }, [id])

  const handleSubmit = async (values: DogFormValues) => {
    const res = await fetch(`/api/dogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        birthdate: values.birthdate || null,
        personality: values.personality || null,
        notes: values.notes || null,
      }),
    })

    if (res.ok) navigate("/perritos")
    return res.ok
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">Peludo no encontrado</h1>
        <p className="mt-2 text-ink-light">
          No pudimos encontrar este peludo. Es posible que ya haya sido eliminado.
        </p>
        <Link to="/perritos" className="mt-4 inline-block text-sky-dark hover:underline">
          Volver a la comunidad
        </Link>
      </div>
    )
  }

  if (!initialValues) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="h-64 animate-pulse rounded-card bg-cream-dark" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="space-y-2 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold/30 text-gold-dark">
          <PawPrint className="size-6" />
        </span>
        <h1 className="text-3xl font-bold text-ink">Editar peludo</h1>
        <p className="text-ink-light">
          Actualiza la información del perfil de tu peludo.
        </p>
      </div>

      <DogForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
        submittingLabel="Guardando..."
      />
    </div>
  )
}
