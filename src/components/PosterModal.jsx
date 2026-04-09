import { posterModalCopy } from "../data/resultConfig"

function PosterModal({ open, failed, imageUrl, onClose }) {
  if (!open) return null

  const m = posterModalCopy

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={m.ariaLabel}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-h-[92vh] max-w-[min(92vw,380px)]" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-1 -top-10 rounded-lg border border-cyan-300/40 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-cyan-100 sm:-right-2 sm:-top-12 sm:text-sm"
        >
          {m.close}
        </button>
        {!failed && imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt={m.imageAlt}
              className="max-h-[78vh] w-full rounded-2xl border border-cyan-300/45 object-contain shadow-[0_0_48px_rgba(34,211,238,0.35)]"
            />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end rounded-2xl bg-gradient-to-t from-black/75 via-black/20 to-transparent pb-8 pt-28">
              <span
                className="fingerprint-ring mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-cyan-200/90 bg-cyan-400/15 text-xl text-cyan-50"
                aria-hidden
              >
                👆
              </span>
              <p className="px-4 text-center text-sm font-medium text-white drop-shadow-md">{m.longPressHint}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-300/45 bg-slate-900 px-6 py-8 text-center text-cyan-50 shadow-xl">
            <p className="font-semibold text-amber-100">{m.failTitle}</p>
            <p className="mt-2 text-sm text-cyan-100/85">{m.failBody}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PosterModal
