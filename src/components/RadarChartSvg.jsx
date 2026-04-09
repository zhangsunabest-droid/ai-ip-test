import { useId } from "react"

/**
 * 纯 SVG 四维雷达图（无第三方图表库，避免与 React 版本 Hook 冲突）。
 * data: [{ dimension: string, score: number 0-100 }, ...]
 */
function clampScore(v) {
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

function pointsForValues(values, cx, cy, maxR) {
  const n = values.length
  if (n === 0) return ""
  return values
    .map((v, i) => {
      const t = clampScore(v) / 100
      const a = -Math.PI / 2 + (2 * Math.PI * i) / n
      const x = cx + maxR * t * Math.cos(a)
      const y = cy + maxR * t * Math.sin(a)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(" ")
}

function outerLabelPoint(i, n, cx, cy, labelR) {
  const a = -Math.PI / 2 + (2 * Math.PI * i) / n
  return { x: cx + labelR * Math.cos(a), y: cy + labelR * Math.sin(a) }
}

export default function RadarChartSvg({ data = [], baseline = 62, className = "" }) {
  const glowId = useId().replace(/:/g, "g")
  const safe = Array.isArray(data) ? data : []
  const n = safe.length
  const vb = 240
  const cx = vb / 2
  const cy = vb / 2
  const maxR = 78
  const labelR = 102

  if (n === 0) {
    return (
      <div className={`flex min-h-[200px] items-center justify-center text-sm text-cyan-200/70 ${className}`}>
        暂无维度数据
      </div>
    )
  }

  const scores = safe.map((d) => d.score)
  const baselineScores = safe.map(() => baseline)
  const userPoly = pointsForValues(scores, cx, cy, maxR)
  const basePoly = pointsForValues(baselineScores, cx, cy, maxR)

  const gridSteps = [0.25, 0.5, 0.75, 1]
  const axisEnds = scores.map((_, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n
    return { x: cx + maxR * Math.cos(a), y: cy + maxR * Math.sin(a) }
  })

  return (
    <svg
      viewBox={`0 0 ${vb} ${vb}`}
      className={`h-full w-full max-h-[290px] ${className}`}
      role="img"
      aria-label="AI 能力四维雷达图"
    >
      <defs>
        <filter id={`radar-glow-${glowId}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {gridSteps.map((s) => (
        <polygon
          key={s}
          points={pointsForValues(scores.map(() => s * 100), cx, cy, maxR)}
          fill="none"
          stroke="rgba(103,232,249,0.22)"
          strokeWidth="1"
        />
      ))}

      {axisEnds.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(103,232,249,0.2)" strokeWidth="1" />
      ))}

      <polygon
        points={basePoly}
        fill="rgba(245,158,11,0.12)"
        stroke="#f59e0b"
        strokeWidth="1.8"
        strokeDasharray="6 5"
      >
        <title>同龄人均值：各维度约 {baseline} / 100</title>
      </polygon>

      <polygon
        points={userPoly}
        fill="rgba(34,211,238,0.35)"
        stroke="#22d3ee"
        strokeWidth="2"
        filter={`url(#radar-glow-${glowId})`}
      >
        <title>你的综合轮廓（0–100）</title>
      </polygon>

      {safe.map((d, i) => {
        const a = -Math.PI / 2 + (2 * Math.PI * i) / n
        const dotR = (clampScore(d.score) / 100) * maxR
        const px = cx + dotR * Math.cos(a)
        const py = cy + dotR * Math.sin(a)
        const lp = outerLabelPoint(i, n, cx, cy, labelR)
        return (
          <g key={d.dimension ?? i}>
            <circle cx={px} cy={py} r="4" fill="#e0f2fe" stroke="#22d3ee" strokeWidth="1.2">
              <title>{d.dimension}：{clampScore(d.score)} / 100</title>
            </circle>
            <text
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#c4b5fd"
              fontSize="11"
              style={{ fontFamily: "Inter, 'PingFang SC', 'Microsoft YaHei', sans-serif" }}
            >
              {d.dimension}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
