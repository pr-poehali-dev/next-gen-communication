const URLS = {
  auth: "https://functions.poehali.dev/9b31ffbe-4df4-4408-b225-5e900391f25e",
  games: "https://functions.poehali.dev/4ece6693-b4b3-409e-906e-3b670a614ec0",
  offers: "https://functions.poehali.dev/3dc05384-0e1e-40af-b95e-0eea581a4697",
  deals: "https://functions.poehali.dev/b299f5d9-bcab-4a31-aeab-ea97b6b10b8a",
  balance: "https://functions.poehali.dev/17805e60-43fd-44c5-96fc-b6ae084dc9cd",
}

function getSession() {
  return localStorage.getItem("astrex_session") || ""
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Session-Id": getSession(),
  }
}

async function req(url: string, options?: RequestInit) {
  const res = await fetch(url, options)
  const text = await res.text()
  try {
    const data = JSON.parse(text)
    // бэкенд возвращает body как строку JSON — парсим повторно если нужно
    if (typeof data === "string") return JSON.parse(data)
    return data
  } catch {
    return text
  }
}

// AUTH
export const authApi = {
  me: () => req(`${URLS.auth}/me`, { headers: authHeaders() }),
  register: (data: { username: string; email: string; password: string }) =>
    req(`${URLS.auth}/register`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    req(`${URLS.auth}/login`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) }),
  logout: () =>
    req(`${URLS.auth}/logout`, { method: "POST", headers: authHeaders() }),
}

// GAMES
export const gamesApi = {
  list: () => req(`${URLS.games}/`, { headers: authHeaders() }),
}

// OFFERS
export const offersApi = {
  list: (params?: { game?: string; category?: string; sort?: string; search?: string; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams()
    if (params?.game) qs.set("game", params.game)
    if (params?.category) qs.set("category", params.category)
    if (params?.sort) qs.set("sort", params.sort)
    if (params?.search) qs.set("search", params.search)
    if (params?.limit) qs.set("limit", String(params.limit))
    if (params?.offset) qs.set("offset", String(params.offset))
    return req(`${URLS.offers}/?${qs}`, { headers: authHeaders() })
  },
  get: (id: number) => req(`${URLS.offers}/${id}`, { headers: authHeaders() }),
  create: (data: object) =>
    req(`${URLS.offers}/`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) }),
}

// DEALS
export const dealsApi = {
  list: () => req(`${URLS.deals}/`, { headers: authHeaders() }),
  get: (id: number) => req(`${URLS.deals}/${id}`, { headers: authHeaders() }),
  create: (data: { offer_id: number; quantity: number }) =>
    req(`${URLS.deals}/create`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) }),
  confirm: (id: number) =>
    req(`${URLS.deals}/${id}/confirm`, { method: "POST", headers: authHeaders() }),
  dispute: (id: number, reason: string) =>
    req(`${URLS.deals}/${id}/dispute`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ reason }) }),
  review: (id: number, rating: number, comment: string) =>
    req(`${URLS.deals}/${id}/review`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ deal_id: id, rating, comment }) }),
}

// BALANCE
export const balanceApi = {
  get: () => req(`${URLS.balance}/`, { headers: authHeaders() }),
  topup: (amount: number) =>
    req(`${URLS.balance}/`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ amount }) }),
}

// AUTH STORE (простой)
export function saveSession(sessionId: string) {
  localStorage.setItem("astrex_session", sessionId)
}
export function clearSession() {
  localStorage.removeItem("astrex_session")
}
export function hasSession() {
  return !!localStorage.getItem("astrex_session")
}
