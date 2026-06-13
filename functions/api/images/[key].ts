interface Env {
  PHOTOS: R2Bucket
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const key = context.params.key as string
  const object = await context.env.PHOTOS.get(key)

  if (!object) {
    return new Response("Not found", { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set("Cache-Control", "public, max-age=31536000, immutable")

  return new Response(object.body, { headers })
}
