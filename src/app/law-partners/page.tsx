"use client";

import PageHero from "@/components/sections/page-hero";
import PartnerCard from "@/components/sections/partner-card";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { motion } from "framer-motion";

const partners = [
  {
    name: "Legato Advisory",
    logo: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=200&q=80",
    description: "Gayrimenkul fonları ve karma projeler için sözleşme mimarisi, tapu süreçleri ve regülasyon yönetimi sağlayan butik ekip.",
    services: ["Kurumsal Sözleşmeler", "Tapu ve Tescil", "Fon Yapılanması", "Uyum Yönetimi"],
    website: "https://legatoadvisory.com"
  },
  {
    name: "Atlas Legal Studio",
    logo: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=200&q=80",
    description: "İnşaat ve yatırım hukuku alanında proje başlangıcından teslimata tüm süreçleri yöneten multidisipliner hukuk stüdyosu.",
    services: ["İnşaat Hukuku", "İhale Süreçleri", "Ruhsat Yönetimi", "Proje Teslim"],
    website: "https://atlaslegal.studio"
  },
  {
    name: "Nova Juris",
    logo: "https://images.unsplash.com/photo-1555375771-14b4d60aad07?auto=format&fit=crop&w=200&q=80",
    description: "Yabancı yatırımcılar için vatandaşlık programları, şirket kuruluşu ve vergi planlaması sunan global hukuk ağı.",
    services: ["Vatandaşlık Programları", "Şirket Kuruluşu", "Vergi Planlaması", "Uluslararası Tahkim"],
    website: "https://novajuris.co"
  },
  {
    name: "Equilibrio Law",
    logo: "https://images.unsplash.com/photo-1505664182761-efe827bfbf02?auto=format&fit=crop&w=200&q=80",
    description: "Lüks rezidans ve karma kullanım projeleri için marka lisanslama, kira kontratları ve topluluk yönetimi sözleşmeleri hazırlayan ekip.",
    services: ["Marka Lisanslama", "Kira Kontratları", "Topluluk Yönetimi", "Risk Yönetimi"],
    website: "https://equilibriolaw.com"
  },
  {
    name: "Veritas Partners",
    logo: "https://images.unsplash.com/photo-1505666287802-931dc83948e3?auto=format&fit=crop&w=200&q=80",
    description: "Gayrimenkul yatırım ortaklıkları için birleşme, satın alma ve ortak girişim yapılarını yöneten stratejik hukuk partneri.",
    services: ["M&A Süreçleri", "Joint Venture", "Due Diligence", "Finansal Yapılandırma"],
    website: "https://veritaspartners.law"
  }
];

const stats = [
  {
    value: "60+",
    label: "Aktif Dosya",
    caption: "Gayrimenkul, finans ve yatırım başlıklarında yönetilen güncel süreçler",
    accent: "from-primary-500/20 via-primary-400/10 to-transparent"
  },
  {
    value: "18 yıl",
    label: "Ortalama Deneyim",
    caption: "Partner avukatların sektördeki ortalama uzmanlık süresi",
    accent: "from-slate-900/10 via-primary-500/15 to-transparent"
  },
  {
    value: "72 saat",
    label: "İlk Taslak Süresi",
    caption: "Proje anlaşmalarının ön taslak teslim ortalaması",
    accent: "from-emerald-500/20 via-emerald-400/10 to-transparent"
  },
  {
    value: "94%",
    label: "Uzaklaştırma Oranı",
    caption: "Uyuşmazlıkların dava sürecine gitmeden çözümlenme yüzdesi",
    accent: "from-violet-500/20 via-primary-500/10 to-transparent"
  }
];

