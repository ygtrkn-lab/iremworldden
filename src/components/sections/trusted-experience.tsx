"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

const trustFeatures = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Geniş Portföy",
    description: "Türkiye'nin en kapsamlı emlak portföyü",
    gradient: "from-orange-400 to-red-500"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Uzman Ekip",
    description: "Deneyimli emlak danışmanları",
    gradient: "from-orange-500 to-amber-500"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Güvenli İşlem",
    description: "Yasal güvence ile şeffaf süreç",
    gradient: "from-amber-500 to-yellow-500"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Hızlı Süreç",
    description: "Modern teknoloji ile kolay işlem",
    gradient: "from-yellow-500 to-orange-400"
  }
];

export default function TrustedExperience() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">

      <div className="container mx-auto px-4 relative z-10">
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border-2 px-6 py-3 rounded-full text-sm font-semibold shadow-lg"
            style={{ borderColor: '#f07f38', color: '#f07f38', boxShadow: '0 10px 25px rgba(240, 127, 56, 0.1)' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: '#f07f38' }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
            Güvenilir Emlak Deneyimi
          </motion.div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Teknoloji destekli emlak hizmetleri ile güvenilir alım, satım ve kiralama deneyimi
          </p>
        </motion.div>

        {/* Modern Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              <motion.div
                className="relative h-full"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Glassmorphism Card */}
                <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 
                              shadow-xl shadow-orange-500/5 hover:shadow-2xl hover:shadow-orange-500/10 
                              transition-all duration-500 h-full flex flex-col overflow-hidden">
                  
                  {/* Gradient Background on Hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  
                  {/* Floating Icon */}
                  <div className="relative mb-6">
                    <motion.div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg relative overflow-hidden"
                      style={{ background: '#f07f38' }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Icon Glow Effect */}
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-2xl"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: hoveredIndex === index ? [1, 1.2, 1] : 1,
                          opacity: hoveredIndex === index ? [0.3, 0.6, 0.3] : 0
                        }}
                        transition={{ duration: 1, repeat: hoveredIndex === index ? Infinity : 0 }}
                      />
                      {feature.icon}
                    </motion.div>
                    
                    {/* Floating Particles */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                      style={{ background: '#f07f38' }}
                      animate={{
                        scale: hoveredIndex === index ? [1, 1.3, 1] : 1,
                        opacity: hoveredIndex === index ? [0.7, 1, 0.7] : 0.7
                      }}
                      transition={{ duration: 1, repeat: hoveredIndex === index ? Infinity : 0 }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 transition-colors duration-300"
                        style={{ color: hoveredIndex === index ? '#f07f38' : undefined }}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom Accent */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: '#f07f38' }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Modern CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 
                        shadow-2xl shadow-orange-500/10 overflow-hidden">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-full h-full"
                style={{
                  background: '#f07f38',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f07f38' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: "60px 60px"
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.h3
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
              >
                Emlak Hayallerinizi Gerçeğe Dönüştürün
              </motion.h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Modern teknoloji ve uzman ekibimizle güvenilir emlak deneyimi yaşayın
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative text-white px-10 py-4 rounded-2xl font-bold shadow-xl 
                         hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                style={{ 
                  background: '#f07f38',
                  boxShadow: '0 4px 6px -1px rgba(240, 127, 56, 0.25), 0 2px 4px -1px rgba(240, 127, 56, 0.06)'
                }}
              >
                {/* Button Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  İlanları Keşfet
                  <motion.svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
