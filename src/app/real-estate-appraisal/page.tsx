import { FiCheck, FiShield, FiGlobe, FiAward, FiTrendingUp } from "react-icons/fi";
import PageHero from "@/components/sections/page-hero";
import AppraisalComparison from "@/components/sections/appraisal-comparison";

export const metadata = {
  title: "Ekspertiz - İş Ortaklarımız | IREM World",
  description: "IremWorld, lisanslı değerleme uzmanları ve hukuk danışmanlarıyla iş birliği yaparak gayrimenkul değerleme, uluslararası standartlara uyum ve kapsamlı danışmanlık hizmeti sunar.",
};

export default function RealEstateAppraisalPage() {
  const services = [
    "Gayrimenkul ve proje değerleme sözleşmeleri hazırlanması",
    "Ekspertiz raporu doğrulama ve yasal uygunluk denetimi",  
    "Lisans ve yetkilendirme süreçleri için hukuki destek",
    "Vergi, risk ve piyasa analizi danışmanlığı",
    "Uluslararası yatırım projelerinde değerleme koordinasyonu",
    "Uyuşmazlık ve dava süreçlerinde bilirkişi desteği"
  ];

  const features = [
    {
      icon: FiAward,
      title: "Uluslararası Standartlara Tam Uyum",
      description: "IVS, TEGoVA, RICS mevzuatına uygun değerleme"
    },
    {
      icon: FiGlobe,
      title: "Çok Dilli Raporlama",
      description: "İngilizce, Türkçe, Arapça ve Rusça dillerinde hizmet"
    },
    {
      icon: FiShield,
      title: "Dijital Onay Süreçleri",
      description: "Uzaktan belge doğrulama ve dijital işlem kolaylığı"
    },
    {
      icon: FiTrendingUp,
      title: "Entegre Danışmanlık",
      description: "Yatırım, hukuk ve değerleme danışmanlığı bir arada"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PageHero
        title="Ekspertiz"
        subtitle="İŞ ORTAKLARIMIZ"
        description="Güvenilir gayrimenkul değerleme ve uluslararası standartlara tam uyum."
        imagePath="/images/partners/appraisal-hero.jpg"
        gradient="from-slate-950/85 via-slate-900/55 to-slate-900/10"
      />

      {/* About Section */}
      <section className="relative py-14 md:py-20">
        <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-slate-200/60 blur-3xl" />
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 text-center">HİZMET HAKKINDA</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-slate-900 mb-6 md:mb-8 text-center">Değerlemede Hukuki Çerçeve</h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                Gayrimenkul değerleme ve ekspertiz süreçleri, yatırım kararlarının temelini oluşturur. Bu süreçlerin güvenilir, yasal ve uluslararası standartlara uygun şekilde yürütülmesi, hem yatırımcı hem kurumlar için kritik öneme sahiptir.
              </p>
              <p>
                <strong>IremWorld</strong>, lisanslı değerleme uzmanları ve hukuk danışmanlarıyla iş birliği yaparak;
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Gayrimenkul ve proje değerleme sözleşmeleri</li>
                <li>Lisans, yetki ve raporlama süreçleri</li>
                <li>Uluslararası değerleme standartlarına (IVS, RICS) uyum</li>
                <li>Vergisel ve hukuki risk analizi konularında kapsamlı danışmanlık sunar</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="container px-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 text-center">NEDEN IREMWORLD?</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-slate-900 mb-6 md:mb-10 text-center">Ekspertizde ölçülebilir ve şeffaf süreçler</h2>
          <p className="text-base md:text-lg text-slate-600 text-center max-w-3xl mx-auto mb-10 md:mb-14">
            Dijital hukuk ve danışmanlık altyapımız, ekspertiz süreçlerini şeffaf, hızlı ve uluslararası uyumlu hale getirir.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-7 md:p-8 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.55)] backdrop-blur transition-all hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary-50/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <feature.icon className="w-12 h-12 text-primary-500 mb-4" />
                <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-2 md:mb-3">{feature.title}</h3>
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

      {/* Standards Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6 md:mb-8">Uluslararası Standartlar</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
              <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-slate-200/70 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.55)] backdrop-blur hover:shadow-xl transition-all hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-primary-600 mb-2">IVS</h3>
                <p className="text-slate-600">International Valuation Standards</p>
              </div>
              <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-slate-200/70 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.55)] backdrop-blur hover:shadow-xl transition-all hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-primary-600 mb-2">TEGoVA</h3>
                <p className="text-slate-600">European Valuation Standards</p>
              </div>
              <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-slate-200/70 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.55)] backdrop-blur hover:shadow-xl transition-all hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-primary-600 mb-2">RICS</h3>
                <p className="text-slate-600">Royal Institution Standards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppraisalComparison />

      {/* CTA Section */}
      <section id="contact-section" className="relative py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-[36px] border border-primary-100/40 bg-gradient-to-br from-slate-950 via-primary-900 to-primary-700 px-8 py-16 text-white shadow-[0_70px_160px_-90px_rgba(15,23,42,0.9)] md:px-16 text-center">
            <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-primary-400/40 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <h2 className="text-3xl font-semibold md:text-4xl">Güvenilir Değerleme İçin Yanınızdayız</h2>
            <p className="mt-6 text-base text-primary-100/90 max-w-2xl mx-auto">
              Gayrimenkul değerleme süreçlerinizde profesyonel destek almak için bize ulaşın.
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
