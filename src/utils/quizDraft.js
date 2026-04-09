const QUIZ_DRAFT_KEY = "ai-iq-test-quiz-draft"

export function saveQuizDraft(draft) {
  try {
    window.localStorage.setItem(QUIZ_DRAFT_KEY, JSON.stringify(draft))
  } catch {
    // Ignore persistence failures; quiz should still work.
  }
}

export function readQuizDraft() {
  try {
    const raw = window.localStorage.getItem(QUIZ_DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearQuizDraft() {
  try {
    window.localStorage.removeItem(QUIZ_DRAFT_KEY)
  } catch {
    // Ignore localStorage errors.
  }
}

