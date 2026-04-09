import { useEffect, useMemo, useState } from "react"

const QUESTION_TIME_LIMIT = 30

function QuizEngine({
  currentIndex,
  totalQuestions,
  progress,
  question,
  isLocked,
  onSelect,
  onToggleOption,
  onSubmitMulti,
  selectedOptionKeys = [],
  onTimeout,
  onBackCover,
}) {
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT)

  useEffect(() => {
    setTimeLeft(QUESTION_TIME_LIMIT)
  }, [question.id])

  useEffect(() => {
    if (isLocked) return
    if (timeLeft <= 0) return
    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [timeLeft, isLocked])

  useEffect(() => {
    if (isLocked) return
    if (timeLeft !== 0) return
    onTimeout()
  }, [timeLeft, isLocked, onTimeout])

  const timerPercent = Math.max((timeLeft / QUESTION_TIME_LIMIT) * 100, 0)
  const timerUrgent = timeLeft <= 5
  const isMulti = question.type === "multi"
  const selectedCount = selectedOptionKeys.length
  const helperText = isMulti
    ? "本题为多选题：选中所有你认为正确的项后，再点击“确认提交”。"
    : "本题为单选题：点击任一选项后将直接进入下一题。"

  const selectedKeySet = useMemo(() => new Set(selectedOptionKeys), [selectedOptionKeys])

  return (
    <main className="cyber-bg relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
      <div className="cyber-grid absolute inset-0" />
      <section
        className={`quiz-card-enter relative z-10 w-full max-w-3xl rounded-3xl border border-cyan-300/30 bg-slate-950/55 px-6 py-7 shadow-[0_0_55px_rgba(45,212,191,0.22)] backdrop-blur-md transition-all duration-220 sm:px-10 ${
          isLocked ? "scale-[0.992] opacity-75 blur-[1px]" : "scale-100 opacity-100 blur-0"
        }`}
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onBackCover}
            className="rounded-lg border border-cyan-200/40 bg-slate-900/40 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-900/25"
          >
            返回封面
          </button>
        </div>
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs tracking-[0.12em] text-cyan-100/90">
            <span>正在进行专家级扫描：第 {currentIndex + 1} / {totalQuestions} 题</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cyan-950/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mb-2 mt-4 flex items-center justify-between text-xs tracking-[0.08em] text-cyan-100/85">
            <span>本题限时 30 秒</span>
            <span className={timerUrgent ? "font-bold text-red-300" : ""}>{timeLeft}s</span>
          </div>
          <div className={`h-2 overflow-hidden rounded-full bg-slate-800/80 ${timerUrgent ? "quiz-timer-shake" : ""}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                timerUrgent
                  ? "bg-gradient-to-r from-red-500 via-orange-400 to-red-500"
                  : "bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300"
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs text-cyan-100/75">
          <span className={`rounded-full border px-2.5 py-1 font-semibold ${isMulti ? "border-fuchsia-300/40 bg-fuchsia-500/10 text-fuchsia-100" : "border-cyan-300/40 bg-cyan-500/10 text-cyan-100"}`}>
            {isMulti ? "多选题" : "单选题"}
          </span>
          {isMulti ? <span>已选择 {selectedCount} 项</span> : null}
        </div>

        <h2 className="mb-3 text-xl font-semibold leading-relaxed text-cyan-50 sm:text-2xl">
          {question.text}
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-cyan-100/72">{helperText}</p>

        <div className="grid gap-3">
          {question.options.map((option) => {
            const selected = selectedKeySet.has(option.key)
            return (
              <button
                type="button"
                key={option.key}
                onClick={() => (isMulti ? onToggleOption(option.key) : onSelect(option))}
                disabled={isLocked}
                className={`rounded-xl border px-4 py-4 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-65 sm:text-base ${
                  selected
                    ? "border-fuchsia-200/80 bg-fuchsia-950/55 text-white shadow-[0_0_18px_rgba(217,70,239,0.18)]"
                    : "border-cyan-200/30 bg-slate-900/70 text-cyan-50 hover:border-fuchsia-200/70 hover:bg-fuchsia-950/45"
                }`}
              >
                <span className="mr-2 font-bold text-fuchsia-200">{option.key}.</span>
                {option.label}
              </button>
            )
          })}
        </div>

        {isMulti ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-cyan-100/65">
              错选会被扣分或不得分，别被跨维度干扰项和逻辑陷阱带偏。
            </p>
            <button
              type="button"
              onClick={onSubmitMulti}
              disabled={isLocked}
              className="rounded-xl border border-cyan-200/80 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 px-5 py-3 text-sm font-bold text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              确认提交
            </button>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default QuizEngine
