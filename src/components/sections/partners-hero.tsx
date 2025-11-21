"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PartnersHeroProps {
  title: string;
  subtitle: string;
  description: string;
  imagePath: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  gradient?: string;
}

export default function PartnersHero({
  title,
  subtitle,
  description,
  imagePath,
  stats,
  gradient = "from-gray-900/80 via-gray-900/50 to-transparent"
}: PartnersHeroProps) {
  return (
    <section className="relative h-[70vh] min-h-[600px] overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imagePath}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-primary-400 text-lg md:text-xl font-medium mb-4"
              >
                {subtitle}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                {title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                {description}
              </motion.p>

              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-12"
                >
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center lg:text-left">
                      <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-white/80 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="hidden lg:block relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-700/20 rounded-full blur-3xl"></div>
              </div>
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-2 border-white/10 rounded-full"
              ></motion.div>
              <motion.div
                animate={{
                  rotate: [360, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-2 border-white/20 rounded-full"
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
