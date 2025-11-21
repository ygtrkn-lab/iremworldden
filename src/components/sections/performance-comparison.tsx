"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

const metrics = [
  {
    category: "Müşteri Memnuniyeti",
    iremWorld: 98,
    others: 75,
    unit: "%",
    description: "Müşterilerimizin %98'i hizmetlerimizden memnun kaldığını belirtiyor."
  },
  {
    category: "Ortalama Satış Süresi",
    iremWorld: 45,
    others: 90,
    unit: "gün",
    description: "Emlak satış süremiz sektör ortalamasının yarısı kadar."
  },
  {
    category: "Portföy Büyüklüğü",
    iremWorld: 1500,
    others: 500,
    unit: "+",
    description: "Türkiye'nin en geniş emlak portföyüne sahibiz."
  },
  {
    category: "Yıllık İşlem Hacmi",
    iremWorld: 250,
    others: 100,
    unit: "M₺",
    description: "Yıllık işlem hacmimiz sürekli artıyor."
  }
];

export default function PerformanceComparison() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="section bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title text-gradient">
            Rakamlarla IREMWORLD
          </h2>
          <p className="section-subtitle">
            Sektörün önde gelen emlak pazarlama şirketi olarak, başarımızı rakamlarla kanıtlıyoruz.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={metric.category}
              className="card p-8 hover-lift"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex flex-col space-y-6">
                {/* Category */}
                <h3 className="text-xl font-bold text-gray-900">
                  {metric.category}
                </h3>

                {/* Comparison Bars */}
                <div className="space-y-4">
                  {/* IREMWORLD Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-primary-500">IREMWORLD</span>
                      <span className="font-bold">{metric.iremWorld}{metric.unit}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.iremWorld}%` }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: index * 0.2
                        }}
                      />
                    </div>
                  </div>

                  {/* Others Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-500">Sektör Ortalaması</span>
                      <span className="font-bold text-gray-700">{metric.others}{metric.unit}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gray-300"
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.others}%` }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: index * 0.2
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <motion.p
                  className="text-sm text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0.7 }}
                  transition={{ duration: 0.3 }}
                >
                  {metric.description}
                </motion.p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-8">
            Siz de IREMWORLD farkını yaşamak ister misiniz?
          </p>
          <button className="btn btn-primary hover-lift hover-glow">
            Hemen Başlayın
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
