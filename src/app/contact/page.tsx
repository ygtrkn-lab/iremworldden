"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "24 sn", label: "İlk geri dönüş ortalaması" },
  { value: "50+", label: "Kurumsal çözüm ortağı" },
  { value: "12", label: "Aktif ülke ekosistemi" }
];

const contactChannels = [
  {
    label: "Merkez Ofis",
    title: "Sarphan Finanspark",
    description: "Finanskent Mah. A Blok No:32, Ümraniye / İstanbul",
    meta: "Hafta içi 09:00 - 18:00",
    action: {
      href: "https://g.co/kgs/ZW1J5nA",
      label: "Haritada Aç"
    },
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.828 0L6.343 16.657a8 8 0 1 1 11.314 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    )
  },
  {
    label: "Telefon",
    title: "+90 216 755 47 38",
    description: "IremWorld global iletişim masası hafta içi her gün aktiftir.",
    meta: "08:30 - 20:00 canlı destek",
    action: {
      href: "tel:+902167554738",
      label: "Çağrı Başlat"
    },
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21L6.16 10.928c-.652.35-.852 1.17-.43 1.768C6.98 14.528 9.472 17.02 11.304 18.27c.598.422 1.418.222 1.768-.43l1.541-4.064a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.948V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5Z" />
      </svg>
    )
  },
  {
    label: "E-posta",
    title: "turkiye@iremworld.com",
    description: "Global projeler, veri paylaşımları ve basın talepleri için resmi kanal.",
    meta: "Ortalama yanıt: 6 saat",
    action: {
      href: "mailto:turkiye@iremworld.com",
      label: "Mesaj Yaz"
    },
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3 8 7.89 4.26a2 2 0 0 0 2.22 0L21 8" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />
      </svg>
    )
  }
];

const serviceHighlights = [
  {
    title: "Dijital Pazaryeri Altyapısı",
    description: "Platform katılımcılarına real-time stok, fiyatlama ve vitrin yönetimi için birleşik panel sunuyoruz."
  },
  {
    title: "Çok Kanallı Sunum",
    description: "İstanbul deneyim stüdyosu, global webinar stüdyosu ve saha ekipleri tek operasyon planında buluşur."
  },
  {
    title: "Operasyon Güvencesi",
    description: "Hukuk, finans ve teknik ekiplerimiz uluslararası gayrimenkul işlemlerinde kurumunuzun yanında yer alır."
  }
];

