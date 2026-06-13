interface Env {
  DB: D1Database
}

const CATEGORIES = ["tienda", "clinica", "veterinario"]

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string
  const body = await context.request.json<{
    name?: string
    category?: string
    address?: string | null
    maps_url?: string | null
    website?: string | null
    phone?: string | null
    description?: string | null
  }>()

  if (!body.name?.trim() || !CATEGORIES.includes(body.category ?? "")) {
    return Response.json({ error: "Faltan campos obligatorios." }, { status: 400 })
  }

  await context.env.DB.prepare(
    `UPDATE resources
     SET name = ?, category = ?, address = ?, maps_url = ?, website = ?, phone = ?, description = ?
     WHERE id = ?`
  )
    .bind(
      body.name.trim(),
      body.category,
      body.address?.trim() || null,
      body.maps_url?.trim() || null,
      body.website?.trim() || null,
      body.phone?.trim() || null,
      body.description?.trim() || null,
      id
    )
    .run()

  return Response.json({ id })
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string
  await context.env.DB.prepare("DELETE FROM resources WHERE id = ?").bind(id).run()
  return Response.json({ ok: true })
}
