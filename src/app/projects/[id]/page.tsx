"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import allProjects from "@/data/projects.json";

type SharePlatform = "whatsapp" | "instagram" | "sms";

interface Project {
  id: string;
  title: string;
  location: string;
  country: string;
  type: string;
  status: string;
  description: string;
  price: string;
  features: {
    projectName: string;
    projectType: string;
    projectStatus: string;
    estimatedPrice: string;
  };
  images: string[];
  video?: string;
  videoThumbnail?: string;
  agent: {
    name: string;
    title: string;
    phone: string;
    email: string;
    address: string;
    image: string;
  };
}

// JSON'dan gelen projeleri uygun formata dönüştür
const convertedProjects: Record<string, Project> = {};
allProjects.forEach((proj: any) => {
  convertedProjects[proj.id] = {
    id: proj.id,
    title: proj.title,
    location: proj.location,
    country: proj.country,
    type: proj.type,
    status: proj.status,
    description: proj.description,
    price: proj.price,
    features: proj.features,
    images: proj.images,
    video: proj.video,
    videoThumbnail: proj.videoThumbnail,
    agent: proj.agent
  };
});

const projectsData: Record<string, Project> = convertedProjects;

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = projectsData[projectId];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const totalImages = project?.images.length ?? 0;

  const handleNext = useCallback(() => {
    if (totalImages < 2) {
      return;
    }

    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const handlePrev = useCallback(() => {
    if (totalImages < 2) {
      return;
    }

    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  useEffect(() => {
    if (!project) {
      return;
    }

    setCurrentImageIndex(0);
  }, [project]);

  useEffect(() => {
    if (!project || totalImages <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }, 5000);

    return () => clearInterval(interval);
  }, [project, totalImages]);

  useEffect(() => {
    if (!isImageModalOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImageModalOpen(false);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, handlePrev, isImageModalOpen]);

  const shareProject = useCallback(
    (platform: SharePlatform) => {
      if (!project || typeof window === "undefined") {
        return;
      }

      const url = window.location.href;
      const text = `${project.title} - ${project.location}`;

      switch (platform) {
        case "whatsapp":
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
            "_blank",
            "noopener,noreferrer"
          );
          break;
        case "instagram":
          if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(url).then(() => {
              alert("Link panoya kopyalandı. Instagram'da paylaşabilirsiniz.");
            });
          }
          break;
        case "sms":
          window.open(`sms:?body=${encodeURIComponent(`${text} ${url}`)}`);
          break;
      }
    },
    [project]
  );

  const heroSummary = useMemo(() => {
    if (!project) {
      return "";
    }

    const sanitized = project.description.replace(/\s+/g, " ").trim();
    const sentences = sanitized.split(/\.\s+/);

    if (sentences.length === 0) {
      return sanitized;
    }

    const summary = sentences.slice(0, 2).join(". ");
    return sentences.length > 2 ? `${summary}.` : summary;
  }, [project]);

  const heroStats = useMemo(() => {
    if (!project) {
      return [];
    }

    return [
      {
        label: "Proje ID",
        value: project.id,
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7H8m8 4H8m3 4H8m5 4H8a2 2 0 01-2-2V7a2 2 0 012-2h9l3 3v10a2 2 0 01-2 2h-3" />
          </svg>
        )
      },
      {
        label: "Kategori",
        value: project.type,
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7l9-4 9 4-9 4-9-4zm0 6l9-4 9 4-9 4-9-4zm0 6l9-4 9 4" />
          </svg>
        )
      },
      {
        label: "Durum",
        value: project.status,
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2h-2.5M6 5H3a2 2 0 00-2 2v12a2 2 0 002 2h3" />
          </svg>
        )
      },
      {
        label: "Görsel",
        value: `${project.images.length}+`,
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12l6 7-6 7H3V5zm4 6.5l2.25 3 1.75-2 2.25 3H7v-4z" />
          </svg>
        )
      }
    ];
  }, [project]);

  const essentials = useMemo(() => {
    if (!project) {
      return [];
    }

    return [
      {
        label: "Lokasyon",
        value: project.location,
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11a3 3 0 100-6 3 3 0 000 6zm0 0c-4 0-7 2-7 4v3h14v-3c0-2-3-4-7-4z" />
          </svg>
        )
      },
      {
        label: "Proje Tipi",
        value: project.type,
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7l8-4 8 4-8 4-8-4zm0 5l8-4 8 4-8 4-8-4zm0 5l8-4 8 4" />
          </svg>
        )
      },
      {
        label: "Durum",
        value: project.status,
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      {
        label: "Fiyat",
        value: project.price,
        icon: (
          <svg className="h-5 w-5 text-[#f07f38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
          </svg>
        )
      }
    ];
  }, [project]);

  const mapEmbedUrl = useMemo(() => {
    if (!project) {
      return "";
    }

    // Google Maps Embed API - proper format
    const location = encodeURIComponent(project.location);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${location}`;
  }, [project]);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-slate-900">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Proje bulunamadı</h1>
          <p className="mt-2 text-sm text-slate-600">Aradığınız proje artık yayında olmayabilir.</p>
          <Link
            href="/projects"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f07f38] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#de6d2e]"
          >
            Projeler sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-neutral-50 text-slate-900">
      <section className="relative isolate h-[70vh] min-h-[520px] overflow-hidden">
        <div className="absolute inset-0">
          {project.images.map((image, index) => (
            <motion.div
              key={image}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src={image}
                alt={`${project.title} görsel ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-white" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white via-white/90 to-transparent" />
        <div className="absolute -right-36 top-14 h-72 w-72 rounded-full bg-[#f07f38]/25 blur-3xl" />
        <div className="absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-[#f07f38]/20 blur-3xl" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <Link href="/projects" className="inline-flex items-center gap-2 transition hover:text-slate-900">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Projeler
            </Link>
            <span>•</span>
            <span className="uppercase tracking-[0.25em] text-slate-400">Detay</span>
          </div>

          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-slate-500">
                <span className="rounded-full bg-[#f07f38] px-4 py-2 text-sm font-semibold text-white">ID: {project.id}</span>
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  {project.type}
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {project.location}
                </div>
                <div className="inline-flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                  </svg>
                  {project.status}
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{heroSummary}</p>
            </div>

            <div className="flex w-full flex-col gap-3 text-sm font-semibold text-slate-900 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f07f38] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#f07f38]/40 transition hover:bg-[#de6d2e]"
              >
                Uzman ile görüş
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                Galeriyi Aç
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {heroStats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#f07f38]/10 p-3 text-[#f07f38]">{stat.icon}</div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">{stat.label}</p>
                    <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isImageModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/85 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsImageModalOpen(false)}
              />

              <motion.div
                className="relative z-10 w-full max-w-5xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
                  aria-label="Kapat"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mb-6 flex flex-wrap items-start justify-between gap-4 text-slate-900">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Proje galerisi</p>
                    <h3 className="text-lg font-semibold leading-tight text-slate-900">{project.title}</h3>
                    <p className="text-sm text-slate-500">{project.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2.5 w-6 rounded-full transition-all ${
                          currentImageIndex === index ? "bg-[#f07f38]" : "bg-slate-200"
                        }`}
                        aria-label={`Görsel ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white">
                  {totalImages > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute left-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f38]/40"
                        aria-label="Önceki görsel"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="absolute right-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f38]/40"
                        aria-label="Sonraki görsel"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  <div className="relative h-[65vh] min-h-[320px] w-full">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={project.images[currentImageIndex]}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={project.images[currentImageIndex]}
                          alt={`${project.title} görsel ${currentImageIndex + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 70vw, 60vw"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/0 to-transparent" />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-slate-600">
                  <span className="text-sm">
                    {project.title} • {project.location}
                  </span>
                  <a
                    href={project.images[currentImageIndex]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    Orijinal görseli aç
                  </a>
                </div>

                <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                  {project.images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-2xl border transition-all ${
                        currentImageIndex === index
                          ? "border-[#f07f38] ring-2 ring-[#f07f38]/40"
                          : "border-slate-200 opacity-80 hover:opacity-100"
                      }`}
                      aria-label={`${project.title} küçük önizleme ${index + 1}`}
                    >
                      <Image src={image} alt="Galeri küçük görsel" fill className="object-cover" sizes="120px" />
                      {currentImageIndex === index && <div className="absolute inset-0 border-2 border-white" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="relative z-20 -mt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur sm:p-10"
          >
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="relative flex-1 overflow-hidden rounded-[28px] border border-slate-100 bg-slate-50 shadow-inner">
                {totalImages > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f38]/40"
                      aria-label="Önceki görsel"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f38]/40"
                      aria-label="Sonraki görsel"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                <div className="relative h-[420px] w-full sm:h-[520px]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={project.images[currentImageIndex]}
                      initial={{ opacity: 0.6, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={project.images[currentImageIndex]}
                        alt={`${project.title} görsel ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 800px"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/5 to-transparent" />

                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-slate-600 shadow">
                  <span>{currentImageIndex + 1}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>{totalImages}</span>
                </div>
              </div>

              <div className="w-full max-w-xl space-y-6 lg:w-80">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Görsel galerisi</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{project.title} görselleri</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Projenin peyzajından iç mekanlarına kadar güncel fotoğrafları inceleyin. Tam ekran izlemek için aşağıdaki butonu kullanabilirsiniz.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {project.images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square overflow-hidden rounded-2xl border text-left transition-all ${
                        currentImageIndex === index
                          ? "border-[#f07f38] shadow-lg shadow-[#f07f38]/30"
                          : "border-slate-200 hover:border-[#f07f38]"
                      }`}
                      aria-label={`${project.title} küçük görsel ${index + 1}`}
                    >
                      <Image src={image} alt={`${project.title} küçük görsel ${index + 1}`} fill className="object-cover" sizes="120px" />
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsImageModalOpen(true)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#f07f38] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#de6d2e]"
                  >
                    Tam ekran izle
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m18 0V5a2 2 0 00-2-2h-4m0 18h4a2 2 0 002-2v-4M3 15v4a2 2 0 002 2h4" />
                    </svg>
                  </button>
                  <a
                    href={project.images[currentImageIndex]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    Orijinal görsel
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur sm:p-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {essentials.map((item) => (
                <div key={item.label} className="flex items-start gap-3 text-slate-800">
                  <div className="rounded-full bg-[#f07f38]/10 p-3 text-[#f07f38]">{item.icon}</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-10">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <h2 className="text-3xl font-semibold text-slate-900">Proje hakkında</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">{project.description}</p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-slate-900">Proje Bilgileri</h3>
                  <span className="text-xs uppercase tracking-[0.35em] text-slate-300">Özet</span>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {Object.entries(project.features).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#f07f38]" />
                      <p className="text-sm font-medium leading-relaxed">
                        <strong className="text-slate-900">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.section>

              {project.agent && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-slate-900">İletişim Bilgileri</h3>
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-300">Danışman</span>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      {project.agent.image && (
                        <img
                          src={project.agent.image}
                          alt={project.agent.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-slate-900">{project.agent.name}</h4>
                        <p className="text-sm text-slate-600">{project.agent.title}</p>
                        <div className="mt-3 space-y-1 text-sm text-slate-600">
                          {project.agent.phone && (
                            <div className="flex items-center gap-2">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{project.agent.phone}</span>
                            </div>
                          )}
                          {project.agent.email && (
                            <div className="flex items-center gap-2">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>{project.agent.email}</span>
                            </div>
                          )}
                          {project.agent.address && (
                            <div className="flex items-center gap-2">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span>{project.agent.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </div>

            <aside className="space-y-8 lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
              >
                <h4 className="text-xl font-semibold text-slate-900">Uzman danışmanımızla görüşün</h4>
                <p className="mt-2 text-sm text-slate-600">
                  İhtiyaçlarınıza uygun daire seçimi, yatırım getirisi ve ödeme planı için 48 saat içinde sizi arıyoruz.
                </p>
                <div className="mt-6 space-y-3">
                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f07f38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#de6d2e]"
                  >
                    Hemen iletişime geç
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    Tanıtım dosyasını indir
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
              >
                <h4 className="text-xl font-semibold text-slate-900">Konum</h4>
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                  <iframe
                    title={`${project.title} harita`}
                    src={mapEmbedUrl}
                    className="h-56 w-full"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Haritada aç
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
              >
                <h4 className="text-xl font-semibold text-slate-900">Projeyi paylaş</h4>
                <p className="mt-2 text-sm text-slate-600">Takımınızla veya yatırımcılarla saniyeler içinde paylaşın.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => shareProject("whatsapp")}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-100"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                    </svg>
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => shareProject("instagram")}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 text-sm font-semibold text-purple-700 transition hover:from-purple-100 hover:to-pink-100"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Instagram
                  </button>
                  <button
                    type="button"
                    onClick={() => shareProject("sms")}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-200"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.22 0-2.39-.213-3.45-.6L3 21l1.043-3.129C3.377 16.815 3 14.961 3 13c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    SMS
                  </button>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 block md:hidden">
        <div className="pointer-events-auto mx-auto max-w-7xl px-4 pb-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="flex-1 rounded-full bg-[#f07f38] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#de6d2e]"
              >
                Uzman ile görüş
              </Link>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                Galeri
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
