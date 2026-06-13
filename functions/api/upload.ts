interface Env {
  PHOTOS: R2Bucket
}

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

const MAX_SIZE = 5 * 1024 * 1024

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return Response.json({ error: "Falta el archivo." }, { status: 400 })
  }

  const extension = ALLOWED_TYPES[file.type]
  if (!extension) {
    return Response.json({ error: "Formato de imagen no soportado." }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "La imagen no puede superar 5MB." }, { status: 400 })
  }

  const key = `${crypto.randomUUID()}.${extension}`
  await context.env.PHOTOS.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  })

  return Response.json({ url: `/api/images/${key}` }, { status: 201 })
}
