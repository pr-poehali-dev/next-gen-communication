import { LiquidMetalBackground } from "@/components/LiquidMetalBackground"
import { useRef, useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

const GAMES = [
  { name: "Roblox", icon: "Gamepad2", items: ["Robux", "Gamepass", "Предметы"] },
  { name: "Standoff 2", icon: "Sword", items: ["Золото", "Скины", "Стикеры"] },
  { name: "CS2", icon: "Target", items: ["Скины", "Faceit", "Кейсы"] },
  { name: "Mobile Legends", icon: "Zap", items: ["Алмазы", "Starlight", "Скины"] },
  { name: "Apex Legends", icon: "Shield", items: ["Монеты", "Drops", "Скины"] },
  { name: "App Store", icon: "Smartphone", items: ["Подарочные карты", "Покупки"] },
]

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Выбери товар",
    desc: "Найди нужную игровую валюту, предмет или услугу в каталоге. Тысячи предложений от реальных игроков.",
  },
  {
    step: "02",
    title: "Оплати безопасно",
    desc: "Средства поступают на эскроу-счёт. Продавец не получит деньги, пока ты не подтвердишь сделку.",
  },
  {
    step: "03",
    title: "Получи товар",
    desc: "Продавец передаёт товар. Ты проверяешь и подтверждаешь. Деньги моментально уходят продавцу.",
  },
]

const FEATURES = [
  { icon: "ShieldCheck", title: "Защита сделок", desc: "Эскроу-система защищает покупателя и продавца на каждом шаге." },
  { icon: "Zap", title: "Мгновенно", desc: "Большинство сделок завершается за несколько минут." },
  { icon: "Users", title: "P2P торговля", desc: "Напрямую между игроками — без посредников и наценок." },
  { icon: "Star", title: "Рейтинг", desc: "Проверенные продавцы с историей и отзывами реальных покупателей." },
  { icon: "Globe", title: "Любая игра", desc: "Roblox, CS2, Standoff, Mobile Legends, Apex и ещё сотни игр." },
  { icon: "HeadphonesIcon", title: "Поддержка 24/7", desc: "Команда всегда на связи для решения любых спорных ситуаций." },
]

const STATS = [
  { value: "500К+", label: "Сделок завершено" },
  { value: "120К+", label: "Активных игроков" },
  { value: "98%", label: "Довольных покупателей" },
  { value: "200+", label: "Игр на бирже" },
]

