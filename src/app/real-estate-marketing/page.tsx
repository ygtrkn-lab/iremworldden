import PageHero from "@/components/sections/page-hero";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    id: 1,
    title: "Daire Kiralama / Satış",
    subtitle: "KİRALIK/SATILIK",
    description: "İhtiyacınıza uygun daireleri kiralama ve satış seçenekleriyle sunuyoruz. Konforlu yaşam alanları ve avantajlı lokasyonlarla size en iyi fırsatları sağlıyoruz.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: "🏠"
  },
  {
    id: 2,
    title: "Ofis Satış / Kiralama",
    subtitle: "OFİS ÇÖZÜMLERİ",
    description: "İş hayatınız için esnek ve modern ofis alanları sunuyoruz. Satış ve kiralama seçenekleriyle işinizi büyütmenize destek oluyoruz.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: "🏢"
  },
  {
    id: 3,
    title: "Villa / Proje Satışları",
    subtitle: "LÜKS PROJELER",
    description: "Prestijli villalar ve özel projelerle yatırım fırsatları sunuyoruz. Hayalinizdeki yaşam alanına ulaşmanız için profesyonel destek sağlıyoruz.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: "🏰"
  },
  {
    id: 4,
    title: "Ticari Proje Satışları",
    subtitle: "TİCARİ YATIRIM",
    description: "Geniş ticari projelerle iş ve yatırım alanlarınızı büyütün. Profesyonel danışmanlık ve satış hizmetleri sunuyoruz.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: "🏪"
  },
  {
    id: 5,
    title: "Arsa / Tarla Satışları",
    subtitle: "ARSA/TARLA",
    description: "Yatırım ve gelişim için uygun arsa ve tarla seçenekleri sunuyoruz. Doğru lokasyon ve fırsatlarla geleceğinizi şekillendirin.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: "🌾"
  },
  {
    id: 6,
    title: "Proje Pazarlama",
    subtitle: "PROJE PAZARLAMA",
    description: "Yeni projelerinizin pazarlamasında uzman ekibimizle yanınızdayız. Dijital ve geleneksel pazarlama stratejileriyle hedef kitlenize ulaşıyoruz.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: "📈"
  }
];

const advantages = [
  {
    title: "Hedef Odaklı Pazarlama",
    description: "Doğru hedef kitleye ulaşarak satış ve kiralama süreçlerinizi hızlandırıyoruz.",
    icon: "🎯"
  },
  {
    title: "Profesyonel Fotoğraf & Video",
    description: "Gayrimenkulünüzü en iyi şekilde tanıtmak için yüksek kaliteli görseller sağlıyoruz.",
    icon: "📸"
  },
  {
    title: "Geniş Dijital Ağ",
    description: "Web sitemiz ve sosyal medya kanallarımızla geniş kitlelere erişim sağlıyoruz.",
    icon: "🌐"
  },
  {
    title: "Güvenilir İş Ortaklığı",
    description: "Müşteri memnuniyetini ön planda tutan, şeffaf ve güvenilir hizmet sunuyoruz.",
    icon: "🤝"
  }
];

export default function RealEstateMarketingPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Profesyonel Emlak Pazarlama"
        subtitle="PROFESYONEL EMLAK PAZARLAMA"
        description="Gayrimenkul sektöründe geniş hizmet yelpazemizle, kiralama, satış ve proje pazarlaması alanlarında profesyonel çözümler sunuyoruz."
        imagePath="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        gradient="from-blue-900/80 via-blue-800/50 to-transparent"
      />

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Emlak Pazarlama Hizmetlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Türkiye'nin en prestijli bölgelerinde, özenle seçilmiş emlak fırsatları ve profesyonel pazarlama çözümleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {service.subtitle}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 text-4xl">
                    {service.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <button className="btn btn-outline w-full">
                    Bilgi Alın
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden İremWorld ile Çalışmalısınız?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Premium gayrimenkul deneyimi için benzersiz avantajlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors duration-300"
              >
                <div className="text-5xl mb-4">{advantage.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Emlak pazarlaması hakkında sorularınız mı var? Size yardımcı olmaktan memnuniyet duyarız.
          </p>
          <Link
            href="/contact-us"
            className="btn btn-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4 inline-flex items-center"
          >
            İletişime Geç
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
