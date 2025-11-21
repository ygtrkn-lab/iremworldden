'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AboutUsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutUsPopup({ isOpen, onClose }: AboutUsPopupProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && overlayRef.current && popupRef.current && contentRef.current) {
      // Overlay fade in
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      // Popup scale and fade in
      gsap.fromTo(
        popupRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
      );

      // Content stagger animation
      const elements = contentRef.current.querySelectorAll('.animate-item');
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: 'power3.out' }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    if (overlayRef.current && popupRef.current) {
      gsap.to(popupRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: 'power2.in',
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      onClick={handleClose}
    >
      <div
        ref={popupRef}
        className="relative w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-orange-50/30 to-white rounded-2xl sm:rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Mobil Uyumlu */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-[#f07f38] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content - Mobil Uyumlu */}
        <div ref={contentRef} className="p-4 sm:p-8 md:p-12 lg:p-16">
          {/* Hero Section - Mobil Uyumlu */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-item">
            <div className="inline-block mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#f07f38] bg-orange-100/50 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full">
                Biz Kimiz?
              </span>
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Gayrimenkul Dünyası
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
              Fonksiyonel bir ekosistem oluşturmak...
            </p>
          </div>

          {/* Main Value Propositions - Mobil Uyumlu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
            {/* Tek Çatı Altında - Mobil Uyumlu */}
            <div className="animate-item bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#f07f38] to-[#ff8c4a] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-lg">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Tek Çatı Altında</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Gayrimenkul dünyasının profesyonellerini tek çatı altında buluşturuyoruz.
              </p>
            </div>

            {/* Çözümümüz */}
            <div className="animate-item bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f07f38] to-[#ff8c4a] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Çözümümüz</h3>
              <p className="text-gray-600 leading-relaxed">
                Hukuk, sigorta, vergi, teknoloji ve genel hizmet alanlarında faaliyet gösteren işletmelerin bilgi paylaşımı yapabildiği, bağlantı kurabildiği ve büyüyebildiği bir dijital platform oluşturduk.
              </p>
            </div>

            {/* Dijital Dünya */}
            <div className="animate-item bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f07f38] to-[#ff8c4a] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dijital Dünya</h3>
              <p className="text-gray-600 leading-relaxed">
                Gayrimenkul sektörünü dijital çağın olanaklarıyla yeniden şekillendiriyoruz.
              </p>
            </div>

            {/* İnovasyon */}
            <div className="animate-item bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f07f38] to-[#ff8c4a] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">İnovasyon</h3>
              <p className="text-gray-600 leading-relaxed">
                Bu platform, gayrimenkul dünyasını dijital entegrasyon ve akıllı bağlantılarla yeniden tanımlayan yenilikçi bir ekosistemdir.
              </p>
            </div>
          </div>

          {/* Target Audiences */}
          <div className="mb-16">
            <h2 className="animate-item text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Kimler İçin?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Yatırımcılar',
                  description: 'Profesyonel ya da Amatör, dünyanın her yerindeki uygun yatırım fırsatlarından haberiniz olsun.',
                  icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                },
                {
                  title: 'Proje Üreticileri',
                  description: 'Konut Projeleri ya da İş Projeleri ile ilgili olarak projelerine yatırımcı ve pazar arayan büyük - küçük firmalar.',
                  icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                },
                {
                  title: 'Alım / Satım',
                  description: 'Sahip olduğu gayrimenkul veya benzeri araçlarla alakalı olarak lokasyon bağımsız olanak arayışı içinde olan atılımcılar.',
                  icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
                },
                {
                  title: 'Ortak Çalışma',
                  description: 'İşi konusunda yeni ortaklıklarla gelişme sağlamayı planlayan ve birlikten kuvvet doğacağına inanan iş adamları.',
                  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="animate-item bg-gradient-to-br from-white to-orange-50/50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-orange-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#f07f38] to-[#ff8c4a] rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="animate-item bg-gradient-to-r from-[#f07f38] to-[#ff8c4a] rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              IW Ekosistemine Katılın
            </h3>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Yatırımcılar, proje geliştiricileri ve danışmanlarla aynı dijital ekosistemde buluşun; Global gayrimenkul dünyasında görünürlük, güven ve yeni fırsatlar kazanın.
            </p>
            <button
              onClick={handleClose}
              className="bg-white text-[#f07f38] px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Hadi Başlayalım
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
