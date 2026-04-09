import { getAiPrescription, posterCardCopy, resultPageCopy } from "../data/resultConfig"
import LearningCardModal from "./LearningCardModal"
import PosterModal from "./PosterModal"

function ResultDashboard({
  level,
  copiedBrag,
  posterBusy,
  onGeneratePoster,
  onCopyBrag,
  onRestart,
  onBackCover,
  qrDataUrl,
  posterRef,
  learningCardRef,
  wecomQrFailed,
  onWecomQrError,
  posterModalOpen,
  posterFailed,
  posterDataUrl,
  onClosePosterModal,
  llmEvaluation,
  totalScore,
  defeatedPercent,
  learningCardBusy,
  onSaveLearningCard,
  learningCardModalOpen,
  learningCardDataUrl,
  onCloseLearningCardModal,
  onDownloadLearningCard,
}) {
  const c = resultPageCopy
  const pc = posterCardCopy
  const { wecom } = c
  const prescription = getAiPrescription(totalScore)

  return (
    <main className="cyber-bg relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
      <div className="cyber-grid absolute inset-0" />

      <div
        ref={posterRef}
        data-poster-capture
        className="pointer-events-none fixed left-0 top-0 z-[-100] flex h-[640px] w-[360px] flex-col justify-between rounded-3xl border-2 border-cyan-400/50 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] p-8 shadow-2xl [visibility:hidden]"
        aria-hidden
      >
        <div>
          <p className="text-center text-[11px] tracking-[0.35em] text-cyan-200/85">{pc.brand}</p>
          <p className="mt-8 text-center text-5xl leading-none">{level.icon}</p>
          <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/45 bg-slate-900/50 px-3 py-1 text-[11px] text-cyan-100">
            <span className="tracking-wider">SCORE</span>
            <span className="font-bold text-amber-200">{totalScore}</span>
          </div>
          <p className="mt-3 text-center text-[22px] font-bold text-cyan-50">{level.tag}</p>
          <p className="mt-5 text-center text-sm leading-relaxed text-amber-100/95">
            你的 AI 商已击败全国 {defeatedPercent}% 的人
            <br />
            AI 商：{totalScore}分（满分150分）
          </p>
        </div>
        <div className="flex flex-col items-center">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="" width={112} height={112} className="rounded-xl bg-white/5 p-1" />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-dashed border-cyan-300/45 text-center text-[11px] leading-snug text-cyan-200/65">
              {pc.qrPlaceholder}
            </div>
          )}
          <p className="mt-2 text-center text-[11px] tracking-wider text-cyan-200/75">{pc.qrCaption}</p>
        </div>

        <div
          ref={learningCardRef}
          data-learning-card-capture
          className="pointer-events-none fixed left-0 top-0 z-[-100] w-[360px] rounded-3xl border border-emerald-300/40 bg-gradient-to-br from-[#052e2b] via-[#0f172a] to-[#042f2e] p-6 shadow-2xl [visibility:hidden]"
          aria-hidden
        >
          <p className="text-center text-[11px] tracking-[0.3em] text-emerald-100/85">AI PRESCRIPTION CARD</p>
          <p className="mt-3 text-center text-2xl font-bold text-emerald-50">{prescription.title}</p>
          <p className="mt-2 text-center text-xs text-cyan-100/80">
            {level.icon} {level.tag} · 当前得分 {totalScore}
          </p>
          <p className="mt-1 text-center text-xs text-amber-200/90">你的 AI 商已击败全国 {defeatedPercent}%</p>
          <div className="mt-5 space-y-2">
            {prescription.bullets.map((item) => (
              <div key={item} className="rounded-lg border border-emerald-200/25 bg-slate-950/55 px-3 py-2 text-sm leading-relaxed text-cyan-50/95">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] text-emerald-100/75">测测你的 AI 商 · 长按保存学习卡</p>
        </div>
      </div>

      <section className="relative z-10 w-full max-w-4xl rounded-3xl border border-cyan-300/35 bg-slate-950/60 px-6 py-10 shadow-[0_0_70px_rgba(45,212,191,0.2)] backdrop-blur-md sm:px-10">
        <p className="mb-2 text-center text-xs tracking-[0.22em] text-fuchsia-200/90">{c.eyebrow}</p>
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">{c.headline}</h2>

        <div className="mt-7 rounded-2xl border border-amber-200/25 bg-gradient-to-r from-fuchsia-950/35 to-cyan-950/35 p-5">
          <p className="text-lg font-bold text-amber-100 sm:text-2xl">
            {level.icon} {level.tag}
          </p>
          <p className="mt-2 text-cyan-50">
            {c.rankLinePrefix} <span className="font-bold text-amber-200">{defeatedPercent}%</span>
          </p>
          <p className="mt-1 text-xs text-cyan-200/75">AI 商：{totalScore}分（满分150分）</p>
          <p className="mt-3 text-sm leading-relaxed text-cyan-100/85">{level.review}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <button
              type="button"
              onClick={onGeneratePoster}
              disabled={posterBusy}
              className="rounded-xl border border-cyan-200/80 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 px-5 py-3 text-sm font-bold text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {posterBusy ? c.posterButtonBusy : c.posterButtonIdle}
            </button>
            <button
              type="button"
              onClick={onCopyBrag}
              className="rounded-xl border border-fuchsia-300/50 bg-fuchsia-950/35 px-5 py-3 text-sm font-bold text-fuchsia-100 transition hover:bg-fuchsia-950/55"
            >
              {copiedBrag ? c.bragButtonDone : c.bragButtonIdle}
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-950/20 p-5">
          <p className="text-sm font-semibold tracking-[0.08em] text-emerald-100">{prescription.title}</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-cyan-50/95">
            {prescription.bullets.map((item) => (
              <li key={item} className="rounded-lg border border-emerald-200/20 bg-slate-950/45 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onSaveLearningCard}
            disabled={learningCardBusy}
            className="mx-auto mt-4 rounded-xl border border-emerald-200/75 bg-emerald-300/90 px-5 py-2 text-sm font-bold text-slate-900 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-65"
          >
            {learningCardBusy ? "正在生成学习卡…" : "一键保存学习卡"}
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-950/25 to-purple-950/20 p-6 text-center">
          <p className="text-sm font-bold tracking-[0.12em] text-amber-100">{wecom.title}</p>
          <p className="mt-2 text-sm text-cyan-100/90">{wecom.subtitle}</p>
          {!wecomQrFailed ? (
            <img
              src={wecom.qrSrc}
              alt={wecom.qrAlt}
              className="mx-auto mt-4 h-36 w-36 rounded-2xl border border-amber-200/35 object-cover shadow-lg"
              onError={onWecomQrError}
            />
          ) : (
            <div className="mx-auto mt-4 flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-dashed border-amber-200/40 bg-slate-950/60 px-2 text-xs leading-relaxed text-amber-100/70">
              {wecom.placeholderBeforePath}
              <br />
              <span className="font-mono text-[11px] text-cyan-200/90">{wecom.placeholderPath}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-xl border border-cyan-200/70 bg-transparent px-6 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15"
          >
            {c.restart}
          </button>
          <button
            type="button"
            onClick={onBackCover}
            className="rounded-xl border border-fuchsia-300/50 bg-fuchsia-950/20 px-6 py-3 text-sm font-bold text-fuchsia-100 transition hover:bg-fuchsia-900/30"
          >
            返回封面
          </button>
        </div>
      </section>

      <PosterModal open={posterModalOpen} failed={posterFailed} imageUrl={posterDataUrl} onClose={onClosePosterModal} />
      <LearningCardModal
        open={learningCardModalOpen}
        imageUrl={learningCardDataUrl}
        onClose={onCloseLearningCardModal}
        onDownload={onDownloadLearningCard}
      />
    </main>
  )
}

export default ResultDashboard