const globalInsights = [
  {
    title: "Global Vitrin Paneli",
    description: "Tek yönetim ekranından 40'tan fazla ülkeye simultane portföy yayını sağlayın.",
    metric: "54+ pazar"
  },
  {
    title: "Marka Güven Programı",
    description: "Doğrulanmış broker, geliştirici ve fonlarla standart güven protokolleri oluşturuyoruz.",
    metric: "%98 memnuniyet"
  },
  {
    title: "İleri Analitik",
    description: "İş zekâsı raporlarıyla talep, fiyat ve yatırım trendlerini canlı izleyin.",
    metric: "24 ülkede veri"
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const pageRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  const channelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const highlightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const globalSectionRef = useRef<HTMLDivElement | null>(null);
  const globalCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const mapCardRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const hoverCleanupRef = useRef<(() => void)[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // TODO: Bağlantı hazır olduğunda form verilerini sunucuya ilet.
    console.log("Form submitted:", formData);
  };

  useEffect(() => {
    if (!pageRef.current) {
      return;
    }

    hoverCleanupRef.current.forEach(clean => clean());
    hoverCleanupRef.current = [];

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 60, filter: "blur(16px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "expo.out"
          }
        );
      }

      statsRef.current.forEach((element, index) => {
        if (!element) {
          return;
        }

        gsap.fromTo(
          element,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: index * 0.08
          }
        );
      });

      channelRefs.current.forEach((element, index) => {
        if (!element) {
          return;
        }

        gsap.fromTo(
          element,
          { opacity: 0, y: 60, rotateX: -6, transformOrigin: "center top" },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            ease: "expo.out",
            delay: index * 0.12,
            scrollTrigger: {
              trigger: element,
              start: "top 85%"
            }
          }
        );

        const handleEnter = () => {
          gsap.to(element, {
            y: -8,
            scale: 1.02,
            backgroundColor: "rgba(255,255,255,0.82)",
            borderColor: "rgba(59,130,246,0.32)",
            boxShadow: "0 60px 160px -70px rgba(15,23,42,0.4)",
            duration: 0.45,
            ease: "power3.out"
          });
        };

        const handleLeave = () => {
          gsap.to(element, {
            y: 0,
            scale: 1,
            backgroundColor: "rgba(255,255,255,0.65)",
            borderColor: "rgba(255,255,255,0.6)",
            boxShadow: "0 40px 120px -70px rgba(15,23,42,0.35)",
            duration: 0.45,
            ease: "power3.out"
          });
        };

        element.addEventListener("pointerenter", handleEnter);
        element.addEventListener("pointerleave", handleLeave);
        hoverCleanupRef.current.push(() => {
          element.removeEventListener("pointerenter", handleEnter);
          element.removeEventListener("pointerleave", handleLeave);
        });
      });

      highlightRefs.current.forEach((element, index) => {
        if (!element) {
          return;
        }

        gsap.fromTo(
          element,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: index * 0.08,
            scrollTrigger: {
              trigger: element,
              start: "top 92%"
            }
          }
        );
      });

      if (globalSectionRef.current) {
        gsap.fromTo(
          globalSectionRef.current,
          { opacity: 0, y: 70, filter: "blur(18px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: globalSectionRef.current,
              start: "top 80%"
            }
          }
        );
      }

      globalCardRefs.current.forEach((element, index) => {
        if (!element) {
          return;
        }

        gsap.fromTo(
          element,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: index * 0.1,
            scrollTrigger: {
              trigger: element,
              start: "top 88%"
            }
          }
        );

        const handleEnter = () => {
          gsap.to(element, {
            y: -6,
            scale: 1.015,
            backgroundColor: "rgba(255,255,255,0.85)",
            borderColor: "rgba(59,130,246,0.28)",
            boxShadow: "0 55px 150px -70px rgba(15,23,42,0.38)",
            duration: 0.4,
            ease: "power3.out"
          });
        };

        const handleLeave = () => {
          gsap.to(element, {
            y: 0,
            scale: 1,
            backgroundColor: "rgba(255,255,255,0.7)",
            borderColor: "rgba(255,255,255,0.6)",
            boxShadow: "0 40px 120px -70px rgba(15,23,42,0.35)",
            duration: 0.4,
            ease: "power3.out"
          });
        };

        element.addEventListener("pointerenter", handleEnter);
        element.addEventListener("pointerleave", handleLeave);
        hoverCleanupRef.current.push(() => {
          element.removeEventListener("pointerenter", handleEnter);
          element.removeEventListener("pointerleave", handleLeave);
        });
      });

      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { opacity: 0, y: 60, filter: "blur(18px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: formCardRef.current,
              start: "top 85%"
            }
          }
        );
      }

      if (mapCardRef.current) {
        gsap.fromTo(
          mapCardRef.current,
          { opacity: 0, y: 80, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: mapCardRef.current,
              start: "top 80%"
            }
          }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 60, filter: "blur(16px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%"
            }
          }
        );
      }
    }, pageRef);

    return () => {
      hoverCleanupRef.current.forEach(clean => clean());
      hoverCleanupRef.current = [];
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-16 h-[480px] w-[480px] rounded-full bg-primary-300/30 blur-[180px]" />
        <div className="absolute -bottom-24 left-24 h-[420px] w-[420px] rounded-full bg-amber-200/20 blur-[160px]" />
      </div>

      <section className="relative pt-28 pb-16">
        <div className="container">
          <div
            ref={heroRef}
            className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/70 px-8 py-14 shadow-[0_65px_120px_-60px_rgba(15,23,42,0.45)] backdrop-blur-2xl md:px-14"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/85 via-white/65 to-white/35" />
            <div className="absolute right-6 top-6 hidden h-28 w-28 rounded-full bg-primary-500/10 blur-3xl md:block" />
            <div className="absolute -bottom-16 left-12 hidden h-36 w-36 rounded-full bg-sky-400/10 blur-3xl md:block" />

            <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
              <span className="rounded-full border border-slate-200/70 bg-white/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">
                IremWorld İletişim Merkezi
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl md:text-[56px] md:leading-[1.05]">
                IremWorld global pazaryeri; kurumsal emlak dünyası için tek iletişim kapısı
              </h1>
              <p className="mt-6 max-w-3xl text-base text-slate-600 md:text-lg">
                İstanbul Finans Merkezi'ndeki deneyim alanımızdan dünyanın dört bir yanındaki yatırım ofislerine uzanan tek temas noktası. IremWorld, tüm paydaşları aynı dijital mağazada buluşturur; hedefinizi paylaşmanız, küresel ekiplerimizin harekete geçmesi için yeterlidir.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    ref={element => {
                      statsRef.current[index] = element;
                    }}
                    className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-white/60 bg-white/65 px-6 py-4 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.25)] backdrop-blur-xl"
                  >
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-white/80 via-white/55 to-white/25" />
                    <span className="text-2xl font-semibold text-slate-900">{stat.value}</span>
                    <span className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
                  Irem<span className="text-[#f07f38]">World</span> iletişim yaklaşımı
                </h2>
                <p className="text-base text-slate-600 md:text-lg">
                  Finans, hukuk, pazarlama ve teknik ekiplerimiz ortak bir masa etrafında toplanır. Proje maketleri, veri ekranları ve saha ziyaretleri tek bir plan içinde kurgulanır; siz sadece hedefinizi paylaşırsınız.
                </p>
              </div>

              <div className="grid gap-6">
                {contactChannels.map((channel, index) => (
                  <div
                    key={channel.label}
                    ref={element => {
                      channelRefs.current[index] = element;
                    }}
                    className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/65 px-6 py-7 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-500"
                  >
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
                      <div className="h-full w-full bg-gradient-to-br from-white/90 via-white/65 to-white/30 transition duration-700 group-hover:scale-[1.02]" />
                    </div>
                    <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white/50 via-white/40 to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative z-[1] flex flex-wrap items-start gap-5 lg:flex-nowrap">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/75 text-primary-500 shadow-inner">
                        {channel.icon}
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">{channel.label}</p>
                        <h3 className="text-xl font-semibold text-slate-900">{channel.title}</h3>
                        <p className="text-sm text-slate-600">{channel.description}</p>
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">{channel.meta}</p>
                      </div>
                      <a
                        href={channel.action.href}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 transition-all duration-300 hover:border-primary-200 hover:text-primary-500"
                      >
                        <span>{channel.action.label}</span>
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative grid gap-4 overflow-hidden rounded-3xl border border-white/60 bg-white/65 p-6 shadow-[0_32px_90px_-70px_rgba(15,23,42,0.4)] backdrop-blur-xl">
                <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-white/88 via-white/60 to-white/30" />
                {serviceHighlights.map((highlight, index) => (
                  <div
                    key={highlight.title}
                    ref={element => {
                      highlightRefs.current[index] = element;
                    }}
                    className="flex flex-col gap-2 border-b border-slate-200/60 pb-4 last:border-none last:pb-0"
                  >
                    <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                      {highlight.title}
                    </div>
                    <p className="text-sm text-slate-600">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative grid gap-8">
              <div
                ref={formCardRef}
                className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/70 p-10 shadow-[0_50px_120px_-70px_rgba(15,23,42,0.4)] backdrop-blur-2xl"
              >
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary-100/30 via-white/20 to-transparent" />
                <div className="relative">
                  <h2 className="text-2xl font-semibold text-slate-900">Projenizi Bize Anlatın</h2>
                  <p className="mt-3 text-sm text-slate-600">
                    Hedeflerinizi birkaç cümleyle paylaşın; IremWorld uzmanları 24 saat içinde birlikte çalışma planını sizinle oluşturur.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Ad Soyad *</span>
                        <input
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Adınızı ve soyadınızı yazın"
                          className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-inner transition focus:border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-200/70"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Telefon</span>
                        <input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Tercih ettiğiniz numara"
                          className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-inner transition focus:border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-200/70"
                        />
                      </label>
                    </div>

                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">E-posta *</span>
                      <input
                        id="email"
                        name="email"
                        required
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="E-posta adresiniz"
                        className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-inner transition focus:border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-200/70"
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Konu</span>
                      <input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Talebinizin başlığını yazın"
                        className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-inner transition focus:border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-200/70"
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Mesaj *</span>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Projenizi ve ihtiyaçlarınızı kısaca özetleyin."
                        className="resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-inner transition focus:border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-200/70"
                      />
                    </label>

                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/60"
                    >
                      Mesaj Gönder
                    </button>
                  </form>
                </div>
              </div>

              <div
                ref={mapCardRef}
                className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_45px_120px_-70px_rgba(15,23,42,0.4)] backdrop-blur-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200/30 via-white/0 to-slate-100/60" />
                <div className="relative">
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-t-[28px]">
                    <iframe
                      title="IremWorld Konum"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.426857817477!2d29.11743407648046!3d41.00998672137779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab05e2e5f69a5%3A0x4c76cf8d8e7d6d58!2sSarphan%20Finanspark!5e0!3m2!1str!2str!4v1699999999999!5m2!1str!2str"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="flex flex-col gap-4 px-8 pb-8 pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-500">Konum</p>
                        <h3 className="text-lg font-semibold text-slate-900">İstanbul Finans Merkezi</h3>
                        <p className="text-sm text-slate-600">Sarphan Finanspark, Finanskent Mah. A Blok No:32</p>
                      </div>
                      <a
                        href="https://g.co/kgs/ZW1J5nA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 transition hover:border-primary-200 hover:text-primary-500"
                      >
                        Rotayı Aç
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                      <span>Vale Hizmeti</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>VIP Karşılama</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>Dijital Sunum Alanı</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="container">
          <div
            ref={globalSectionRef}
            className="relative overflow-hidden rounded-[36px] border border-white/60 bg-white/65 px-10 py-14 shadow-[0_60px_140px_-70px_rgba(15,23,42,0.45)] backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-200/25 via-white/40 to-transparent" />
            <div className="absolute -right-20 top-12 hidden h-[420px] w-[420px] rounded-full bg-sky-300/20 blur-[180px] lg:block" />
            <div className="absolute -left-24 bottom-0 hidden h-[360px] w-[360px] rounded-full bg-amber-200/20 blur-[160px] lg:block" />

            <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">
                  IremWorld Global Network
                </span>
                <h2 className="text-3xl font-semibold text-slate-900 md:text-[42px] md:leading-[1.1]">
                  Uluslararası gayrimenkul ekosistemleri için tekli sanal mağaza altyapısı
                </h2>
                <p className="text-base text-slate-600 md:text-lg">
                  IremWorld, brokerlerden geliştiricilere kadar tüm kurumsal aktörleri tek çatı altında buluşturur. Global vitrininizi yönetirken, yerel pazar dinamiklerine özel uyarlamalar yapmanızı sağlayan çok katmanlı bir platform sunuyoruz.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {globalInsights.map((insight, index) => (
                    <div
                      key={insight.title}
                      ref={element => {
                        globalCardRefs.current[index] = element;
                      }}
                      className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 px-6 py-6 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-all duration-500"
                    >
                      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-white/92 via-white/62 to-white/28 transition duration-700 group-hover:from-white/95 group-hover:via-white/68 group-hover:to-white/34" />
                      <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative z-[1] space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-500">{insight.metric}</p>
                        <h3 className="text-lg font-semibold text-slate-900">{insight.title}</h3>
                        <p className="text-sm text-slate-600">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_45px_120px_-70px_rgba(15,23,42,0.35)] backdrop-blur-2xl">
                  <div className="aspect-[4/3] w-full bg-gradient-to-br from-white/92 via-white/65 to-white/28" />
                  <div className="flex flex-col gap-4 px-8 pb-8 pt-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-500">Global Görünürlük</p>
                      <h3 className="text-lg font-semibold text-slate-900">Çok dilli vitrin yönetimi</h3>
                      <p className="text-sm text-slate-600">
                        Platformumuzda yer alan emlak şirketleri, portföylerini 8 dilde yayınlayıp ziyaretçilerin coğrafi konumuna göre özelleştirebilir.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                      <span>Çoklu Para Birimi</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>Yerelleştirilmiş Arayüz</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>API Entegrasyonları</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="container">
          <div
            ref={ctaRef}
            className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/70 px-8 py-12 text-center shadow-[0_50px_120px_-70px_rgba(15,23,42,0.4)] backdrop-blur-2xl md:px-16"
          >
            <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-white/90 via-white/60 to-white/28" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 via-white/40 to-transparent" />
            <div className="relative flex flex-col items-center gap-6">
              <span className="rounded-full border border-slate-200/70 bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">
                IremWorld ile iletişimde kalın
              </span>
              <h2 className="text-3xl font-semibold text-slate-900 md:text-[40px] md:leading-[1.1]">
                İhtiyacınızı paylaşın; küresel IremWorld ekibi aynı anda dijital ve fiziksel aksiyonları başlatsın
              </h2>
              <p className="max-w-3xl text-base text-slate-600 md:text-lg">
                Telefon, e-posta ya da İstanbul'daki ofisimiz fark etmeksizin; proje değerlendirme, yatırım planlama ve saha deneyimleri için tek temas noktanız biziz.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <a
                  href="tel:+902167554738"
                  className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-slate-800"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21L6.16 10.928c-.652.35-.852 1.17-.43 1.768C6.98 14.528 9.472 17.02 11.304 18.27c.598.422 1.418.222 1.768-.43l1.541-4.064a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.948V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5Z" />
                  </svg>
                  Telefonla Bağlan
                </a>
                <a
                  href="mailto:turkiye@iremworld.com"
                  className="inline-flex items-center gap-3 rounded-full border border-slate-200/70 bg-white/70 px-8 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-700 transition hover:border-primary-200 hover:text-primary-500"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3 8 7.89 4.26a2 2 0 0 0 2.22 0L21 8" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />
                  </svg>
                  E-posta Gönder
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
