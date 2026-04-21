import { Link } from "react-router-dom";
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

const OFFERS = [
  { id: 1, game: "Roblox", title: "800 Robux", price: "149 ₽", seller: "GameMaster", rating: 4.9, reviews: 234, badge: "Быстро", slug: "roblox" },
  { id: 2, game: "Standoff 2", title: "1000 золота", price: "89 ₽", seller: "StarSeller", rating: 5.0, reviews: 892, badge: "Топ", slug: "standoff-2" },
  { id: 3, game: "CS2", title: "Скин AK-47 | Redline", price: "2 400 ₽", seller: "SkinTrader", rating: 4.8, reviews: 156, badge: null, slug: "cs2" },
  { id: 4, game: "Mobile Legends", title: "500 алмазов", price: "320 ₽", seller: "MLBBpro", rating: 4.9, reviews: 445, badge: "Популярно", slug: "mobile-legends" },
  { id: 5, game: "Apex Legends", title: "1000 монет Apex", price: "890 ₽", seller: "ApexKing", rating: 4.7, reviews: 89, badge: null, slug: "apex-legends" },
  { id: 6, game: "Roblox", title: "2000 Robux", price: "299 ₽", seller: "RobuxShop", rating: 5.0, reviews: 1203, badge: "Хит", slug: "roblox" },
];

const HOW_IT_WORKS = [
  { step: "1", icon: "Search", title: "Выбери товар", desc: "Найди нужную игровую валюту, предмет или услугу. Тысячи предложений от реальных игроков." },
  { step: "2", icon: "CreditCard", title: "Оплати безопасно", desc: "Средства поступают на эскроу-счёт. Продавец не получит деньги, пока ты не подтвердишь сделку." },
  { step: "3", icon: "PackageCheck", title: "Получи товар", desc: "Продавец передаёт товар. Ты проверяешь и подтверждаешь — деньги моментально уходят продавцу." },
];

const FEATURES = [
  { icon: "ShieldCheck", title: "Защита покупателя", desc: "Эскроу-система гарантирует безопасность каждой сделки. Ваши деньги под защитой.", color: "bg-violet-100 text-violet-600" },
  { icon: "Zap", title: "Быстрые сделки", desc: "Большинство сделок завершается за несколько минут. Продавцы онлайн 24/7.", color: "bg-yellow-100 text-yellow-600" },
  { icon: "Users", title: "P2P торговля", desc: "Напрямую между игроками — без посредников и скрытых наценок.", color: "bg-blue-100 text-blue-600" },
  { icon: "Headphones", title: "Поддержка 24/7", desc: "Команда всегда на связи для решения любых спорных ситуаций.", color: "bg-green-100 text-green-600" },
];

