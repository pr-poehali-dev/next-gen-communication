import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Icon from "@/components/ui/icon";

const GAMES = [
  { name: "Roblox", slug: "roblox", emoji: "🎮", color: "from-red-400 to-orange-400", items: "Robux, предметы, gamepass", count: "2 840 предложений" },
  { name: "Standoff 2", slug: "standoff-2", emoji: "🔫", color: "from-yellow-400 to-orange-500", items: "Золото, скины, стикеры", count: "1 230 предложений" },
  { name: "CS2", slug: "cs2", emoji: "🎯", color: "from-orange-400 to-red-500", items: "Скины, кейсы, Faceit", count: "3 560 предложений" },
  { name: "Mobile Legends", slug: "mobile-legends", emoji: "⚡", color: "from-blue-400 to-cyan-400", items: "Алмазы, Starlight, скины", count: "980 предложений" },
  { name: "Apex Legends", slug: "apex-legends", emoji: "🦊", color: "from-red-500 to-pink-500", items: "Монеты, скины, Drops", count: "640 предложений" },
  { name: "Minecraft", slug: "minecraft", emoji: "⛏️", color: "from-green-400 to-emerald-500", items: "Аккаунты, читы, моды", count: "420 предложений" },
  { name: "Fortnite", slug: "fortnite", emoji: "🌪️", color: "from-purple-400 to-violet-500", items: "V-Bucks, скины, аккаунты", count: "1 100 предложений" },
  { name: "Valorant", slug: "valorant", emoji: "💎", color: "from-rose-400 to-red-500", items: "VP, скины, аккаунты", count: "780 предложений" },
];

const MOCK_OFFERS = [
  { id: 1, title: "800 игровой валюты", price: "149 ₽", seller: "GameMaster", rating: 4.9, reviews: 234, description: "Быстрая доставка, онлайн 24/7. Опыт более 2 лет.", avatar: "G", avatarColor: "bg-violet-500" },
  { id: 2, title: "1 000 игровой валюты", price: "179 ₽", seller: "StarSeller", rating: 5.0, reviews: 892, description: "Топ продавец. Мгновенное выполнение заказа.", avatar: "S", avatarColor: "bg-blue-500" },
  { id: 3, title: "2 000 игровой валюты", price: "299 ₽", seller: "RobuxShop", rating: 5.0, reviews: 1203, description: "Более 1200 успешных сделок. Гарантия возврата.", avatar: "R", avatarColor: "bg-green-500" },
  { id: 4, title: "5 000 игровой валюты", price: "649 ₽", seller: "ProTrader", rating: 4.8, reviews: 445, description: "Оптовые заказы. Скидки при повторном обращении.", avatar: "P", avatarColor: "bg-orange-500" },
  { id: 5, title: "Редкий предмет #1", price: "1 200 ₽", seller: "SkinKing", rating: 4.7, reviews: 89, description: "Уникальный предмет. Быстрая передача в игре.", avatar: "S", avatarColor: "bg-red-500" },
  { id: 6, title: "Редкий предмет #2", price: "890 ₽", seller: "ItemPro", rating: 4.9, reviews: 320, description: "Проверенный продавец. Все предметы в наличии.", avatar: "I", avatarColor: "bg-pink-500" },
  { id: 7, title: "Услуга прокачки аккаунта", price: "500 ₽", seller: "LevelUp99", rating: 4.6, reviews: 67, description: "Прокачка без риска. Работаю вручную, без ботов.", avatar: "L", avatarColor: "bg-teal-500" },
  { id: 8, title: "Аккаунт с предметами", price: "3 500 ₽", seller: "AccountShop", rating: 4.8, reviews: 178, description: "Аккаунт с историей. Редкие предметы в наборе.", avatar: "A", avatarColor: "bg-indigo-500" },
  { id: 9, title: "Набор стартера", price: "299 ₽", seller: "StarterPack", rating: 4.9, reviews: 512, description: "Идеально для новичков. Всё необходимое с нуля.", avatar: "S", avatarColor: "bg-yellow-500" },
  { id: 10, title: "Премиум подписка", price: "450 ₽", seller: "PremiumGuy", rating: 5.0, reviews: 234, description: "Официальная активация на ваш аккаунт.", avatar: "P", avatarColor: "bg-cyan-500" },
  { id: 11, title: "Сезонный пропуск", price: "750 ₽", seller: "SeasonPass", rating: 4.7, reviews: 143, description: "Полный сезонный доступ. Все награды сезона.", avatar: "S", avatarColor: "bg-emerald-500" },
  { id: 12, title: "VIP статус на месяц", price: "1 100 ₽", seller: "VIPseller", rating: 4.8, reviews: 98, description: "Месяц VIP-преимуществ. Активация за 5 минут.", avatar: "V", avatarColor: "bg-purple-600" },
];

const TABS = ["Валюта", "Предметы", "Услуги", "Аккаунты"];
const SORT_OPTIONS = ["По цене", "По рейтингу", "По отзывам"];

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [sortBy, setSortBy] = useState(0);
  const [search, setSearch] = useState("");

  const game = GAMES.find((g) => g.slug === slug) || GAMES[0];

  const filtered = MOCK_OFFERS.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.seller.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
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
                  placeholder="Поиск товаров, игр..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-violet-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
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
            </div>
          </div>
        </div>
      </nav>

      {/* GAME BANNER */}
      <div className={`bg-gradient-to-r ${game.color} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-white/80 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Главная</Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-white font-medium">{game.name}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
              {game.emoji}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-1">{game.name}</h1>
              <p className="text-white/80 text-sm">{game.items}</p>
              <p className="text-white font-semibold mt-1">{game.count}</p>
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">Сортировка:</span>
              <div className="flex gap-2">
                {SORT_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSortBy(i)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      sortBy === i
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative sm:ml-auto w-full sm:w-64">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск в каталоге..."
                className="w-full pl-8 pr-4 py-2 bg-gray-100 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-violet-400 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* OFFERS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl border border-gray-100 p-5 card-hover shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${offer.avatarColor}`}>
                  {offer.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{offer.seller}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Icon name="Star" size={11} className="text-amber-400 fill-amber-400" />
                    <span className="font-medium text-gray-700">{offer.rating}</span>
                    <span>({offer.reviews})</span>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-sm mb-2">{offer.title}</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">{offer.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-violet-600">{offer.price}</span>
                <Link
                  to={`/offer/${offer.id}`}
                  className="px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Купить
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Ничего не найдено</h3>
            <p className="text-gray-400 text-sm">Попробуйте изменить поисковый запрос</p>
          </div>
        )}
      </div>
    </div>
  );
}
