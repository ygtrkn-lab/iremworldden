'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const projectImages = [
  '/uploads/projects/226/superior-1.jpg',
  '/uploads/projects/226/superior-2.jpg',
  '/uploads/projects/226/superior-3.jpg',
  '/uploads/projects/226/superior-4.jpg',
  '/uploads/projects/226/superior-5.jpg',
  '/uploads/projects/226/superior-6.jpg',
  '/uploads/projects/226/superior-7.jpg',
  '/uploads/projects/226/superior-8.jpg',
];

export default function PortalLanding({ onEnter }: { onEnter: () => void }) {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('residential');
  const [selectedTransaction, setSelectedTransaction] = useState('sale');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Parallax Background Slider */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: mousePosition.x,
              y: mousePosition.y,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={projectImages[currentImageIndex]}
              alt="Project Background"
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay with shadow */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/85 to-gray-900/90"></div>
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Header with Logo in Center */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 z-20 py-8"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4 shadow-2xl border border-white/20"
            >
              <Image
                src="/images/kurumsal-logo/iremworld-logo.png"
                alt="IREMWORLD Logo"
                width={200}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 pt-24">
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
            IREMWORLD
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light drop-shadow-lg">
            Türkiye'nin En Prestijli Emlak Platformu
          </p>
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow-lg shadow-primary-500/50"></div>
            <p className="text-sm text-gray-300 uppercase tracking-wider drop-shadow-lg">
              Global Listings Service
            </p>
          </div>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6 max-w-4xl w-full"
        >
          {/* SHOP Properties Card */}
          <motion.div
            onHoverStart={() => setHoveredCard('shop')}
            onHoverEnd={() => setHoveredCard(null)}
            whileHover={{ scale: 1.02 }}
            className="relative group cursor-pointer"
            onClick={onEnter}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12 hover:border-blue-500/50 transition-all duration-300">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-white mb-3">
                SHOP
              </h2>
              <p className="text-blue-300 text-lg mb-4">Properties Worldwide</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <span>Residential</span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span>Commercial</span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span>Vacation</span>
              </div>

              <div className="inline-flex items-center gap-2 text-blue-400 group-hover:gap-3 transition-all duration-300">
                <span className="font-semibold">Aramaya Başla</span>
                <motion.svg
                  animate={hoveredCard === 'shop' ? { x: [0, 5, 0] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </div>
            </div>
          </motion.div>

          {/* POST Properties Card */}
          <motion.div
            onHoverStart={() => setHoveredCard('post')}
            onHoverEnd={() => setHoveredCard(null)}
            whileHover={{ scale: 1.02 }}
            className="relative group cursor-pointer"
            onClick={onEnter}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12 hover:border-primary-500/50 transition-all duration-300">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-white mb-3">
                POST
              </h2>
              <p className="text-primary-300 text-lg mb-4">Properties Worldwide</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <span>For Sale</span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span>Rent</span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span>Auction</span>
              </div>

              <div className="inline-flex items-center gap-2 text-primary-400 group-hover:gap-3 transition-all duration-300">
                <span className="font-semibold">İlan Ver</span>
                <motion.svg
                  animate={hoveredCard === 'post' ? { x: [0, 5, 0] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-12 max-w-2xl w-full"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">500+</div>
            <div className="text-sm text-gray-400">Aktif İlan</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">25+</div>
            <div className="text-sm text-gray-400">Yıl Deneyim</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">1000+</div>
            <div className="text-sm text-gray-400">Mutlu Müşteri</div>
          </div>
        </motion.div>

        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onClick={onEnter}
          className="mt-12 text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
        >
          <span className="text-sm">Portala Geç</span>
          <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
