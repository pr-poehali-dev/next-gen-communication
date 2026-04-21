import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Icon from "@/components/ui/icon"
import { authApi, saveSession } from "@/api"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const passwordsMatch = confirmPassword === "" || password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Пожалуйста, заполните все поля")
      return
    }
    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    setLoading(true)
    try {
      const data = await authApi.register({ username, email, password }) as Record<string, unknown>
      if (data?.error || data?.detail) {
        setError(String(data.error || data.detail))
      } else {
        const sessionId = String(data?.session_id || data?.token || "")
        if (sessionId) {
          saveSession(sessionId)
          navigate("/")
        } else {
          setError("Регистрация прошла успешно, но не удалось получить сессию. Войдите вручную.")
        }
      }
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl astrex-gradient flex items-center justify-center">
              <Icon name="Zap" size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black text-violet-600 tracking-tight">ASTREX</span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900 mt-2">Регистрация</h1>
          <p className="text-gray-500 text-sm mt-1">Создайте аккаунт бесплатно</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-600">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя пользователя</label>
              <div className="relative">
                <Icon name="User" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ваш_никнейм"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 8 символов"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Подтвердите пароль</label>
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${
                    !passwordsMatch ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-violet-400"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon name={showConfirm ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>
              {!passwordsMatch && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <Icon name="AlertCircle" size={12} />
                  Пароли не совпадают
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="w-full py-3.5 astrex-gradient text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-violet-200 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Icon name="Loader2" size={16} className="animate-spin" />}
              {loading ? "Создание аккаунта..." : "Создать аккаунт"}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">
            Войти
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
  )
}