const BADGE_COLORS: Record<string, string> = {
  "Топ": "bg-amber-100 text-amber-700",
  "Быстро": "bg-green-100 text-green-700",
  "Хит": "bg-rose-100 text-rose-700",
  "Популярно": "bg-blue-100 text-blue-700",
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
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

      {/* HERO */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-full text-violet-700 text-sm font-medium mb-6">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              Биржа игровых товаров нового поколения
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
              Покупай и продавай{" "}
              <span className="astrex-gradient-text">игровые ценности</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              На бирже ASTREX вы можете купить игровую валюту, предметы и услуги напрямую у других игроков. Быстро, безопасно, выгодно.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link
                to="/game/roblox"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl astrex-gradient text-white font-semibold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
              >
                <Icon name="ShoppingBag" size={18} />
                Перейти на биржу
              </Link>
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-base hover:border-violet-300 hover:text-violet-600 transition-colors flex items-center justify-center gap-2">
                <Icon name="TrendingUp" size={18} />
                Продать товар
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "500К+", label: "Сделок завершено", color: "bg-violet-50 text-violet-700 border-violet-100" },
                { value: "120К+", label: "Активных игроков", color: "bg-blue-50 text-blue-700 border-blue-100" },
                { value: "200+", label: "Игр на бирже", color: "bg-green-50 text-green-700 border-green-100" },
                { value: "98%", label: "Довольных покупателей", color: "bg-amber-50 text-amber-700 border-amber-100" },
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Популярные игры</h2>
              <p className="text-gray-500 mt-1">Выбери игру и найди лучшие предложения</p>
            </div>
            <Link to="/game/roblox" className="text-violet-600 text-sm font-medium hover:text-violet-700 flex items-center gap-1">
              Все игры <Icon name="ChevronRight" size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {GAMES.map((game) => (
              <Link
                key={game.slug}
                to={`/game/${game.slug}`}
                className="bg-white rounded-xl border border-gray-100 p-5 card-hover cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-2xl mb-3`}>
                  {game.emoji}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-violet-600 transition-colors">{game.name}</h3>
                <p className="text-xs text-gray-400 mb-2 leading-relaxed">{game.items}</p>
                <span className="text-xs text-violet-600 font-medium">{game.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR OFFERS */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Популярные предложения</h2>
              <p className="text-gray-500 mt-1">Лучшие цены от проверенных продавцов</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OFFERS.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl border border-gray-100 p-5 card-hover shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full astrex-gradient flex items-center justify-center text-white font-bold text-sm">
                      {offer.seller[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{offer.seller}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Icon name="Star" size={11} className="text-amber-400 fill-amber-400" />
                        <span className="font-medium text-gray-700">{offer.rating}</span>
                        <span>({offer.reviews} отзывов)</span>
                      </div>
                    </div>
                  </div>
                  {offer.badge && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${BADGE_COLORS[offer.badge] || "bg-gray-100 text-gray-600"}`}>
                      {offer.badge}
                    </span>
                  )}
                </div>

                <div className="mb-1">
                  <span className="text-xs text-violet-600 font-medium bg-violet-50 px-2 py-0.5 rounded">{offer.game}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 mt-2">{offer.title}</h3>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-violet-600">{offer.price}</span>
                  <Link
                    to={`/offer/${offer.id}`}
                    className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Купить
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Как это работает</h2>
            <p className="text-gray-500">Три простых шага до получения товара</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="text-center relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-violet-200 to-transparent -translate-x-8 z-0" />
                )}
                <div className="relative z-10 w-20 h-20 rounded-2xl astrex-gradient mx-auto mb-5 flex items-center justify-center shadow-lg shadow-violet-200">
                  <Icon name={step.icon} size={32} className="text-white" />
                </div>
                <div className="inline-block px-2 py-0.5 rounded text-xs font-bold text-violet-600 bg-violet-50 mb-2">ШАГ {step.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Почему выбирают ASTREX</h2>
            <p className="text-gray-500">Надёжная платформа для игровой торговли</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100 card-hover">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <Icon name={feature.icon} size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg astrex-gradient flex items-center justify-center">
                  <Icon name="Zap" size={16} className="text-white" />
                </div>
                <span className="text-xl font-black text-white tracking-tight">ASTREX</span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed">
                Биржа игровых товаров нового поколения. Безопасные P2P сделки.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Платформа</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Каталог</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Стать продавцом</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Как работает</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Комиссии</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Игры</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/game/roblox" className="hover:text-white transition-colors">Roblox</Link></li>
                <li><Link to="/game/cs2" className="hover:text-white transition-colors">CS2</Link></li>
                <li><Link to="/game/standoff-2" className="hover:text-white transition-colors">Standoff 2</Link></li>
                <li><Link to="/game/valorant" className="hover:text-white transition-colors">Valorant</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Поддержка</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Помощь</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Правила</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Конфиденциальность</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">© 2024 ASTREX. Все права защищены.</p>
            <p className="text-xs text-gray-600">Безопасная P2P торговля игровыми ценностями</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
