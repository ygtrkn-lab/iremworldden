"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Partner {
  name: string;
  site: string;
  logo: string;
  color: string;
  textColor: string;
}

const partners: Partner[] = [
  {
    name: "Green Gaming Oyuncu Bilgisayarları",
    site: "https://green.net.tr",
    logo: "https://green.net.tr/wp-content/uploads/2024/10/Green-Logo-1.png.webp",
    color: "#22C55E",
    textColor: "#FFFFFF"
  },
  {
    name: "Medel Elektronik",
    site: "https://medelelektronik.com",
    logo: "https://medelelektronik.com/wp-content/uploads/2024/08/logo.png",
    color: "#3B82F6",
    textColor: "#FFFFFF"
  },
  {
    name: "Pasha Glass Technology",
    site: "https://pashateknoloji.com",
    logo: "https://pashateknoloji.com/wp-content/uploads/2020/10/logo-20201008-194610.png",
    color: "#6366F1",
    textColor: "#FFFFFF"
  },
  {
    name: "TMC Dış Ticaret",
    site: "https://tmctrade.ae",
    logo: "https://tmctrade.ae/wp-content/uploads/2024/02/tmc1-e1706781987883.png",
    color: "#EC4899",
    textColor: "#FFFFFF"
  },
  {
    name: "BPA",
    site: "https://bpa.com.tr",
    logo: "images/partners/bpa_yatay.png",
    color: "#F59E0B",
    textColor: "#FFFFFF"
  },
  {
    name: "Petro Pasha",
    site: "https://petropasha.com.tr",
    logo: "https://petropasha.com.tr/wp-content/uploads/2020/09/logo.png",
    color: "#10B981",
    textColor: "#FFFFFF"
  },
  {
    name: "Medel Medical",
    site: "https://medelmedical.com",
    logo: "https://medelmedical.com/wp-content/uploads/2024/06/icon.png",
    color: "#8B5CF6",
    textColor: "#FFFFFF"
  },
  {
    name: "GWA Greener World",
    site: "https://gwa.com.tr",
    logo: "images/partners/gwa.png",
    color: "#14B8A6",
    textColor: "#FFFFFF"
  }
];


export default function PartnersSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(partners.length / 4));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay]);

  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                İş Ortaklarımız
              </h2>
              <p className="text-xl text-gray-600">
                Sektörün önde gelen firmaları ile güçlü iş birliği
              </p>
            </motion.div>
          </div>

          <div 
            className="relative px-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
          {/* Navigation Buttons */}
          <button
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + partners.length) % partners.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % partners.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
            {partners.slice(currentIndex, currentIndex + 4).map((partner, index) => (
              <motion.a
                key={partner.name}
                href={partner.site}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-[3/2] bg-white rounded-xl p-6 flex items-center justify-center group hover:shadow-2xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-white rounded-lg">
                  <div className="text-center mb-3">
                    <span className="text-lg font-bold text-gray-800">
                      {partner.name}
                    </span>
                  </div>
                  <div 
                    className="w-full h-16 flex items-center justify-center rounded-md"
                    style={{ backgroundColor: partner.color }}
                  >
                    <span className="text-2xl font-bold" style={{ color: partner.textColor }}>
                      {partner.name.split(' ')[0]}
                    </span>
                  </div>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
                      Detaylar <span className="ml-1">→</span>
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Progress Dots */}
          <div className="mt-8 flex justify-center gap-3">
            {Array.from({ length: Math.ceil(partners.length / 4) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 4)}
                className={`w-3 h-3 rounded-full transition-all duration-300 transform ${
                  Math.floor(currentIndex / 4) === index
                    ? "bg-primary-500 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
