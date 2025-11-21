import PageHero from "@/components/sections/page-hero";
import Link from "next/link";
import Image from "next/image";

const investmentTypes = [
  {
    id: 1,
    title: "Yapılması Planlanan Gayrimenkul Projeleri",
    subtitle: "KONUT",
    description: "Şehrin gelişen bölgelerinde planlanan yenilikçi konut ve ticari projelerimizle yatırımınıza değer katıyoruz. Modern mimari, çevre dostu tasarımlar ve sosyal donatılarla geleceğin yaşam alanlarını inşa ediyoruz.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Modern Mimari", "Çevre Dostu Tasarım", "Sosyal Donatılar", "Geniş Yeşil Alanlar"],
    roi: "18-25%",
    timeline: "12-24 ay"
  },
  {
    id: 2,
    title: "Ticari Endüstriyel Proje Alanları",
    subtitle: "ENDÜSTRİYEL",
    description: "İş dünyasının ihtiyaçlarına uygun, stratejik konumlarda tasarlanmış ticari ve endüstriyel proje alanlarımızla işletmenizin büyümesini destekliyoruz. Esnek alan çözümleri ve modern altyapı ile işinizi geleceğe taşıyın.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Stratejik Konum", "Modern Altyapı", "Esnek Alan Çözümleri", "Lojistik Avantajı"],
    roi: "25-35%",
    timeline: "6-18 ay"
  }
];

const advantages = [
  {
    title: "Yüksek Getiri Garantisi",
    description: "Dikkatle seçilmiş projelerimizle yıllık %18-35 arası getiri fırsatları sunuyoruz",
    icon: "📈",
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Stratejik Lokasyonlar",
    description: "Değeri sürekli artan, geleceğin yıldızı olacak lokasyonlarda yatırım fırsatları",
    icon: "📍",
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Güvenli Yatırım",
    description: "Hukuki ve finansal süreçlerde tam destek, şeffaf ve güvenilir yatırım ortaklığı",
    icon: "🛡️",
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Özel Yatırım Danışmanlığı",
    description: "Portföyünüze uygun kişiselleştirilmiş yatırım çözümleri ve sürekli destek",
    icon: "👥",
    color: "bg-orange-50 text-orange-600"
  }
];

const stats = [
  { value: "150+", label: "Başarılı Proje", icon: "🏗️" },
  { value: "%28", label: "Ortalama Getiri", icon: "💰" },
  { value: "5000+", label: "Mutlu Yatırımcı", icon: "😊" },
  { value: "15", label: "Yıllık Deneyim", icon: "⭐" }
];

export default function InvestmentOpportunitiesPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Yatırım Fırsatlarımız"
        subtitle="YATIRIM FIRSATLARIMIZ"
        description="Geleceğin yaşam alanlarını şekillendiren projelerimizle yatırımınızı güvence altına alın"
        imagePath="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        gradient="from-emerald-900/80 via-emerald-800/50 to-transparent"
      />

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="space-y-16">
            {investmentTypes.map((investment, index) => (
              <div
                key={investment.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="relative h-96 rounded-2xl overflow-hidden">
                    <Image
                      src={investment.image}
                      alt={investment.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {investment.subtitle}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex justify-between items-end text-white">
                        <div>
                          <div className="text-sm opacity-80">Beklenen Getiri</div>
                          <div className="text-2xl font-bold">{investment.roi}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm opacity-80">Süre</div>
                          <div className="text-lg font-semibold">{investment.timeline}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {investment.title}
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {investment.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {investment.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2 text-gray-700"
                        >
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="btn btn-primary">
                        Detaylı Bilgi Al
                      </button>
                      <button className="btn btn-outline">
                        Proje Dosyasını İndir
                      </button>
                    </div>
                  </div>
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
              Gayrimenkul yatırımlarınızda güven ve yüksek getiri için tercih edilen çözüm ortağınız
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${advantage.color} text-3xl mb-6`}>
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
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
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Yatırımınızın Geleceğini Birlikte Şekillendirelim
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Uzman ekibimizle tanışın, size özel yatırım çözümlerimizi keşfedin ve gayrimenkul yatırımlarınızı güvence altına alın
          </p>
          <Link
            href="/contact-us"
            className="btn btn-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4 inline-flex items-center"
          >
            Bize Danışın
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
