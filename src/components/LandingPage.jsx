import CyberAgentsLayer from "./CyberAgentsLayer"

const MONSTER_BOTS = [
  { id: "mb1", left: "8%", top: "18%", label: "Midjourney", delay: "0s" },
  { id: "mb2", left: "18%", top: "68%", label: "Notebook LM", delay: "-1.4s" },
  { id: "mb3", left: "78%", top: "22%", label: "Gemini", delay: "-0.6s" },
  { id: "mb4", left: "84%", top: "70%", label: "Cursor", delay: "-2.1s" },
]

function LandingPage({ onStart, hasDraft, onResumeDraft }) {
  return (
    <main className="cyber-bg relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="cyber-grid absolute inset-0" />
      <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl" />
      <CyberAgentsLayer />
      <div className="pointer-events-none absolute inset-0 z-[40]">
        {MONSTER_BOTS.map((bot, index) => (
          <div
            key={bot.id}
            className={`cyber-bot cyber-bot-${index + 1} absolute`}
            style={{ left: bot.left, top: bot.top, animationDelay: bot.delay }}
          >
            <div className="cyber-bot-body" aria-hidden>
              <span className="cyber-bot-eye left" />
              <span className="cyber-bot-eye right" />
              <span className="cyber-bot-mouth" />
              <span className="cyber-bot-antenna" />
            </div>
            <span className="cyber-bot-label">{bot.label}</span>
          </div>
        ))}
      </div>

      <section className="relative z-20 w-full max-w-3xl rounded-3xl border border-cyan-300/30 bg-slate-950/58 px-8 py-16 text-center shadow-[0_0_70px_rgba(45,212,191,0.25)] backdrop-blur-md sm:px-12">
        <p className="mb-5 inline-block rounded-full border border-fuchsia-300/40 bg-fuchsia-400/10 px-4 py-1 text-sm tracking-[0.2em] text-fuchsia-200">
          AI LEVEL CHECK
        </p>

        <h1 className="mb-4 bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-violet-200 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl">
          测测你的 AI 商
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-cyan-50/85 sm:text-lg">
          2 分钟完成测试，看看你属于哪一类玩家，解锁你的专属 AI 升级路径。
        </p>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-cyan-200/70 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 px-10 py-4 text-lg font-bold text-slate-950 transition duration-200 hover:scale-105 hover:shadow-[0_0_45px_rgba(34,211,238,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span className="absolute inset-0 -translate-x-full bg-white/45 transition-transform duration-500 group-hover:translate-x-0" />
            <span className="relative">开始测试</span>
          </button>
          {hasDraft ? (
            <button
              type="button"
              onClick={onResumeDraft}
              className="rounded-xl border border-fuchsia-300/55 bg-fuchsia-950/25 px-6 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-900/35"
            >
              继续上次进度
            </button>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export default LandingPage

