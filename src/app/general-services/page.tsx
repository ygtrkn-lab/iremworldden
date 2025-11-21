"use client";

import PageHero from "@/components/sections/page-hero";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { motion } from "framer-motion";

const serviceTracks = [
  {
    title: "Operasyon ve Lojistik",
    description:
      "Taşınma, depolama ve saha operasyonlarını uluslararası standartlarda yöneten partner ağımızla süreçleri hızlandırırız.",
    bullets: [
      "Taşınma ve lojistik yönetimi",
      "Depolama ve stok takibi",
      "Saha operasyon planlaması"
    ]
  },
  {
    title: "Dokümantasyon ve Onay",
    description:
      "Noter, tercüme ve belge tasdik süreçlerini uçtan uca dijitalleştirerek yatırımcıların güvenini artırırız.",
    bullets: [
      "Resmi kurum randevu ve takibi",
      "Çok dilli tercüme ve yeminli onay",
      "Belge arşiv ve erişim sistemleri"
    ]
  },
  {
    title: "Deneyim ve Sunum",
    description:
      "Mimari çizim, fotoğraf, video ve sanal tur üretimiyle projelerinizin değerini modern bir estetikle sergileriz.",
    bullets: [
      "Render ve mimari çizim stüdyosu",
      "Fotoğraf ve film prodüksiyonu",
      "360 derece sanal tur tasarımı"
    ]
  }
];

const supportAreas = [
  "Gayrimenkul değerleme ve ekspertiz",
  "Noter, tercüme ve belge tasdiki",
  "Taşınma, depolama ve lojistik çözümleri",
  "Resmi kurum işlemlerinde temsil",
  "Mimari çizim, fotoğraf ve sanal tur hizmetleri",
  "Yatırım danışmanlarına operasyonel destek"
];

const workflow = [
  {
    step: "Keşif",
    description:
      "Yatırım seyahatinizin hangi noktalarında destek gerektiğini belirleyerek uzman ekibi devreye alırız."
  },
  {
    step: "Eşleştirme",
    description:
      "Doğrulanmış profesyoneller arasından ihtiyaca en uygun servis sağlayıcıyı seçeriz."
  },
  {
    step: "Koordinasyon",
    description:
      "Tüm iletişim, belge ve zaman çizelgesi verilerini tek platformda paylaşırız."
  },
  {
    step: "Teslim",
    description:
      "Hizmet sonrası rapor, bütçe ve performans değerlendirmesini yatırım ekibinizle paylaşırız."
  }
];

export default function GeneralServicesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 top-0 h-[440px] w-[440px] rounded-full bg-primary-300/25 blur-[140px]" />
        <div className="absolute -left-28 bottom-0 h-[500px] w-[500px] rounded-full bg-amber-200/25 blur-[140px]" />
      </div>

      <PageHero
        title="Genel Hizmetler"
        subtitle="KÜRESEL DESTEK AĞI"
        description="Yatırım süreci yalnızca alım-satımla sınırlı değil. IremWorld, değerleme, tercüme, lojistik ve belge onayları gibi tamamlayıcı hizmet sağlayıcılarını yatırımcılarla aynı ağda buluşturur."
        imagePath="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=2070&q=80"
        gradient="from-slate-950/80 via-slate-900/55 to-slate-900/10"
      />

      <section className="relative py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">NEDEN IREMWORLD?</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              Gayrimenkul ekosistemindeki tüm destek hizmetlerini tek platformda topluyoruz
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Doğrulanmış profesyonel ağımız, operasyonel kolaylık ve hızlı eşleştirme sistemiyle yatırım deneyimini sadeleştirir.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceTracks.map((service) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 shadow-[0_36px_110px_-60px_rgba(15,23,42,0.25)] backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200/40 via-white/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                  <p className="mt-4 text-sm text-slate-600">{service.description}</p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">HIZMET ALANLARI</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              Yatırım yolculuğunuzun her adımında uzman desteği
            </h2>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {supportAreas.map((area) => (
              <li
                key={area}
                className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-5 py-4 text-sm font-medium text-slate-700 shadow-[0_28px_80px_-60px_rgba(15,23,42,0.25)] backdrop-blur-lg"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {area}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">IS AKISI</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              Dört adımda operasyonel uyum
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Çevik koordinasyon modeliyle sürecin her aşamasında şeffaf iletişim ve raporlama sunarız.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((stage) => (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 text-center shadow-[0_32px_90px_-60px_rgba(15,23,42,0.25)] backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary-200/35 via-white/65 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">{stage.step}</span>
                  <p className="mt-4 text-sm text-slate-600">{stage.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}
