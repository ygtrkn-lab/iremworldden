"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 1,
    name: "Lüks Villalar",
    description: "Özel bahçeli, havuzlu villa seçenekleri",
    count: "150+ İlan",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/for-sale?type=villa",
    color: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    name: "Modern Daireler",
    description: "Şehir merkezinde konforlu yaşam",
    count: "300+ İlan",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/for-sale?type=daire",
    color: "from-green-500 to-teal-600"
  },
  {
    id: 3,
    name: "Ticari Alanlar",
    description: "Yatırım için ideal ticari gayrimenkuller",
    count: "80+ İlan",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/for-sale?type=ofis",
    color: "from-orange-500 to-red-600"
  },
  {
    id: 4,
    name: "Arsa & Arazi",
    description: "Gelecek projeleriniz için ideal arsalar",
    count: "120+ İlan",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/for-sale?type=arsa",
    color: "from-purple-500 to-pink-600"
  }
];

export default function FeaturedCategories() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <section className="section bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title">
            Öne Çıkan <span className="text-gradient">Kategoriler</span>
          </h2>
          <p className="section-subtitle">
            İhtiyacınıza uygun emlak kategorisini seçin ve hayalinizdeki mülkü bulun.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl hover-lift"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="relative h-80 overflow-hidden">
                {/* Background Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  {/* Count Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {category.count}
                    </span>
                  </div>

                  {/* Category Info */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-primary-300 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {category.description}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className={`mt-4 transform transition-all duration-300 ${
                    hoveredCategory === category.id ? 'translate-x-2' : ''
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-primary-500/20 transition-opacity duration-300 ${
                  hoveredCategory === category.id ? 'opacity-100' : 'opacity-0'
                }`}></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Aradığınız kategoriyi bulamadınız mı?
          </p>
          <Link href="/categories" className="btn btn-outline hover-lift">
            Tüm Kategorileri Görüntüle
          </Link>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
}
