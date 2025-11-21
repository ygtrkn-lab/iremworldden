"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function LayeredTextHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Arka plan çok yavaş hareket etsin (derinlik hissi için)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  // Metin çok dramatik hareket etsin
  const textY = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.8, 1], ["0%", "30%", "70%", "120%", "180%"]);
  const textScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 1.5]);
  
  // Ön plan çok hızlı hareket etsin
  const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const foregroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  
  // Opacity ve Z-Index daha dramatik
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.7, 0.9, 1], [1, 1, 0.8, 0.3, 0.1, 1]);
  const textZIndex = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [15, 15, 5, 100]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="relative w-full h-[400px] sm:h-[600px] md:h-[800px] overflow-hidden">
        {/* Animated Background Particles */}
        <motion.div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{ 
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%"
              }}
              animate={{
                x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </motion.div>

        {/* Background Layer with Parallax */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            y: backgroundY,
            scale: backgroundScale
          }}
        >
          <div className="relative w-full h-[160%] -top-[30%] overflow-hidden">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 1, 0]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
              className="w-full h-full transform-gpu"
            >
              <Image
                src="/uploads/des/arkaplan.png"
                alt="Background Sky"
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
                priority
                quality={90}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Dynamic Text Layer */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            y: textY, 
            opacity: textOpacity,
            zIndex: textZIndex,
            scale: textScale
          }}
        >
          <div className="relative h-full flex flex-col items-center justify-center">
            {/* Main Animated Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.5,
                type: "spring",
                stiffness: 100
              }}
              className="text-center mb-8 px-4 relative z-10"
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tighter"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span className="block text-white">
                  ARADIĞINIZ YAŞAMIN YENİ ADRESLERİ
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Animated Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-center px-4 relative z-10"
            >
              <motion.p 
                className="text-xl sm:text-2xl md:text-3xl text-white/95 font-light max-w-4xl mx-auto leading-relaxed"
                whileHover={{ scale: 1.02 }}
              >
                Geleceğin yaşam alanlarında yerinizi alın
              </motion.p>
            </motion.div>

            {/* Floating Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.8 }}
              className="flex flex-col sm:flex-row gap-4 mt-12 px-4"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px rgba(240,127,56,0.4)" 
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl"
              >
                <span className="flex items-center gap-3">
                  <motion.svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </motion.svg>
                  PROJELERİ KEŞFET
                  <motion.svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ x: 5 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300"
              >
                <span className="flex items-center gap-3">
                  <motion.svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </motion.svg>
                  İletişime Geç
                </span>
              </motion.button>
            </motion.div>

            {/* Scrolling Background Text */}
            <motion.div
              animate={{ 
                x: ["100%", "-100%"]
              }}
              transition={{ 
                duration: 25,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              }}
              className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap opacity-5 pointer-events-none"
              style={{
                willChange: "transform",
                fontSize: 'clamp(8rem, 20vw, 16rem)',
                fontFamily: '"SF Pro Display", sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: 'white'
              }}
            >
              IREMWORLD • PREMIUM LIVING • IREMWORLD • PREMIUM LIVING •
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
            />
            
            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, -3, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-32 right-16 w-12 h-12 bg-primary-500/20 rounded-full backdrop-blur-sm border border-primary-300/30"
            />
          </div>
        </motion.div>

        {/* Foreground Layer with Parallax */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            y: foregroundY,
            scale: foregroundScale
          }}
        >
          <div className="relative w-full h-[160%] -top-[30%]">
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src="/uploads/des/onplan.png"
                alt="Foreground House"
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
                priority
                quality={90}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Dynamic Gradient Overlays */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(to top, rgba(0,0,0,0.1), transparent)",
              "linear-gradient(to top, rgba(0,0,0,0.2), transparent)",
              "linear-gradient(to top, rgba(0,0,0,0.1), transparent)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)",
              "linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)",
              "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)"
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-white/80"
          >
            <span className="text-sm font-medium mb-2">Keşfetmeye Devam Et</span>
            <motion.svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