export default function Index() {
  const [activeSection, setActiveSection] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const sections = ["home", "how", "games", "features", "contact"]
  const sectionLabels = ["Главная", "Как работает", "Игры", "Преимущества", "Контакты"]

  const scrollTo = (idx: number) => {
    containerRef.current?.scrollTo({ left: idx * window.innerWidth, behavior: "smooth" })
    setMenuOpen(false)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth)
      setActiveSection(idx)
    }
    el.addEventListener("scroll", onScroll)
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const idx = Math.round(el.scrollLeft / el.offsetWidth)
      const next = e.deltaY > 0 ? Math.min(idx + 1, sections.length - 1) : Math.max(idx - 1, 0)
      el.scrollTo({ left: next * window.innerWidth, behavior: "smooth" })
    }
    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [sections.length])

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#08010f]">
      <LiquidMetalBackground />
      <div className="absolute inset-0 bg-black/60 z-[1]" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3 rounded-2xl border border-purple-500/20 bg-black/40 backdrop-blur-xl">
          <button onClick={() => scrollTo(0)} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center">
              <Icon name="Star" size={16} className="text-white fill-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-wider">STARVELL</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {sectionLabels.map((label, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === i ? "text-purple-300" : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2">
              Войти
            </button>
            <button className="text-sm font-semibold px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/25">
              Регистрация
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-2 mx-auto max-w-7xl rounded-2xl border border-purple-500/20 bg-black/90 backdrop-blur-xl p-4">
            {sectionLabels.map((label, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white text-sm"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* SCROLL CONTAINER */}
      <div
        ref={containerRef}
        className="relative z-10 flex h-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >

        {/* SECTION 1 — HERO */}
        <section className="min-w-full snap-start flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Биржа игровых товаров и услуг
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tight">
              Покупай и продавай{" "}
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                игровые ценности
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              На бирже STARVELL вы можете купить игровую валюту, предметы, услуги и другие игровые ценности напрямую у других игроков, а также продать свои.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold text-base hover:from-purple-500 hover:to-violet-500 transition-all shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2">
                <Icon name="ShoppingBag" size={18} />
                Перейти на биржу
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white font-semibold text-base hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Icon name="TrendingUp" size={18} />
                Продать товар
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm p-4">
                  <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-gray-400 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2 — HOW IT WORKS */}
        <section className="min-w-full snap-start flex flex-col items-center justify-center px-4 py-20">
          <div className="max-w-5xl mx-auto w-full">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-4">
                <Icon name="HelpCircle" size={14} />
                Как это работает
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4">Три простых шага</h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">Безопасная P2P торговля — деньги в эскроу до завершения сделки</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HOW_IT_WORKS.map((item, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 overflow-hidden group hover:border-purple-500/40 transition-all"
                >
                  <div className="absolute top-0 right-0 text-[120px] font-black text-white/3 leading-none select-none">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-violet-600/30 border border-purple-500/30 flex items-center justify-center mb-6">
                    <span className="text-purple-300 text-lg font-black">{item.step}</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — GAMES */}
        <section className="min-w-full snap-start flex flex-col items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-4">
                <Icon name="Gamepad2" size={14} />
                Популярные игры
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4">200+ игр на бирже</h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">Валюта, предметы и услуги для всех популярных игр</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {GAMES.map((game, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/30 to-violet-600/30 border border-purple-500/20 flex items-center justify-center">
                      <Icon name={game.icon as "Gamepad2"} size={18} className="text-purple-300" />
                    </div>
                    <span className="text-white font-bold">{game.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {game.items.map((item, j) => (
                      <span key={j} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
                Смотреть все игры
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 4 — FEATURES */}
        <section className="min-w-full snap-start flex flex-col items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-4">
                <Icon name="Sparkles" size={14} />
                Преимущества
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4">Почему STARVELL</h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">Биржа, которой доверяют тысячи игроков каждый день</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:from-purple-600/40 group-hover:to-violet-600/40 transition-all">
                    <Icon name={f.icon as "Star"} size={20} className="text-purple-300" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 — CONTACT */}
        <section className="min-w-full snap-start flex flex-col items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-4">
                <Icon name="Mail" size={14} />
                Поддержка
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4">Напишите нам</h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">Вопросы по сделкам или предложения? Отвечаем быстро.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Контактная инфо */}
              <div className="space-y-4">
                {[
                  { icon: "Mail", label: "Email", value: "support@starvell.com" },
                  { icon: "MessageCircle", label: "Telegram", value: "@starvell_support" },
                  { icon: "Clock", label: "Время работы", value: "24/7 без выходных" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600/30 to-violet-600/30 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon name={c.icon as "Mail"} size={18} className="text-purple-300" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-0.5">{c.label}</div>
                      <div className="text-white font-semibold text-sm">{c.value}</div>
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-600/10 to-violet-600/10 p-6">
                  <div className="text-purple-300 font-bold text-lg mb-2">STARVELL</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Биржа игровых товаров и услуг. Покупай и продавай напрямую у других игроков безопасно и быстро.
                  </p>
                </div>
              </div>

              {/* Форма */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Имя</label>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 text-sm transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 text-sm transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Сообщение</label>
                  <textarea
                    rows={4}
                    placeholder="Опишите ваш вопрос..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 text-sm transition-colors resize-none"
                  />
                </div>
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/20 text-sm">
                  Отправить сообщение
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* DOT NAVIGATION */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl">
        {sections.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all ${
              activeSection === i
                ? "w-6 h-2 bg-purple-400"
                : "w-2 h-2 bg-gray-600 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </main>
  )
}
