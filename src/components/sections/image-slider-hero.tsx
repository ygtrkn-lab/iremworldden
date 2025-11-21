"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageSliderHero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const textSlides = [
    {
      id: 1,
      title: "Hayalinizdeki Ev",
      subtitle: "Sizi Bekliyor",
      description: "Modern yaşamın konforunu ve lüksünü bir arada sunan özel projelerimizi keşfedin."
    },
    {
      id: 2,
      title: "Geleceğe Yatırım",
      subtitle: "Bugün Başlıyor",
      description: "Değer kazanma potansiyeli yüksek emlak projelerimizle geleceğinizi güvence altına alın."
    },
    {
      id: 3,
      title: "Lüks Yaşam",
      subtitle: "Artık Çok Yakın",
      description: "Premium lokasyonlarda, özel tasarım detaylarıyla hazırlanmış yaşam alanları."
    },
    {
      id: 4,
      title: "Uzman Danışmanlık",
      subtitle: "Her Adımda Yanınızda",
      description: "25 yıllık deneyimimizle emlak yatırımınızda size rehberlik ediyoruz."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % textSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [textSlides.length]);

  const currentText = textSlides[currentTextIndex];

  return (
<section className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/uploads/des/arkaplan.webp"
          alt="Background"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Foreground Image */}
      <div className="absolute inset-0 z-10">
        <Image
          src="/uploads/des/onplan.webp"
          alt="Foreground"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Text Slider Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentText.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.25, 0.46, 0.45, 0.94] // Apple-like easing
                }}
                className="space-y-6"
              >
                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-block"
                >
                  <span className="text-white/90 text-lg md:text-xl font-medium tracking-wide uppercase">
                    {currentText.subtitle}
                  </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-white text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontWeight: 700,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {currentText.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-white/80 text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontWeight: 300
                  }}
                >
                  {currentText.description}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="pt-8"
                >
                  <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <span className="relative z-10">Keşfetmeye Başla</span>
                    <svg 
                      className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-3">
          {textSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTextIndex(index)}
              className={`relative h-1 rounded-full transition-all duration-500 ${
                index === currentTextIndex 
                  ? "w-12 bg-white" 
                  : "w-3 bg-white/40 hover:bg-white/60"
              }`}
            >
              {index === currentTextIndex && (
                <motion.div
                  className="absolute inset-0 bg-white rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 4, ease: "linear" }}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Elements for Apple-like Design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-15">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full backdrop-blur-sm"
        />
        <motion.div 
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-white/5 rounded-full backdrop-blur-sm"
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 right-8 z-30 text-white/70"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 font-light">Scroll</span>
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Gradient for smooth transition */}
<div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-100 via-gray-100/50 to-transparent z-25"></div>
    </section>
  );
}
