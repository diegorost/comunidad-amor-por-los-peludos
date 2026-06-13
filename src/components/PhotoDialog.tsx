import { X } from "lucide-react"

export function PhotoDialog({
  open,
  onClose,
  imageUrl,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  imageUrl: string
  title: string
  children?: React.ReactNode
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-full w-full max-w-2xl overflow-auto rounded-card bg-cream shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-cream/90 text-ink shadow"
        >
          <X className="size-5" />
        </button>
        <img src={imageUrl} alt={title} className="max-h-[70vh] w-full object-contain bg-cream-dark" />
        <div className="space-y-2 p-4">
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  )
}
