"use client";

import { useEffect, useRef } from "react";
import PageHero from "@/components/sections/page-hero";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const coverages = [
  {
    title: "Kapsamlı Risk Analizi",
    description:
      "Projenizin konum, kullanım amacı ve yatırım hedeflerine göre özelleştirilmiş risk profili oluştururuz.",
    bullets: [
      "Farklı bölgeler için karşılaştırmalı risk skoru",
      "Lojistik, inşaat ve operasyonel aşamalar için ayrı senaryolar",
      "Doğal afet, fiziki hasar ve gelir kaybı içeren entegre çerçeve"
    ]
  },
  {
    title: "Poliçe Tasarım Stüdyosu",
    description:
      "Portföyünüzün dinamiklerine göre global sigorta firmalarıyla birlikte çalışarak optimum teminat setleri öneririz.",
    bullets: [
      "Konut, ticari ve karma projeler için modüler poliçe şablonları",
      "Yatırımcı beklentilerine göre teminat limitleri ve muafiyet planları",
      "Dijital teklif, kıyaslama ve onay süreci yönetimi"
    ]
  },
  {
    title: "Kesintisiz Poliçe Yönetimi",
    description:
      "Poliçelerin yenileme, belge doğrulama ve hasar süreçlerini tek panelde takip edebileceğiniz altyapı sunarız.",
    bullets: [
      "Global erişimli belge doğrulama kütüphanesi",
      "Hasar ihbarı ve ekspertiz ilerleme takibi",
      "Yatırımcılara özel raporlama ve risk sinyal bildirimleri"
    ]
  }
];

const advantages = [
  "Global sigorta firmalarıyla doğrudan bağlantı",
  "Proje bazlı teminat ve risk analizi",
  "Dijital poliçe yönetimi ve belge doğrulama kolaylığı",
  "Uluslararası kapsama seçenekleri",
  "Uzaktan kimlik ve vekalet doğrulama",
  "Yatırımcı dashboard'u ile canlı takip"
];

const workflows = [
  {
    step: "01",
    title: "Risk Keşfi",
    detail:
      "Yatırım hedeflerini, proje türünü ve operasyonel riskleri analiz ederek sigorta yol haritasını çıkarırız."
  },
  {
    step: "02",
    title: "Poliçe Mimarlığı",
    detail:
      "Global sigorta ağımızla teminat kapsamlarını kıyaslar, size özel teklif paketini oluşturarak onaya sunarız."
  },
  {
    step: "03",
    title: "Digital Onboarding",
    detail:
      "Tüm belgeleri dijital ortamda toplar, imza süreçlerini yönetir ve poliçe aktivasyonunu takip ederiz."
  },
  {
    step: "04",
    title: "Sürekli Güvence",
    detail:
      "Hasar, yenileme ve raporlama adımlarında operasyonunuzu kesintisiz destekleriz."
  }
];

