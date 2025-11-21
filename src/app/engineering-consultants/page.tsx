import { FiCheck, FiShield, FiGlobe, FiAward } from "react-icons/fi";
import PageHero from "@/components/sections/page-hero";

export const metadata = {
  title: "Mühendisler - İş Ortaklarımız | IREM World",
  description: "IremWorld, mühendisler ve teknik danışmanlar için proje sözleşmeleri, fikri mülkiyet koruması, ruhsat süreçleri ve kapsamlı hukuki danışmanlık hizmeti sunar.",
};

export default function EngineeringConsultantsPage() {
  const services = [
    "Mühendislik ve danışmanlık sözleşmeleri hazırlanması",
    "Patent, tasarım ve teknik buluş tescili",
    "Şirket kurulumu, hisse devri ve ortaklık protokolleri",
    "Ruhsat, izin ve proje uygunluk süreçlerinde yasal temsil",
    "Tedarikçi, taşeron ve yüklenici sözleşmeleri",
    "Uyuşmazlık çözümü, tahkim ve dava takibi"
  ];

  const features = [
    {
      icon: FiAward,
      title: "Uluslararası Mühendislik Sözleşmeleri",
      description: "Uzman hukuk desteği ile teknik ve ticari süreçler"
    },
    {
      icon: FiGlobe,
      title: "Çok Dilli Danışmanlık",
      description: "Türkçe, İngilizce, Arapça ve Rusça dillerinde hizmet"
    },
    {
      icon: FiShield,
      title: "Global İşlem Kolaylığı",
      description: "Uzaktan vekalet ve sözleşme onay sistemleri"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PageHero
        title="Mühendisler"
        subtitle="İŞ ORTAKLARIMIZ"
        description="Teknik projeleriniz için güçlü hukuki çerçeve ve danışmanlık."
        imagePath="/images/partners/engineering-hero.jpg"
        gradient="from-slate-950/85 via-slate-900/55 to-slate-900/10"
      />

      {/* About Section */}
      <section className="relative py-14 md:py-20">
        <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-slate-200/60 blur-3xl" />
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 text-center">HİZMET HAKKINDA</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-slate-900 mb-6 md:mb-8 text-center">Mühendislikte Hukuki Çerçeve</h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                Mühendislik projeleri; teknik uzmanlığın yanı sıra güçlü bir hukuki çerçeveye ihtiyaç duyar. Sözleşmeler, proje teslim süreçleri ve fikri hakların korunması, mühendislik çalışmalarının sürdürülebilirliği için kritik öneme sahiptir.
              </p>
              <p>
                <strong>IremWorld</strong>, mühendisler ve teknik danışmanlar için uluslararası hukuk bürolarıyla iş birliği yaparak;
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proje ve danışmanlık sözleşmeleri</li>
                <li>Fikri mülkiyet ve patent koruması</li>
                <li>Şirket kurulumu ve ortaklık anlaşmaları</li>
                <li>Ruhsat, izin ve teknik uygunluk süreçlerinde hukuki danışmanlık sunar</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="container px-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 text-center">NEDEN IREMWORLD?</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-slate-900 mb-6 md:mb-10 text-center">Teknik süreçleri güvenle yönetin</h2>
          <p className="text-base md:text-lg text-slate-600 text-center max-w-3xl mx-auto mb-10 md:mb-14">
            Mühendislik alanına özel dijital hukuk altyapımız, teknik ve ticari süreçleri şeffaf, güvenli ve hızlı hale getirir.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-7 md:p-8 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.55)] backdrop-blur transition-all hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary-50/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <feature.icon className="w-12 h-12 text-primary-500 mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-14 md:py-20">
        <div className="container px-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 text-center">HİZMET SETİ</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-slate-900 mb-8 md:mb-12 text-center">Sağlanan Hizmetler</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              {services.map((service, index) => (
                <div key={index} className="flex items-start gap-3 md:gap-4 p-5 md:p-6 rounded-2xl border border-slate-200/70 bg-white/80 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.6)] backdrop-blur hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <FiCheck className="w-5 h-5 md:w-6 md:h-6 text-primary-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-700 font-medium text-sm md:text-base">{service}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact-section" className="relative py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-[36px] border border-primary-100/40 bg-gradient-to-br from-slate-950 via-primary-900 to-primary-700 px-8 py-16 text-white shadow-[0_70px_160px_-90px_rgba(15,23,42,0.9)] md:px-16 text-center">
            <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-primary-400/40 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <h2 className="text-3xl font-semibold md:text-4xl">Mühendislik Projelerinizde Yanınızdayız</h2>
            <p className="mt-6 text-base text-primary-100/90 max-w-2xl mx-auto">
              Teknik projelerinizi güvence altına almak ve hukuki süreçlerinizi kolaylaştırmak için bize ulaşın.
            </p>
            <div className="mt-10">
              <a
                href="/contact"
                className="group inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-semibold text-primary-900 shadow-xl transition-all duration-300 hover:translate-y-[-2px] hover:bg-primary-50"
              >
                İletişime Geçin
                <svg
                  className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
