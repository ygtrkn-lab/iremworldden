import { redirect } from "next/navigation";

const slugMap: Record<string, string> = {
  "proje-sahipleri": "project-owners",
  "emlak-ofisleri": "real-estate-offices",
  "gayrimenkul-sahipleri": "property-owners",
  "kurumlarla-iliskiler": "institutional-relations",
  bankalar: "banks",
  gyolar: "reits",
  "devlet-kurumlari": "government-agencies"
};

type PageProps = {
  params: {
    audience: string;
  };
};

export default function LegacyAudiencePage({ params }: PageProps) {
  const target = slugMap[params.audience];

  if (!target) {
    redirect("/partners");
  }

  redirect(`/partners/${target}`);
}