export default function RealEstateInsurancePage() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const advantagesIntroRef = useRef<HTMLDivElement | null>(null);
  const workflowIntroRef = useRef<HTMLDivElement | null>(null);
  const coverageCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const advantageItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const workflowCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!pageRef.current) {
      return;
    }

    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const fadeUp = (target: HTMLElement | null, options: { delay?: number } = {}) => {
        if (!target) {
          return;
        }

        gsap.fromTo(
          target,
          { y: 48, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            delay: options.delay ?? 0,
            scrollTrigger: {
              trigger: target,
              start: "top 80%"
            }
          }
        );
      };

      fadeUp(introRef.current);
      fadeUp(advantagesIntroRef.current);
      fadeUp(workflowIntroRef.current);

      coverageCardsRef.current.forEach((card, index) => {
        if (!card) {
          return;
        }

        gsap.fromTo(
          card,
          { y: 60, opacity: 0, rotateX: -10, transformOrigin: "center top" },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            delay: index * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 85%"
            }
          }
        );

        const handleEnter = () => {
          gsap.to(card, {
            y: -10,
            scale: 1.025,
            boxShadow: "0 60px 160px -70px rgba(15,23,42,0.35)",
            borderColor: "rgba(59,130,246,0.28)",
            backgroundColor: "rgba(255,255,255,0.82)",
            duration: 0.45,
            ease: "power3.out"
          });
        };

        const handleLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: "0 40px 120px -60px rgba(15,23,42,0.25)",
            borderColor: "rgba(255,255,255,0.6)",
            backgroundColor: "rgba(255,255,255,0.6)",
            duration: 0.45,
            ease: "power3.out"
          });
        };

        card.addEventListener("pointerenter", handleEnter);
        card.addEventListener("pointerleave", handleLeave);
        cleanupFns.push(() => {
          card.removeEventListener("pointerenter", handleEnter);
          card.removeEventListener("pointerleave", handleLeave);
        });
      });

      advantageItemsRef.current.forEach((item, index) => {
        if (!item) {
          return;
        }

        gsap.fromTo(
          item,
          { x: 30, opacity: 0, filter: "blur(8px)" },
          {
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            delay: index * 0.06,
            scrollTrigger: {
              trigger: item,
              start: "top 90%"
            }
          }
        );

        const handleEnter = () => {
          gsap.to(item, {
            x: 12,
            backgroundColor: "rgba(255,255,255,0.9)",
            borderColor: "rgba(59,130,246,0.35)",
            duration: 0.35,
            ease: "power2.out"
          });
        };

        const handleLeave = () => {
          gsap.to(item, {
            x: 0,
            backgroundColor: "rgba(255,255,255,0.7)",
            borderColor: "rgba(255,255,255,0.6)",
            duration: 0.35,
            ease: "power2.out"
          });
        };

        item.addEventListener("pointerenter", handleEnter);
        item.addEventListener("pointerleave", handleLeave);
        cleanupFns.push(() => {
          item.removeEventListener("pointerenter", handleEnter);
          item.removeEventListener("pointerleave", handleLeave);
        });
      });

      workflowCardsRef.current.forEach((card, index) => {
        if (!card) {
          return;
        }

        gsap.fromTo(
          card,
          { y: 64, opacity: 0, rotateY: 14, transformOrigin: "center bottom" },
          {
            y: 0,
            opacity: 1,
            rotateY: 0,
            duration: 1,
            ease: "power3.out",
            delay: index * 0.07,
            scrollTrigger: {
              trigger: card,
              start: "top 85%"
            }
          }
        );

        const handleEnter = () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            backgroundColor: "rgba(255,255,255,0.85)",
            borderColor: "rgba(59,130,246,0.28)",
            duration: 0.4,
            ease: "power3.out"
          });
        };

        const handleLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            backgroundColor: "rgba(255,255,255,0.6)",
            borderColor: "rgba(255,255,255,0.6)",
            duration: 0.4,
            ease: "power3.out"
          });
        };

        card.addEventListener("pointerenter", handleEnter);
        card.addEventListener("pointerleave", handleLeave);
        cleanupFns.push(() => {
          card.removeEventListener("pointerenter", handleEnter);
          card.removeEventListener("pointerleave", handleLeave);
        });
      });
    }, pageRef);

    return () => {
      cleanupFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 top-0 h-[460px] w-[460px] rounded-full bg-primary-400/20 blur-[140px]" />
        <div className="absolute -left-32 bottom-0 h-[520px] w-[520px] rounded-full bg-amber-200/25 blur-[160px]" />
      </div>

      <PageHero
        title="Gayrimenkul Sigortaları"
        subtitle="GLOBAL RİSK YÖNETİMİ"
        description="Her gayrimenkul yatırımı, fiziksel ve finansal risklere karşı korunmalıdır. IremWorld, güvenilir sigorta firmalarını yatırımcılar, proje sahipleri ve danışmanlarla buluşturan global bir platformdur."
        imagePath="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2070&q=80"
        gradient="from-slate-950/80 via-slate-900/55 to-slate-900/10"
      />

      <section className="relative py-24">
        <div className="container">
          <div ref={introRef} className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">NEDEN IREMWORLD?</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              Uluslararası sigorta ağlarını tek dijital platformda buluşturuyoruz
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Farklı bölgelerdeki risk yönetimi çözümlerini kıyaslayarak en uygun poliçelere hızlı ve dijital erişim sağlarsınız.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coverages.map((coverage, index) => (
              <div
                key={coverage.title}
                ref={(element) => {
                  coverageCardsRef.current[index] = element;
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.25)] backdrop-blur-xl transition-colors"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-200/40 via-white/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <h3 className="text-xl font-semibold text-slate-900">{coverage.title}</h3>
                  <p className="mt-4 text-sm text-slate-600">{coverage.description}</p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    {coverage.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container">
          <div ref={advantagesIntroRef} className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">AVANTAJLAR</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              Sigorta süreçlerini dijitalleştirerek yatırımcı güvenini artırın
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Platformumuz poliçe planlamasından hasar yönetimine kadar tüm adımları tek merkezde toplayarak zaman kazandırır.
            </p>
          </div>

          <ul className="mt-16 grid gap-4 lg:grid-cols-2">
            {advantages.map((advantage, index) => (
              <li
                key={advantage}
                ref={(element) => {
                  advantageItemsRef.current[index] = element;
                }}
                className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-5 py-4 text-sm font-medium text-slate-700 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.25)] backdrop-blur-lg transition-colors"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {advantage}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container">
          <div ref={workflowIntroRef} className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">DENEYİM AKIŞI</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              Sigorta süreçleriniz dört adımda kontrol altında
            </h2>
            <p className="mt-6 text-base text-slate-600 md:text-lg">
              Risk keşfinden sürekli güvenceye kadar her adımı dijital olarak takip edebileceğiniz iş akışı sunuyoruz.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workflows.map((flow, index) => (
              <div
                key={flow.step}
                ref={(element) => {
                  workflowCardsRef.current[index] = element;
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 text-center shadow-[0_32px_90px_-60px_rgba(15,23,42,0.25)] backdrop-blur-xl transition-colors"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-200/40 via-white/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">{flow.step}</span>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{flow.title}</h3>
                  <p className="mt-5 text-sm text-slate-600">{flow.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}
