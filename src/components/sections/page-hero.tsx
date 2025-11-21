"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  imagePath: string;
  gradient?: string;
}

export default function PageHero({
  title,
  subtitle,
  description,
  imagePath,
  gradient = "from-primary-900/80 via-primary-800/50 to-transparent"
}: PageHeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[600px] overflow-hidden bg-primary-900">
      {/* Parallax Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 scale-110"
      >
        <Image
          src={imagePath}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`}></div>
      </motion.div>

      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-32 h-32 border-2 border-white/20 rounded-full backdrop-blur-sm"
        />
        <motion.div 
          animate={{ 
            y: [0, 25, 0],
            rotate: [0, -360],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 1
          }}
          className="absolute bottom-40 left-20 w-24 h-24 border-2 border-primary-300/30 rounded-lg backdrop-blur-sm transform rotate-45"
        />
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white/10 rounded-full backdrop-blur-sm"
        />
      </div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 h-full flex items-center"
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
              >
                <span className="text-primary-200 text-sm md:text-base font-medium uppercase tracking-wider">
                  {subtitle}
                </span>
              </motion.div>
            )}
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              {title}
            </motion.h1>
            
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
              >
                {description}
              </motion.p>
            )}

            {/* Contact Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <Link
                href="/contact-us"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-full shadow-2xl hover:bg-gray-50 hover:shadow-3xl hover:scale-105 transition-all duration-300"
              >
                İletişime Geç
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
