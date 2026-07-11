"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const companies = [
  {
    id: "iwill",
    name: "株式会社 IWiLL",
    logo: "/logos/iwill-logo.png",
    tagline: "営業代行 × 人材教育",
    description:
      "高品質な営業代行サービスと、次世代を担う人材の教育・育成を通じて、企業の成長を力強くサポートします。",
    color: "#e07330",
    accent: "rgba(224, 115, 48, 0.15)",
    services: ["営業代行", "人材育成", "研修・コンサルティング"],
  },
  {
    id: "titan",
    name: "株式会社 TiTAN",
    logo: "/logos/titan-logo.png",
    subLogo: "/logos/finedge-logo.png",
    subName: "FiNEDGE",
    tagline: "オンライン金融教育スクール",
    description:
      "誰もが資産形成の知識を持てる社会を目指し、投資・金融リテラシーを高めるオンライン教育プラットフォームを運営しています。",
    color: "#d4a820",
    accent: "rgba(212, 168, 32, 0.15)",
    services: ["金融教育", "資産形成サポート", "オンライン講座"],
  },
  {
    id: "nlg",
    name: "株式会社 NLG",
    logo: "/logos/nlg-logo.png",
    tagline: "フルオーダーメイド型システム開発",
    description:
      "企業の課題を深く理解し、一からカスタマイズするシステム開発で、業務効率化とDX推進を実現します。",
    color: "#1a5fa8",
    accent: "rgba(26, 95, 168, 0.15)",
    services: ["システム開発", "DXコンサルティング", "ラクシズ"],
  },
  {
    id: "lien",
    name: "株式会社 LiEN",
    logo: "/logos/lien-logo.png",
    tagline: "シーシャ・サロン事業",
    description:
      "大阪を中心に、くつろぎと洗練を融合したシーシャバー・カフェ・サロンを展開。都市に癒しの空間を提供します。",
    color: "#7c5cbf",
    accent: "rgba(124, 92, 191, 0.15)",
    services: [
      "Shisha Bar BLUE（梅田）",
      "Shisha Cafe GREEN（アメ村）",
      "Salon de LILAC（東心斎橋）",
    ],
  },
  {
    id: "bravo",
    name: "株式会社 BRAVO",
    logo: "/logos/brandvox-logo.png",
    tagline: "ポイ活 × SNS × ショッピングアプリ",
    description:
      "ポイ活・SNS・ショッピングを一つに融合したアプリ「BRANDVOX」で、消費者の新しいライフスタイルを創出します。",
    color: "#c8991a",
    accent: "rgba(200, 153, 26, 0.15)",
    services: ["BRANDVOX アプリ", "ポイント還元", "SNSコマース"],
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen">
      {/* ─── Navigation ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#07070f]/95 backdrop-blur-md border-b border-[rgba(93,184,212,0.1)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logos/aile-logo.png"
              alt="AiLE GROUP"
              width={120}
              height={48}
              className="object-contain"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {["About", "Companies", "Vision", "Contact"].map((item, i) => (
              <a
                key={i}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-white/60 hover:text-white transition-colors tracking-wider"
              >
                {item}
              </a>
            ))}
            <a
              href="#contact"
              className="text-sm px-5 py-2 border border-[rgba(93,184,212,0.4)] text-[#5db8d4] rounded-full hover:bg-[rgba(93,184,212,0.1)] transition-all"
            >
              お問い合わせ
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="space-y-1.5">
              <span
                className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#07070f]/98 backdrop-blur-md border-t border-[rgba(93,184,212,0.1)] px-6 py-6 space-y-4">
            {["About", "Companies", "Vision", "Contact"].map((item, i) => (
              <a
                key={i}
                href={`#${item.toLowerCase()}`}
                className="block text-white/70 hover:text-white py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ─── Hero ─── */}
      <section
        id="about"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[rgba(93,184,212,0.04)] blur-[120px]" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[rgba(93,184,212,0.03)] blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[rgba(93,184,212,0.03)] blur-[60px]" />

          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(93,184,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(93,184,212,1) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-40">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left: Text */}
            <div className="flex-1 text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 text-xs text-[#5db8d4] tracking-[0.2em] uppercase mb-8 px-4 py-2 rounded-full border border-[rgba(93,184,212,0.2)] bg-[rgba(93,184,212,0.05)]"
                style={{
                  animation: "fadeIn 1s ease forwards",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#5db8d4] animate-pulse" />
                AiLE GROUP
              </div>

              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6"
                style={{ animation: "fadeInUp 1s ease 0.2s both" }}
              >
                すべてを、
                <br />
                <span className="gradient-text">翼にして。</span>
              </h1>

              <p
                className="text-white/50 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0"
                style={{ animation: "fadeInUp 1s ease 0.4s both" }}
              >
                金融・教育・テクノロジー・エンターテインメント。
                <br />
                多彩な事業で、日本の未来を切り拓く。
              </p>

              <div
                className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
                style={{ animation: "fadeInUp 1s ease 0.6s both" }}
              >
                <a
                  href="#companies"
                  className="w-full sm:w-auto px-8 py-4 bg-[#5db8d4] text-[#07070f] font-semibold rounded-full hover:bg-[#8dd4e8] transition-all text-center text-sm tracking-wider"
                >
                  グループ企業を見る
                </a>
                <a
                  href="#contact"
                  className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white/70 rounded-full hover:border-white/40 hover:text-white transition-all text-center text-sm tracking-wider"
                >
                  お問い合わせ
                </a>
              </div>
            </div>

            {/* Right: Logo illustration */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[rgba(93,184,212,0.1)] blur-[60px] scale-150" />
                <Image
                  src="/logos/aile-illust.png"
                  alt="AiLE GROUP"
                  width={320}
                  height={320}
                  className="relative z-10 float-animation opacity-90"
                  style={{ filter: "drop-shadow(0 0 40px rgba(93,184,212,0.4))" }}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: "5", label: "グループ会社" },
              { num: "10+", label: "展開事業" },
              { num: "3", label: "大阪拠点" },
              { num: "∞", label: "可能性" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl border border-[rgba(93,184,212,0.1)] bg-[rgba(93,184,212,0.03)]"
                style={{ animation: `fadeInUp 0.7s ease ${0.8 + i * 0.1}s both` }}
              >
                <div className="text-4xl font-bold gradient-text mb-1">{stat.num}</div>
                <div className="text-white/40 text-xs tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/30 text-xs tracking-[0.2em]">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-[rgba(93,184,212,0.5)] to-transparent" />
        </div>
      </section>

      {/* ─── Marquee ─── */}
      <section className="py-6 border-y border-[rgba(93,184,212,0.08)] overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-track">
            {[
              "IWiLL",
              "TiTAN",
              "FiNEDGE",
              "NLG",
              "ラクシズ",
              "LiEN",
              "BLUE",
              "GREEN",
              "LILAC",
              "BRAVO",
              "BRANDVOX",
              "AiLE GROUP",
              "IWiLL",
              "TiTAN",
              "FiNEDGE",
              "NLG",
              "ラクシズ",
              "LiEN",
              "BLUE",
              "GREEN",
              "LILAC",
              "BRAVO",
              "BRANDVOX",
              "AiLE GROUP",
            ].map((text, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-6 px-6 text-white/20 text-sm tracking-[0.3em] uppercase font-light"
              >
                {text}
                <span className="text-[#5db8d4]/30">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About AiLE GROUP ─── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-4 mb-4">
              <div className="section-line" />
              <span className="text-[#5db8d4] text-xs tracking-[0.3em] uppercase">
                About
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-16 leading-tight">
              多様な翼で、
              <br />
              <span className="gradient-text">社会を飛躍させる。</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <FadeIn delay={0.1}>
              <div className="space-y-6 text-white/60 text-base leading-relaxed font-light">
                <p>
                  AiLE GROUPは、「すべてを翼にして」というビジョンのもと、
                  異なる分野の専門企業が連携し、シナジーを生み出すグループ経営体を構築しています。
                </p>
                <p>
                  金融教育・営業代行・人材育成・フルオーダーメイドシステム開発・シーシャ飲食事業・SNSショッピングアプリ。
                  それぞれが独自の強みを持ちながら、グループ全体として社会に新しい価値を提供します。
                </p>
                <p>
                  大阪を拠点に、日本全国へ——そして世界へ向けて、AiLE GROUPの翼は広がり続けます。
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    title: "多角的事業",
                    desc: "金融・IT・飲食・アプリなど幅広い分野で展開",
                    icon: "◈",
                  },
                  {
                    title: "グループシナジー",
                    desc: "各社が連携し合い相乗効果を最大化",
                    icon: "◉",
                  },
                  {
                    title: "人材第一主義",
                    desc: "人を育て、組織の力を高める経営哲学",
                    icon: "◇",
                  },
                  {
                    title: "革新への挑戦",
                    desc: "常に新しい市場と価値を創出し続ける",
                    icon: "◆",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-[rgba(93,184,212,0.1)] bg-[rgba(93,184,212,0.03)] hover:border-[rgba(93,184,212,0.25)] transition-all"
                  >
                    <div className="text-[#5db8d4] text-xl mb-3">{item.icon}</div>
                    <div className="text-white text-sm font-medium mb-2">{item.title}</div>
                    <div className="text-white/40 text-xs leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Group Companies ─── */}
      <section id="companies" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-4 mb-4">
              <div className="section-line" />
              <span className="text-[#5db8d4] text-xs tracking-[0.3em] uppercase">
                Companies
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              グループ企業
            </h2>
            <p className="text-white/40 text-base mb-16 font-light">
              それぞれの専門性が融合し、グループとしての力を生み出す。
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, i) => (
              <FadeIn key={company.id} delay={i * 0.1}>
                <div
                  className="card-hover group rounded-3xl border p-8 h-full flex flex-col"
                  style={{
                    borderColor: "rgba(255,255,255,0.07)",
                    backgroundColor: company.accent,
                    background: `linear-gradient(135deg, ${company.accent} 0%, rgba(13,13,26,0.8) 100%)`,
                  }}
                >
                  {/* Logo */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-14 flex items-center">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        width={100}
                        height={50}
                        className="object-contain max-h-14 w-auto"
                      />
                    </div>
                    {company.subLogo && (
                      <div className="flex items-center">
                        <Image
                          src={company.subLogo}
                          alt={company.subName || ""}
                          width={80}
                          height={32}
                          className="object-contain max-h-10 w-auto opacity-80"
                        />
                      </div>
                    )}
                  </div>

                  {/* Company name */}
                  <div className="mb-3">
                    <div className="text-xs text-white/40 mb-1 tracking-wider">
                      {company.name}
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: company.color }}
                    >
                      {company.tagline}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1 font-light">
                    {company.description}
                  </p>

                  {/* Services */}
                  <div className="space-y-2">
                    {company.services.map((service, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{ backgroundColor: company.color }}
                        />
                        <span className="text-xs text-white/40 font-light">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom accent */}
                  <div
                    className="mt-6 h-px w-full opacity-20 group-hover:opacity-50 transition-opacity"
                    style={{
                      background: `linear-gradient(90deg, ${company.color}, transparent)`,
                    }}
                  />
                </div>
              </FadeIn>
            ))}

            {/* AiLE GROUP center card */}
            <FadeIn delay={0.5}>
              <div className="card-hover md:col-span-2 lg:col-span-1 rounded-3xl border border-[rgba(93,184,212,0.2)] p-8 flex flex-col items-center justify-center text-center glow-pulse bg-[rgba(93,184,212,0.05)]">
                <div className="mb-6">
                  <Image
                    src="/logos/aile-logo.png"
                    alt="AiLE GROUP"
                    width={140}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <div className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">
                  Holding Company
                </div>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  各グループ会社を統括し、
                  <br />
                  シナジーを最大化する
                  <br />
                  グループ持株会社
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Vision ─── */}
      <section id="vision" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(93,184,212,0.04)] blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <FadeIn>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="section-line" />
              <span className="text-[#5db8d4] text-xs tracking-[0.3em] uppercase">
                Vision
              </span>
              <div
                className="section-line"
                style={{ transform: "rotate(180deg)" }}
              />
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              事業の枠を超えて、
              <br />
              <span className="gradient-text">未来を共に創る。</span>
            </h2>

            <p className="text-white/40 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-16">
              AiLE GROUPは、単なるビジネスの集合体ではありません。
              多様な才能と事業が交わる場所で、日本社会に新しいスタンダードを打ち立てることを目指しています。
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  num: "01",
                  title: "Connect",
                  desc: "異なる事業・人・才能をつなぎ、新しい価値を生み出す",
                },
                {
                  num: "02",
                  title: "Grow",
                  desc: "グループ全体で成長し、各社の可能性を最大限に引き出す",
                },
                {
                  num: "03",
                  title: "Impact",
                  desc: "社会に真の変化をもたらし、長期的な影響を残す",
                },
              ].map((v, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl border border-[rgba(93,184,212,0.1)] bg-[rgba(93,184,212,0.03)] text-left"
                >
                  <div className="text-[#5db8d4]/30 text-5xl font-bold mb-4 font-mono">
                    {v.num}
                  </div>
                  <div className="text-white text-xl font-semibold mb-3">{v.title}</div>
                  <div className="text-white/40 text-sm font-light leading-relaxed">
                    {v.desc}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Contact CTA ─── */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="rounded-3xl border border-[rgba(93,184,212,0.2)] bg-[rgba(93,184,212,0.04)] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[rgba(93,184,212,0.4)] to-transparent" />

              <div className="text-[#5db8d4] text-xs tracking-[0.3em] uppercase mb-6">
                Contact
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                ともに、
                <span className="gradient-text">飛躍しよう。</span>
              </h2>
              <p className="text-white/40 text-base font-light mb-10 max-w-lg mx-auto leading-relaxed">
                事業連携・採用・メディア取材など、
                お気軽にお問い合わせください。
                AiLE GROUPはあなたのビジョンを歓迎します。
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="mailto:info@aile-group.jp"
                  className="w-full sm:w-auto px-10 py-4 bg-[#5db8d4] text-[#07070f] font-semibold rounded-full hover:bg-[#8dd4e8] transition-all text-sm tracking-wider"
                >
                  メールで問い合わせる
                </a>
                <a
                  href="#"
                  className="w-full sm:w-auto px-10 py-4 border border-white/15 text-white/60 rounded-full hover:border-white/30 hover:text-white transition-all text-sm tracking-wider"
                >
                  採用情報を見る
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[rgba(93,184,212,0.08)] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <Image
                src="/logos/aile-logo.png"
                alt="AiLE GROUP"
                width={100}
                height={40}
                className="object-contain opacity-70"
              />
              <p className="text-white/25 text-xs font-light tracking-wider">
                すべてを、翼にして。
              </p>
            </div>

            <div className="flex items-center gap-8">
              {["Privacy Policy", "Terms", "Sitemap"].map((item, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-white/25 text-xs hover:text-white/50 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <p className="text-white/20 text-xs font-light">
              © 2025 AiLE GROUP. All rights reserved.
            </p>
          </div>

          {/* Group logos */}
          <div className="mt-10 pt-8 border-t border-[rgba(255,255,255,0.05)]">
            <p className="text-white/20 text-xs text-center mb-6 tracking-wider">
              GROUP COMPANIES
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-30">
              {[
                { src: "/logos/iwill-logo.png", alt: "IWiLL" },
                { src: "/logos/titan-logo.png", alt: "TiTAN" },
                { src: "/logos/finedge-logo.png", alt: "FiNEDGE" },
                { src: "/logos/nlg-logo.png", alt: "NLG" },
                { src: "/logos/lien-logo.png", alt: "LiEN" },
                { src: "/logos/brandvox-logo.png", alt: "BRANDVOX" },
              ].map((logo, i) => (
                <Image
                  key={i}
                  src={logo.src}
                  alt={logo.alt}
                  width={60}
                  height={30}
                  className="object-contain max-h-8 w-auto"
                />
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
