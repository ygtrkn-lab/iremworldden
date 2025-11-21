"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import allProjects from "@/data/projects.json";

interface FeaturedProject {
  id: string;
  title: string;
  location: string;
  description: string;
  status: string;
  price: string;
  images: string[];
  features: {
    projectName: string;
    projectType: string;
    projectStatus: string;
    estimatedPrice: string;
  };
  type: "project";
}

const featuredProjects: FeaturedProject[] = (allProjects as FeaturedProject[])
  .filter((project) => {
    const statusAvailable = Boolean(project.status?.length);
    const isTurkeyProject = project.country?.toLowerCase() === "türkiye";
    return statusAvailable && isTurkeyProject;
  })
  .slice(0, 4);

export default function FeaturedProjects() {
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newIndex = { ...prev };
        featuredProjects.forEach(project => {
          if (project.images.length > 1) {
            newIndex[project.id] = ((prev[project.id] || 0) + 1) % project.images.length;
          }
        });
        return newIndex;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
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
            Öne Çıkan Projelerimiz
          </motion.div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            İstanbul'un prestijli lokasyonlarında hayata geçirdiğimiz projeler
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProjects.map((project, index) => {
            const featureTags = Object.values(project.features || {}).filter(Boolean);

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/projects/${project.id}`}>
                  <motion.div
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                  {/* Image Carousel Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {project.images.map((image, imageIndex) => (
                      <motion.div
                        key={image}
                        className="absolute inset-0"
                        initial={{ opacity: imageIndex === 0 ? 1 : 0 }}
                        animate={{ 
                          opacity: (currentImageIndex[project.id] || 0) === imageIndex ? 1 : 0
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={image}
                          alt={`${project.title} - Görsel ${imageIndex + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                    
                    {/* Project Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        PROJE
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === "Satışta" 
                          ? "bg-green-500 text-white" 
                          : "bg-blue-500 text-white"
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Code Badge */}
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-[#f07f38] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        KOD: {project.id}
                      </span>
                    </div>
                    
                    {/* Image Indicators */}
                    {project.images.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {project.images.map((_, imageIndex) => (
                          <div
                            key={imageIndex}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              (currentImageIndex[project.id] || 0) === imageIndex 
                                ? 'bg-white' 
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Location Badge */}
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{project.location}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-[#f07f38] transition-colors duration-300">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {featureTags.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="bg-gradient-to-r from-[#f07f38]/10 to-[#f07f38]/20 text-[#f07f38] px-2 py-1 rounded-full text-xs font-medium border border-[#f07f38]/20"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-[#f07f38] font-bold text-lg">
                        {project.price}
                      </div>
                    </div>
                  </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Horizontal Compact Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/projects">
            <motion.button
              className="bg-gradient-to-r from-[#f07f38] to-[#e06b2a] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Tüm Projelerimizi Görüntüle
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
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
