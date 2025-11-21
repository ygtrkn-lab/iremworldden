"use client";

import PageHero from "@/components/sections/page-hero";
import PartnerCard from "@/components/sections/partner-card";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { motion } from "framer-motion";

const partners = [
  {
    name: "Fluxion Labs",
    logo: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=200&q=80",
    description: "Proptech girişimleri için veri platformları, API entegrasyonları ve gerçek zamanlı analitik sağlayan ürün ekibi.",
    services: ["Proptech API", "Veri Ambarı", "Görselleştirme", "Ürün Danışmanlığı"],
    website: "https://fluxionlabs.co"
  },
  {
    name: "Sysnova One",
    logo: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=200&q=80",
    description: "Akıllı bina otomasyonu, sensör ağları ve enerji tasarrufu çözümlerini tek platformda buluşturan teknoloji ortağı.",
    services: ["Bina Otomasyonu", "Sensör Ağı", "Enerji Optimizasyonu", "IoT Dashboard"],
    website: "https://sysnova.one"
  },
  {
    name: "HoloEstate Studio",
    logo: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=200&q=80",
    description: "Artırılmış gerçeklik, dijital ikiz ve sanal tur teknolojileriyle pazarlama deneyimlerini üst seviyeye taşıyan yaratıcı stüdyo.",
    services: ["AR/VR Deneyimleri", "Dijital İkiz", "Sanal Tur", "3D İçerik"],
    website: "https://holoestate.studio"
  },
  {
    name: "Gridpulse",
    logo: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=80",
    description: "Yapay zekâ destekli müşteri deneyimi, chatbot ve otomasyon çözümleriyle satış ekiplerine hız kazandıran platform.",
    services: ["AI Asistan", "Otomasyon", "CRM Entegrasyonu", "Müşteri Analitiği"],
    website: "https://gridpulse.ai"
  },
  {
    name: "Bluemist Cloud",
    logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80",
    description: "Bulut altyapısı, güvenlik ve içerik dağıtımını gayrimenkul projelerine göre optimize eden teknoloji sağlayıcısı.",
    services: ["Bulut Altyapısı", "İçerik Dağıtımı", "Güvenlik", "DevOps"],
    website: "https://bluemistcloud.com"
  },
  {
    name: "LineaSense",
    logo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=200&q=80",
    description: "Akıllı sensörler ve veri toplama cihazlarıyla saha ölçümlerini dijital sisteme taşıyan donanım ekosistemi.",
    services: ["Sensör Donanımı", "Veri Toplama", "API Köprüsü", "Teknik Servis"],
    website: "https://lineasense.io"
  }
];

const stats = [
  {
    value: "42+",
    label: "Teknoloji Modülü",
    caption: "Proptech, otomasyon ve pazarlama dikeylerinde aktif çözümler",
    accent: "from-primary-500/20 via-primary-400/10 to-transparent"
  },
  {
    value: "18 ülke",
    label: "Dağıtım Ağı",
    caption: "Eş zamanlı destek verdiğimiz global partner lokasyonları",
    accent: "from-slate-900/10 via-primary-500/15 to-transparent"
  },
  {
    value: "99.7%",
    label: "Sistem Erişilebilirliği",
    caption: "Yıl geneline yayılan altyapı çalışma süresi ortalaması",
    accent: "from-emerald-500/20 via-emerald-400/10 to-transparent"
  },
  {
    value: "4 hafta",
    label: "Entegrasyon Süresi",
    caption: "Pilot projenin canlıya alınması için gereken ortalama zaman",
    accent: "from-violet-500/20 via-primary-500/10 to-transparent"
  }
];

const innovationTracks = [
  {
    title: "Dijital Altyapı",
    description: "Bulut mimarisi, mikro servis entegrasyonları ve API güvenliğini uçtan uca kurguluyoruz.",
    icon: (
      <svg className="h-6 w-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h8m-8 5h16" />
      </svg>
    ),
    items: [
      "Çok katmanlı API yönetimi",
      "Dinamik içerik dağıtımı",
      "Otomatik ölçeklenebilirlik"
    ]
  },
  {
    title: "Deneyim Tasarımı",
    description: "Pazarlama ve satış ekipleri için sezgisel arayüzler, etkileşimli içerikler ve akışlar geliştiriyoruz.",
    icon: (
      <svg className="h-6 w-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-.75-3m1.5 0L12 4l2.25 13m-4.5 0h4.5M15 17l-.75 3-.75-3" />
      </svg>
    ),
    items: [
      "Sanal tur ve 3D sunum modülleri",
      "Çoklu kanal deneyim setleri",
      "Hızlı prototipleme sprintleri"
    ]
  },
  {
    title: "Veri & Analitik",
    description: "Sensör, CRM ve pazarlama verilerini tek pano üzerinde buluşturarak karar süreçlerini hızlandırıyoruz.",
    icon: (
      <svg className="h-6 w-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3v18M6 8v13m10-9v9m5-5v5M1 21h22" />
      </svg>
    ),
    items: [
      "Gerçek zamanlı raporlama",
      "Öngörü analitiği",
      "Aksiyon bazlı uyarılar"
    ]
  }
];

