import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "AiLE GROUP | すべてを、翼にして。",
  description:
    "AiLE GROUPは、金融教育・営業代行・人材育成・システム開発・飲食・アプリ事業など多角的な事業を展開するグループ企業です。",
  openGraph: {
    title: "AiLE GROUP | すべてを、翼にして。",
    description: "多角的な事業で日本を動かすグループ企業 AiLE GROUP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className="bg-[#07070f] text-white antialiased">{children}</body>
    </html>
  );
}
