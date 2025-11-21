"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  location: string;
  country: string;
  type: string;
  status: string;
  description: string;
  price: string;
  features: {
    projectName: string;
    projectType: string;
    projectStatus: string;
    estimatedPrice: string;
  };
  images: string[];
  video: string;
  videoThumbnail: string;
  agent: {
    name: string;
    title: string;
    phone: string;
    email: string;
    address: string;
    image: string;
  };
}

// Import projects data
import allProjects from '@/data/projects.json';
const projects = allProjects as Project[];

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
    // selectedProjectSub handled from query params; no local state needed here
  const projectInvestmentSubCategories = [
    { id: 'development', name: 'Geliştirme Projeleri (konut, lüks, karma kullanım, kentsel dönüşüm)' },
    { id: 'income_generating', name: 'Gelir Üreten Yatırımlar (GYO, kiralık ticari, coworking, lojistik)' },
    { id: 'alternative', name: 'Alternatif Yatırımlar (student housing, senior living, sağlık kampüsleri, data center, turizm)' },
    { id: 'land_longterm', name: 'Arazi & Uzun Vadeli Yatırım (geliştirilebilir arsa, land banking)' },
  ];
    // removed unused currentImageIndex; each project card uses internal animation

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/uploads/projects/229/dky-sahil-galeri1.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
        
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full text-sm font-semibold text-white mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 rounded-full flex items-center justify-center bg-[#f07f38]"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
              Projelerimiz
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Gayrimenkul Projelerimiz
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              İstanbul&apos;un en prestijli lokasyonlarında hayata geçirdiğimiz 
              projelerimizi keşfedin. Modern yaşamın tüm konforunu sunan 
              yatırım fırsatları.
            </p>
          </motion.div>
        </div>
      </section>


      {/* Projects Grid */}
      {/* Project filters (investment categories) */}
      {searchParams.get('category') && (() => {
        try {
          const parsed = JSON.parse(decodeURIComponent(searchParams.get('category') || ''));
          if (parsed.main === 'investment') {
            const currentlySelected = parsed.sub || null;
            return (
              <section className="py-6">
                <div className="container mx-auto px-4">
                  <div className="mb-4 text-gray-700 font-medium">Yatırım Projeleri</div>
                  <div className="flex flex-wrap gap-2">
                    {projectInvestmentSubCategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          const obj = { main: 'investment', sub: sub.id };
                          const params = new URLSearchParams(searchParams.toString());
                          params.set('category', JSON.stringify(obj));
                          router.push(`/projects?${params.toString()}`);
                        }}
                        className={`px-3 py-2 rounded-full text-sm ${currentlySelected === sub.id ? 'bg-[#f07f38] text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            );
          }
        } catch {
          // ignore
        }
        return null;
      })()}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group h-full"
              >
                <Link href={`/projects/${project.id}`}>
                  <motion.div
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                    whileHover={{ y: -5 }}
                  >
                      {/* Image Section */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={project.images[0]}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            project.status === "Satışta" 
                              ? "bg-green-500 text-white" 
                              : project.status === "Tamamlandı"
                              ? "bg-blue-500 text-white"
                              : "bg-yellow-500 text-white"
                          }`}>
                            {project.status}
                          </span>
                        </div>

                        {/* ID Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="bg-[#f07f38] text-white px-3 py-1 rounded-full text-xs font-semibold">
                            ID: {project.id}
                          </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* View Details Button */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold shadow-lg flex items-center gap-2"
                          >
                            <span>Detayları Görüntüle</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col">
                        {/* Type */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[#f07f38] text-sm font-semibold">{project.type}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500 text-sm">{project.country}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#f07f38] transition-colors duration-300">
                          {project.title}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-2 mb-4">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-600 text-sm">{project.location}</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {project.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Object.entries(project.features).slice(0, 2).map(([key, value], featureIndex) => (
                            <span
                              key={featureIndex}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {value}
                            </span>
                          ))}
                          {Object.keys(project.features).length > 2 && (
                            <span className="bg-[#f07f38]/10 text-[#f07f38] px-3 py-1 rounded-full text-xs font-medium">
                              +{Object.keys(project.features).length - 2} daha
                            </span>
                          )}
                        </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-[#f07f38] font-bold">
                          {project.price}
                        </div>
                        <motion.div
                          className="text-[#f07f38] font-semibold flex items-center gap-1"
                          whileHover={{ x: 3 }}
                        >
                          <span className="text-sm">İncele</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#f07f38] via-[#e06b2a] to-[#d85a1a]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Hayalinizdeki Projeyi Bulamadınız mı?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Size özel proje önerilerimiz için uzman ekibimizle iletişime geçin. 
              İhtiyaçlarınıza en uygun yatırım fırsatlarını birlikte keşfedelim.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-white text-[#f07f38] px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  İletişime Geç
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/investment-opportunities"
                  className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Yatırım Fırsatları
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f07f38] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Projeler yükleniyor...</p>
        </div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
