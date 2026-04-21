import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl astrex-gradient flex items-center justify-center">
              <Icon name="Zap" size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black text-violet-600 tracking-tight">ASTREX</span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900 mt-2">Вход в аккаунт</h1>
          <p className="text-gray-500 text-sm mt-1">Добро пожаловать обратно!</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Icon name="Mail" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Пароль
                </label>
                <a href="#" className="text-xs text-violet-600 hover:text-violet-700 transition-colors">
                  Забыли пароль?
                </a>
              </div>
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 astrex-gradient text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-violet-200 text-sm"
            >
              Войти
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">или</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Social */}
          <button className="w-full py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Icon name="Globe" size={16} className="text-gray-400" />
            Войти через Google
          </button>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Нет аккаунта?{" "}
          <Link to="/register" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">
            Зарегистрируйтесь
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-4">
          <Link to="/" className="hover:text-gray-600 transition-colors flex items-center justify-center gap-1">
            <Icon name="ArrowLeft" size={12} />
            Вернуться на главную
          </Link>
        </p>
      </div>
    </div>
  );
}
