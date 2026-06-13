interface Env {
  DB: D1Database
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { results } = await context.env.DB.prepare(
    "SELECT * FROM community_highlights ORDER BY created_at DESC LIMIT 3"
  ).all()
  return Response.json(results)
}
