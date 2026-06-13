interface Env {
  DB: D1Database
  PHOTOS: R2Bucket
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string
  const body = await context.request.json<{
    title?: string
    text?: string
    image_url?: string | null
  }>()

  if (!body.title?.trim()) {
    return Response.json({ error: "Faltan campos obligatorios." }, { status: 400 })
  }

  await context.env.DB.prepare(
    `UPDATE tips SET title = ?, text = ?, image_url = ? WHERE id = ?`
  )
    .bind(body.title.trim(), body.text?.trim() || null, body.image_url?.trim() || null, id)
    .run()

  return Response.json({ id })
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string

  const tip = await context.env.DB.prepare("SELECT image_url FROM tips WHERE id = ?")
    .bind(id)
    .first<{ image_url: string | null }>()

  await context.env.DB.prepare("DELETE FROM tips WHERE id = ?").bind(id).run()

  if (tip?.image_url?.startsWith("/api/images/")) {
    await context.env.PHOTOS.delete(tip.image_url.replace("/api/images/", ""))
  }

  return Response.json({ ok: true })
}
