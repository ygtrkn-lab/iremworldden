"use client";

import PageHero from "@/components/sections/page-hero";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { motion } from "framer-motion";

const focusAreas = [
  {
    title: "Uluslararası Vergi Stratejisi",
    description:
      "Çok uluslu yatırımlar için gelir, dolaylı vergiler ve sermaye kazançlarını optimize eden kapsamlı planlama modelleri sunarız.",
    bullets: [
      "Çifte vergilendirme anlaşmalarına uygun yapılandırma",
      "Sınır ötesi ortak girişimler için vergi senaryoları",
      "Holding, SPV ve fon yapıları için danışmanlık"
    ]
  },
  {
    title: "Uyum ve Raporlama",
    description:
      "Yerel ve uluslararası mevzuata uyum sağlayan raporlama ritimleri oluşturarak operasyonel sürdürülebilirlik sağlarınız.",
    bullets: [
      "Gelir ve kurumlar vergisi beyannameleri",
      "KDV/VAT süreçleri ve iade yönetimi",
      "ESG ve finansal raporlama entegrasyonları"
    ]
  },
  {
    title: "Teşvik ve Avantaj",
    description:
      "Yatırım teşvikleri, muafiyetler ve hibelerden maksimum faydayı sağlayacak stratejik danışmanlık sunarız.",
    bullets: [
      "Bölgesel ve sektörel teşvik haritaları",
      "Vergi kredi ve indirim analizleri",
      "Kamu-özel iş birliği projeleri için yapı planlama"
    ]
  }
];

const serviceList = [
  "Uluslararası vergi planlama ve mali danışmanlık",
  "Gayrimenkul kazanç ve değer artışı vergileri",
  "Şirket kuruluşu, yapısal planlama ve vergi uyumluluğu",
  "Çifte vergilendirme önleme danışmanlığı",
  "Küresel yatırımcılara özel mali süreç rehberliği",
  "Yatırım teşvikleri ve vergi avantajları danışmanlığı"
];

const workflow = [
  {
    title: "Analiz",
    detail: "Yatırımın bulunduğu ülke ve sektörlere yönelik vergi gereksinimlerini çıkarırız."
  },
  {
    title: "Yapılandırma",
    detail: "Finansal akışları optimize edecek tüzel ve vergi yapılarını tasarlarız."
  },
  {
    title: "Uygulama",
    detail: "Gerekli kayıt, beyan ve lisans süreçlerini yönetir, ekiplerinizi bilgilendiririz."
  },
  {
    title: "Sürekli İzleme",
    detail: "Mevzuat değişikliklerini takip ederek olası risk ve fırsatları raporlarız."
  }
];

export default function TaxConsultingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 top-0 h-[440px] w-[440px] rounded-full bg-primary-300/25 blur-[140px]" />
        <div className="absolute -left-28 bottom-0 h-[500px] w-[500px] rounded-full bg-sky-200/25 blur-[150px]" />
      </div>

      <PageHero
        title="Vergi Danışmanlıkları"
  subtitle="GLOBAL VERGİ MİMARİSİ"
        description="Uluslararası yatırımlar, farklı ülkelerdeki vergi düzenlemeleri ve mali yükümlülükler açısından karmaşık süreçler içerir. IremWorld, vergi uzmanlarını yatırımcılar ve proje geliştiricilerle buluşturan global bir platformdur."
        imagePath="https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=2070&q=80"
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
              Gayrimenkul ve finans dünyasının vergi uzmanlarını tek dijital ağda birleştiriyoruz
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Uluslararası vergi planlaması, mevzuat desteği ve çifte vergilendirme anlaşmalarına uygun yapılandırma konusunda proaktif destek sağlıyoruz.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((area) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 shadow-[0_36px_110px_-60px_rgba(15,23,42,0.25)] backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200/40 via-white/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <h3 className="text-xl font-semibold text-slate-900">{area.title}</h3>
                  <p className="mt-4 text-sm text-slate-600">{area.description}</p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    {area.bullets.map((bullet) => (
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
              Finansal sürdürülebilirliği destekleyen uzmanlık seti
            </h2>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {serviceList.map((service) => (
              <li
                key={service}
                className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-5 py-4 text-sm font-medium text-slate-700 shadow-[0_28px_80px_-60px_rgba(15,23,42,0.25)] backdrop-blur-lg"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {service}
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
              Yatırımınız için vergi yolculuğu
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Analizden sürekli izlemeye kadar tüm süreçleri şeffaf biçimde yönetiyoruz.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((stage) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 text-center shadow-[0_32px_90px_-60px_rgba(15,23,42,0.25)] backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary-200/35 via-white/65 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <h3 className="text-lg font-semibold text-slate-900">{stage.title}</h3>
                  <p className="mt-5 text-sm text-slate-600">{stage.detail}</p>
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
