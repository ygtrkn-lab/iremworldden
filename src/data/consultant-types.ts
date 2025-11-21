export type ConsultantSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type ConsultantType = {
  id: string;
  name: string;
  summary: string;
  sections: ConsultantSection[];
};

export const consultantTypes: ConsultantType[] = [
  {
    id: 'lawyer',
    name: 'Avukat',
    summary: 'Gayrimenkul hukuku ve uluslararası yatırım süreçlerinde uzman avukatlarla çalışın.',
    sections: [
      {
        heading: 'Uzmanlık Alanları',
        bullets: [
          'Gayrimenkul alım-satım sözleşmeleri',
          'Mülkiyet devri ve tapu işlemleri',
          'Uluslararası yatırım hukuku',
          'Vatandaşlık ve oturum izni süreçleri',
        ],
      },
    ],
  },
  {
    id: 'accountant',
    name: 'Mali Müşavir',
    summary: 'Vergi planlaması ve mali danışmanlık konusunda uzman mali müşavirlerle çalışın.',
    sections: [
      {
        heading: 'Uzmanlık Alanları',
        bullets: [
          'Vergi planlaması ve beyannameler',
          'Gayrimenkul yatırım değerlendirmesi',
          'Uluslararası vergi düzenlemeleri',
          'Mali raporlama ve muhasebe',
        ],
      },
    ],
  },
  {
    id: 'architect',
    name: 'Mimar',
    summary: 'Proje tasarımı ve mimari planlama için deneyimli mimarlarla iletişime geçin.',
    sections: [
      {
        heading: 'Uzmanlık Alanları',
        bullets: [
          'Mimari proje tasarımı',
          'İç mekan düzenlemesi',
          'Restorasyon ve yenileme projeleri',
          'Ruhsat ve onay süreçleri',
        ],
      },
    ],
  },
  {
    id: 'engineer',
    name: 'Mühendis',
    summary: 'İnşaat, yapı denetim ve teknik hesaplamalar için uzman mühendislerle çalışın.',
    sections: [
      {
        heading: 'Uzmanlık Alanları',
        bullets: [
          'Yapı statik ve dayanıklılık analizi',
          'Elektrik ve mekanik sistemler',
          'Zemin etüdü ve uygulaması',
          'Proje teknik kontrol ve danışmanlık',
        ],
      },
    ],
  },
  {
    id: 'appraisal',
    name: 'Ekspertiz',
    summary: 'Gayrimenkul değerleme ve hasar tespiti için lisanslı ekspertiz hizmeti alın.',
    sections: [
      {
        heading: 'Uzmanlık Alanları',
        bullets: [
          'Gayrimenkul değer tespiti',
          'Hasar ve kusur analizi',
          'Teknik ekspertiz raporları',
          'Piyasa değeri araştırması',
        ],
      },
    ],
  },
  {
    id: 'legal-audit',
    name: 'Hukuk Denetimi',
    summary: 'Yasal uygunluk kontrolü ve hukuki denetim hizmetleri için uzmanlarla bağlantı kurun.',
    sections: [
      {
        heading: 'Uzmanlık Alanları',
        bullets: [
          'Sözleşme ve doküman incelemesi',
          'Tapu ve mülkiyet kontrolleri',
          'Yasal risk değerlendirmesi',
          'Uyum ve mevzuat denetimi',
        ],
      },
    ],
  },
];

export const consultantCategoryLabel = (id: string) =>
  consultantTypes.find(type => type.id === id)?.name ?? id;
