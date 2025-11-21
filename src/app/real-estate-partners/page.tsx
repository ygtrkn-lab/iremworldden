"use client";

import PageHero from "@/components/sections/page-hero";
import PartnerCard from "@/components/sections/partner-card";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { motion } from "framer-motion";

const partners = [
  {
    name: "Lumina Estates",
    logo: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=200&q=80",
    description: "İstanbul ve Dubai hattında ultra lüks rezidanslara dijital showroom deneyimi sunan teknoloji odaklı gayrimenkul stüdyosu.",
    services: ["Dijital Portföy", "Uluslararası Satış", "Yatırım Stratejisi", "Özel Concierge"],
    website: "https://luminaestates.com"
  },
  {
    name: "Nova Realty Collective",
    logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=200&q=80",
    description: "Yeni nesil veri analitiği kullanarak premium segment müşterileri için hiper kişiselleştirilmiş gayrimenkul teklifleri oluşturan butik ekip.",
    services: ["Veri Analitiği", "Premium Kiralama", "Marka Danışmanlığı", "Müşteri Deneyimi"],
    website: "https://novarealty.co"
  },
  {
    name: "Atlas Property Studio",
    logo: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=200&q=80",
    description: "Karma kullanımlı projeler için strateji, markalama ve satış süreçlerini tek çatı altında yürüten ödüllü tasarım odaklı gayrimenkul ajansı.",
    services: ["Marka Stratejisi", "Arsa Geliştirme", "Satış Mimarisı", "CRM Entegrasyonu"],
    website: "https://atlasstudio.com"
  },
  {
    name: "Serene Properties",
    logo: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=200&q=80",
    description: "Sürdürülebilir yaşam alanları ve wellness odaklı toplu konut projeleriyle bilinen, müşteri deneyimine öncelik veren partnerimiz.",
    services: ["Sürdürülebilirlik", "Wellness Konut", "Topluluk Yönetimi", "Dijital Satış"],
    website: "https://sereneproperties.co"
  },
  {
    name: "Arc & Co. Realty",
    logo: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=200&q=80",
    description: "Mimari hikayeleştirme ve artırılmış gerçeklik destekli satış sunumları ile global yatırımcı ağını büyüten yaratıcı gayrimenkul kolektifi.",
    services: ["AR Deneyimleri", "Global Portföy", "Yatırımcı İlişkileri", "İçerik Prodüksiyonu"],
    website: "https://arcandco.com"
  },
  {
    name: "Aether Living",
    logo: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=200&q=80",
    description: "Tasarım odaklı mikro rezidanslar ve esnek ofis alanları için hibrit pazarlama modelleri geliştiren yenilikçi gayrimenkul stüdyosu.",
    services: ["Mikro Rezidans", "Esnek Ofis", "Topluluk Kurgusu", "Deneyim Tasarımı"],
    website: "https://aetherliving.com"
  }
];

const stats = [
  {
    value: "120+",
    label: "Premium Portföy",
    caption: "Rezidanslar, karma kullanım ve ticari projeler",
    accent: "from-primary-500/20 via-primary-500/10 to-transparent"
  },
  {
    value: "48 sa",
    label: "Aktivasyon Süresi",
    caption: "Dijital onboarding ve marka kitleri iki gün içinde hazır",
    accent: "from-slate-900/10 via-primary-600/10 to-transparent"
  },
  {
    value: "4.9/5",
    label: "Partner Skoru",
    caption: "NPS ve proje sonrası deneyim anketleri",
    accent: "from-emerald-500/20 via-emerald-400/10 to-transparent"
  },
  {
    value: "24/7",
    label: "Proaktif Destek",
    caption: "Strateji, tasarım ve teknik operasyon tek noktada",
    accent: "from-violet-500/20 via-primary-500/10 to-transparent"
  }
];

const experiencePillars = [
  {
    title: "Butik Marka Deneyimi",
    description: "Minimal tasarım dilleri, sade tipografi ve kusursuz mikro geçişlerle portföylerinizi dijital sahneleriz.",
    items: [
      "Özelleştirilebilir mikrosite ve sunum kitleri",
      "Seçkin modüler UI bileşenleri",
      "Hyper-real render & video kürasyonu"
    ]
  },
  {
    title: "Veri Merkezli Strateji",
    description: "Gerçek zamanlı analitik, hedef kitle segmentasyonu ve yatırımı yönlendiren içgörülerle deneyimi sürekli optimize ederiz.",
    items: [
      "Canlı satış paneli ve davranış analitiği",
      "AI destekli müşteri eşleştirme motoru",
      "ROI ve pipeline raporları"
    ]
  },
  {
    title: "Tek Dokunuşta Entegrasyon",
    description: "CRM, otomasyon ve içerik yönetimini zahmetsiz biçimde bağlayarak ekibinizin tek platformdan çalışmasını sağlarız.",
    items: [
      "HubSpot / Salesforce senkronizasyonu",
      "Cloudinary & Vercel pipeline yönetimi",
      "Sahadan real-time içerik akışı"
    ]
  }
];

