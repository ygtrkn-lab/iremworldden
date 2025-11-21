import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PartnerProfileTemplate, { PartnerProfileContent } from "@/components/sections/partner-profile-template";

const audienceContent: Record<string, PartnerProfileContent> = {
  "project-owners": {
    title: "Proje Sahipleri",
    heroDescription:
      "Proje sahipleri, geliştirdikleri konut, ticari veya karma gayrimenkul projelerini IW'de yatırımcılar, danışmanlar ve satış ofisleriyle paylaşır.",
    intro: [
      "Proje sahipleri IW'de geliştirdikleri konut, ticari veya karma projeleri yatırımcılar, danışmanlar ve satış ofisleriyle paylaşır.",
      "IW ağı projeleri güvenilir ağlara taşıyarak görünürlüğü artırır."
    ],
    role:
      "Platform, projelerin uluslararası ölçekte görünürlük kazanmasını ve yeni finansal ortaklıkların kurulmasını sağlar.",
    reasons: [
      "Projeler, global yatırımcı kitlesine doğrudan ulaşır.",
      "Güvenilir danışmanlar ve satış kanallarıyla bağlantı kurulur.",
      "Dijital vitrin sayesinde marka bilinirliği artar.",
      "Uluslararası fonlar ve yatırımcılarla iş birliği fırsatları doğar."
    ],
    advantage:
      "IW'de, proje sahiplerinin yalnızca yerel pazarda değil, dünya genelinde temsil edilmesini sağlar. Bu da her proje için daha yüksek yatırım olasılığı ve daha geniş hedef kitle anlamına gelir.",
    metaDescription:
      "Proje sahipleri için IW: projeleri global yatırımcıya taşıyan dijital vitrin ve finansal ortaklık ağı."
  },
  "real-estate-offices": {
    title: "Emlak Ofisleri",
    heroDescription:
      "Emlak ofisleri, portföylerini dijital olarak tanıtarak hem yerel hem de yabancı yatırımcılara ulaşır.",
    intro: [
      "Emlak ofisleri portföylerini dijital olarak tanıtarak hem yerel hem de yabancı yatırımcılara ulaşır.",
      "Ayrıca proje sahipleri, bireysel satıcılar ve danışmanlarla doğrudan iletişim kurarak iş ağlarını genişletirler."
    ],
    role:
      "Emlak ofisleri, portföylerini dijital olarak tanıtarak hem yerel hem de yabancı yatırımcılara ulaşır; proje sahipleri ve danışmanlarla doğrudan iletişim kurar.",
    reasons: [
      "Platform üzerinden çok daha geniş bir yatırımcı havuzuna erişim sağlanır.",
      "Uluslararası müşterilerle güvenli iletişim kurulabilir.",
      "Portföy yönetimi dijital ortamda, merkezi biçimde yapılabilir.",
      "Projeler için yeni iş birlikleri ve komisyon fırsatları oluşur."
    ],
    advantage:
      "IremWorld, emlak ofislerini dijital bir pazar yerine taşır. Bu, klasik ofis bazlı satış modelinden çıkıp, küresel yatırım ekosisteminde aktif bir oyuncu olma fırsatı sunar.",
    metaDescription:
      "Emlak ofisleri IW ile portföylerini dijital vitrine taşır, global yatırımcılarla güvenle buluşur."
  },
  "property-owners": {
    title: "Gayrimenkul Sahipleri",
    heroDescription:
      "Konut veya ticari mülklerini satmak isteyen bireyler, IremWorld üzerinden doğrulanmış danışmanlar ve yatırımcılarla buluşur.",
    intro: [
      "Konut veya ticari mülklerini satmak isteyen bireyler, IremWorld üzerinden doğrulanmış danışmanlar ve yatırımcılarla buluşur.",
      "Böylece satış süreci daha güvenli, şeffaf ve profesyonel biçimde yürütülür."
    ],
    role:
      "Konut veya ticari mülklerini satmak isteyen bireyler, IremWorld üzerinden doğrulanmış danışmanlar ve yatırımcılarla buluşur; süreç güvenli ve profesyonel ilerler.",
    reasons: [
      "Yalnızca onaylı yatırımcılar ve danışmanlarla iletişime geçilir.",
      "Fiyat değerlendirmeleri piyasa analizlerine göre yapılabilir.",
      "Yabancı yatırımcılara ulaşarak satış potansiyeli artırılır.",
      "Dolandırıcılık riskleri ortadan kaldırılır."
    ],
    advantage:
      "IremWorld, bireysel satıcıya profesyonel bir satış ağı kazandırır. Süreç dijital olarak ilerler; böylece hem hız hem güvenlik sağlanır.",
    metaDescription:
      "Gayrimenkul sahipleri IW üzerinden doğrulanmış danışmanlarla buluşur, satış sürecini güvenle yönetir."
  },
  "institutional-relations": {
    title: "Kurumlarla İlişkiler",
    heroDescription:
      "IremWorld, gayrimenkul sektöründeki kamu kurumlarını, finansal kuruluşları ve GYO şirketlerini tek ağda birleştirir.",
    intro: [
      "IremWorld, gayrimenkul sektöründeki kamu kurumlarını, finansal kuruluşları ve GYO şirketlerini tek ağda birleştirir.",
      "Bu kurumlar, yatırımcılarla iletişim kurabilir, projelerini tanıtabilir ve küresel pazarlarda görünür hale gelebilir."
    ],
    role:
      "IremWorld, gayrimenkul sektöründeki kamu kurumlarını, finansal kuruluşları ve GYO şirketlerini tek ağda birleştirir ve global görünürlük sağlar.",
    reasons: [
      "Uluslararası yatırımcı topluluğuna doğrudan erişim sağlarlar.",
      "Kurumsal çözümlerini veya programlarını global tanıtımda sergilerler.",
      "Yatırım ve iş birliği fırsatlarını kolaylaştıran bir platforma entegre olurlar."
    ],
    advantage:
      "Kurumlar için IremWorld, geleneksel ilişkileri dijital düzleme taşır. Bu sayede hem görünürlük hem de güvenilirlik artar, sektör genelinde daha güçlü bağlar kurulur.",
    metaDescription:
      "Kurumlarla ilişkiler IW'de dijitalleşir, kamu ve finans kurumları global yatırımcıyla buluşur."
  },
  banks: {
    title: "Bankalar",
    heroDescription:
      "Bankalar, gayrimenkul yatırımcılarına finansal ürünlerini tanıtır, mortgage ve ticari krediler için bilgi sağlar.",
    intro: [
      "Bankalar, gayrimenkul yatırımcılarına finansal ürünlerini tanıtır, mortgage ve ticari krediler için bilgi sağlar.",
      "Ayrıca proje sahipleriyle potansiyel finansman iş birlikleri kurabilir."
    ],
    role:
      "Bankalar, gayrimenkul yatırımcılarına finansal ürünlerini tanıtır, mortgage ve ticari krediler için bilgi sağlar; proje sahipleriyle finansman iş birlikleri kurar.",
    reasons: [
      "Platformda aktif yatırımcı topluluğuna erişim sağlanır.",
      "Finansal çözümler global ölçekte tanıtılır.",
      "Yabancı yatırımcıların ülke içi finansman süreçlerine destek olunabilir.",
      "Marka güveni ve kurumsal itibarı güçlenir."
    ],
    advantage:
      "IremWorld, bankaları gayrimenkul finans ekosisteminin merkezine yerleştirir. Bu sayede bankalar, yalnızca finansman sağlayıcı değil, yatırım sürecinin stratejik ortağı haline gelir.",
    metaDescription:
      "Bankalar IW'de mortgage ve ticari kredi çözümlerini global yatırımcılara sunar, finansman ortaklıkları geliştirir."
  },
  reits: {
    title: "GYO'lar",
    heroDescription:
      "GYO şirketleri, yatırım portföylerini IremWorld üzerinde tanıtarak global yatırımcılarla bağlantı kurar.",
    intro: [
      "GYO şirketleri, yatırım portföylerini IremWorld üzerinde tanıtarak global yatırımcılarla bağlantı kurar.",
      "Ayrıca projeleri için uluslararası fon ve ortaklık fırsatlarını araştırabilir."
    ],
    role:
      "GYO şirketleri, yatırım portföylerini IremWorld üzerinde tanıtarak global yatırımcılarla bağlantı kurar ve uluslararası fon arayışlarını hızlandırır.",
    reasons: [
      "Portföyleri global yatırımcı topluluğuna görünür hale gelir.",
      "Dijital ortamda tanıtım ve iletişim süreçleri kolaylaşır.",
      "Yatırımcılarla güvenilir bilgi paylaşımı sağlanır.",
      "Marka bilinirliği ve yatırımcı güveni artar."
    ],
    advantage:
      "IremWorld, GYO'ların yalnızca ulusal değil, küresel yatırımcılar tarafından tanınmasını sağlar. Bu da fon toplama ve proje finansmanı süreçlerinde yeni kapılar açar.",
    metaDescription:
      "GYO'lar IW sayesinde portföylerini global yatırımcılara tanıtır, fon toplama fırsatlarını genişletir."
  },
  "government-agencies": {
    title: "Devlet Kurumları",
    heroDescription:
      "Devlet kurumları, yatırım teşviklerini, vatandaşlık programlarını veya kamu-özel sektör projelerini tanıtmak için IremWorld ağına katılır.",
    intro: [
      "Devlet kurumları, yatırım teşviklerini, vatandaşlık programlarını veya kamu-özel sektör projelerini tanıtmak için IremWorld ağına katılır.",
      "Platform, resmi kurumların yatırımcılarla güvenli ve doğrudan iletişim kurmasını sağlar."
    ],
    role:
      "Devlet kurumları, IremWorld ağı sayesinde yatırım teşviklerini, vatandaşlık programlarını ve kamu-özel sektör projelerini global yatırımcılarla paylaşır.",
    reasons: [
      "Ülke yatırım politikaları global yatırımcıya ulaşır.",
      "Vatandaşlık ve oturum programları uluslararası görünürlük kazanır.",
      "Kamu-özel sektör iş birliği projelerine yatırımcı çekilir.",
      "Ülke markası güçlenir, sermaye akışı desteklenir."
    ],
    advantage:
      "Kurumlar için IremWorld, geleneksel ilişkileri dijital düzleme taşır. Bu sayede hem görünürlük hem de güvenilirlik artar, sektör genelinde daha güçlü bağlar kurulur.",
    metaDescription:
      "Devlet kurumları IW ile teşviklerini global yatırımcıya aktarır, kamu projelerine uluslararası ilgi çeker."
  }
};

type PageProps = {
  params: {
    audience: string;
  };
};

export function generateStaticParams() {
  return Object.keys(audienceContent).map((audience) => ({ audience }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const content = audienceContent[params.audience];

  if (!content) {
    return {
      title: "Partners | IREM World"
    };
  }

  return {
    title: `${content.title} - İş Ortakları | IREM World`,
    description: content.metaDescription
  };
}

export default function AudiencePage({ params }: PageProps) {
  const content = audienceContent[params.audience];

  if (!content) {
    notFound();
  }

  return <PartnerProfileTemplate content={content} />;
}
