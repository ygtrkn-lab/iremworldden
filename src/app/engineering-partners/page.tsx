"use client";

import PageHero from "@/components/sections/page-hero";
import PartnerCard from "@/components/sections/partner-card";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { motion } from "framer-motion";

const partners = [
  {
    name: "Vertex Structural Labs",
    logo: "https://images.unsplash.com/photo-1531835551805-16d864c8d0ad?auto=format&fit=crop&w=200&q=80",
    description: "Mega projeler için performans analizi, sismik modelleme ve yüksek katlı yapı optimizasyonu sunan uzman mühendislik kolektifi.",
  services: ["Sismik Simülasyon", "Yapı Sağlığı İzleme", "Proje Denetimi", "Güçlendirme Stratejisi"],
    website: "https://vertexstructural.com"
  },
  {
    name: "Nexa Build Studio",
    logo: "https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=200&q=80",
    description: "Mekanik, elektrik ve enerji sistemlerini hibrit dijital ikizlerle yöneten, sürdürülebilirlik odaklı proje danışmanı.",
  services: ["Mekanik Tasarım", "Enerji Modellemesi", "Dijital İkiz", "Tesis Yönetimi (SFM)"],
    website: "https://nexabuild.studio"
  },
  {
    name: "Terranova Geo",
    logo: "https://images.unsplash.com/photo-1531835551805-16d864c8d0ad?auto=format&fit=crop&w=200&q=80",
    description: "Jeoteknik keşif, zemin analizi ve altyapı mühendisliği süreçlerini tümleşik veri platformu üzerinden yöneten uzman ekip.",
    services: ["Jeoteknik Etüt", "Zemin İyileştirme", "Temel Tasarımı", "Altyapı Yönetimi"],
    website: "https://terranovageo.com"
  },
  {
    name: "Aeris Systems",
    logo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=200&q=80",
    description: "LEED ve WELL standartlarına uygun HVAC, iç mekân hava kalitesi ve IoT izleme çözümleriyle projelere değer katan teknoloji mühendisleri.",
    services: ["HVAC Tasarımı", "Enerji Yönetimi", "IoT İzleme", "Well Sertifikasyonu"],
    website: "https://aerissystems.com"
  },
  {
    name: "Cortex Infrastructure",
    logo: "https://images.unsplash.com/photo-1529429617124-aee711a271f0?auto=format&fit=crop&w=200&q=80",
    description: "Akıllı şehir altyapısı, su yönetimi ve veri odaklı tesis otomasyon çözümleri geliştirerek bütünsel mühendislik desteği sağlar.",
    services: ["Akıllı Şehir", "Su Yönetimi", "Otomasyon", "Bakım Analitiği"],
    website: "https://cortexinfra.com"
  },
  {
    name: "Linea Facade Atelier",
    logo: "https://images.unsplash.com/photo-1529429617124-aee711a271f0?auto=format&fit=crop&w=200&q=80",
    description: "Yüksek performanslı cephe mühendisliği, parametrik tasarım ve iklim adaptasyonu üzerine çalışan disiplinlerarası stüdyo.",
    services: ["Cephe Analizi", "Parametrik Tasarım", "İklim Adaptasyonu", "Malzeme AR-GE"],
    website: "https://lineafacade.com"
  }
];

const stats = [
  {
    value: "85+",
    label: "Aktif Proje",
    caption: "Karma kullanımlı, konut ve altyapı projelerinde eş zamanlı yönetim",
    accent: "from-slate-900/10 via-primary-500/15 to-transparent"
  },
  {
    value: "12 ülke",
    label: "Global Ayak İzi",
    caption: "Orta Doğu, Avrupa ve Afrika'da sahada mühendislik denetimi",
    accent: "from-primary-500/20 via-primary-400/10 to-transparent"
  },
  {
    value: "36 saat",
    label: "Teknik Başlangıç",
    caption: "Proje verisinin analizi ve dijital ikiz kurulumu için gereken süre",
    accent: "from-emerald-500/20 via-emerald-400/10 to-transparent"
  },
  {
    value: "0.4%",
    label: "Hata Payı",
    caption: "Yapı sağlığı sensörleri ile takip edilen tolerans bandı",
    accent: "from-violet-500/20 via-primary-500/10 to-transparent"
  }
];

