import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Icon from "@/components/ui/icon"
import { dealsApi } from "@/api"

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

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  pending_payment: { label: "Ожидает оплаты", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: "Clock" },
  paid: { label: "Оплачено, ждём продавца", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "CreditCard" },
  completed: { label: "Завершено", color: "bg-green-100 text-green-700 border-green-200", icon: "CheckCircle2" },
  disputed: { label: "Спор", color: "bg-red-100 text-red-700 border-red-200", icon: "AlertTriangle" },
}

export default function DealPage() {
  const { id } = useParams<{ id: string }>()
  const [deal, setDeal] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState("")
  const [disputeReason, setDisputeReason] = useState("")
  const [showDisputeForm, setShowDisputeForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  function loadDeal() {
    if (!id) return
    setLoading(true)
    dealsApi.get(Number(id))
      .then((data: unknown) => {
        const d = data as Record<string, unknown>
        if (d?.error || d?.detail) {
          setError(String(d.error || d.detail))
        } else {
          setDeal(d)
        }
      })
      .catch(() => setError("Не удалось загрузить сделку"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadDeal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleConfirm() {
    setActionError("")
    setActionLoading(true)
    try {
      const res = await dealsApi.confirm(Number(id)) as Record<string, unknown>
      if (res?.error || res?.detail) {
        setActionError(String(res.error || res.detail))
      } else {
        loadDeal()
      }
    } catch {
      setActionError("Ошибка при подтверждении. Попробуйте ещё раз.")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDispute() {
    if (!disputeReason.trim()) {
      setActionError("Укажите причину спора")
      return
    }
    setActionError("")
    setActionLoading(true)
    try {
      const res = await dealsApi.dispute(Number(id), disputeReason) as Record<string, unknown>
      if (res?.error || res?.detail) {
        setActionError(String(res.error || res.detail))
      } else {
        setShowDisputeForm(false)
        setDisputeReason("")
        loadDeal()
      }
    } catch {
      setActionError("Ошибка при открытии спора. Попробуйте ещё раз.")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReview() {
    setActionError("")
    setActionLoading(true)
    try {
      const res = await dealsApi.review(Number(id), reviewRating, reviewComment) as Record<string, unknown>
      if (res?.error || res?.detail) {
        setActionError(String(res.error || res.detail))
      } else {
        setReviewSubmitted(true)
        loadDeal()
      }
    } catch {
      setActionError("Ошибка при отправке отзыва.")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-64" />
          <div className="h-32 bg-white rounded-xl" />
          <div className="h-48 bg-white rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-red-400" />
          <p className="text-red-500 font-semibold mb-4">{error || "Сделка не найдена"}</p>
          <Link to="/" className="text-violet-600 hover:underline">Вернуться на главную</Link>
        </div>
      </div>
    )
  }

  const status = String(deal.status || "pending_payment")
  const statusCfg = STATUS_CONFIG[status] || { label: status, color: "bg-gray-100 text-gray-700 border-gray-200", icon: "Circle" }
  const isBuyer = Boolean(deal.is_buyer)
  const hasReview = Boolean(deal.has_review)
  const offerId = deal.offer_id || (deal.offer as Record<string, unknown>)?.id
  const offerTitle = String(deal.offer_title || (deal.offer as Record<string, unknown>)?.title || "Товар")
  const gameName = String(deal.game_name || (deal.offer as Record<string, unknown>)?.game_name || (deal.game as Record<string, unknown>)?.name || "")
  const gameSlug = String(deal.game_slug || (deal.offer as Record<string, unknown>)?.game_slug || "")
  const sellerName = String(deal.seller_username || (deal.seller as Record<string, unknown>)?.username || "Продавец")
  const buyerName = String(deal.buyer_username || (deal.buyer as Record<string, unknown>)?.username || "Покупатель")
  const price = Number(deal.price || 0)
  const quantity = Number(deal.quantity || 1)
  const total = Number(deal.total || price * quantity)
  const commission = Number(deal.commission || 0)
  const sellerAmount = Number(deal.seller_amount || total - commission)
  const instructions = String(deal.instructions || "")
  const createdAt = String(deal.created_at || deal.date || "")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-violet-600 transition-colors">Главная</Link>
          <Icon name="ChevronRight" size={14} />
          <Link to="/profile" className="hover:text-violet-600 transition-colors">Мои сделки</Link>
          <Icon name="ChevronRight" size={14} />
          <span className="text-gray-900 font-medium">Сделка #{id}</span>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-4 mb-6">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${statusCfg.color}`}>
            <Icon name={statusCfg.icon} size={16} />
            {statusCfg.label}
          </span>
          {createdAt && (
            <span className="text-sm text-gray-400">{createdAt}</span>
          )}
        </div>

        <div className="space-y-6">
          {/* Deal details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="ShoppingBag" size={18} className="text-violet-600" />
              Детали сделки
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Товар</p>
                <p className="font-semibold text-gray-900">{offerTitle}</p>
                {offerId && (
                  <Link to={`/offer/${String(offerId)}`} className="text-xs text-violet-600 hover:underline">Смотреть объявление</Link>
                )}
              </div>
              {gameName && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Игра</p>
                  {gameSlug ? (
                    <Link to={`/game/${gameSlug}`} className="font-semibold text-violet-600 hover:underline">{gameName}</Link>
                  ) : (
                    <p className="font-semibold text-gray-900">{gameName}</p>
                  )}
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Продавец</p>
                <p className="font-semibold text-gray-900">{sellerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Покупатель</p>
                <p className="font-semibold text-gray-900">{buyerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Количество</p>
                <p className="font-semibold text-gray-900">{quantity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Цена за единицу</p>
                <p className="font-semibold text-gray-900">{price.toLocaleString("ru-RU")} ₽</p>
              </div>
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Итого</span>
                <span className="font-bold text-gray-900">{total.toLocaleString("ru-RU")} ₽</span>
              </div>
              {commission > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Комиссия платформы (5%)</span>
                  <span className="text-gray-700">{commission.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
              {sellerAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Продавец получит</span>
                  <span className="font-bold text-green-600">{sellerAmount.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          {instructions && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Icon name="BookOpen" size={18} className="text-violet-600" />
                Инструкции продавца
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{instructions}</p>
            </div>
          )}

          {/* Actions for buyer when paid */}
          {isBuyer && status === "paid" && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="CheckSquare" size={18} className="text-violet-600" />
                Действия
              </h2>

              {actionError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-600">
                  <Icon name="AlertCircle" size={14} />
                  {actionError}
                </div>
              )}

              {!showDisputeForm ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleConfirm}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Icon name="CheckCircle2" size={18} />
                    Подтвердить получение
                  </button>
                  <button
                    onClick={() => setShowDisputeForm(true)}
                    className="flex-1 py-3 border border-red-400 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="AlertTriangle" size={18} />
                    Открыть спор
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Опишите проблему:</p>
                  <textarea
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Укажите причину открытия спора..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleDispute}
                      disabled={actionLoading || !disputeReason.trim()}
                      className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {actionLoading && <Icon name="Loader2" size={15} className="animate-spin" />}
                      Открыть спор
                    </button>
                    <button
                      onClick={() => { setShowDisputeForm(false); setDisputeReason(""); setActionError("") }}
                      className="px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Review form if completed and no review yet */}
          {isBuyer && status === "completed" && !hasReview && !reviewSubmitted && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="Star" size={18} className="text-violet-600" />
                Оставить отзыв
              </h2>

              {actionError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-600">
                  <Icon name="AlertCircle" size={14} />
                  {actionError}
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Оценка:</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReviewRating(i + 1)}
                      className="focus:outline-none"
                    >
                      <Icon
                        name="Star"
                        size={28}
                        className={i < reviewRating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{reviewRating} из 5</span>
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Расскажите о вашем опыте покупки..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-colors resize-none mb-3"
              />

              <button
                onClick={handleReview}
                disabled={actionLoading}
                className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {actionLoading && <Icon name="Loader2" size={15} className="animate-spin" />}
                Оставить отзыв
              </button>
            </div>
          )}

          {reviewSubmitted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-700">
              <Icon name="CheckCircle2" size={20} />
              <p className="font-semibold">Отзыв успешно отправлен!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
