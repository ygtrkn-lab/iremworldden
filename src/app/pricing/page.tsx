"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type PricingTier = {
  name: string;
  price: string;
  description: string;
  highlights: string[];
  cta: string;
  badge?: string;
};

type InventorySlot = {
  name: string;
  summary: string;
  kpis: string[];
};

type TimelineStep = {
  title: string;
  detail: string;
  timing: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const heroStats = [
  { label: "Aktif kampanya", value: "18" },
  { label: "Aylık gösterim", value: "420K" },
  { label: "İlk yanıt süresi", value: "4 saat" },
];

const pricingTiers: PricingTier[] = [
  {
    name: "Spotlight Hero",
    price: "₺145.000 / ay",
    description: "Ana sayfa hero sahnesinde tam ekran video + canlı data entegrasyonu.",
    highlights: [
      "Tam ekran hero slotu",
      "Özel geçiş animasyonları",
      "Video + görsel miks",
      "Kampanya performans paneli",
    ],
    cta: "Hero slotunu ayır",
    badge: "En popüler",
  },
  {
    name: "Premium Grid",
    price: "₺78.000 / ay",
    description: "Öne çıkan kartlarda garantili görünürlük ve hedefli CTA alanı.",
    highlights: [
      "9 kartlık dönüşümlü slot",
      "Lokasyon rozetleri",
      "CTA butonu + deep-link",
      "A/B test desteği",
    ],
    cta: "Grid paketini seç",
  },
  {
    name: "Immersive Story",
    price: "₺52.000 / ay",
    description: "Scrolling hikâye bloğu ile marka anlatımı ve dinamik içerik sürümleri.",
    highlights: [
      "Tam genişlik hikâye alanı",
      "GIF + video desteği",
      "Metin sürümleri",
      "Ara rapor mailing",
    ],
    cta: "Story rezervasyonu yap",
  },
];

const inventorySlots: InventorySlot[] = [
  {
    name: "Hero Spotlight",
    summary: "Günün ilk ziyaretiyle açılan hero sahnesi. 1 slot, maksimum etki.",
    kpis: ["Tam ekran", "Video + static", "Scroll tetik animasyonu"],
  },
  {
    name: "Premium Grid",
    summary: "9 kartlık carousel, gerçek ilan görselleriyle harmanlanan sponsor kartları.",
    kpis: ["%62 görünürlük", "Net lokasyon etiketi", "CTA izleme"],
  },
  {
    name: "Deep Dive Story",
    summary: "Satır içi anlatım alanı; görsel + metin + mini form kombinasyonu.",
    kpis: ["Parallax", "Form entegrasyonu", "Mikro CTA"],
  },
];

const timeline: TimelineStep[] = [
  { title: "Creative kickoff", detail: "Brief alımı, materyal talep listesi ve hedef KPI paylaşımı.", timing: "Gün 0" },
  { title: "Design & QA", detail: "Figma ön izlemesi, animasyon provası ve tracking testleri.", timing: "Gün 1-3" },
  { title: "Soft launch", detail: "Staging ortamında canlı veri ile senaryo testi.", timing: "Gün 4" },
  { title: "Go-live", detail: "İçerik yayına alınır, rapor erişimi açılır.", timing: "Gün 5" },
];

const faqs: FaqItem[] = [
  {
    question: "Slotları kim güncelliyor?",
    answer: "Kreatif dosyalarınızı ekiplerimiz web optimizasyonuna göre uyarlıyor, yayın onayını siz veriyorsunuz.",
  },
  {
    question: "İzleme raporu nasıl geliyor?",
    answer: "Günlük dashboard + haftalık PDF rapor sunuyoruz; talebe göre BigQuery entegrasyonu yapılabilir.",
  },
  {
    question: "Kontrat süresi minimum nedir?",
    answer: "Minimum 1 ay, hero slotu için 2 ay tavsiye ediyoruz. Paketler aylık yenilenir.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fc] text-gray-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fef9f5] via-white to-[#eef2ff]" />
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#ffd7ba]/60 blur-[140px]" />
        <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#c7d2fe]/70 blur-[140px]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-24 pt-24 text-center lg:pt-32">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Pricing</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Türkiye'nin seçkin konut kitlesine reklam verin.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
              Aylık 420 bin gösterim alan öne çıkanlar sayfası, yüksek bütçeli yatırımcıları hedefleyen markalar için
              hazırda bekleyen bir vitrin. Hero slotu anında awareness, grid kartlar ise tıklama ve form dönüşümü
              sağlayarak her kampanyanın geri dönüşünü ölçülebilir hale getirir.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-gray-900/10 transition hover:bg-gray-800"
              >
                Satın alma görüşmesi planla
              </Link>
              <Link
                href="mailto:hello@iremworld.com"
                className="rounded-full border border-gray-300 bg-white/80 px-8 py-3 text-sm font-semibold text-gray-700 backdrop-blur"
              >
                Deck iste
              </Link>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-lg shadow-gray-200/70">
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{stat.label}</p>
                <p className="mt-4 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-[-80px] max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[48px] border border-white/70 bg-white/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#fef9f5] via-white to-[#eef2ff]" />
          <div className="absolute -left-24 top-4 h-72 w-72 rounded-full bg-[#ffd7ba]/50 blur-[140px]" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#c7d2fe]/60 blur-[140px]" />
          <div className="relative grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <motion.article
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[32px] border border-gray-100 bg-white p-8 text-gray-600 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
            >
              {tier.badge && (
                <span className="absolute right-6 top-6 rounded-full bg-gray-900/10 px-3 py-1 text-xs font-semibold text-gray-700">
                  {tier.badge}
                </span>
              )}
              <p className="text-sm uppercase tracking-[0.4em] text-gray-400">Paket</p>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">{tier.name}</h2>
              <p className="mt-2 text-lg font-semibold text-gray-900">{tier.price}</p>
              <p className="mt-4 text-sm text-gray-600">{tier.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                {tier.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                {tier.cta}
              </Link>
            </motion.article>
          ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[40px] border border-gray-100 bg-white p-10 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1596&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]" />
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="lg:w-1/2">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Slot envanteri</p>
              <h2 className="mt-4 text-3xl font-semibold text-gray-900">Satılabilir alanları tanımlayın.</h2>
              <p className="mt-4 text-gray-600">
                Aktif portföyümüzden ayrılan üç temel alan bulunuyor. Dilerseniz aynı anda birden fazla slot rezerve
                edebilir, kreatifleri ortak stile göre güncelleyebiliriz.
              </p>
            </div>
            <div className="grid flex-1 gap-6 md:grid-cols-2">
              {inventorySlots.map((slot) => (
                <div key={slot.name} className="rounded-[28px] border border-gray-100 bg-gray-50 p-6 text-gray-600">
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{slot.name}</p>
                  <p className="mt-3 text-gray-900">{slot.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {slot.kpis.map((kpi) => (
                      <span key={kpi} className="rounded-full bg-white px-3 py-1 text-gray-700 shadow-sm">
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6">
        <div className="rounded-[36px] border border-gray-100 bg-gradient-to-br from-white to-[#f8faff] p-10 shadow-[0_25px_80px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="lg:w-1/3">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Süreç</p>
              <h2 className="mt-4 text-3xl font-semibold text-gray-900">5 günde canlı yayın.</h2>
              <p className="mt-4 text-gray-600">
                Motion, copy ve tracking döngüsü tek flow. Süreci kendi operasyonlarımıza entegre ettiğimiz için
                hızlanıyoruz.
              </p>
            </div>
            <div className="flex-1 grid gap-6 md:grid-cols-2">
              {timeline.map((step) => (
                <div key={step.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_15px_40px_rgba(15,23,42,0.05)]">
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-400">{step.timing}</p>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-sm text-gray-600">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-5xl px-6">
        <div className="rounded-[32px] border border-gray-100 bg-white p-10 shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">FAQ</p>
          <h2 className="mt-4 text-3xl font-semibold text-gray-900">Sık sorulanlar.</h2>
          <div className="mt-8 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{faq.question}</p>
                <p className="mt-3 text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-between gap-4 text-sm text-gray-600">
            <span>hello@iremworld.com</span>
            <span>+90 216 755 4738</span>
            <span>İstanbul · Sarphan Plaza</span>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 mb-24 max-w-4xl px-6 text-center">
        <div className="rounded-[40px] border border-gray-100 bg-white px-10 py-12 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Son adım</p>
          <h2 className="mt-4 text-3xl font-semibold text-gray-900">Slotu ayır, kreatifi gönder.</h2>
          <p className="mt-4 text-gray-600">
            Gerekli tüm materyal ve API erişimlerini paylaştığınızda, 48 saat içinde staging ön izlemesini
            gönderiyoruz.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Satış ekibi ile konuş
            </Link>
            <Link
              href="mailto:hello@iremworld.com"
              className="rounded-full border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-700"
            >
              Media kit indir
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
