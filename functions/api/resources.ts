interface Env {
  DB: D1Database
}

const CATEGORIES = ["tienda", "clinica", "veterinario"]

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { results } = await context.env.DB.prepare(
    "SELECT * FROM resources ORDER BY created_at DESC"
  ).all()
  return Response.json(results)
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json<{
    name?: string
    category?: string
    address?: string | null
    website?: string | null
    phone?: string | null
    description?: string | null
  }>()

  if (!body.name?.trim() || !CATEGORIES.includes(body.category ?? "")) {
    return Response.json({ error: "Faltan campos obligatorios." }, { status: 400 })
  }

  const id = crypto.randomUUID()
  await context.env.DB.prepare(
    `INSERT INTO resources (id, name, category, address, website, phone, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      body.name.trim(),
      body.category,
      body.address?.trim() || null,
      body.website?.trim() || null,
      body.phone?.trim() || null,
      body.description?.trim() || null
    )
    .run()

  return Response.json({ id }, { status: 201 })
}
