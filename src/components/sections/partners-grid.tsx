"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Partner {
  name: string;
  site: string;
  logo: string;
}

const partners: Partner[] = [
  {
    name: "Green Gaming Oyuncu Bilgisayarları",
    site: "https://green.net.tr",
    logo: "/uploads/partners/Green-Logo.webp"
  },
  {
    name: "Medel Elektronik",
    site: "https://medelelektronik.com",
    logo: "/uploads/partners/medel-elektronik-logo.webp"
  },
  {
    name: "Pasha Glass Technology",
    site: "https://pashateknoloji.com",
    logo: "/uploads/partners/psaha-teknoloji-logo.png"
  },
  {
    name: "TMC Dış Ticaret",
    site: "https://tmctrade.ae",
    logo: "/uploads/partners/tmc-dis-ticaret-logo.png"
  },
  {
    name: "BPA",
    site: "https://bpa.com.tr",
    logo: "/uploads/partners/bpa-logo.png"
  },
  {
    name: "Petro Pasha",
    site: "https://petropasha.com.tr",
    logo: "/uploads/partners/petro-pasha-logo.png"
  },
  {
    name: "Medel Medical",
    site: "https://medelmedical.com",
    logo: "/uploads/partners/medel-medikal-logo.png"
  },
  {
    name: "GWA Greener World",
    site: "https://gwa.com.tr",
    logo: "/uploads/partners/gwa-greener-world-logo.svg"
  }
];

export default function PartnersGrid() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-xl"
          style={{ background: 'linear-gradient(to right, rgba(240, 127, 56, 0.1), rgba(240, 127, 56, 0.15))' }}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-xl"
          style={{ background: 'linear-gradient(to right, rgba(240, 127, 56, 0.15), rgba(240, 127, 56, 0.2))' }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header with Animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
            İş Ortaklarımız
          </motion.div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Sektörün önde gelen firmaları ile güvenilir iş ortaklıklarımız
          </p>
        </motion.div>

        {/* Partners Grid with Enhanced Design */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <motion.a
                href={partner.site}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-300
                         hover:shadow-lg border border-gray-100 overflow-hidden aspect-square flex flex-col justify-center"
                whileHover={{ y: -5 }}
              >
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ background: 'linear-gradient(135deg, rgba(240, 127, 56, 0.05), transparent, transparent)' }} />
                <div className="absolute top-0 right-0 h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full -mr-6 sm:-mr-8 md:-mr-10 -mt-6 sm:-mt-8 md:-mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ background: 'linear-gradient(135deg, rgba(240, 127, 56, 0.05), transparent)' }} />
                
                {/* Logo Container - Fixed Equal Size */}
                <div className="relative w-full h-12 sm:h-14 md:h-16 flex items-center justify-center mb-2 sm:mb-3">
                  <div className="relative w-full h-full">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain transition-all duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  </div>
                </div>

                {/* Partner Name - Responsive Text */}
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 transition-colors duration-300 line-clamp-2 leading-tight">
                    {partner.name}
                  </p>
                </div>

                {/* Hover Indicator */}
                <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                     style={{ background: '#f07f38' }} />
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="rounded-2xl p-8 border"
               style={{ 
                 background: 'linear-gradient(to right, rgba(240, 127, 56, 0.05), rgba(240, 127, 56, 0.08))',
                 borderColor: 'rgba(240, 127, 56, 0.1)'
               }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                   style={{ background: '#f07f38' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Güvenilir İş Ortaklıkları</h3>
            <p className="text-gray-600">
              Sektörün lider firmaları ile kurduğumuz güçlü iş birlikleri sayesinde hizmet kalitemizi sürekli artırıyoruz
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
