function LearningCardModal({ open, imageUrl, onClose, onDownload }) {
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="学习卡预览"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/85 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-h-[92vh] max-w-[min(92vw,420px)]" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-1 -top-10 rounded-lg border border-emerald-300/40 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-emerald-100 sm:-right-2 sm:-top-12 sm:text-sm"
        >
          关闭
        </button>
        {imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt="学习卡预览"
              className="max-h-[78vh] w-full rounded-2xl border border-emerald-300/45 object-contain shadow-[0_0_48px_rgba(16,185,129,0.35)]"
            />
            <div className="mt-3 flex items-center justify-center">
              <button
                type="button"
                onClick={onDownload}
                className="rounded-xl border border-emerald-200/75 bg-emerald-300/90 px-5 py-2 text-sm font-bold text-slate-900 transition hover:bg-emerald-200"
              >
                保存到相册
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-300/45 bg-slate-900 px-6 py-8 text-center text-cyan-50 shadow-xl">
            <p className="font-semibold text-amber-100">学习卡生成失败</p>
            <p className="mt-2 text-sm text-cyan-100/85">请稍后重试或截图保存当前结果。</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LearningCardModal