const experiencePillars = [
  {
    title: "Entegre Tasarım Kontrolü",
    description: "Statik, mekanik ve elektrik disiplinlerini tek platformda senkronize ederek saha sürprizlerini ortadan kaldırıyoruz.",
    icon: (
      <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-6 4h4m8-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    items: [
      "Yapısal ve MEP modelleri için tek merkezli koordinasyon",
      "Bulut tabanlı clash ve revizyon yönetimi",
      "Saha ve BIM ekipleri arasında gerçek zamanlı senkron"
    ]
  },
  {
    title: "Veri Odaklı İzleme",
    description: "Sensör verisi, drone taramaları ve saha raporlarını birleşik gösterge panelinde toplayarak sürekli doğrulama sağlıyoruz.",
    icon: (
      <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m4 0h-4m0 0h-4m4 0v2m-4-2v2m-4-2H5m4 0v2M9 7h.01M15 7h.01M12 7h.01M12 3a9 9 0 110 18 9 9 0 010-18z" />
      </svg>
    ),
    items: [
      "24/7 yapı sağlığı sensörleri",
      "Fotogrametri tabanlı ilerleme raporu",
      "Yapay zekâ destekli risk uyarıları"
    ]
  },
  {
    title: "Sürdürülebilir Performans",
    description: "Enerji, su ve karbon ayak izi metriklerini proje tasarımına erken evrede entegre ederek uzun ömürlü çözümler geliştiriyoruz.",
    icon: (
      <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-5a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    items: [
      "Enerji simülasyonu & gölgeleme analizi",
      "Malzeme yaşam döngüsü hesapları",
      "Yeşil sertifikasyon yol haritaları"
    ]
  }
];

const collaborationFlow = [
  {
    title: "Keşif Analizi",
    description: "Proje brifingi, veri toplama ve mevcut modellerin teknik durum analizi için yoğun çalışma sprintleri.",
    detail: "Yerinde keşif, risk matrisi, veri konsolidasyonu"
  },
  {
    title: "Tasarım Entegrasyonu",
    description: "Disiplinlerarası tasarım entegrasyonu, optimizasyon senaryoları ve değer mühendisliği oturumları.",
    detail: "Akıllı parametre analizi, malzeme seçimi, revizyon yönetimi"
  },
  {
    title: "Saha Otomasyonu",
    description: "Saha validasyonu, sensör kurulumu ve dijital ikiz eşleştirmesi ile inşaat sürecini kontrol altında tutarız.",
    detail: "IoT ağ mimarisi, saha uygulama protokolleri"
  },
  {
    title: "Performans Döngüsü",
    description: "İşletmeye geçiş, bakım stratejisi ve sürekli iyileştirme döngüleri ile verimliliği garanti altına alırız.",
    detail: "Performans göstergesi panelleri, bakım simülasyonları, optimizasyon ritüelleri"
  }
];

const testimonials = [
  {
    quote: "Ön tasarım fazından itibaren tüm disiplinleri tek çatı altında takip etmelerini, sahada hata payını dramatik biçimde düşüren ana faktör olarak görüyoruz.",
    name: "Duygu Karaman",
    role: "Proje Direktörü",
    company: "Skyline Developments"
  },
  {
    quote: "Sensör bazlı izleme ve veri raporları sayesinde yatırımcı sunumlarımız ölçülebilir ilerleme göstergeleriyle destekleniyor. Güven duvarını bu kadar hızlı inşa etmemiştik.",
    name: "Kerem Aksoy",
    role: "Genel Müdür",
    company: "Nova Infra"
  }
];

export default function EngineeringPartnersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary-100/70 via-white to-transparent" />

      <PageHero
        title="Mühendislik Partnerleri"
        subtitle="ENTEGRE PROJE EKOSİSTEMİ"
        description="Yüksek hassasiyetli projeleri tasarım aşamasından işletmeye kadar taşıyan, veri odaklı mühendislik partner ağımız."
        imagePath="https://images.unsplash.com/photo-1529429617124-aee711a271f0?auto=format&fit=crop&w=2070&q=80"
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">IREMWORLD MÜHENDİSLİK AĞI</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              Hassasiyet ve veriyle güçlenen mühendislik deneyimi
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Yapısal, mekanik ve dijital ikiz çözümlerini bir araya getirerek projelerinizi güvenle ölçeklendirmenizi sağlayan teknik partnerliğe davet ediyoruz.
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">DENEYİM SÜTUNLARI</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
              Entegre mühendislik partnerliği için yeniden kurgulanan süreçler
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-600 md:text-lg">
              Disiplinler arası koordinasyonu, veri doğrulamasını ve sürdürülebilirlik metriklerini tek çatı altında birleştirerek projelerinizi yüksek standartta güvence altına alıyoruz.
            </p>
          </motion.div>

          <div className="grid gap-6">
            {experiencePillars.map((pillar, index) => (
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
              Şehir ölçeğindeki projeleri aynı anda yöneten mühendislik partnerleri
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Global deneyimi ve yüksek teknolojiyi yerel hassasiyetlerle birleştiren partnerlerimiz, projelerinizin her adımında yanınızda.
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
                  Etüt aşamasından işletmeye uzanan tek ritimli süreç
                </h2>
                <p className="mt-6 text-base leading-relaxed text-primary-100/90">
                  Analiz, tasarım, saha ve işletme ekiplerini aynı veri akışında buluşturarak, projelerinizin her fazında güven veren bir otomasyon kurgusu oluşturuyoruz.
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
              Teknik partnerlerimizin deneyim notları
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
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-100/80">HAZIR OLDUĞUNUZDA</p>
                <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                  Projenizi ileri mühendislik standartlarıyla yükseltelim
                </h2>
                <p className="mt-6 text-base text-primary-100/90">
                  Teknik yol haritası, optimizasyon senaryoları ve sahaya özel çözüm önerileri için ekibimizle strateji oturumu planlayın.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href="/contact"
                    className="group inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-semibold text-primary-900 shadow-xl transition-all duration-300 hover:translate-y-[-2px] hover:bg-primary-50"
                  >
                    Strateji Oturumu Planla
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
                    Teknik Özet Talep Et
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
                  <p className="mt-3 text-lg font-semibold text-white">Mühendislik Rehberi</p>
                  <p className="mt-2 text-sm text-primary-100/90">Dijital ikiz kontrol listesi, saha otomasyon planı, risk değerlendirme şablonları.</p>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-2 text-sm text-primary-100/90">
                  <p>• Koordinasyon toplantı ritüelleri</p>
                  <p>• Performans göstergesi örnek panelleri</p>
                  <p>• Sürdürülebilirlik ölçüm araçları</p>
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