const expertisePillars = [
  {
    title: "Sözleşme Mimarlığı",
    description: "Proje paydaşlarını aynı hukuk dilinde buluşturan, riskleri öngören sözleşme kurguları hazırlıyoruz.",
    icon: (
      <svg className="h-6 w-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    items: [
      "Çok taraflı sözleşme şablonları",
      "Sorumluluk ve risk haritası",
      "İmza sonrası izleme prosedürleri"
    ]
  },
  {
    title: "Regülasyon Yönetimi",
    description: "Ulusal ve uluslararası düzenlemeleri takip ederek projelerinizi uyum içinde ilerletiyoruz.",
    icon: (
      <svg className="h-6 w-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-.75-3m1.5 0L12 4l2.25 13m-4.5 0h4.5M15 17l-.75 3-.75-3" />
      </svg>
    ),
    items: [
      "Tapu, ruhsat ve izin süreçleri",
      "Yatırım teşvikleri danışmanlığı",
      "Uyum denetim raporları"
    ]
  },
  {
    title: "Uyuşmazlık Önleme",
    description: "Erken uyarı mekanizmaları ile uyuşmazlık riskini minimize ediyor, gerektiğinde hızlı çözüm sunuyoruz.",
    icon: (
      <svg className="h-6 w-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    items: [
      "Risk skorlama modeli",
      "Tahkim & arabuluculuk planları",
      "Dokümantasyon standardizasyonu"
    ]
  }
];

const collaborationFlow = [
  {
    title: "Hukuki Keşif",
    description: "Proje hedeflerini, ortaklık yapısını ve zaman planını analiz ederek hukuk yol haritasını çıkarıyoruz.",
    detail: "Paydaş analizleri, işlem listesi, regülasyon taraması"
  },
  {
    title: "Strateji Tasarımı",
    description: "Sözleşme setleri, onay süreçleri ve risk planını tüm ekiplerle paylaşılabilir formatta hazırlıyoruz.",
    detail: "Taslak paket, inceleme döngüsü, imza planı"
  },
  {
    title: "Uygulama & İzleme",
    description: "Süreç ilerlerken imza, ruhsat ve iletişim akışlarını tek noktadan yöneterek kayıt altına alıyoruz.",
    detail: "Karar defteri, uyum panosu, bildirim protokolleri"
  },
  {
    title: "Devam Eden Destek",
    description: "Proje sonrası teslim, kira ve işletme dönemlerinde hukuki destek ve revizyonları sürdürürüz.",
    detail: "Periyodik kontrol, sözleşme yenileme, risk raporu"
  }
];

const testimonials = [
  {
    quote: "Projeyi başlatmadan önce tüm sözleşme trafiğini tek panelde toplamaları, saha ekiplerimizin işini çok hızlandırdı.",
    name: "İrem Aydın",
    role: "Proje Yöneticisi",
    company: "Skyline Residences"
  },
  {
    quote: "Yabancı yatırımcıyla yürüttüğümüz vatandaşlık ve şirket kuruluş süreci planlandığı gibi ilerledi. Sürekli raporlama güven verdi.",
    name: "Mert Ersoy",
    role: "CEO",
    company: "Polaris Investments"
  }
];

