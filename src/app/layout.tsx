import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { COMPANY, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.nameKo} | 화재복구 전문`,
    template: `%s | ${COMPANY.nameKo}`,
  },
  description:
    "화재 발생부터 완전한 복구까지, 현장조사·철거·그을음제거·전기설비·건축인테리어를 통합 관리하는 화재복구 전문업체입니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: COMPANY.nameKo,
    title: `${COMPANY.nameKo} | 화재복구 전문`,
    description:
      "화재 발생부터 완전한 복구까지, 전공정을 통합 관리하는 화재복구 전문업체입니다.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: COMPANY.nameKo,
  alternateName: COMPANY.nameEn,
  telephone: COMPANY.tel,
  email: COMPANY.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address,
    addressLocality: "인천광역시 서구",
    addressCountry: "KR",
  },
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileCTA />
      </body>
    </html>
  );
}
