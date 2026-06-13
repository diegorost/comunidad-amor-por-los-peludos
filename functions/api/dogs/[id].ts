interface Env {
  DB: D1Database
  PHOTOS: R2Bucket
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string
  const body = await context.request.json<{
    name?: string
    breed?: string
    birthdate?: string | null
    personality?: string | null
    notes?: string | null
    owner_name?: string
    photo_url?: string | null
  }>()

  if (!body.name?.trim() || !body.breed?.trim() || !body.owner_name?.trim()) {
    return Response.json({ error: "Faltan campos obligatorios." }, { status: 400 })
  }

  await context.env.DB.prepare(
    `UPDATE dogs
     SET name = ?, breed = ?, birthdate = ?, personality = ?, notes = ?, owner_name = ?, photo_url = ?
     WHERE id = ?`
  )
    .bind(
      body.name.trim(),
      body.breed.trim(),
      body.birthdate?.trim() || null,
      body.personality?.trim() || null,
      body.notes?.trim() || null,
      body.owner_name.trim(),
      body.photo_url?.trim() || null,
      id
    )
    .run()

  return Response.json({ id })
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string

  const dog = await context.env.DB.prepare("SELECT photo_url FROM dogs WHERE id = ?")
    .bind(id)
    .first<{ photo_url: string | null }>()

  await context.env.DB.prepare("DELETE FROM dogs WHERE id = ?").bind(id).run()

  if (dog?.photo_url?.startsWith("/api/images/")) {
    await context.env.PHOTOS.delete(dog.photo_url.replace("/api/images/", ""))
  }

  return Response.json({ ok: true })
}
