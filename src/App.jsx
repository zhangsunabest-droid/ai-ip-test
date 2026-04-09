import { useEffect, useMemo, useRef, useState } from "react"
import QRCode from "qrcode"
import AnalysingScreen from "./components/AnalysingScreen"
import LandingPage from "./components/LandingPage"
import QuizEngine from "./components/QuizEngine"
import ResultDashboard from "./components/ResultDashboard"
import { questions } from "./data/questions"
import { buildBragText, levelConfig } from "./data/resultConfig"
import { trackEvent } from "./utils/analytics"
import { clearQuizDraft, readQuizDraft, saveQuizDraft } from "./utils/quizDraft"

const RADAR_DIMENSIONS = [
  { key: "execution", label: "执行落地", questionIds: [1, 2, 11, 14] },
  { key: "communication", label: "沟通表达", questionIds: [3, 8, 13] },
  { key: "thinking", label: "思维框架", questionIds: [4, 10, 12, 15] },
  { key: "investment", label: "投入意愿", questionIds: [5, 6, 7, 9] },
]

function getDeepseekChatUrl() {
  const override = import.meta.env.VITE_DEEPSEEK_API_URL?.trim()
  if (override) return override
  return import.meta.env.DEV
    ? "/deepseek-api/chat/completions"
    : "https://api.deepseek.com/chat/completions"
}

function parseLlmJsonObject(raw) {
  let text = String(raw ?? "").trim()
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  if (fenced) text = fenced[1].trim()
  return JSON.parse(text)
}

async function fetchAIEvaluationRequest(answerTexts) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY?.trim()
  if (!apiKey) {
    throw new Error("MISSING_API_KEY")
  }
  if (!Array.isArray(answerTexts) || answerTexts.length !== questions.length) {
    throw new Error("INVALID_ANSWERS")
  }

  const list = answerTexts.map((t, i) => `${i + 1}. ${String(t)}`).join("\n")
  const userContent = `用户 15 题作答内容（按顺序）：\n${list}`

  const systemPrompt = `你是一位毒舌又专业的 AI 转型顾问。请基于用户的答题表现，生成一段个性化内容。

硬性要求：
1. 深度评价必须控制在 100 个汉字以内。
2. 深度评价里必须包含至少一条具体、可执行的建议（最好带动作+场景）。
3. 风格要幽默、带一点“网感”，适合社交平台传播，但不要低俗谩骂。
4. 只输出一个合法 JSON 对象，禁止 Markdown、禁止代码块、禁止任何解释或前后缀文字。
5. JSON 必须且只能包含两个键："称号" 和 "深度评价"（键名必须完全使用这两个中文）。

示例（仅示意结构，勿照抄）：{"称号":"赛博包工头预备役","深度评价":"你……"}`

  const res = await fetch(getDeepseekChatUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.85,
    }),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => "")
    throw new Error(errBody || res.statusText || String(res.status))
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  const parsed = parseLlmJsonObject(content)
  const title = String(parsed["称号"] ?? "").trim()
  const review = String(parsed["深度评价"] ?? "").trim()
  if (!title || !review) {
    throw new Error("INVALID_LLM_JSON")
  }
  return { 称号: title, 深度评价: review }
}

/** 单次请求超时（毫秒）：超时或网络错误时结果页回退到 level.review。 */
const LLM_REQUEST_TIMEOUT_MS = 28_000
/** 分析页最短停留时间，避免动效一闪而过。 */
const ANALYSING_MIN_MS = 1_400

/**
 * DeepSeek 实时评价 — 预留替换点：可改为请求自有后端、别的模型、或签名验真后的代理。
 * 保持 (string[]) => Promise<{ 称号, 深度评价 }> 即可与 App 内流程对接。
 */
async function requestDeepSeekEvaluation(answerTexts) {
  return fetchAIEvaluationRequest(answerTexts)
}

