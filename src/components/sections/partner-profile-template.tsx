import Link from "next/link";

export interface PartnerProfileContent {
  title: string;
  heroDescription: string;
  intro: string[];
  role: string;
  reasons: string[];
  advantage: string;
  metaDescription: string;
}

export default function PartnerProfileTemplate({ content }: { content: PartnerProfileContent }) {
  const { title, heroDescription, intro, role, reasons, advantage } = content;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-primary-900 to-primary-700 text-white py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
        <div className="container relative px-4">
          <p className="text-xs font-semibold tracking-[0.4em] text-primary-100/80 uppercase">İş Ortakları</p>
          <h1 className="mt-6 text-4xl md:text-5xl font-semibold max-w-3xl">{title}</h1>
          <p className="mt-6 text-base md:text-lg text-primary-100/90 max-w-3xl">{heroDescription}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container px-4 space-y-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-[0_60px_120px_-80px_rgba(15,23,42,0.45)]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Kimler İçin</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">{title}</h2>
              <div className="mt-6 space-y-4 text-base text-slate-600">
                {intro.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200/70 bg-slate-50 p-8 shadow-[0_50px_140px_-90px_rgba(15,23,42,0.55)]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Platformdaki Rolü</p>
              <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed">{role}</p>
            </article>
          </div>

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <article className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-[0_60px_120px_-90px_rgba(15,23,42,0.5)]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">?</div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">Neden Katılmalılar?</p>
                  <h3 className="text-xl font-semibold text-slate-900">Stratejik Avantajlar</h3>
                </div>
              </div>
              <ul className="mt-8 space-y-4">
                {reasons.map((reason, index) => (
                  <li key={index} className="flex gap-4 text-base text-slate-700">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-8 shadow-[0_50px_120px_-95px_rgba(79,70,229,0.9)]">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-600">Katılımın Avantajı</p>
              <p className="mt-5 text-base md:text-lg text-primary-900 leading-relaxed">{advantage}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container px-4">
          <div className="rounded-[32px] border border-primary-100/60 bg-gradient-to-br from-slate-950 via-primary-900 to-primary-700 px-8 py-14 text-center text-white shadow-[0_80px_160px_-100px_rgba(15,23,42,0.95)]">
            <h2 className="text-3xl font-semibold">İş Birliğini Başlatalım</h2>
            <p className="mt-5 text-base text-primary-100/90 max-w-3xl mx-auto">
              IW ağına katılmak, doğru yatırımcılar ve danışmanlarla tanışmanın en hızlı yoludur. Hemen iletişime geçerek süreci başlatabilirsiniz.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-white/95 px-7 py-3 text-sm font-semibold text-primary-900 shadow-lg shadow-primary-900/30 transition hover:bg-white"
              >
                İletişime Geçin
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
