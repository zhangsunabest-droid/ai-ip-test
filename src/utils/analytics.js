const STORAGE_KEY = "ai-iq-test-events"
const STORAGE_LIMIT = 120

function saveEventLocally(event) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const events = raw ? JSON.parse(raw) : []
    const next = [event, ...events].slice(0, STORAGE_LIMIT)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Ignore local persistence errors to avoid breaking UX.
  }
}

export function trackEvent(name, payload = {}) {
  const event = {
    name,
    payload,
    at: new Date().toISOString(),
  }

  saveEventLocally(event)

  if (typeof window !== "undefined" && window.umami?.track) {
    window.umami.track(name, payload)
  }
}

