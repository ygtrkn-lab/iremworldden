"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const backgroundImages = [
  "/uploads/banner-gallery-bg/banner-gallery (1).jpg",
  "/uploads/banner-gallery-bg/banner-gallery (1).png",
  "/uploads/banner-gallery-bg/banner-gallery (2).jpg",
  "/uploads/banner-gallery-bg/banner-gallery (2).png",
  "/uploads/banner-gallery-bg/banner-gallery (3).jpg",
  "/uploads/banner-gallery-bg/banner-gallery (4).jpg",
  "/uploads/banner-gallery-bg/banner-gallery (5).jpg",
];

const baseSlides = [
  {
    title: "Lüks Villa Yaşamı",
    subtitle: "Kartepe Suadiye'de",
    description:
      "Havuzlu, müstakil lüks villa yaşamı. Doğayla iç içe huzurlu bir yaşam.",
    portfolioImage:
      "/uploads/properties/KARTEPE SUADİYE'DE SATILIK HAVUZLU MUSTAKİL VİLLA/1.png",
  },
  {
    title: "Premium Ofis Fırsatı",
    subtitle: "Sarphan Finans Park'ta",
    description: "A+ lokasyonda prestijli ofis seçenekleri. Modern iş dünyasının kalbi.",
    portfolioImage:
      "/uploads/properties/SARPHAN FİNANS PARK' TA BÜYÜK TERASLI KİRALIK OFİS/1.png",
  },
  {
    title: "Yatırım Fırsatı",
    subtitle: "Ritim İstanbul'da",
    description: "Teraslı, geniş ofis seçenekleri. Yüksek getiri potansiyeli.",
    portfolioImage:
      "/uploads/properties/RİTİM İSTANBUL' DA SATILIK TERASLI 4+1 OFİS/1.png",
  },
  {
    title: "Rezidans Yaşamı",
    subtitle: "Kartal Referans Tower'da",
    description:
      "Modern ve konforlu rezidans daireleri. Şehrin kalbinde lüks yaşam.",
    portfolioImage:
      "/uploads/properties/KARTAL REFERANS TOWERDA SATILIK 3+1 FIRSAT DAİRE!/1.png",
  },
];

const banners = backgroundImages.map((image, index) => {
  const base = baseSlides[index % baseSlides.length];
  return {
    ...base,
    id: index + 1,
    image,
    portfolioImage: base.portfolioImage ?? image,
  };
});

