interface Env {
  DB: D1Database
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { results } = await context.env.DB.prepare(
    "SELECT * FROM tips ORDER BY created_at DESC"
  ).all()
  return Response.json(results)
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json<{
    title?: string
    text?: string
    image_url?: string | null
  }>()

  if (!body.title?.trim() || !body.text?.trim()) {
    return Response.json({ error: "Faltan campos obligatorios." }, { status: 400 })
  }

  const id = crypto.randomUUID()
  await context.env.DB.prepare(
    `INSERT INTO tips (id, title, text, image_url) VALUES (?, ?, ?, ?)`
  )
    .bind(id, body.title.trim(), body.text.trim(), body.image_url?.trim() || null)
    .run()

  return Response.json({ id }, { status: 201 })
}
