import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Icon from "@/components/ui/icon"
import { authApi, dealsApi, offersApi, balanceApi, clearSession, saveSession, gamesApi } from "@/api"

const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-green-500", "bg-orange-500",
  "bg-red-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500",
]

function getAvatarColor(name: string) {
  const idx = name ? name.charCodeAt(0) % AVATAR_COLORS.length : 0
  return AVATAR_COLORS[idx]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="Star"
          size={13}
          className={i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  )
}

const DEAL_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Ожидает оплаты", color: "bg-yellow-100 text-yellow-700" },
  paid: { label: "Оплачено", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Завершено", color: "bg-green-100 text-green-700" },
  disputed: { label: "Спор", color: "bg-red-100 text-red-700" },
}

const CATEGORY_OPTIONS = [
  { value: "currency", label: "Валюта" },
  { value: "items", label: "Предметы" },
  { value: "services", label: "Услуги" },
  { value: "accounts", label: "Аккаунты" },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<Record<string, unknown> | null>(null)
  const [deals, setDeals] = useState<Record<string, unknown>[]>([])
  const [balance, setBalance] = useState<Record<string, unknown> | null>(null)
  const [games, setGames] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"deals" | "offers">("deals")

  // Topup modal
  const [showTopup, setShowTopup] = useState(false)
  const [topupAmount, setTopupAmount] = useState("")
  const [topupLoading, setTopupLoading] = useState(false)
  const [topupError, setTopupError] = useState("")
  const [topupSuccess, setTopupSuccess] = useState(false)

  // Create offer form
  const [showCreateOffer, setShowCreateOffer] = useState(false)
  const [offerForm, setOfferForm] = useState({
    game_slug: "",
    category: "currency",
    title: "",
    description: "",
    price: "",
    max_quantity: "1",
    instructions: "",
  })
  const [offerLoading, setOfferLoading] = useState(false)
  const [offerError, setOfferError] = useState("")
  const [offerSuccess, setOfferSuccess] = useState(false)

  useEffect(() => {
    authApi.me()
      .then((data: unknown) => {
        const d = data as Record<string, unknown>
        if (d?.error || d?.detail || !d?.username) {
          navigate("/login")
        } else {
          setUser(d)
        }
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false))

    dealsApi.list()
      .then((data: unknown) => {
        const list: Record<string, unknown>[] = Array.isArray(data) ? data : (data as Record<string, unknown>)?.deals as Record<string, unknown>[] || (data as Record<string, unknown>)?.results as Record<string, unknown>[] || []
        setDeals(list)
      })
      .catch(() => setDeals([]))

    balanceApi.get()
      .then((data: unknown) => {
        setBalance(data as Record<string, unknown>)
      })
      .catch(() => setBalance(null))

    gamesApi.list()
      .then((data: unknown) => {
        const list: Record<string, unknown>[] = Array.isArray(data) ? data : (data as Record<string, unknown>)?.games as Record<string, unknown>[] || []
        setGames(list)
      })
      .catch(() => setGames([]))
  }, [navigate])

  async function handleLogout() {
    await authApi.logout().catch(() => {})
    clearSession()
    navigate("/")
  }

  async function handleTopup() {
    const amt = parseFloat(topupAmount)
    if (!topupAmount || isNaN(amt) || amt <= 0) {
      setTopupError("Введите корректную сумму")
      return
    }
    setTopupError("")
    setTopupLoading(true)
    try {
      const res = await balanceApi.topup(amt) as Record<string, unknown>
      if (res?.error || res?.detail) {
        setTopupError(String(res.error || res.detail))
      } else {
        setTopupSuccess(true)
        setTopupAmount("")
        // Refresh balance
        const newBal = await balanceApi.get() as Record<string, unknown>
        setBalance(newBal)
        setTimeout(() => { setShowTopup(false); setTopupSuccess(false) }, 1500)
      }
    } catch {
      setTopupError("Ошибка при пополнении")
    } finally {
      setTopupLoading(false)
    }
  }

  async function handleCreateOffer() {
    if (!offerForm.title.trim() || !offerForm.price || !offerForm.game_slug) {
      setOfferError("Заполните все обязательные поля: игра, заголовок, цена")
      return
    }
    setOfferError("")
    setOfferLoading(true)
    try {
      const res = await offersApi.create({
        game_slug: offerForm.game_slug,
        category: offerForm.category,
        title: offerForm.title,
        description: offerForm.description,
        price: parseFloat(offerForm.price),
        max_quantity: parseInt(offerForm.max_quantity) || 1,
        instructions: offerForm.instructions,
      }) as Record<string, unknown>
      if (res?.error || res?.detail) {
        setOfferError(String(res.error || res.detail))
      } else {
        setOfferSuccess(true)
        setOfferForm({ game_slug: "", category: "currency", title: "", description: "", price: "", max_quantity: "1", instructions: "" })
        setTimeout(() => { setShowCreateOffer(false); setOfferSuccess(false) }, 2000)
      }
    } catch {
      setOfferError("Ошибка при создании объявления")
    } finally {
      setOfferLoading(false)
    }
  }

  // Update session from authApi.me if there's a new session
  const updateSession = (data: Record<string, unknown>) => {
    if (data?.session_id) saveSession(String(data.session_id))
  }
  if (user) updateSession(user)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-violet-600 mx-auto mb-3" />
          <p className="text-gray-500">Загрузка профиля...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const username = String(user.username || "Пользователь")
  const email = String(user.email || "")
  const rating = Number(user.rating || 0)
  const avatarColor = getAvatarColor(username)
  const initial = username[0]?.toUpperCase() || "?"
  const balanceAmount = Number(balance?.balance || balance?.amount || 0)
  const frozenBalance = Number(balance?.frozen || balance?.frozen_balance || 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg astrex-gradient flex items-center justify-center">
                <Icon name="Zap" size={16} className="text-white" />
              </div>
              <span className="text-xl font-black text-violet-600 tracking-tight">ASTREX</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:block">{username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Icon name="LogOut" size={15} />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SIDEBAR */}
          <div className="lg:col-span-1 space-y-4">
            {/* User card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm text-center">
              <div className={`w-20 h-20 rounded-full ${avatarColor} flex items-center justify-center text-white font-black text-3xl mx-auto mb-3`}>
                {initial}
              </div>
              <h2 className="font-black text-gray-900 text-lg">{username}</h2>
              {email && <p className="text-sm text-gray-400 mb-2">{email}</p>}
              <StarRating rating={rating} />
            </div>

            {/* Balance card */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Icon name="Wallet" size={16} className="text-violet-600" />
                Баланс
              </h3>
              <div className="mb-1">
                <span className="text-2xl font-black text-gray-900">{balanceAmount.toLocaleString("ru-RU")} ₽</span>
              </div>
              {frozenBalance > 0 && (
                <p className="text-xs text-gray-400 mb-3">Заморожено: {frozenBalance.toLocaleString("ru-RU")} ₽</p>
              )}

              {!showTopup ? (
                <button
                  onClick={() => { setShowTopup(true); setTopupError(""); setTopupSuccess(false) }}
                  className="w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Icon name="Plus" size={15} />
                  Пополнить баланс
                </button>
              ) : (
                <div className="space-y-2">
                  {topupError && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <Icon name="AlertCircle" size={12} />
                      {topupError}
                    </p>
                  )}
                  {topupSuccess && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Icon name="CheckCircle2" size={12} />
                      Баланс пополнен!
                    </p>
                  )}
                  <input
                    type="number"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    placeholder="Сумма в рублях"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 transition-colors"
                    min="1"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleTopup}
                      disabled={topupLoading}
                      className="flex-1 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
                    >
                      {topupLoading && <Icon name="Loader2" size={13} className="animate-spin" />}
                      Пополнить (тест)
                    </button>
                    <button
                      onClick={() => { setShowTopup(false); setTopupError(""); setTopupAmount("") }}
                      className="px-3 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar nav */}
            <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm space-y-1">
              <button
                onClick={() => setActiveTab("deals")}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "deals" ? "bg-violet-50 text-violet-600" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <Icon name="ShoppingCart" size={16} />
                Мои сделки
              </button>
              <button
                onClick={() => setActiveTab("offers")}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "offers" ? "bg-violet-50 text-violet-600" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <Icon name="Tag" size={16} />
                Мои объявления
              </button>
              <button
                onClick={() => { setActiveTab("offers"); setShowCreateOffer(true) }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-violet-600 hover:bg-violet-50 transition-colors flex items-center gap-2"
              >
                <Icon name="PlusCircle" size={16} />
                Разместить объявление
              </button>
              <hr className="border-gray-100 my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <Icon name="LogOut" size={16} />
                Выйти
              </button>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab("deals")}
                  className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === "deals" ? "border-violet-600 text-violet-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  Мои сделки
                </button>
                <button
                  onClick={() => setActiveTab("offers")}
                  className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === "offers" ? "border-violet-600 text-violet-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  Мои объявления
                </button>
              </div>

              {/* DEALS TAB */}
              {activeTab === "deals" && (
                <div className="p-6">
                  {deals.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="ShoppingCart" size={40} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">У вас пока нет сделок</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {deals.map((deal) => {
                        const dealId = String(deal.id)
                        const title = String(deal.offer_title || (deal.offer as Record<string, unknown>)?.title || "Товар")
                        const gameName = String(deal.game_name || "")
                        const status = String(deal.status || "pending_payment")
                        const statusCfg = DEAL_STATUS_CONFIG[status] || { label: status, color: "bg-gray-100 text-gray-700" }
                        const amount = Number(deal.total || deal.price || 0)
                        const date = String(deal.created_at || deal.date || "")

                        return (
                          <div key={dealId} className="border border-gray-100 rounded-xl p-4 hover:border-violet-200 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{title}</p>
                                {gameName && <p className="text-xs text-gray-400">{gameName}</p>}
                                <div className="flex items-center gap-3 mt-2">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.color}`}>
                                    {statusCfg.label}
                                  </span>
                                  {date && <span className="text-xs text-gray-400">{date}</span>}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                {amount > 0 && (
                                  <p className="font-bold text-gray-900">{amount.toLocaleString("ru-RU")} ₽</p>
                                )}
                                <Link
                                  to={`/deals/${dealId}`}
                                  className="text-sm text-violet-600 hover:text-violet-700 font-medium mt-1 block"
                                >
                                  Подробнее
                                </Link>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* OFFERS TAB */}
              {activeTab === "offers" && (
                <div className="p-6">
                  {/* Create offer button */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Мои объявления</h3>
                    <button
                      onClick={() => { setShowCreateOffer(!showCreateOffer); setOfferError(""); setOfferSuccess(false) }}
                      className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
                    >
                      <Icon name="Plus" size={15} />
                      Разместить
                    </button>
                  </div>

                  {/* Create offer form */}
                  {showCreateOffer && (
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-5 space-y-4">
                      <h4 className="font-bold text-gray-900">Новое объявление</h4>

                      {offerError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600 flex items-center gap-2">
                          <Icon name="AlertCircle" size={14} />
                          {offerError}
                        </div>
                      )}
                      {offerSuccess && (
                        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700 flex items-center gap-2">
                          <Icon name="CheckCircle2" size={14} />
                          Объявление успешно размещено!
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Игра *</label>
                          <select
                            value={offerForm.game_slug}
                            onChange={(e) => setOfferForm((f) => ({ ...f, game_slug: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 transition-colors"
                          >
                            <option value="">Выберите игру</option>
                            {games.map((g) => (
                              <option key={String(g.slug)} value={String(g.slug)}>{String(g.name)}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Категория</label>
                          <select
                            value={offerForm.category}
                            onChange={(e) => setOfferForm((f) => ({ ...f, category: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 transition-colors"
                          >
                            {CATEGORY_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Заголовок *</label>
                        <input
                          type="text"
                          value={offerForm.title}
                          onChange={(e) => setOfferForm((f) => ({ ...f, title: e.target.value }))}
                          placeholder="Например: 1000 Robux"
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Описание</label>
                        <textarea
                          value={offerForm.description}
                          onChange={(e) => setOfferForm((f) => ({ ...f, description: e.target.value }))}
                          placeholder="Опишите ваш товар подробнее..."
                          rows={3}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 transition-colors resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Цена (₽) *</label>
                          <input
                            type="number"
                            value={offerForm.price}
                            onChange={(e) => setOfferForm((f) => ({ ...f, price: e.target.value }))}
                            placeholder="0"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Макс. количество</label>
                          <input
                            type="number"
                            value={offerForm.max_quantity}
                            onChange={(e) => setOfferForm((f) => ({ ...f, max_quantity: e.target.value }))}
                            placeholder="1"
                            min="1"
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Инструкция (как передать товар)</label>
                        <textarea
                          value={offerForm.instructions}
                          onChange={(e) => setOfferForm((f) => ({ ...f, instructions: e.target.value }))}
                          placeholder="Опишите, как покупатель получит товар..."
                          rows={2}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 transition-colors resize-none"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleCreateOffer}
                          disabled={offerLoading}
                          className="flex-1 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {offerLoading && <Icon name="Loader2" size={15} className="animate-spin" />}
                          Разместить объявление
                        </button>
                        <button
                          onClick={() => { setShowCreateOffer(false); setOfferError(""); setOfferSuccess(false) }}
                          className="px-4 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}

                  {/* My offers placeholder */}
                  <div className="text-center py-12">
                    <Icon name="Tag" size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 mb-2">Функция просмотра своих объявлений скоро появится</p>
                    <p className="text-sm text-gray-400">Вы можете разместить новое объявление с помощью кнопки выше</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
