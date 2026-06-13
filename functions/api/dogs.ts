interface Env {
  DB: D1Database
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { results } = await context.env.DB.prepare(
    "SELECT * FROM dogs ORDER BY created_at DESC"
  ).all()
  return Response.json(results)
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json<{
    name?: string
    breed?: string
    birthdate?: string | null
    personality?: string | null
    notes?: string | null
    owner_name?: string
  }>()

  if (!body.name?.trim() || !body.breed?.trim() || !body.owner_name?.trim()) {
    return Response.json({ error: "Faltan campos obligatorios." }, { status: 400 })
  }

  const id = crypto.randomUUID()
  await context.env.DB.prepare(
    `INSERT INTO dogs (id, name, breed, birthdate, personality, notes, owner_name)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      body.name.trim(),
      body.breed.trim(),
      body.birthdate?.trim() || null,
      body.personality?.trim() || null,
      body.notes?.trim() || null,
      body.owner_name.trim()
    )
    .run()

  return Response.json({ id }, { status: 201 })
}
