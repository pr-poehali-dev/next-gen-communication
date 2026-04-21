import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Icon from "@/components/ui/icon"
import { offersApi, dealsApi, hasSession } from "@/api"

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
          size={14}
          className={i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  )
}

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

export default function OfferPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [offer, setOffer] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState("")

  useEffect(() => {
    if (!id) return
    setLoading(true)
    offersApi.get(Number(id))
      .then((data: unknown) => {
        const d = data as Record<string, unknown>
        if (d?.error || d?.detail) {
          setError(String(d.error || d.detail))
        } else {
          setOffer(d)
          const minQty = Number(d.min_quantity || 1)
          setQuantity(minQty)
        }
      })
      .catch(() => setError("Не удалось загрузить предложение"))
      .finally(() => setLoading(false))
  }, [id])

  const minQty = Number(offer?.min_quantity || 1)
  const maxQty = Number(offer?.max_quantity || 999)
  const price = Number(offer?.price || 0)
  const total = price * quantity

  function changeQty(delta: number) {
    setQuantity((q) => Math.min(maxQty, Math.max(minQty, q + delta)))
  }

  async function handleBuy() {
    if (!hasSession()) {
      navigate("/login")
      return
    }
    setBuyError("")
    setBuying(true)
    try {
      const res = await dealsApi.create({ offer_id: Number(id), quantity }) as Record<string, unknown>
      if (res?.error || res?.detail) {
        setBuyError(String(res.error || res.detail))
      } else {
        const dealId = res?.id || res?.deal_id || res?.deal?.id
        navigate(`/deals/${dealId}`)
      }
    } catch {
      setBuyError("Не удалось создать сделку. Попробуйте ещё раз.")
    } finally {
      setBuying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-xl h-40" />
                <div className="bg-white rounded-xl h-32" />
              </div>
              <div className="bg-white rounded-xl h-64" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-red-400" />
          <p className="text-red-500 font-semibold mb-4">{error || "Предложение не найдено"}</p>
          <Link to="/" className="text-violet-600 hover:underline">Вернуться на главную</Link>
        </div>
      </div>
    )
  }

  const sellerName = String(offer.seller_username || (offer.seller as Record<string, unknown>)?.username || offer.seller || "Продавец")
  const initial = sellerName[0]?.toUpperCase() || "?"
  const avatarColor = getAvatarColor(sellerName)
  const rating = Number(offer.seller_rating || (offer.seller as Record<string, unknown>)?.rating || 0)
  const reviews = Number(offer.seller_reviews || (offer.seller as Record<string, unknown>)?.reviews_count || 0)
  const deals = Number(offer.seller_deals || (offer.seller as Record<string, unknown>)?.deals_count || 0)
  const online = Boolean(offer.seller_online || (offer.seller as Record<string, unknown>)?.is_online)
  const gameName = String(offer.game_name || (offer.game as Record<string, unknown>)?.name || offer.game || "")
  const gameSlug = String(offer.game_slug || (offer.game as Record<string, unknown>)?.slug || "")
  const category = String(offer.category || "")
  const reviewsList = Array.isArray(offer.reviews) ? offer.reviews as Record<string, unknown>[] : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-violet-600 transition-colors">Главная</Link>
          <Icon name="ChevronRight" size={14} />
          {gameSlug ? (
            <Link to={`/game/${gameSlug}`} className="hover:text-violet-600 transition-colors">{gameName}</Link>
          ) : (
            <span>{gameName}</span>
          )}
          <Icon name="ChevronRight" size={14} />
          <span className="text-gray-900 font-medium line-clamp-1">{String(offer.title)}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              {category && (
                <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded mb-3 inline-block capitalize">{category}</span>
              )}
              {gameName && !category && (
                <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded mb-3 inline-block">{gameName}</span>
              )}
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">{String(offer.title)}</h1>
              {offer.description && (
                <p className="text-gray-600 leading-relaxed">{String(offer.description)}</p>
              )}
            </div>

            {/* Instructions */}
            {offer.instructions && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="BookOpen" size={18} className="text-violet-600" />
                  Инструкция продавца
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">{String(offer.instructions)}</p>
              </div>
            )}

            {/* Seller */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="User" size={18} className="text-violet-600" />
                Продавец
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full ${avatarColor} flex items-center justify-center text-white font-black text-xl`}>
                    {initial}
                  </div>
                  {online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{sellerName}</p>
                  <p className="text-xs text-gray-400 mb-1">{online ? "Онлайн" : "Не в сети"}</p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={rating} />
                    <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
                    {reviews > 0 && <span className="text-xs text-gray-400">({reviews} отзывов)</span>}
                    {deals > 0 && <span className="text-xs text-gray-400">{deals} сделок</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {reviewsList.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="MessageSquare" size={18} className="text-violet-600" />
                  Отзывы покупателей
                </h2>
                <div className="space-y-4">
                  {reviewsList.map((review, i) => {
                    const reviewUser = String(review.username || review.user || "Пользователь")
                    const reviewRating = Number(review.rating || 0)
                    const reviewText = String(review.comment || review.text || "")
                    const reviewDate = String(review.created_at || review.date || "")
                    return (
                      <div key={i} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full ${getAvatarColor(reviewUser)} flex items-center justify-center text-white text-sm font-bold`}>
                              {reviewUser[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900 text-sm">{reviewUser}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <StarRating rating={reviewRating} />
                            {reviewDate && <span className="text-xs text-gray-400 ml-1">{reviewDate}</span>}
                          </div>
                        </div>
                        {reviewText && <p className="text-sm text-gray-600 leading-relaxed">{reviewText}</p>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Buy panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <div className="text-3xl font-black text-violet-600 mb-1">
                {price.toLocaleString("ru-RU")} ₽
              </div>
              <p className="text-xs text-gray-400 mb-4">за единицу товара</p>

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Количество</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => changeQty(-1)}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Icon name="Minus" size={16} />
                  </button>
                  <span className="text-lg font-bold text-gray-900 min-w-[2rem] text-center">{quantity}</span>
                  <button
                    onClick={() => changeQty(1)}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Icon name="Plus" size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Мин: {minQty} / Макс: {maxQty}</p>
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Итого</span>
                  <span className="font-black text-gray-900 text-lg">{total.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>

              {buyError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600 mb-3 flex items-center gap-2">
                  <Icon name="AlertCircle" size={14} />
                  {buyError}
                </div>
              )}

              <button
                onClick={handleBuy}
                disabled={buying}
                className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {buying ? "Создание сделки..." : "Купить сейчас"}
              </button>

              {/* Security block */}
              <div className="mt-4 bg-green-50 rounded-xl p-4 flex items-start gap-3">
                <Icon name="ShieldCheck" size={20} className="text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Защита сделки ASTREX</p>
                  <p className="text-xs text-green-700 mt-0.5">Деньги в эскроу до вашего подтверждения получения товара</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