export default function BannerGallery() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      nextBanner();
    }, 3000); // Banner changes every 3 seconds

    return () => window.clearTimeout(timer);
  }, [currentBanner]);

  const nextBanner = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentBanner((prev) => (prev + 1) % banners.length);
  setTimeout(() => setIsAnimating(false), 900);
    }
  };

  const prevBanner = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  setTimeout(() => setIsAnimating(false), 900);
    }
  };

  return (
    <section className="relative h-[280px] sm:h-[320px] md:h-[400px] lg:h-[500px] overflow-hidden bg-gray-900">
      {/* Background Slides with Parallax */}
      {banners.map((banner, index) => (
        <motion.div
          key={banner.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1, x: 100 }}
          animate={{
            opacity: index === currentBanner ? 1 : 0,
            scale: index === currentBanner ? 1 : 1.05,
            x: index === currentBanner ? 0 : (index < currentBanner ? -50 : 50)
          }}
          exit={{ opacity: 0, scale: 0.95, x: -100 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.25, 0.46, 0.45, 0.94],
            opacity: { duration: 0.8 },
            scale: { duration: 1.4, ease: "easeOut" },
            x: { duration: 1, ease: "easeInOut" }
          }}
        >
          <motion.div
            className="relative w-full h-full"
            animate={{
              scale: index === currentBanner ? [1, 1.02, 1] : 1
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority={index === 0}
            />
          </motion.div>
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            animate={{
              opacity: index === currentBanner ? [0.6, 0.5, 0.6] : 0.6
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="container h-full flex items-center justify-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 w-full">
            {/* Left Content with Parallax */}
            <motion.div
              key={banners[currentBanner].id}
              initial={{ opacity: 0, y: 30, x: -50 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                x: 0,
                scale: [0.95, 1, 0.98, 1]
              }}
              exit={{ opacity: 0, y: -30, x: 50 }}
              transition={{ 
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="max-w-[260px] sm:max-w-xs md:max-w-lg lg:max-w-xl text-white px-3 sm:px-4 md:px-0 text-center md:text-left"
            >
              <span className="inline-block text-[#f07f38] text-xs sm:text-sm md:text-base font-medium mb-1 sm:mb-2">
                {banners[currentBanner].subtitle}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
                {banners[currentBanner].title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-3 sm:mb-4 md:mb-6 line-clamp-2 leading-snug">
                {banners[currentBanner].description}
              </p>
              <button className="bg-gradient-to-r from-[#f07f38] to-[#e06b2a] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-xs sm:text-sm md:text-base">
                Detayları İncele
              </button>
            </motion.div>

            {/* Right Portfolio Image with Advanced Parallax */}
            <motion.div
              key={`portfolio-${banners[currentBanner].id}`}
              initial={{ opacity: 0, x: 80, scale: 0.8, rotateY: 15 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1, 
                rotateY: 0,
                y: [0, -5, 0, 5, 0]
              }}
              exit={{ opacity: 0, x: -80, scale: 0.8, rotateY: -15 }}
              transition={{ 
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94],
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="hidden md:block"
              whileHover={{ 
                scale: 1.01, 
                y: -2,
                rotateY: 2,
                transition: { duration: 0.3 }
              }}
              style={{ perspective: "1000px" }}
            >
              {/* Modern Portfolio Image Container */}
              <div className="relative group">
                {/* Animated Glow Effect Background */}
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-[#f07f38]/15 via-[#e06b2a]/10 to-[#f07f38]/15 rounded-3xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Main Image Container */}
                <div className="relative w-[480px] lg:w-[576px] h-72 lg:h-[360px] rounded-2xl overflow-hidden shadow-xl bg-white/3 backdrop-blur-sm border border-white/5" style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}>
                  {/* Image with Parallax Effects */}
                  <motion.div
                    className="relative w-full h-full"
                    whileHover={{ 
                      scale: 1.02, 
                      rotateX: 1,
                      transition: { duration: 0.6, ease: "easeOut" }
                    }}
                    animate={{
                      rotateX: [0, 1, 0, -1, 0],
                      rotateY: [0, 0.5, 0, -0.5, 0]
                    }}
                    style={{ 
                      transformStyle: "preserve-3d",
                      perspective: "1000px"
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Image
                      src={banners[currentBanner].portfolioImage}
                      alt={`${banners[currentBanner].title} Portfolio`}
                      fill
                      className="object-cover transition-all duration-700 group-hover:brightness-105 group-hover:contrast-102"
                      style={{
                        filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.25))'
                      }}
                    />
                    
                    {/* Subtle Overlay for Depth */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5"></div>
                    
                    {/* Subtle Hover Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-[#f07f38]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </motion.div>
                  
                  {/* Subtle Corner Accent */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-[#f07f38] rounded-full shadow-md opacity-60"></div>
                  
                  {/* Bottom Reflection Effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/5 to-transparent"></div>
                </div>
                
                {/* Parallax Floating Elements */}
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-[#f07f38] to-[#e06b2a] rounded-full shadow-sm opacity-70"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5],
                    x: [0, 2, 0, -1, 0],
                    y: [0, -1, 0, 1, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.div
                  className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gradient-to-br from-[#e06b2a] to-[#f07f38] rounded-full shadow-sm opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, -1, 0, 2, 0],
                    y: [0, 1, 0, -1, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {/* Navigation Arrows - Hidden on very small screens, shown at bottom for mobile, and right side for larger screens */}
      <div className="hidden sm:flex absolute md:right-6 z-20 space-x-3 bottom-12 md:bottom-4 left-1/2 md:left-auto transform -translate-x-1/2 md:translate-x-0">
        <button
          onClick={prevBanner}
          className="p-2 sm:p-2.5 md:p-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-all duration-300 group touch-manipulation"
          disabled={isAnimating}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextBanner}
          className="p-2 sm:p-2.5 md:p-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-all duration-300 group touch-manipulation"
          disabled={isAnimating}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress Indicators */}
      {/* Progress Indicators - Centered on mobile, left-aligned on larger screens */}
      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 md:left-6 transform -translate-x-1/2 md:translate-x-0 z-20 flex space-x-1.5 sm:space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-8 sm:w-10 md:w-12 h-0.5 sm:h-1 rounded-full transition-all duration-500 ${
              index === currentBanner
                ? "bg-[#f07f38] w-12 sm:w-16 md:w-20"
                : "bg-white/25 hover:bg-white/40"
            } touch-manipulation`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-20 sm:h-24 md:h-32 bg-gradient-to-b from-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 sm:h-24 md:h-32 bg-gradient-to-t from-black/40 to-transparent"></div>
    </section>
  );
}