const collaborationFlow = [
  {
    title: "Teknoloji Keşfi",
    description: "İhtiyaç analizini, mevcut sistemlerinizi ve hedef deneyimi teknik ekiplerle aynı masada tartışıyoruz.",
    detail: "Sistem haritası, entegrasyon kontrol listesi, vizyon oturumu"
  },
  {
    title: "Prototip & Test",
    description: "Hızlı prototipler ve kullanıcı testleri ile ürünün akışını doğruluyor, iyileştirme planı çıkarıyoruz.",
    detail: "Design sprints, kullanıcı senaryoları, geribildirim döngüsü"
  },
  {
    title: "Canlıya Alma",
    description: "DevOps, güvenlik ve eğitim süreçlerini aynı rota üzerinde kurgulayarak yayına geçiyoruz.",
    detail: "Devreye alma checklist'i, performans izleme, eğitim içerikleri"
  },
  {
    title: "Sürekli Gelişim",
    description: "Ölçümler ve kullanıcı geri bildirimleriyle sürümleri düzenli olarak geliştiriyor, yeni modüller ekliyoruz.",
    detail: "Yol haritası ritüelleri, KPI panoları, sürüm planları"
  }
];

const testimonials = [
  {
    quote: "CRM entegrasyonlarını haftalar yerine günler içinde tamamladılar. Satış ekibimizin gerçek zamanlı görünürlüğü ciddi anlamda arttı.",
    name: "Beste Arslan",
    role: "Satış Operasyonları Lideri",
    company: "Cresta Living"
  },
  {
    quote: "Dijital ikiz ve AR içerikleri sayesinde lansman sürecinde ziyaretçi etkileşiminde %47 artış yakaladık. Tüm altyapıyı tek noktadan yönetiyoruz.",
    name: "Furkan Demir",
    role: "Pazarlama Direktörü",
    company: "Nova Urban"
  }
];

export default function TechnologyPartnersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary-100/70 via-white to-transparent" />

      <PageHero
        title="Teknoloji Partnerleri"
        subtitle="DİJİTAL DÖNÜŞÜM AĞI"
        description="Gayrimenkul projelerini veri odaklı platformlara dönüştüren, hızlı entegrasyon ve kusursuz deneyim sunan teknoloji partner ekosistemi."
        imagePath="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2070&q=80"
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">IREMWORLD TECH NETWORK</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              Dijital hız ve deneyim kalitesini aynı anda sunan teknoloji ortaklığı
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Altyapıdan pazarlamaya uzanan teknoloji zincirini tek platformda yöneterek ekiplerinizin odaklanmasını kolaylaştırıyoruz.
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">YENİLİK HATLARI</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
              Teknoloji yolculuğunu üç ana hat üzerinden kurguluyoruz
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-600 md:text-lg">
              Altyapı, deneyim ve veri katmanlarını entegre ederek projelerinizi ölçeklendirmenizi sağlayan modern bir mimari kuruyoruz.
            </p>
          </motion.div>

          <div className="grid gap-6">
            {innovationTracks.map((track, index) => (
              <motion.div
                key={track.title}
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
                      {track.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{track.title}</h3>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 md:text-base">{track.description}</p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-600">
                    {track.items.map((item) => (
                      <li key={`${track.title}-${item}`} className="flex items-start gap-2">
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
              Saha operasyonlarından pazarlamaya uzanan teknoloji ortakları
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Fiziksel mekanlarınızı dijital dünyaya taşıyan, veriyle güçlendiren ve müşteri deneyimini hızlandıran partnerlerimizle tanışın.
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
                  Keşiften yayına sorunsuz teknoloji deneyimi
                </h2>
                <p className="mt-6 text-base leading-relaxed text-primary-100/90">
                  Ürün ekipleri, geliştiriciler ve pazarlama takımlarıyla birlikte çalışarak her fazı ölçülebilir çıktılarla destekliyoruz.
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
              Teknoloji ortaklarımızdan gelen geri bildirimler
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
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-100/80">GELECEĞE HAZIR</p>
                <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                  Projelerinizi modern teknoloji altyapısıyla güçlendirelim
                </h2>
                <p className="mt-6 text-base text-primary-100/90">
                  Entegrasyon planından ürün rotasına kadar tüm süreci birlikte kurgulamak için teknoloji oturumu planlayın.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href="/contact"
                    className="group inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-semibold text-primary-900 shadow-xl transition-all duration-300 hover:translate-y-[-2px] hover:bg-primary-50"
                  >
                    Teknoloji Oturumu Planla
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
                    Platform Özeti Al
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
                  <p className="mt-3 text-lg font-semibold text-white">Tech Blueprint</p>
                  <p className="mt-2 text-sm text-primary-100/90">Mimari diyagramlar, entegrasyon planı, güvenlik kontrol listeleri.</p>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-2 text-sm text-primary-100/90">
                  <p>• Modül kataloğu ve fiyatlama seçenekleri</p>
                  <p>• SLA ve destek kapsamı</p>
                  <p>• Başarı hikâyeleri ve referanslar</p>
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