const collaborationFlow = [
  {
    title: "Discovery Sprint",
    description: "Marka tonunuzu, satış hedeflerinizi ve müşteri ritüellerinizi birlikte anlamlandırdığımız yoğun bir workshop dizisi.",
    detail: "Figma moodboard, persona haritaları ve sezgisel yolculuk kurguları"
  },
  {
    title: "Design System Build",
    description: "Farklı pazarlara uyarlanabilen, premium modüler bir gayrimenkul tasarım sistemi oluştururuz.",
    detail: "UI kit, tipografi ritmi ve rafine mikro animasyonlar"
  },
  {
    title: "Omni-channel Launch",
    description: "Fiziksel ve dijital temas noktalarını senkronize ederek lansmanı tek ritimde yönetiriz.",
    detail: "CRM tetiklemeleri, AR deneyimler, sosyal senaryolar"
  },
  {
    title: "Growth & Iterate",
    description: "Veriyle beslendiğimiz aylık büyüme ritüelleri, satış ve marka hedeflerinizi sürekli ileri taşır.",
    detail: "A/B testleri, yatırımcı raporlaması, deneyim iyileştirmeleri"
  }
];

const testimonials = [
  {
    quote: "IREMWORLD ekibi, markamızın minimal lüks çizgisini dijitalde birebir hissettiren tek partner oldu. İlk çeyrekte satış hızımız %34 arttı.",
    name: "Selin Arman",
    role: "Kurucu Ortak",
    company: "Nova Realty"
  },
  {
    quote: "Atölye çalışmaları ve veri odaklı içgörüleri sayesinde yatırımcı sunumlarımız global teknoloji lansmanları gibi akıyor. Müşteri geri dönüşleri enfes.",
    name: "Kaan Bekler",
    role: "Satış Direktörü",
    company: "Arc & Co. Realty"
  }
];

export default function RealEstatePartnersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary-100/70 via-white to-transparent" />

      <PageHero
        title="Emlak Ofisi Partnerleri"
        subtitle="MODERN GAYRİMENKUL EKOSİSTEMİ"
        description="Yeni nesil yatırımcı beklentilerine göre tasarlanmış, üst düzey dijital estetiği gerçek satış metrikleriyle buluşturan partner programı."
        imagePath="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2070&q=80"
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">IREMWORLD PARTNER EXPERIENCE</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              Tasarım odaklı, veriye dayalı partnerlik modeli
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Pazarlama, strateji ve dijital showroom deneyimlerini tek çatı altında toplayan, geleceğin gayrimenkul markaları için tasarlanmış premium ekosisteme katılın.
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">EXPERIENCE PILLARS</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
              Modern gayrimenkul için yeniden tasarlanmış partner yolculuğu
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-600 md:text-lg">
              Global tasarım trendlerini sezgisel bir deneyim anlayışıyla birleştirerek portföylerinizi premium müşterilerle buluşturuyoruz. Her dokunuşta yalın ama derin bir marka atmosferi kuruyoruz.
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
                    <div className="h-10 w-10 rounded-full bg-primary-500/10" />
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
              Dünyanın farklı şehirlerinden çağdaş partnerlerle aynı anda çalışın
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Özgün marka hikayesine sahip stüdyolarla ortaklaşa üretiyor, dijital showroom'larınızı üst segment lansman standartlarında kurguluyoruz.
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
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-200">COLLABORATION FLOW</p>
                <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                  İçgörüden lansmana tek ritimli yolculuk
                </h2>
                <p className="mt-6 text-base leading-relaxed text-primary-100/90">
                  Strateji, tasarım ve operasyon ekiplerimiz; markanızın tonunu koruyarak tüm değer zincirini tek merkezde toplar. Sezgisel, rafine ve bütünlüklü bir deneyim yaratırız.
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">VOICES FROM PARTNERS</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
              Partnerlerimiz deneyimi nasıl tanımlıyor?
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
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-100/80">READY WHEN YOU ARE</p>
                <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                  Üst düzey bir gayrimenkul deneyimi tasarlayalım
                </h2>
                <p className="mt-6 text-base text-primary-100/90">
                  Partner topluluğumuza katılın, lansman ritmini beraber kurgulayalım ve premium müşterileriniz için unutulmaz bir yolculuk tasarlayalım.
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
                    Program Rehberi İndir
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
                  <p className="mt-3 text-lg font-semibold text-white">Partner Playbook</p>
                  <p className="mt-2 text-sm text-primary-100/90">Dijital showroom checklist, CRM entegrasyon akışı, marka kiti yönergeleri.</p>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-2 text-sm text-primary-100/90">
                  <p>• Premium portföy lansman storyboard'ları</p>
                  <p>• İlham verici UI bileşen kütüphanesi</p>
                  <p>• Üst segment sunum şablonları</p>
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