export default function LawPartnersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary-100/70 via-white to-transparent" />

      <PageHero
        title="Hukuk Partnerleri"
        subtitle="STRATEJİK HUKUK AĞI"
        description="Gayrimenkul yatırımlarını hızlı, şeffaf ve güvenilir biçimde yöneten, modern hukuk partner ekosistemi."
        imagePath="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2070&q=80"
        gradient="from-slate-950/85 via-slate-900/55 to-slate-900/10"
      />

      <section className="relative py-24">
        <div className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-100/50 blur-3xl" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">IREMWORLD LEGAL NETWORK</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              Gayrimenkul projelerine özel hukuki deneyim tasarımı
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Riskleri öngören, süreçleri hızlandıran ve tüm paydaşlara güven veren modern hukuki çözümlerle yanınızdayız.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-100/60 bg-white/80 p-8 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.6)] backdrop-blur"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <div className="relative">
                  <span className="text-4xl font-semibold text-slate-900 md:text-[2.6rem]">{stat.value}</span>
                  <p className="mt-3 text-sm font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                  <p className="mt-4 text-sm text-slate-600">{stat.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-slate-200/60 blur-3xl" />
        <div className="container grid gap-16 lg:grid-cols-[0.65fr_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">UZMANLIK DİKEYLERİ</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
              Hukuki yolculuğu uçtan uca güvenli hale getiriyoruz
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-600 md:text-lg">
              Sözleşme hazırlığından yatırım sonrası yönetime kadar her adımı ölçülebilir ve şeffaf bir yapıda ilerletiyoruz.
            </p>
          </motion.div>

          <div className="grid gap-6">
            {expertisePillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.55)] backdrop-blur"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary-50/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10">
                      {pillar.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{pillar.title}</h3>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 md:text-base">{pillar.description}</p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-600">
                    {pillar.items.map((item) => (
                      <li key={`${pillar.title}-${item}`} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-primary-500" />
                        <span>{item}</span>
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
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">PARTNER EKOSİSTEMİ</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
              Stratejik hukuk partnerlerimizle tanışın
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Gayrimenkul dünyasının karmaşık süreçlerini yalınlaştıran, deneyimli hukuk ekipleriyle ortak üretim yapıyoruz.
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {partners.map((partner, index) => (
              <PartnerCard
                key={partner.name}
                name={partner.name}
                logo={partner.logo}
                description={partner.description}
                services={partner.services}
                website={partner.website}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-950 px-8 py-16 text-white shadow-[0_60px_160px_-80px_rgba(15,23,42,0.9)] md:px-14">
            <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary-500/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-12 h-64 w-64 rounded-full bg-primary-300/40 blur-3xl" />
            <div className="relative grid gap-12 lg:grid-cols-[0.45fr_1fr] lg:items-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-200">İŞ BİRLİĞİ AKIŞI</p>
                <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                  Hukuki süreçler için yalın ve şeffaf yol haritası
                </h2>
                <p className="mt-6 text-base leading-relaxed text-primary-100/90">
                  Keşif toplantılarından teslim sonrası süreçlere kadar her adımı kayıt altına alarak ilerleriz.
                </p>
              </motion.div>

              <ol className="relative space-y-8">
                <div className="absolute left-5 top-0 h-full w-px bg-white/10" />
                {collaborationFlow.map((step, index) => (
                  <motion.li
                    key={step.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    className="relative pl-12"
                  >
                    <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 text-base text-primary-100/90">{step.description}</p>
                    <p className="mt-2 text-sm text-primary-200/90">{step.detail}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[460px] -translate-y-1/2 bg-gradient-to-br from-primary-50 via-white to-primary-100" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">PARTNERLERDEN NOTLAR</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
              İş ortaklarımız nasıl deneyimledi?
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.blockquote
                key={testimonial.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-left shadow-[0_40px_120px_-70px_rgba(15,23,42,0.55)] backdrop-blur"
              >
                <div className="absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-300" />
                <p className="mt-6 text-lg text-slate-700 md:text-xl">“{testimonial.quote}”</p>
                <footer className="mt-8 flex flex-col text-sm text-slate-500">
                  <span className="text-base font-semibold text-slate-900">{testimonial.name}</span>
                  <span>{testimonial.role} · {testimonial.company}</span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-section" className="relative py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-[36px] border border-primary-100/40 bg-gradient-to-br from-slate-950 via-primary-900 to-primary-700 px-8 py-16 text-white shadow-[0_70px_160px_-90px_rgba(15,23,42,0.9)] md:px-16">
            <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-primary-400/40 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid gap-12 lg:grid-cols-[0.6fr_0.4fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-100/80">HUKUKİ HAZIRLIK</p>
                <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                  Projenin her aşamasını hukuki güvenceye alın
                </h2>
                <p className="mt-6 text-base text-primary-100/90">
                  Yol haritası, sözleşme paketleri ve risk planı için hukuk oturumu planlayalım.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href="/contact"
                    className="group inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-semibold text-primary-900 shadow-xl transition-all duration-300 hover:translate-y-[-2px] hover:bg-primary-50"
                  >
                    Hukuk Oturumu Planla
                    <svg
                      className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <button
                    type="button"
                    className="group inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/50"
                    onClick={() => {
                      const section = document.getElementById("contact-section");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    Süreç Kılavuzu Al
                    <svg
                      className="ml-2 h-4 w-4 opacity-70 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-primary-200">Anında erişim</p>
                  <p className="mt-3 text-lg font-semibold text-white">Legal Blueprint</p>
                  <p className="mt-2 text-sm text-primary-100/90">Sözleşme haritası, risk planı, revizyon takvimi.</p>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-2 text-sm text-primary-100/90">
                  <p>• İmza hazırlık checklist'i</p>
                  <p>• Uyuşmazlık önleme rehberi</p>
                  <p>• Referans proje örnekleri</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}
