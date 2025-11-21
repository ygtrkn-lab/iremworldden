"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated, router]);

  useEffect(() => {
    try {
      const remembered = localStorage.getItem('irem_remember_me') === 'true';
      setRemember(remembered);
      if (remembered) {
        const stored = localStorage.getItem('irem_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.email) setEmail(parsed.email);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = await login({ email, password });
      if (!ok) {
        setError('E-posta veya parola hatalı');
      } else {
        try {
          localStorage.setItem('irem_remember_me', remember ? 'true' : 'false');
          if (remember) {
            localStorage.setItem('irem_user', JSON.stringify({ email }));
          } else {
            localStorage.removeItem('irem_user');
          }
        } catch (storageError) {
          console.warn('Remember me storage error', storageError);
        }
      }
    } catch (err) {
      setError('Sunucu hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/videos/portal-bg/w.mp4" type="video/mp4" />
        </video>
        {/* Video overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-500/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-[140px]"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.19, 1.0, 0.22, 1.0] }}
          className="w-full max-w-sm"
        >
          {/* Glass Card */}
          <motion.div 
            initial={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(255, 255, 255, 0)", borderColor: "rgba(255, 255, 255, 0)" }}
            animate={{ backdropFilter: "blur(24px)", backgroundColor: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.15)" }}
            transition={{ 
              duration: 3, 
              ease: [0.25, 0.1, 0.25, 1.0],
              delay: 0.4 
            }}
            style={{ willChange: 'backdrop-filter, background-color, border-color' }}
            className="border rounded-2xl p-6 sm:p-7 shadow-2xl"
          >
            {/* Logo & Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-6"
            >
              <div className="relative w-12 h-12 mx-auto mb-4">
                <Image
                  src="/images/kurumsal-logo/logo-light.png"
                  alt="IREM World"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                Tekrar Hoş Geldiniz
              </h1>
              <p className="text-white/70 text-xs sm:text-sm">
                Devam etmek için giriş yapın
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Email Input */}
              <div className="group">
                <label htmlFor="email" className="block text-xs font-medium text-white/80 mb-1.5">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-4 w-4 text-white/50 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-xl"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label htmlFor="password" className="block text-xs font-medium text-white/80 mb-1.5">
                  Parola
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 text-white/50 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-xl"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-xs backdrop-blur-xl"
                >
                  {error}
                </motion.div>
              )}

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-0"
                  />
                  <span className="text-white/70 group-hover:text-white/90 transition-colors">
                    Beni hatırla
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-white/70 hover:text-white transition-colors font-medium"
                >
                  Parolamı unuttum?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full group overflow-hidden rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 p-[2px] shadow-lg shadow-primary-500/50 transition-all hover:shadow-xl hover:shadow-primary-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-[6px] px-4 py-2.5 text-white text-sm font-semibold">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Giriş yapılıyor...</span>
                    </>
                  ) : (
                    <>
                      <span>Giriş Yap</span>
                      <FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </motion.button>
            </motion.form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-transparent text-white/50">veya</span>
              </div>
            </div>

            {/* Google Button */}
            <motion.button
              onClick={() => (window.location.href = '/api/auth/google')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white text-sm font-medium transition-all backdrop-blur-xl"
            >
              <Image src="/images/logos/google.svg" alt="Google" width={16} height={16} />
              <span>Google ile giriş</span>
            </motion.button>

            {/* Sign Up Link */}
            <p className="text-center text-white/60 text-xs mt-5">
              Hesabınız yok mu?{' '}
              <Link href="/register" className="text-white font-semibold hover:text-primary-300 transition-colors">
                Kayıt olun
              </Link>
            </p>
          </motion.div>

          {/* Footer Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6 flex items-center justify-center gap-6 text-white/60 text-xs"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
              <span>78+ Ülke</span>
            </div>
            <div className="w-px h-3 bg-white/20" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
              <span>3.200+ Portföy</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.015] mix-blend-overlay">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }} />
      </div>
    </div>
  );
}
