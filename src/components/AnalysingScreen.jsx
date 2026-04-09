/**
 * 答题完成后的「实时分析」全屏动效页。
 * DeepSeek 请求在 App 中触发；此处仅负责展示与返回入口。
 */
function AnalysingScreen({ level, onBackCover }) {
  const hints = [
    "正在聚合 10 题行为信号…",
    "建模：执行 / 沟通 / 框架 / 投入 四维…",
    "对齐毒舌顾问人设与网感约束…",
    "压测 JSON 输出格式…",
    "几乎好了，再等一帧赛博特效…",
  ]

  return (
    <main className="cyber-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div className="cyber-grid pointer-events-none absolute inset-0 opacity-90" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.04) 2px, rgba(34,211,238,0.04) 4px)",
        }}
      />

      <div className="analysing-scan pointer-events-none absolute inset-x-0 top-0 h-[40%] opacity-50" />

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <p className="text-xs tracking-[0.35em] text-cyan-200/80">LLM · REALTIME</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          <span className="analysing-glitch bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent">
            赛博顾问正在咀嚼你的答案
          </span>
        </h1>
        <p className="mt-3 text-sm text-cyan-100/75">
          当前档位{" "}
          <span className="font-semibold text-amber-200">
            {level.icon} {level.tag}
          </span>
        </p>

        <div className="analysing-core relative mt-10 flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
          <div className="analysing-ring absolute inset-0 rounded-full border-2 border-cyan-400/50" />
          <div className="analysing-ring analysing-ring--delay absolute inset-3 rounded-full border border-fuchsia-400/40" />
          <div className="analysing-ring analysing-ring--slow absolute inset-8 rounded-full border border-violet-400/35" />
          <div className="relative z-10 text-5xl drop-shadow-[0_0_18px_rgba(34,211,238,0.5)]">{level.icon}</div>
        </div>

        <ul className="mt-10 space-y-2 text-left text-sm text-cyan-100/85">
          {hints.map((line, i) => (
            <li
              key={line}
              className="analysing-hint flex gap-2"
              style={{ animationDelay: `${i * 0.45}s` }}
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <p className="mt-8 font-mono text-[11px] text-fuchsia-200/70">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-fuchsia-400 align-middle" />{" "}
          请求预留位：App → requestDeepSeekEvaluation()
        </p>

        <button
          type="button"
          onClick={onBackCover}
          className="mt-10 rounded-xl border border-cyan-300/40 bg-slate-950/50 px-5 py-2.5 text-sm font-semibold text-cyan-100 backdrop-blur-sm transition hover:bg-cyan-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400/60"
        >
          返回封面
        </button>
      </div>
    </main>
  )
}

export default AnalysingScreen