function clampScore(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getAnswerEntryScore(answerEntry) {
  return typeof answerEntry?.score === "number" ? answerEntry.score : 0
}

function buildRadarData(answerEntries) {
  return RADAR_DIMENSIONS.map((dimension) => {
    const relatedAnswers = answerEntries.filter((entry) => dimension.questionIds.includes(entry.questionId))
    const totalPossible = dimension.questionIds.reduce((sum, questionId) => {
      const question = questions.find((item) => item.id === questionId)
      return sum + (question?.maxScore ?? 0)
    }, 0)
    const totalScored = relatedAnswers.reduce((sum, entry) => sum + getAnswerEntryScore(entry), 0)
    const normalized = totalPossible > 0 ? Math.round((clampScore(totalScored, 0, totalPossible) / totalPossible) * 100) : 0
    return { dimension: dimension.label, score: normalized }
  })
}

const SHARE_UID_KEY = "ai_iq_share_uid"

function getOrCreateShareUid() {
  if (typeof window === "undefined") return "guest"
  const cached = window.localStorage.getItem(SHARE_UID_KEY)
  if (cached) return cached
  const randomPart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  const uid = `u_${randomPart}`
  window.localStorage.setItem(SHARE_UID_KEY, uid)
  return uid
}

function buildShareUrl({ score, levelTag }) {
  if (typeof window === "undefined") return ""
  const url = new URL(window.location.href)
  url.searchParams.set("ref_uid", getOrCreateShareUid())
  url.searchParams.set("ref_score", String(score))
  url.searchParams.set("ref_level", String(levelTag || ""))
  return url.toString()
}

function App() {
  const [stage, setStage] = useState("landing")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [painPoint, setPainPoint] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const [selectedOptionKeys, setSelectedOptionKeys] = useState([])
  const posterRef = useRef(null)
  const learningCardRef = useRef(null)
  const autoPosterRef = useRef(false)
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [posterModalOpen, setPosterModalOpen] = useState(false)
  const [posterDataUrl, setPosterDataUrl] = useState("")
  const [learningCardModalOpen, setLearningCardModalOpen] = useState(false)
  const [learningCardDataUrl, setLearningCardDataUrl] = useState("")
  const [posterFailed, setPosterFailed] = useState(false)
  const [posterBusy, setPosterBusy] = useState(false)
  const [learningCardBusy, setLearningCardBusy] = useState(false)
  const [copiedBrag, setCopiedBrag] = useState(false)
  const [wecomQrFailed, setWecomQrFailed] = useState(false)
  const [savedDraft, setSavedDraft] = useState(null)
  const [llmEvaluation, setLlmEvaluation] = useState(null)
  const analysingCancelledRef = useRef(false)

  const currentQuestion = questions[currentIndex]
  const level =
    levelConfig.find((item) => totalScore >= item.min && totalScore <= item.max) ?? levelConfig[0]
  const progress = useMemo(
    () => (stage === "quiz" ? ((currentIndex + 1) / questions.length) * 100 : 0),
    [currentIndex, stage]
  )
  const shareUrl = useMemo(() => buildShareUrl({ score: totalScore, levelTag: level.tag }), [totalScore, level.tag])
  const bragText = useMemo(() => buildBragText(level, shareUrl), [level, shareUrl])
  const radarData = useMemo(() => buildRadarData(userAnswers), [userAnswers])
  const defeatedPercent = useMemo(() => {
    if (totalScore <= 15) return 12
    if (totalScore <= 30) return 24
    if (totalScore <= 45) return 38
    if (totalScore <= 60) return 51
    if (totalScore <= 75) return 63
    if (totalScore <= 90) return 74
    if (totalScore <= 105) return 83
    if (totalScore <= 120) return 90
    if (totalScore <= 135) return 95
    return 98
  }, [totalScore])

  const startQuiz = () => {
    trackEvent("quiz_started", { from: stage })
    setStage("quiz")
    setCurrentIndex(0)
    setTotalScore(0)
    setUserAnswers([])
    setPainPoint("")
    setSelectedOptionKeys([])
    setQrDataUrl("")
    setPosterModalOpen(false)
    setPosterDataUrl("")
    setLearningCardModalOpen(false)
    setLearningCardDataUrl("")
    setPosterFailed(false)
    setPosterBusy(false)
    setLearningCardBusy(false)
    setCopiedBrag(false)
    setWecomQrFailed(false)
    clearQuizDraft()
    setSavedDraft(null)
    setLlmEvaluation(null)
    analysingCancelledRef.current = false
  }

  const goCover = () => {
    if (stage === "analysing") {
      analysingCancelledRef.current = true
    }
    setStage("landing")
    setIsLocked(false)
    setSelectedOptionKeys([])
    setPosterModalOpen(false)
    setLearningCardModalOpen(false)
    setLearningCardBusy(false)
    setCopiedBrag(false)
    trackEvent("back_to_cover", { from: stage })
  }

  const resumeDraftQuiz = () => {
    if (!savedDraft) return
    setStage("quiz")
    setCurrentIndex(savedDraft.currentIndex)
    setTotalScore(typeof savedDraft.totalScore === "number" ? savedDraft.totalScore : 0)
    setUserAnswers(Array.isArray(savedDraft.userAnswers) ? savedDraft.userAnswers : [])
    setPainPoint(typeof savedDraft.painPoint === "string" ? savedDraft.painPoint : "")
    setSelectedOptionKeys(Array.isArray(savedDraft.selectedOptionKeys) ? savedDraft.selectedOptionKeys : [])
    setSavedDraft(null)
    trackEvent("quiz_draft_restored", { questionIndex: savedDraft.currentIndex })
  }

  const finishQuestion = (answerEntry, scoreDelta) => {
    const nextAnswers = [...userAnswers, answerEntry]
    setUserAnswers(nextAnswers)
    setTotalScore((prev) => prev + scoreDelta)
    if (answerEntry.painPoint) {
      setPainPoint(answerEntry.painPoint)
    }

    const isLast = currentIndex === questions.length - 1
    window.setTimeout(() => {
      if (isLast) {
        trackEvent("quiz_completed", {
          finalScore: totalScore + scoreDelta,
          painPoint: answerEntry.painPoint ?? painPoint,
          answerCount: nextAnswers.length,
        })
        clearQuizDraft()
        setStage("analysing")
        const texts = nextAnswers.map((a) => a.answerText)
        if (texts.length === questions.length) {
          void completeQuizWithLlmEvaluation(texts)
        } else {
          setStage("done")
        }
      } else {
        setCurrentIndex((prev) => prev + 1)
        setSelectedOptionKeys([])
      }
      setIsLocked(false)
    }, 220)
  }

  const onSelect = (option) => {
    if (isLocked || currentQuestion.type === "multi") return

    setIsLocked(true)
    trackEvent("question_answered", {
      questionId: currentQuestion.id,
      optionKey: option.key,
      hasScore: typeof option.score === "number",
      mode: "single",
    })

    const answerEntry = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answerKey: option.key ?? "",
      answerKeys: [option.key ?? ""],
      answerText: option.label ?? "",
      answerTexts: [option.label ?? ""],
      score: typeof option.score === "number" ? option.score : 0,
      maxScore: currentQuestion.maxScore ?? 0,
      type: currentQuestion.type,
      painPoint: option.painPoint,
    }

    finishQuestion(answerEntry, answerEntry.score)
  }

  const onToggleOption = (optionKey) => {
    if (isLocked || currentQuestion.type !== "multi") return
    setSelectedOptionKeys((prev) =>
      prev.includes(optionKey) ? prev.filter((key) => key !== optionKey) : [...prev, optionKey]
    )
  }

  const onSubmitMulti = () => {
    if (isLocked || currentQuestion.type !== "multi") return

    setIsLocked(true)
    const selectedOptions = currentQuestion.options.filter((option) => selectedOptionKeys.includes(option.key))
    const score = clampScore(
      selectedOptions.reduce((sum, option) => sum + (typeof option.score === "number" ? option.score : 0), 0),
      0,
      currentQuestion.maxScore ?? 0
    )

    trackEvent("question_answered", {
      questionId: currentQuestion.id,
      optionKeys: selectedOptionKeys,
      selectedCount: selectedOptionKeys.length,
      mode: "multi",
    })

    const answerEntry = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answerKey: selectedOptionKeys.join("|"),
      answerKeys: [...selectedOptionKeys],
      answerText: selectedOptions.length
        ? selectedOptions.map((option) => `${option.key}. ${option.label}`).join("；")
        : "未选择任何选项",
      answerTexts: selectedOptions.map((option) => option.label),
      score,
      maxScore: currentQuestion.maxScore ?? 0,
      type: currentQuestion.type,
    }

    finishQuestion(answerEntry, answerEntry.score)
  }

  const onTimeout = () => {
    if (isLocked) return
    setIsLocked(true)
    trackEvent("question_timeout", {
      questionId: currentQuestion.id,
      questionIndex: currentIndex,
      mode: currentQuestion.type,
    })
    const answerEntry = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answerKey: "TIMEOUT",
      answerKeys: [],
      answerText: "超时未作答",
      answerTexts: [],
      score: 0,
      maxScore: currentQuestion.maxScore ?? 0,
      type: currentQuestion.type,
    }
    finishQuestion(answerEntry, 0)
  }

  const completeQuizWithLlmEvaluation = async (answerTexts) => {
    const startedAt = Date.now()
    setLlmEvaluation(null)
    trackEvent("llm_evaluation_started")
    try {
      const result = await Promise.race([
        requestDeepSeekEvaluation(answerTexts),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("LLM_TIMEOUT")), LLM_REQUEST_TIMEOUT_MS)
        ),
      ])
      if (!analysingCancelledRef.current) {
        setLlmEvaluation(result)
        trackEvent("llm_evaluation_succeeded")
      }
    } catch (err) {
      if (!analysingCancelledRef.current) {
        setLlmEvaluation(null)
        const msg = String(err?.message ?? err)
        if (msg === "MISSING_API_KEY") {
          trackEvent("llm_evaluation_skipped", { reason: "no_api_key" })
        } else if (msg === "LLM_TIMEOUT") {
          trackEvent("llm_evaluation_failed", { reason: "timeout" })
        } else {
          trackEvent("llm_evaluation_failed", { message: msg.slice(0, 200) })
        }
      }
    } finally {
      const cancelled = analysingCancelledRef.current
      if (cancelled) {
        analysingCancelledRef.current = false
      } else {
        const elapsed = Date.now() - startedAt
        if (elapsed < ANALYSING_MIN_MS) {
          await new Promise((r) => setTimeout(r, ANALYSING_MIN_MS - elapsed))
        }
        setStage("done")
      }
    }
  }

  useEffect(() => {
    const draft = readQuizDraft()
    if (!draft) {
      return
    }
    const validIndex =
      Number.isInteger(draft.currentIndex) && draft.currentIndex >= 0 && draft.currentIndex < questions.length
    if (!validIndex) {
      clearQuizDraft()
      return
    }
    setSavedDraft(draft)
  }, [])

  useEffect(() => {
    if (stage !== "quiz") return
    saveQuizDraft({
      currentIndex,
      totalScore,
      userAnswers,
      painPoint,
      selectedOptionKeys,
      updatedAt: Date.now(),
    })
  }, [stage, currentIndex, totalScore, userAnswers, painPoint, selectedOptionKeys])

  useEffect(() => {
    if (stage !== "done") return
    QRCode.toDataURL(shareUrl, {
      width: 112,
      margin: 1,
      color: { dark: "#e0f2fe", light: "#0f172a" },
    })
      .then(setQrDataUrl)
      .catch(() => {
        trackEvent("qr_generate_failed")
        setQrDataUrl("")
      })
  }, [stage, shareUrl])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    const params = new URLSearchParams(window.location.search)
    const debug = params.get("debug")
    if (!debug || debug !== "1") return

    const scoreParam = Number(params.get("score"))
    const safeScore = Number.isFinite(scoreParam) ? clampScore(Math.round(scoreParam), 0, 150) : 119

    const cardParam = params.get("card")
    setTotalScore(safeScore)
    setUserAnswers([])
    setPainPoint("")
    setStage("done")

    if (cardParam === "1") {
      autoPosterRef.current = true
    }
  }, [])

  useEffect(() => {
    if (stage !== "done") return
    if (!autoPosterRef.current) return
    autoPosterRef.current = false
    window.setTimeout(() => {
      void generatePoster()
    }, 240)
  }, [stage])

  const copyBrag = async () => {
    try {
      await navigator.clipboard.writeText(bragText)
      setCopiedBrag(true)
      trackEvent("brag_copied", { level: level.tag })
      window.setTimeout(() => setCopiedBrag(false), 1400)
    } catch {
      trackEvent("brag_copy_failed", { level: level.tag })
      setCopiedBrag(false)
    }
  }

  const generatePoster = async () => {
    if (!posterRef.current || posterBusy) return
    setPosterBusy(true)
    setPosterFailed(false)
    trackEvent("poster_generate_started", { level: level.tag })
    try {
      if (!qrDataUrl) {
        try {
          const url = await QRCode.toDataURL(shareUrl, {
            width: 112,
            margin: 1,
            color: { dark: "#e0f2fe", light: "#0f172a" },
          })
          setQrDataUrl(url)
          await new Promise((r) => setTimeout(r, 60))
        } catch {
          // Poster UI still works with placeholder.
        }
      }
      const html2canvas = (await import("html2canvas")).default
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
      await new Promise((r) => setTimeout(r, 80))
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: "#0b1120",
        logging: import.meta.env.DEV,
        useCORS: true,
        onclone(clonedDoc) {
          const node = clonedDoc.querySelector("[data-poster-capture]")
          if (!node || !(node instanceof HTMLElement)) return
          node.style.visibility = "visible"
          node.style.opacity = "1"
          node.style.position = "relative"
          node.style.left = "0"
          node.style.top = "0"
          node.style.zIndex = "0"
          node.style.backgroundColor = "#0f172a"
        },
      })
      setPosterDataUrl(canvas.toDataURL("image/png"))
      setPosterModalOpen(true)
      trackEvent("poster_generate_succeeded", { level: level.tag })
    } catch {
      try {
        const fallbackPosterUrl = await generatePosterWithCanvasFallback({
          level,
          qrDataUrl,
          llmEvaluation,
          totalScore,
          defeatedPercent,
        })
        setPosterDataUrl(fallbackPosterUrl)
        setPosterFailed(false)
        setPosterModalOpen(true)
        trackEvent("poster_generate_fallback_succeeded", { level: level.tag })
      } catch {
        setPosterDataUrl("")
        setPosterFailed(true)
        setPosterModalOpen(true)
        trackEvent("poster_generate_failed", { level: level.tag })
      }
    } finally {
      setPosterBusy(false)
    }
  }

  const saveLearningCard = async () => {
    if (!learningCardRef.current || learningCardBusy) return
    setLearningCardBusy(true)
    trackEvent("learning_card_generate_started", { level: level.tag })
    try {
      const html2canvas = (await import("html2canvas")).default
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
      const canvas = await html2canvas(learningCardRef.current, {
        scale: 2,
        backgroundColor: "#041816",
        logging: import.meta.env.DEV,
        onclone(clonedDoc) {
          const node = clonedDoc.querySelector("[data-learning-card-capture]")
          if (!node || !(node instanceof HTMLElement)) return
          node.style.visibility = "visible"
          node.style.opacity = "1"
          node.style.position = "relative"
          node.style.left = "0"
          node.style.top = "0"
          node.style.zIndex = "0"
        },
      })
      const url = canvas.toDataURL("image/png")
      setLearningCardDataUrl(url)
      setLearningCardModalOpen(true)
      trackEvent("learning_card_generate_succeeded", { level: level.tag })
    } catch {
      trackEvent("learning_card_generate_failed", { level: level.tag })
    } finally {
      setLearningCardBusy(false)
    }
  }

  const downloadLearningCard = () => {
    if (!learningCardDataUrl) return
    const link = document.createElement("a")
    link.href = learningCardDataUrl
    link.download = `ai-learning-card-${totalScore}.png`
    link.click()
    trackEvent("learning_card_downloaded", { level: level.tag })
  }

  const onWecomQrError = () => {
    setWecomQrFailed(true)
    trackEvent("wecom_qr_load_failed")
  }

  if (stage === "landing") {
    return <LandingPage onStart={startQuiz} hasDraft={Boolean(savedDraft)} onResumeDraft={resumeDraftQuiz} />
  }

  if (stage === "analysing") {
    return <AnalysingScreen level={level} onBackCover={goCover} />
  }

  if (stage === "done") {
    return (
      <ResultDashboard
        level={level}
        copiedBrag={copiedBrag}
        posterBusy={posterBusy}
        onGeneratePoster={generatePoster}
        onCopyBrag={copyBrag}
        onRestart={startQuiz}
        onBackCover={goCover}
        qrDataUrl={qrDataUrl}
        posterRef={posterRef}
        learningCardRef={learningCardRef}
        wecomQrFailed={wecomQrFailed}
        onWecomQrError={onWecomQrError}
        posterModalOpen={posterModalOpen}
        posterFailed={posterFailed}
        posterDataUrl={posterDataUrl}
        onClosePosterModal={() => setPosterModalOpen(false)}
        llmEvaluation={llmEvaluation}
        radarData={radarData}
        totalScore={totalScore}
        defeatedPercent={defeatedPercent}
        learningCardBusy={learningCardBusy}
        onSaveLearningCard={saveLearningCard}
        learningCardModalOpen={learningCardModalOpen}
        learningCardDataUrl={learningCardDataUrl}
        onCloseLearningCardModal={() => setLearningCardModalOpen(false)}
        onDownloadLearningCard={downloadLearningCard}
      />
    )
  }

  return (
    <QuizEngine
      key={currentIndex}
      currentIndex={currentIndex}
      totalQuestions={questions.length}
      progress={progress}
      question={currentQuestion}
      isLocked={isLocked}
      selectedOptionKeys={selectedOptionKeys}
      onSelect={onSelect}
      onToggleOption={onToggleOption}
      onSubmitMulti={onSubmitMulti}
      onTimeout={onTimeout}
      onBackCover={goCover}
    />
  )
}

