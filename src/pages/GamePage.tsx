import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Icon from "@/components/ui/icon"
import { offersApi, gamesApi } from "@/api"

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
          size={12}
          className={i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  )
}

const TABS = ["Все", "Валюта", "Предметы", "Услуги", "Аккаунты"]
const CATEGORY_MAP: Record<string, string> = {
  "Все": "",
  "Валюта": "currency",
  "Предметы": "items",
  "Услуги": "services",
  "Аккаунты": "accounts",
}
const SORT_OPTIONS = [
  { label: "По умолчанию", value: "" },
  { label: "Дешевле", value: "price_asc" },
  { label: "Дороже", value: "price_desc" },
  { label: "По рейтингу", value: "rating" },
  { label: "По сделкам", value: "deals" },
]

const LIMIT = 12

function Navbar() {
  const session = localStorage.getItem("astrex_session")
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg astrex-gradient flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-white" />
            </div>
            <span className="text-xl font-black text-violet-600 tracking-tight">ASTREX</span>
          </Link>
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск товаров..."
                className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-violet-400 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <Link to="/profile" className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2">
                <Icon name="User" size={15} />
                Личный кабинет
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-violet-600 border border-violet-600 rounded-lg hover:bg-violet-50 transition-colors">Войти</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>()
  const [game, setGame] = useState<Record<string, unknown> | null>(null)
  const [offers, setOffers] = useState<Record<string, unknown>[]>([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [sort, setSort] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    gamesApi.list().then((data: unknown) => {
      const list: Record<string, unknown>[] = Array.isArray(data) ? data : (data as Record<string, unknown>)?.games as Record<string, unknown>[] || []
      const found = list.find((g) => g.slug === slug) || null
      setGame(found)
    }).catch(() => setGame(null))
  }, [slug])

  useEffect(() => {
    setOffset(0)
    setOffers([])
    loadOffers(0, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, activeTab, sort, search])

  function loadOffers(off: number, reset: boolean) {
    const category = CATEGORY_MAP[TABS[activeTab]] || undefined
    if (reset) setLoading(true)
    else setLoadingMore(true)

    offersApi.list({
      game: slug || "",
      category: category || undefined,
      sort: sort || undefined,
      search: search || undefined,
      limit: LIMIT,
      offset: off,
    }).then((data: unknown) => {
      const list: Record<string, unknown>[] = Array.isArray(data) ? data : (data as Record<string, unknown>)?.offers as Record<string, unknown>[] || (data as Record<string, unknown>)?.results as Record<string, unknown>[] || []
      const tot = (data as Record<string, unknown>)?.total as number || list.length
      setTotal(tot)
      if (reset) setOffers(list)
      else setOffers((prev) => [...prev, ...list])
      setOffset(off + list.length)
    }).catch(() => {
      if (reset) setOffers([])
    }).finally(() => {
      setLoading(false)
      setLoadingMore(false)
    })
  }

  const colorFrom = (game?.color_from as string) || "violet-600"
  const colorTo = (game?.color_to as string) || "violet-400"
  const bannerClass = `bg-gradient-to-r from-${colorFrom} to-${colorTo}`

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* GAME BANNER */}
      <div className={`py-12 ${bannerClass || "bg-gradient-to-r from-violet-600 to-violet-400"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Главная</Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-white font-medium">{game ? String(game.name) : slug}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
              {game ? String(game.emoji || "🎮") : "🎮"}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-1">
                {game ? String(game.name) : slug}
              </h1>
              {game?.description && (
                <p className="text-white/80 text-sm mb-1">{String(game.description)}</p>
              )}
              {game?.offers_count != null && (
                <p className="text-white font-semibold">{String(game.offers_count)} предложений</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0">
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === i
                    ? "border-violet-600 text-violet-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск в объявлениях..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 transition-colors"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-violet-400 transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* OFFERS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
                    <div className="h-3 bg-gray-100 rounded w-16" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/3 mt-3" />
              </div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="SearchX" size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">Предложений не найдено</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
            >
              <Icon name="PlusCircle" size={16} />
              Разместить объявление
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer) => {
                const sellerName = String(offer.seller_username || (offer.seller as Record<string, unknown>)?.username || offer.seller || "Продавец")
                const initial = sellerName[0]?.toUpperCase() || "?"
                const avatarColor = getAvatarColor(sellerName)
                const rating = Number(offer.seller_rating || (offer.seller as Record<string, unknown>)?.rating || 0)
                const deals = Number(offer.deals_count || 0)
                const online = Boolean(offer.seller_online || (offer.seller as Record<string, unknown>)?.is_online)
                const price = offer.price != null ? `${Number(offer.price).toLocaleString("ru-RU")} ₽` : "—"

                return (
                  <div key={String(offer.id)} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-violet-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                          {initial}
                        </div>
                        {online && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{sellerName}</p>
                        <div className="flex items-center gap-2">
                          <StarRating rating={rating} />
                          {deals > 0 && <span className="text-xs text-gray-400">{deals} сделок</span>}
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{String(offer.title)}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-violet-600">{price}</span>
                      <Link
                        to={`/offer/${String(offer.id)}`}
                        className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors"
                      >
                        Купить
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {total > offset && (
              <div className="text-center mt-8">
                <button
                  onClick={() => loadOffers(offset, false)}
                  disabled={loadingMore}
                  className="px-8 py-3 border border-violet-600 text-violet-600 rounded-xl font-semibold hover:bg-violet-50 transition-colors disabled:opacity-50"
                >
                  {loadingMore ? "Загрузка..." : "Загрузить ещё"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
