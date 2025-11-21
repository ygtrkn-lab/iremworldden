"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const SLIDES = [
  {
    id: 1,
    type: "rental-office",
    title: "Kiralık Ofis",
    subtitle: "İş Merkezleri",
    description: "Prestijli lokasyonlarda, modern teknoloji altyapısı ile donatılmış ofis alanları. İş dünyasının kalbi olan noktalarda.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    stats: { value: "", label: "Ofis" },
    features: ["Fiber İnternet", "Klima", "Güvenlik", "Otopark"],
    priceRange: "₺15.000 - ₺150.000/ay",
    cta: "Ofis Koleksiyonu",
    href: "/for-rent?category=Ofis",
  gradient: "from-[#0a0301]/95 via-[#f07f38]/12 to-[#050200]/88",
  accentColor: "text-[#ffd7bb]",
  tint: "#f07f38"
  },
  {
    id: 2,
    type: "rental-apartment",
    title: "Kiralık Daire",
    subtitle: "Yaşam Alanları",
    description: "Şehrin en güzel semtlerinde, eşyalı veya eşyasız kiralık daire seçenekleri. Konforlu yaşam için ideal lokasyonlar.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    stats: { value: "", label: "Daire" },
    features: ["Eşyalı", "Balkon", "Asansör", "Güvenlik"],
    priceRange: "₺8.000 - ₺80.000/ay",
    cta: "Daire Koleksiyonu",
    href: "/for-rent?category=Daire",
  gradient: "from-[#0a0301]/95 via-[#f07f38]/12 to-[#050200]/88",
  accentColor: "text-[#ffd7bb]",
  tint: "#f07f38"
  },
  {
    id: 3,
    type: "sale-apartment",
    title: "Satılık Daire",
    subtitle: "Modern Daireler",
    description: "Şehir merkezinde konforlu yaşam alanları. Modern mimarisi ve akıllı ev teknolojileri ile donatılmış daireler.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    stats: { value: "", label: "Daire" },
    features: ["Akıllı Ev", "Güvenlik", "Asansör", "Otopark"],
    priceRange: "₺1.500.000 - ₺8.000.000",
    cta: "Daire Koleksiyonu",
    href: "/for-sale?category=Daire",
  gradient: "from-[#0a0301]/95 via-[#f07f38]/12 to-[#050200]/88",
  accentColor: "text-[#ffd7bb]",
  tint: "#f07f38"
  },
  {
    id: 4,
    type: "sale-office",
    title: "Satılık Ofis",
    subtitle: "Yatırım Fırsatları",
    description: "İş merkezlerinde yatırım değeri yüksek ofis alanları. Gelir getirici gayrimenkul yatırımları için ideal seçenekler.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    stats: { value: "", label: "Ofis" },
    features: ["Yatırım Değeri", "Merkezi Konum", "Modern Yapı", "Güvenlik"],
    priceRange: "₺2.000.000 - ₺15.000.000",
    cta: "Ofis Koleksiyonu",
    href: "/for-sale?category=Ofis",
  gradient: "from-[#0a0301]/95 via-[#f07f38]/12 to-[#050200]/88",
  accentColor: "text-[#ffd7bb]",
  tint: "#f07f38"
  },
  {
    id: 5,
    type: "housing-projects",
    title: "Konut Projeleri",
    subtitle: "Yeni Projeler",
    description: "Gelecek nesil yaşam alanları. Sosyal tesisleri, yeşil alanları ve modern mimarisi ile hayalinizdeki yaşam.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    stats: { value: "", label: "Proje" },
    features: ["Sosyal Tesis", "Yeşil Alan", "Güvenlik", "Otopark"],
    priceRange: "₺1.200.000 - ₺12.000.000",
    cta: "Proje Koleksiyonu",
    href: "/investment-opportunities",
  gradient: "from-[#0a0301]/95 via-[#f07f38]/12 to-[#050200]/88",
  accentColor: "text-[#ffd7bb]",
  tint: "#f07f38"
  },
  {
    id: 6,
    type: "land",
    title: "Satılık Arsalar",
    subtitle: "İnşaat Arsaları",
    description: "İmar durumu net, yatırım değeri yüksek arsalarımızla geleceğe yatırım yapın. Stratejik konumlarda yer alan fırsatlar.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    stats: { value: "", label: "Arsa" },
    features: ["İmar İzni", "Ulaşım", "Altyapı", "Yatırım Değeri"],
    priceRange: "₺500.000 - ₺10.000.000",
    cta: "Arsa Koleksiyonu",
    href: "/for-sale?category=Arsa",
  gradient: "from-[#0a0301]/95 via-[#f07f38]/12 to-[#050200]/88",
  accentColor: "text-[#ffd7bb]",
  tint: "#f07f38"
  },
  {
    id: 7,
    type: "villa",
    title: "Satılık Villa",
    subtitle: "Lüks Villalar",
    description: "Özel havuzlu, deniz manzaralı villa seçenekleri. Modern mimarisi ve geniş yaşam alanları ile hayalinizdeki yaşam.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    stats: { value: "", label: "Villa" },
    features: ["Özel Havuz", "Deniz Manzarası", "Geniş Bahçe", "Kapalı Garaj"],
    priceRange: "₺5.000.000 - ₺25.000.000",
    cta: "Villa Koleksiyonu",
    href: "/for-sale?category=Villa",
    gradient: "from-[#0a0301]/95 via-[#f07f38]/12 to-[#050200]/88",
    accentColor: "text-[#ffd7bb]",
    tint: "#f07f38"
  }
] as const;

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    // Preload all images
    const preloadImages = async () => {
      // Check if we're in the browser environment
      if (typeof window === 'undefined') {
        setIsVisible(true);
        return;
      }

      const imagePromises = SLIDES.map((slide) => {
        return new Promise<void>((resolve, reject) => {
          const img = new window.Image();
          img.src = slide.image;
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
      });

      try {
        await Promise.all(imagePromises);
        setIsVisible(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setIsVisible(true); // Show content even if some images fail to load
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const currentSlideData = SLIDES[currentSlide];
  const progress = ((currentSlide + 1) / SLIDES.length) * 100;
  const accent = currentSlideData.tint ?? '#f07f38';
  const accentShadow = '0 80px 190px -80px rgba(240,127,56,0.78)';
  const accentBorder = 'rgba(240,127,56,0.38)';
  const accentSoft = 'rgba(240,127,56,0.16)';
  const topFeatures = currentSlideData.features.slice(0, 3);

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-[#060201] text-white">
      {!isVisible && (
        <div className="absolute inset-0 bg-[#060201] flex items-center justify-center z-50">
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 border-4 border-[#f07f38] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/80">Yükleniyor...</p>
          </div>
        </div>
      )}

      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], ["0%", "20%"]),
          scale: useTransform(scrollYProgress, [0, 1], [1, 1.05]),
          opacity
        }}
        className="absolute inset-0 z-0"
      >
        {SLIDES.map((slide, index) => (
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
              scale: index === currentSlide ? 1 : 1.12
            }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80" />
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -25, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-24 w-32 h-32 bg-[#f07f38]/14 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 18, 0], x: [0, 12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-36 left-28 w-24 h-24 bg-[#f07f38]/12 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 right-1/3 w-20 h-20 bg-[#f07f38]/10 rounded-full blur-2xl"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10">
          <motion.div
            key={`hero-pane-${currentSlideData.id}`}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-4xl w-full text-center space-y-10 rounded-[42px] border backdrop-blur-2xl bg-white/[0.05] px-8 py-16 sm:px-14 sm:py-20"
            style={{ boxShadow: accentShadow, borderColor: accentBorder }}
          >
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-sm font-semibold uppercase tracking-[0.4em] text-white/70"
              style={{ color: accent }}
            >
              {currentSlideData.subtitle}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-white"
            >
              {currentSlideData.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto"
            >
              {currentSlideData.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3 text-sm"
            >
              {topFeatures.map((feature, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full border border-white/15 bg-white/5 text-white/80"
                  style={{ borderColor: accentSoft }}
                >
                  {feature}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/70"
            >
              <div className="uppercase tracking-[0.4em] text-white/60">Fiyat Aralığı</div>
              <div className="text-2xl font-semibold text-white">{currentSlideData.priceRange}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href={currentSlideData.href}
                className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-3 text-base font-medium text-white"
                style={{
                  background: `linear-gradient(135deg, ${accent} 0%, rgba(240,127,56,0.75) 100%)`,
                  boxShadow: '0 25px 60px -30px rgba(240,127,56,0.7)'
                }}
              >
                {currentSlideData.cta}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-base font-medium text-white/80 border border-white/20 hover:border-white/40 transition"
              >
                Bize Danışın
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="pb-16 px-6 flex flex-col items-center gap-8">
          <div className="w-full max-w-md h-[3px] rounded-full bg-white/10 overflow-hidden">
            <motion.div
              key={currentSlide}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${accentSoft} 0%, ${accent} 100%)` }}
            />
          </div>
          <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-[0.4em]">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`transition-colors duration-300 ${index === currentSlide ? 'text-white' : 'text-white/35 hover:text-white/60'}`}
              >
                {String(index + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
  className="absolute left-10 bottom-12 group flex items-center justify-center w-14 h-14 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300"
      >
        <svg className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
  className="absolute right-10 bottom-12 group flex items-center justify-center w-14 h-14 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300"
      >
        <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70"
      >
        <div className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.4em]">
          <span>Kaydır</span>
          <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 rounded-full bg-white/60"
            />
          </div>
        </div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#060201] via-transparent to-transparent pointer-events-none" />
    </section>
  );
}