function generatePosterWithCanvasFallback({ level, qrDataUrl, llmEvaluation, totalScore, defeatedPercent }) {
  const width = 720
  const height = 1280
  const qrSize = 220

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas context unavailable")

  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, "#0f172a")
  gradient.addColorStop(0.5, "#1e1b4b")
  gradient.addColorStop(1, "#0f172a")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = "rgba(34,211,238,0.7)"
  ctx.lineWidth = 6
  roundRect(ctx, 18, 18, width - 36, height - 36, 26)
  ctx.stroke()

  ctx.fillStyle = "#bae6fd"
  ctx.font = "600 26px 'PingFang SC', 'Microsoft YaHei', sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("测测你的 AI 商", width / 2, 84)

  ctx.font = "84px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif"
  ctx.fillText(level.icon, width / 2, 245)

  ctx.fillStyle = "#e2e8f0"
  ctx.font = "700 48px 'PingFang SC', 'Microsoft YaHei', sans-serif"
  ctx.fillText(level.tag, width / 2, 322)

  ctx.fillStyle = "#fde68a"
  ctx.font = "500 30px 'PingFang SC', 'Microsoft YaHei', sans-serif"
  ctx.fillText(`你的 AI 商已击败全国 ${defeatedPercent}% 的人`, width / 2, 398)

  ctx.fillStyle = "#fef08a"
  ctx.font = "700 34px 'PingFang SC', 'Microsoft YaHei', sans-serif"
  ctx.fillText(`AI 商：${totalScore}分（满分150分）`, width / 2, 448)

  ctx.fillStyle = "rgba(203,213,225,0.95)"
  ctx.font = "400 25px 'PingFang SC', 'Microsoft YaHei', sans-serif"
  wrapCenteredText(ctx, level.review, width / 2, 540, 560, 40)

  const llmReview = String(llmEvaluation?.["深度评价"] ?? "").trim()
  if (llmReview) {
    ctx.fillStyle = "rgba(251,191,36,0.18)"
    roundRect(ctx, 84, 640, width - 168, 140, 18)
    ctx.fill()
    ctx.fillStyle = "#f5d0fe"
    ctx.font = "600 24px 'PingFang SC', 'Microsoft YaHei', sans-serif"
    ctx.fillText("AI 毒舌评价", width / 2, 680)
    ctx.fillStyle = "#e9d5ff"
    ctx.font = "400 22px 'PingFang SC', 'Microsoft YaHei', sans-serif"
    wrapCenteredText(ctx, llmReview, width / 2, 718, width - 230, 32)
  }

  const qrX = (width - qrSize) / 2
  const qrY = 860
  ctx.fillStyle = "rgba(255,255,255,0.06)"
  roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 18)
  ctx.fill()

  const drawFooter = () => {
    ctx.fillStyle = "#cbd5e1"
    ctx.font = "400 23px 'PingFang SC', 'Microsoft YaHei', sans-serif"
    ctx.fillText("长按保存 · 邀请好友来测", width / 2, 1145)
  }

  if (!qrDataUrl) {
    ctx.fillStyle = "#94a3b8"
    ctx.font = "500 26px 'PingFang SC', 'Microsoft YaHei', sans-serif"
    ctx.fillText("扫码复测", width / 2, qrY + qrSize / 2 + 10)
    drawFooter()
    return Promise.resolve(canvas.toDataURL("image/png"))
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize)
      drawFooter()
      resolve(canvas.toDataURL("image/png"))
    }
    img.onerror = () => {
      drawFooter()
      resolve(canvas.toDataURL("image/png"))
    }
    img.src = qrDataUrl
  })
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function wrapCenteredText(ctx, text, centerX, startY, maxWidth, lineHeight) {
  const chars = [...text]
  let line = ""
  let y = startY

  for (const ch of chars) {
    const test = line + ch
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, centerX, y)
      line = ch
      y += lineHeight
    } else {
      line = test
    }
  }
  if (line) {
    ctx.fillText(line, centerX, y)
  }
}

export default App

