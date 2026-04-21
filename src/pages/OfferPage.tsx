import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Icon from "@/components/ui/icon";

const MOCK_OFFERS: Record<
  string,
  {
    id: number;
    title: string;
    game: string;
    price: number;
    seller: string;
    sellerRating: number;
    sellerReviews: number;
    sellerOnline: boolean;
    sellerAvatar: string;
    sellerAvatarColor: string;
    sellerJoined: string;
    description: string;
    conditions: string[];
    instructions: string;
  }
> = {
  "1": {
    id: 1,
    title: "800 Robux",
    game: "Roblox",
    price: 149,
    seller: "GameMaster",
    sellerRating: 4.9,
    sellerReviews: 234,
    sellerOnline: true,
    sellerAvatar: "G",
    sellerAvatarColor: "bg-violet-500",
    sellerJoined: "Июнь 2022",
    description:
      "Продаю 800 Robux по низкой цене. Быстрая доставка — обычно занимает не более 5 минут после оплаты. Работаю через официальный способ передачи внутри игры. Более 2 лет опыта на платформе.",
    conditions: [
      "Аккаунт Roblox должен быть не моложе 7 дней",
      "Минимальный возраст аккаунта — нет ограничений",
      "Не принимаю отменённые заказы без причины",
      "Передача только через официальный метод игры",
    ],
    instructions:
      "После оплаты напишите мне ваш ник в Roblox в чате сделки. Я добавлю вас в игру и передам Robux в течение 5 минут. Пожалуйста, будьте онлайн в игре в момент передачи.",
  },
  "2": {
    id: 2,
    title: "1000 золота",
    game: "Standoff 2",
    price: 89,
    seller: "StarSeller",
    sellerRating: 5.0,
    sellerReviews: 892,
    sellerOnline: true,
    sellerAvatar: "S",
    sellerAvatarColor: "bg-blue-500",
    sellerJoined: "Март 2021",
    description:
      "1000 золота Standoff 2 по лучшей цене. Топ продавец с рейтингом 5.0. Мгновенное выполнение заказа без ожидания. Более 890 довольных покупателей.",
    conditions: [
      "Передача через официальный обмен в игре",
      "Аккаунт должен быть активен",
      "Без возврата после передачи золота",
    ],
    instructions:
      "Напишите ваш игровой ник после оплаты. Встречаемся в игре в любом матче, передача займёт менее 3 минут.",
  },
};

const DEFAULT_OFFER = MOCK_OFFERS["1"];

const REVIEWS = [
  { id: 1, user: "Alexey_G", rating: 5, text: "Отличный продавец! Передал всё быстро, без проблем. Рекомендую!", date: "15 апреля 2024" },
  { id: 2, user: "MikePlayer", rating: 5, text: "Уже третий раз покупаю у этого продавца. Всегда быстро и честно.", date: "10 апреля 2024" },
  { id: 3, user: "Gamer2024", rating: 4, text: "Хороший продавец, передал в течение 10 минут. Немного дольше обычного, но всё окей.", date: "5 апреля 2024" },
];

export default function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  const offer = (id && MOCK_OFFERS[id]) || DEFAULT_OFFER;
  const total = offer.price * quantity;

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
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-violet-600 border border-violet-600 rounded-lg hover:bg-violet-50 transition-colors">
                Войти
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-violet-600 transition-colors">Главная</Link>
          <Icon name="ChevronRight" size={14} />
          <Link to={`/game/roblox`} className="hover:text-violet-600 transition-colors">{offer.game}</Link>
          <Icon name="ChevronRight" size={14} />
          <span className="text-gray-900 font-medium">{offer.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded mb-3 inline-block">{offer.game}</span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">{offer.title}</h1>
              <p className="text-gray-600 leading-relaxed">{offer.description}</p>
            </div>

            {/* Conditions */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="ClipboardList" size={18} className="text-violet-600" />
                Условия сделки
              </h2>
              <ul className="space-y-2">
                {offer.conditions.map((condition, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <Icon name="CheckCircle" size={16} className="text-green-500 mt-0.5 shrink-0" />
                    {condition}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="BookOpen" size={18} className="text-violet-600" />
                Инструкции продавца
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{offer.instructions}</p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="MessageSquare" size={18} className="text-violet-600" />
                Отзывы покупателей
              </h2>
              <div className="space-y-4">
                {REVIEWS.map((review) => (
                  <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                          {review.user[0]}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{review.user}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={12}
                            className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                          />
                        ))}
                        <span className="text-xs text-gray-400 ml-1">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Purchase card */}
          <div className="lg:col-span-1 space-y-4">
            {/* Buy card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <div className="text-3xl font-black text-violet-600 mb-1">
                {offer.price} ₽
              </div>
              <p className="text-xs text-gray-400 mb-5">за 1 единицу</p>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">Количество</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors"
                  >
                    <Icon name="Minus" size={14} />
                  </button>
                  <span className="text-lg font-bold text-gray-900 w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors"
                  >
                    <Icon name="Plus" size={14} />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-5">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>{offer.price} ₽ × {quantity}</span>
                  <span>{total} ₽</span>
                </div>
                <div className="flex items-center justify-between font-bold text-gray-900">
                  <span>Итого</span>
                  <span className="text-violet-600">{total} ₽</span>
                </div>
              </div>

              <button className="w-full py-3.5 astrex-gradient text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-violet-200 mb-3">
                Купить сейчас
              </button>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Icon name="ShieldCheck" size={14} className="text-green-500" />
                <span>Сделка защищена эскроу-системой ASTREX</span>
              </div>
            </div>

            {/* Seller card */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">О продавце</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${offer.sellerAvatarColor}`}>
                  {offer.sellerAvatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{offer.seller}</div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className={`w-2 h-2 rounded-full ${offer.sellerOnline ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className={offer.sellerOnline ? "text-green-600" : "text-gray-400"}>
                      {offer.sellerOnline ? "Онлайн" : "Офлайн"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Рейтинг</span>
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={13} className="text-amber-400 fill-amber-400" />
                    <span className="font-bold text-gray-900">{offer.sellerRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Отзывов</span>
                  <span className="font-medium text-gray-900">{offer.sellerReviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">На платформе с</span>
                  <span className="font-medium text-gray-900">{offer.sellerJoined}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
