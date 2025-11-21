"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface PartnerCardProps {
  name: string;
  logo: string;
  description: string;
  services: string[];
  website: string;
  index: number;
}

export default function PartnerCard({
  name,
  logo,
  description,
  services,
  website,
  index
}: PartnerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-primary-200"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Floating Icon */}
      <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
      
      <div className="relative p-8 space-y-6">
        {/* Logo & Name */}
        <div className="flex items-start space-x-4">
          <div className="relative w-16 h-16 shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-3 group-hover:scale-110 transition-transform duration-300">
            <Image
              src={logo}
              alt={`${name} logo`}
              fill
              sizes="(max-width: 768px) 100px, 100px"
              className="object-contain p-2"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {name}
            </h3>
            <Link
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary-500 hover:text-primary-600 transition-colors mt-1 group/link"
            >
              Web Sitesi
              <svg
                className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed text-sm">
          {description}
        </p>

        {/* Services */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-sm font-semibold text-gray-900">Hizmetler</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {services.map((service, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200/50 hover:border-primary-300 transition-colors duration-200"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Button */}
        <div className="pt-2">
            <a
              href="#contact-section"
              className="group/btn inline-flex w-full items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              onClick={(e) => {
                e.preventDefault();
                const section = document.getElementById('contact-section');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Bilgi Al
              <svg
                className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200"
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
            </a>
        </div>
      </div>
    </motion.div>
  );
}
