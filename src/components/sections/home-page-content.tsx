'use client';

import HeroSection from "@/components/sections/hero-section";
import TrustedExperience from "@/components/sections/trusted-experience";
import LayeredTextHero from "@/components/sections/layered-text-hero";
import AdvancedSearchBar from "@/components/ui/AdvancedSearchBar";
import PartnersGrid from "@/components/sections/partners-grid";
import FeaturedSaleListings from "@/components/sections/featured-sale-listings";
import FeaturedRentListings from "@/components/sections/featured-rent-listings";
import FeaturedProjects from "@/components/sections/featured-projects";

export default function HomePageContent() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Advanced Search Section */}
      <section className="relative -mt-[111px] z-10 container mx-auto px-4">
        <AdvancedSearchBar />
      </section>

      {/* Spacer for content below search */}
      <div className="h-16"></div>

      {/* Layered Text Hero */}
      <section className="w-full overflow-hidden">
        <LayeredTextHero />
      </section>

      {/* Featured Sale Listings */}
      <FeaturedSaleListings />

      {/* Featured Rent Listings */}
      <FeaturedRentListings />

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* Trusted Experience */}
      <TrustedExperience />

      {/* Partners Grid */}
      <PartnersGrid />

      {/* Trust Badges Section */}
      <section className="section bg-white">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border-2 px-6 py-3 rounded-full text-sm font-semibold shadow-lg mb-6"
              style={{ borderColor: '#f07f38', color: '#f07f38', boxShadow: '0 10px 25px rgba(240, 127, 56, 0.1)' }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: '#f07f38' }}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              Bizi Seçmeniz İçin 4 Sebep
            </div>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              25 yıllık deneyimimiz ve güvenilir hizmet anlayışımızla yanınızdayız
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Quality Badge */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-primary-500">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Güvenilir</h3>
              <p className="text-gray-600 text-sm">
                25 yıllık sektör deneyimi
              </p>
            </div>

            {/* Support Badge */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-primary-500">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">7/24 Destek</h3>
              <p className="text-gray-600 text-sm">
                Her zaman yanınızdayız
              </p>
            </div>

            {/* Security Badge */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-primary-500">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Güvenli İşlem</h3>
              <p className="text-gray-600 text-sm">
                %100 yasal güvence
              </p>
            </div>

            {/* Experience Badge */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-primary-500">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Uzman Ekip</h3>
              <p className="text-gray-600 text-sm">
                Profesyonel danışmanlık
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
