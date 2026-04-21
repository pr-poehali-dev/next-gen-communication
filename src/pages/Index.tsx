import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Icon from "@/components/ui/icon"
import { gamesApi, offersApi } from "@/api"

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
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
                >
                  <Icon name="User" size={15} />
                  Личный кабинет
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-violet-600 border border-violet-600 rounded-lg hover:bg-violet-50 transition-colors"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function Index() {
  const [games, setGames] = useState<Record<string, unknown>[]>([])
  const [offers, setOffers] = useState<Record<string, unknown>[]>([])
  const [gamesLoading, setGamesLoading] = useState(true)
  const [offersLoading, setOffersLoading] = useState(true)

  useEffect(() => {
    gamesApi.list()
      .then((data: unknown) => {
        const d = data as Record<string, unknown>
        const list: Record<string, unknown>[] = Array.isArray(data) ? data : d?.games as Record<string, unknown>[] || d?.results as Record<string, unknown>[] || []
        setGames(list)
      })
      .catch(() => setGames([]))
      .finally(() => setGamesLoading(false))

    offersApi.list({ limit: 6 })
      .then((data: unknown) => {
        const d = data as Record<string, unknown>
        const list: Record<string, unknown>[] = Array.isArray(data) ? data : d?.offers as Record<string, unknown>[] || d?.results as Record<string, unknown>[] || []
        setOffers(list)
      })
      .catch(() => setOffers([]))
      .finally(() => setOffersLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Navbar />

      {/* HERO */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-full text-violet-700 text-sm font-medium mb-6">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              Биржа игровых товаров нового поколения
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
              <span className="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
                Биржа игровых ценностей
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              Покупай Robux, скины, валюту и услуги напрямую у игроков. Безопасно, быстро, выгодно.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <a
                href="#games"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl astrex-gradient text-white font-semibold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
              >
                <Icon name="GamepadIcon" size={18} />
                Смотреть все игры
              </a>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-base hover:border-violet-300 hover:text-violet-600 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="PlusCircle" size={18} />
                Разместить объявление
              </Link>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "500К+", label: "Сделок завершено", color: "bg-violet-50 text-violet-700 border-violet-100" },
                { value: "120К+", label: "Активных игроков", color: "bg-blue-50 text-blue-700 border-blue-100" },
                { value: "200+", label: "Игр на бирже", color: "bg-green-50 text-green-700 border-green-100" },
                { value: "5%", label: "Комиссия платформы", color: "bg-amber-50 text-amber-700 border-amber-100" },
              ].map((stat, i) => (
                <div key={i} className={`rounded-xl border p-4 ${stat.color}`}>
                  <div className="text-2xl md:text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR GAMES */}
      <section id="games" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Популярные игры</h2>
              <p className="text-gray-500 mt-1">Выбери игру и найди лучшие предложения</p>
            </div>
          </div>

          {gamesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Icon name="Gamepad2" size={48} className="mx-auto mb-4 opacity-30" />
              <p>Игры не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {games.map((game) => (
                <Link
                  key={String(game.slug || game.id)}
                  to={`/game/${String(game.slug)}`}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:border-violet-200 hover:shadow-md transition-all group"
                >
                  <div className="text-3xl mb-3">{String(game.emoji || "🎮")}</div>
                  <h3 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-1">
                    {String(game.name)}
                  </h3>
                  {game.description && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{String(game.description)}</p>
                  )}
                  <span className="text-xs text-violet-600 font-medium">
                    {game.offers_count != null ? `${String(game.offers_count)} предложений` : "Смотреть предложения"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FRESH OFFERS */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Свежие предложения</h2>
            <p className="text-gray-500 mt-1">Актуальные объявления от продавцов</p>
          </div>

          {offersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div>
                      <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
                      <div className="h-3 bg-gray-100 rounded w-16" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-16">
              <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">Пока нет предложений. Станьте первым продавцом!</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
              >
                <Icon name="PlusCircle" size={16} />
                Разместить объявление
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer) => {
                const sellerName = String(offer.seller_username || (offer.seller as Record<string, unknown>)?.username || offer.seller || "Продавец")
                const initial = sellerName[0]?.toUpperCase() || "?"
                const avatarColor = getAvatarColor(sellerName)
                const rating = Number(offer.seller_rating || (offer.seller as Record<string, unknown>)?.rating || 0)
                const price = offer.price != null ? `${Number(offer.price).toLocaleString("ru-RU")} ₽` : "—"
                return (
                  <div key={String(offer.id)} className="bg-gray-50 rounded-xl border border-gray-100 p-5 hover:border-violet-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                        {initial}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{sellerName}</p>
                        <StarRating rating={rating} />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{String(offer.title)}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-violet-600">{price}</span>
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
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Как это работает</h2>
            <p className="text-gray-500">Три простых шага до вашей покупки</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: "Search",
                title: "Выбери товар",
                desc: "Найди нужное в каталоге — игровую валюту, предметы или услугу. Тысячи предложений от реальных продавцов.",
              },
              {
                step: "2",
                icon: "CreditCard",
                title: "Оплати безопасно",
                desc: "Средства поступают на эскроу-счёт и замораживаются до подтверждения. Продавец не получит деньги без вашего ОК.",
              },
              {
                step: "3",
                icon: "PackageCheck",
                title: "Получи и подтверди",
                desc: "Продавец передаёт товар. Вы проверяете и подтверждаете — деньги моментально уходят продавцу.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={item.icon} size={28} className="text-violet-600" />
                </div>
                <div className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Шаг {item.step}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg astrex-gradient flex items-center justify-center">
                <Icon name="Zap" size={14} className="text-white" />
              </div>
              <span className="text-lg font-black text-violet-600 tracking-tight">ASTREX</span>
            </Link>
            <p className="text-sm text-gray-400">© 2025 ASTREX. Все права защищены.</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <a href="#" className="hover:text-violet-600 transition-colors">Правила</a>
              <a href="#" className="hover:text-violet-600 transition-colors">Поддержка</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}