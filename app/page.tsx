"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import OrbitalDiagram from "./OrbitalDiagram";

type Company = {
  id: string;
  name: string;
  nameJP: string;
  role: string;
  logo: string;
  color: string;
  desc: string;
  longDesc: string;
  capabilities: { name: string; href?: string; logo?: string }[];
  evolutions: { date: string; title: string; desc: string }[];
  subLogo?: string;
  roleLogo?: string;
  roleLogoAlt?: string;
  roleLogoScale?: number;
  roleLogoSlotWidth?: number;
  siteUrl?: string;
};

/* ─── Data ─── */
const companies: Company[] = [
  {
    id: "iwill",
    name: "IWiLL",
    nameJP: "株式会社 IWiLL",
    role: "営業代行事業・人材教育事業",
    logo: "/logos/iwill-logo.png",
    color: "#f97316",
    desc: "IWiLLです。営業の最前線に立ち、御社の成長を力強く後押しします。",
    longDesc:
      "高品質な営業代行サービスと、次世代を担う人材の教育・育成を通じて、企業の成長エンジンとして機能します。",
    capabilities: [
      { name: "To C 営業代行業" },
      { name: "人材教育" },
    ],
    evolutions: [
      { date: "2025-05", title: "第6期売上 7億3000万円", desc: "第6期の売上7億3000万円を達成" },
      { date: "2025-05", title: "第5期売上 4億円", desc: "第5期の売上4億円を達成" },
      { date: "2024-05", title: "第4期売上 8億円 突破", desc: "第4期の売上8億円を突破" },
      { date: "2023-05", title: "第3期売上 7億円 突破", desc: "第3期の売上7億円を突破" },
      { date: "2022-05", title: "第2期売上 3億4000万円 突破", desc: "第2期の売上3億4000万円を突破" },
      { date: "2021-05", title: "初年度売上 1億7000万円 突破", desc: "創業初年度の売上1億7000万円を突破" },
      { date: "2020-07", title: "営業代行業 開始", desc: "営業代行を中核サービスとして立ち上げ" },
      { date: "2020-06-20", title: "会社設立", desc: "株式会社IWiLLを設立" },
    ],
  },
  {
    id: "titan",
    name: "TiTAN",
    nameJP: "株式会社 TiTAN",
    role: "オンライン金融スクール事業",
    roleLogo: "/logos/finedge-logo.png",
    roleLogoAlt: "FiNEDGE",
    roleLogoScale: 2.9,
    roleLogoSlotWidth: 96,
    logo: "/logos/titan-logo.png",
    color: "#6b7588",
    desc: "TiTANです。お金の知識を、すべての人へ。FiNEDGEで未来を変える。",
    longDesc:
      "誰もが資産形成の知識を持てる社会を目指し、投資・金融リテラシーを高めるオンライン教育プラットフォーム「FiNEDGE」を運営します。",
    capabilities: [
      { name: "金融教育オンラインスクール「FiNEDGE」運営", href: "https://finedge.jp/", logo: "/logos/finedge-mark.png" },
    ],
    evolutions: [
      { date: "2026-07", title: "FiNEDGE アプリ版リリース", desc: "スマホでいつでも学べる金融教育アプリを展開" },
      { date: "2025-12", title: "FiNEDGEサービス 開始", desc: "オンライン金融スクールサービスを開始" },
      { date: "2025-10", title: "株式会社TiTANへ社名変更", desc: "大幅な事業シフトを行う" },
      { date: "2020-07", title: "ライバーマネジメント事業 開始", desc: "" },
      { date: "2020-06-20", title: "会社設立", desc: "事業の運営会社を設立" },
    ],
  },
  {
    id: "nlg",
    name: "NLG",
    nameJP: "株式会社 NLG",
    role: "システム開発事業",
    logo: "/logos/nlg-logo.png",
    color: "#60a5fa",
    siteUrl: "https://n-lightningaile.com/",
    desc: "NLGです。システム開発事業を軸に、業務効率化SaaS「ラクシス」で御社のDXを支援します。",
    longDesc:
      "システム開発事業として企業のDXを支援。自社サービス「ラクシス」をはじめ、DXコンサルティングやAPI連携、AI機能組み込みまで一気通貫で提供します。",
    capabilities: [
      { name: "転売プラットフォーム「FLIP BASE」運営" },
      { name: "フルオーダーメイド型システム「ラクシス」運営", href: "https://laxis-lp.vercel.app/", logo: "/logos/laxis-mark.png" },
    ],
    evolutions: [
      { date: "2026-06", title: "「ラクシス」サービス 開始", desc: "業務効率化フルオーダーメイド型システム開発" },
      { date: "2026-04", title: "株式会社NLGに社名変更", desc: "N LIGHTNING株式会社から株式会社NLGへ社名変更" },
      { date: "2025-10", title: "「FLIP BASE」サービス 開始", desc: "" },
      { date: "2025-10-15", title: "会社設立", desc: "N LIGHTNING株式会社を設立" },
    ],
  },
  {
    id: "lien",
    name: "LiEN",
    nameJP: "株式会社 LiEN",
    role: "飲食事業",
    logo: "/logos/lien-logo.png",
    color: "#c084fc",
    desc: "LiENです。大阪に、くつろぎと洗練の時間を届けます。",
    longDesc:
      "大阪を中心に、シーシャバー・シーシャカフェ・ラウンジを展開。都市の中に心安らぐ特別な空間を創り続けます。",
    capabilities: [
      { name: "Shisha Bar BLUE（梅田）", href: "https://share.google/zTG6OrxeYyQCPWKvV", logo: "/logos/blue.png" },
      { name: "Shisha Cafe GREEN（アメ村）", href: "https://www.instagram.com/cafe_green0128/?hl=en", logo: "/logos/green.png" },
      { name: "Salon de LILAC（東心斎橋）", href: "https://www.instagram.com/salon_de.lilac/?hl=en", logo: "/logos/lilac.png" },
      { name: "サブスク型シーシャサービス『シーシャ倶楽部』展開", href: "https://lin.ee/W4ttdzA" },
    ],
    evolutions: [
      { date: "2024-12-14", title: "Salon de LILAC オープン", desc: "東心斎橋にラウンジをオープン" },
      { date: "2024-01-28", title: "GREEN オープン", desc: "アメ村にシーシャカフェをオープン" },
      { date: "2023-09-19", title: "会社設立", desc: "株式会社LiENを設立" },
      { date: "2022-11-28", title: "BLUE オープン", desc: "梅田に1号店シーシャバーをオープン" },
    ],
  },
  {
    id: "bravo",
    name: "BRAVO",
    nameJP: "株式会社 BRAVO",
    role: "アパレルブランド事業",
    roleLogo: "/logos/brandvox-logo.png",
    roleLogoAlt: "BRANDVOX",
    roleLogoScale: 2.7,
    roleLogoSlotWidth: 112,
    logo: "/logos/bravo-logo.png",
    color: "#facc15",
    siteUrl: "https://brand-vox.com/",
    desc: "BRAVOです。アパレルブランド事業を軸に、ファッション×ポイ活アプリ「BRANDVOX」を展開しています。",
    longDesc:
      "アパレルブランド事業としてファッション領域に取り組み、その中でソーシャルショッピングアプリ「BRANDVOX」を立ち上げ。着て・見せて・貯めて・買える、新しいファッション体験を提供します。",
    capabilities: [
      { name: "「BRANDVOX」アプリ運営", href: "https://ogs8t.app.link/wA31E4w194b" },
      { name: "「BRANDVOX」オンラインショップ運営", href: "https://maison-regalia.com/" },
      { name: "ファッションメディア「BRAVO」運営", href: "https://bravo-online.com/" },
      { name: "無料古着仕入れサービス「TADAFURU」運営", href: "http://tadafuru.com/" },
    ],
    evolutions: [
      { date: "2026-05", title: "株式会社BRAVOに社名変更", desc: "有限会社ジーアイティーから株式会社BRAVOへ社名変更" },
      { date: "2025-10", title: "有限会社ジーアイティーを買収", desc: "" },
      { date: "2025-07", title: "「BRANDVOX」ローンチ", desc: "スタイル投稿でポイント獲得、商品タグ付け投稿による紹介報酬を開始" },
      { date: "2024-10", title: "「BRAVO」 メディア運営 開始", desc: "ファッションメディア「BRAVO」の記事をアプリ内で読める機能を追加" },
      { date: "2024-06", title: "「BRANDVOX」プレローンチ", desc: "世界中のブランド品を楽しむソーシャルショッピングアプリとして正式リリース" },
    ],
  },
];

const statusMap = {
  new:     { label: "NEW",  cls: "badge-new" },
  active:  { label: "展開中", cls: "badge-active" },
  planned: { label: "計画中", cls: "badge-planned" },
};

/* ─── Blob background ─── */
const blobs = [
  { color: "#22d3ee", left: "8%",  top: "18%", size: 400 },
  { color: "#a78bfa", left: "72%", top: "12%", size: 300 },
  { color: "#f97316", left: "58%", top: "70%", size: 350 },
  { color: "#f472b6", left: "12%", top: "62%", size: 250 },
];

/* ─── Component: Status Badge ─── */
function Badge({ status }: { status: string }) {
  const s = statusMap[status as keyof typeof statusMap] ?? statusMap.active;
  return (
    <span className={`badge ${s.cls}`}>
      {status === "new" && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {s.label}
    </span>
  );
}

/* ─── Component: Company Section ─── */
function CompanySection({ company, isMobile }: { company: Company; isMobile: boolean }) {
  const logoSize = isMobile ? 52 : 80;
  const nameFontSize = isMobile ? 17 : 28;
  const cardPadding = isMobile ? "16px" : "32px";
  const evoPadding = isMobile ? "16px" : "28px 32px";

  return (
    <div id={company.id} className="section-anchor" style={{ marginBottom: isMobile ? 48 : 80 }}>
      {/* Header */}
      {(() => {
        const headerStyle: CSSProperties = {
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 12 : 24,
          marginBottom: isMobile ? 24 : 40,
          paddingBottom: isMobile ? 20 : 32,
          borderBottom: "1px solid rgba(18,36,56,0.09)",
          textDecoration: "none",
          color: "inherit",
          ...(company.siteUrl ? { cursor: "pointer" } : {}),
        };
        const headerInner = (
          <>
            {/* カラーバー */}
            <div
              className={company.siteUrl ? "company-header-bar" : undefined}
              style={{ width: 3, borderRadius: 2, alignSelf: "stretch", flexShrink: 0, background: company.color, minHeight: isMobile ? 44 : 64 }}
            />
            {/* ロゴ */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <Image
                src={company.logo}
                alt={company.name}
                width={logoSize}
                height={logoSize}
                className={`object-contain${company.siteUrl ? " company-header-logo" : ""}`}
                style={{ maxHeight: logoSize, width: "auto", opacity: 0.95 }}
              />
              {company.subLogo && (
                <Image
                  src={company.subLogo}
                  alt="sub"
                  width={isMobile ? 44 : 70}
                  height={isMobile ? 44 : 70}
                  className={`object-contain${company.siteUrl ? " company-header-logo" : ""}`}
                  style={{ maxHeight: isMobile ? 44 : 70, width: "auto", opacity: 0.8 }}
                />
              )}
            </div>
            {/* テキスト */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                className={`font-orbitron${company.siteUrl ? " company-header-name" : ""}`}
                style={{ fontSize: nameFontSize, fontWeight: 800, letterSpacing: "0.05em", color: company.color, marginBottom: 4, lineHeight: 1.2 }}
              >
                {company.nameJP}
              </h2>
              {/* role行: モバイルはテキストのみ */}
              {isMobile ? (
                <p style={{ color: "#667085", fontSize: 11, fontWeight: 300, letterSpacing: "0.05em" }}>
                  {company.role}{company.roleLogoAlt ? ` / ${company.roleLogoAlt}` : ""}
                </p>
              ) : (
                <p
                  style={{
                    color: "#667085",
                    fontSize: 13,
                    fontWeight: 300,
                    letterSpacing: "0.05em",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    height: 20,
                    lineHeight: "20px",
                    minHeight: 20,
                    maxHeight: 20,
                    overflow: "visible",
                  }}
                >
                  {company.roleLogo ? (
                    <>
                      <span style={{ lineHeight: "20px" }}>{company.role}</span>
                      <span style={{ opacity: 0.45, fontSize: 12, lineHeight: "20px" }}>/</span>
                      <span
                        style={{
                          position: "relative",
                          display: "inline-block",
                          width: company.roleLogoSlotWidth ?? 96,
                          height: 20,
                          flexShrink: 0,
                          overflow: "visible",
                        }}
                      >
                        <Image
                          src={company.roleLogo}
                          alt={company.roleLogoAlt ?? company.name}
                          width={120}
                          height={120}
                          className="object-contain"
                          style={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            width: 40,
                            height: 40,
                            objectFit: "contain",
                            opacity: 0.95,
                            transform: `translateY(-50%) scale(${company.roleLogoScale ?? 2.6})`,
                            transformOrigin: "left center",
                          }}
                        />
                      </span>
                    </>
                  ) : (
                    company.role
                  )}
                </p>
              )}
            </div>
          </>
        );
        return company.siteUrl ? (
          <a
            href={company.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="company-header-link"
            style={{
              ...headerStyle,
              ["--header-color" as string]: company.color,
            }}
          >
            {headerInner}
          </a>
        ) : (
          <div style={headerStyle}>{headerInner}</div>
        );
      })()}

      <div className="grid lg:grid-cols-2" style={{ gap: isMobile ? 12 : 24 }}>
        {/* Business Contents */}
        <div className="glass-card glass-card--static" style={{ padding: cardPadding }}>
          <h3 style={{ fontSize: 10, color: "#98a2b3", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16 }}>
            Business Contents
          </h3>
          <div>
            {company.capabilities.map((cap, i) => {
              const capTextSize = isMobile ? 12 : 14;
              const capIconSize = isMobile ? 14 : 16;
              const rowStyle: CSSProperties = {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: isMobile ? "10px 0" : "14px 0",
                borderBottom: i < company.capabilities.length - 1 ? "1px solid rgba(18,36,56,0.08)" : "none",
                textDecoration: "none",
                color: "inherit",
              };
              const content = (
                <>
                  {cap.logo ? (
                    <Image
                      src={cap.logo}
                      alt=""
                      aria-hidden
                      width={capIconSize}
                      height={capIconSize}
                      className={cap.href ? "capability-link-icon" : undefined}
                      style={{
                        width: capIconSize,
                        height: capIconSize,
                        objectFit: "contain",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      className={cap.href ? "capability-link-dot" : undefined}
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        flexShrink: 0,
                        backgroundColor: company.color,
                      }}
                    />
                  )}
                  <span
                    className={cap.href ? "capability-link-text" : undefined}
                    style={{
                      fontSize: capTextSize,
                      color: "#2a3346",
                      fontWeight: 300,
                      wordBreak: "break-all",
                      lineHeight: 1.5,
                    }}
                  >
                    {cap.name}
                  </span>
                </>
              );
              return cap.href ? (
                <a
                  key={i}
                  href={cap.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capability-link"
                  style={{
                    ...rowStyle,
                    cursor: "pointer",
                    ["--cap-color" as string]: company.color,
                  }}
                >
                  {content}
                </a>
              ) : (
                <div key={i} style={rowStyle}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Evolution */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="glass-card" style={{ padding: evoPadding }}>
            <h3 style={{ fontSize: 10, color: "#98a2b3", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: isMobile ? 16 : 28 }}>
              Evolution Log
            </h3>
            <div style={{ position: "relative", paddingLeft: 18 }}>
              <div className="timeline-line" />
              {company.evolutions.map((ev, i) => (
                <div key={i} style={{ position: "relative", marginBottom: i < company.evolutions.length - 1 ? (isMobile ? 20 : 28) : 0 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: -18,
                      top: 4,
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: i === 0 ? company.color : "rgba(18,36,56,0.22)",
                      border: `2px solid ${i === 0 ? company.color : "rgba(18,36,56,0.12)"}`,
                    }}
                  />
                  <div style={{ fontSize: 10, color: "#98a2b3", marginBottom: 3, fontFamily: "monospace" }}>{ev.date}</div>
                  <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 500, color: "#0c1220", marginBottom: ev.desc ? 4 : 0 }}>{ev.title}</div>
                  {ev.desc ? (
                    <div style={{ fontSize: isMobile ? 11 : 12, color: "#667085", fontWeight: 300, lineHeight: 1.6 }}>{ev.desc}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [active, setActive] = useState("iwill");
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Update active section based on scroll position
      const sections = companies.map((c) => document.getElementById(c.id));
      const offset = 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.getBoundingClientRect().top <= offset) {
          setActive(companies[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (mobileNavOpen && headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [mobileNavOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
    setMobileNavOpen(false);
  };

  const activeCompany = companies.find((c) => c.id === active) ?? companies[0];

  return (
    <div style={{ background: "#050508", minHeight: "100vh", position: "relative" }}>
      {/* ─── Header（全ページ共通ダーク） ─── */}
      <header
        ref={headerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: (scrolled || isMobile) ? "rgba(5,5,8,0.95)" : "transparent",
          backdropFilter: (scrolled || isMobile) ? "blur(20px)" : "none",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          transition: "background 0.3s, backdrop-filter 0.3s",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Image src="/logos/aile-illust.png" alt="AiLE" width={28} height={28} style={{ objectFit: "contain" }} />
            <span
              className="font-orbitron"
              style={{ fontSize: isMobile ? 13 : 16, fontWeight: 700, color: "#00d2ef", letterSpacing: isMobile ? "0.06em" : "0.1em" }}
            >
              AiLE GROUP
            </span>
          </div>

          {/* Desktop quick nav */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 4 }}>
            {companies.map((c) => (
              <button
                key={c.id}
                onClick={() => scrollTo(c.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: "Orbitron, monospace",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  border: "1px solid",
                  transition: "all 0.2s",
                  background: active === c.id ? `${c.color}18` : "transparent",
                  borderColor: active === c.id ? `${c.color}50` : "transparent",
                  color: active === c.id ? c.color : "rgba(255,255,255,0.4)",
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Mobile menu btn */}
          <button
            className="md:hidden"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            style={{ color: "rgba(255,255,255,0.7)", padding: "10px", background: "none", border: "none", cursor: "pointer" }}
          >
            <div style={{ width: 20, display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ height: 1.5, background: "currentColor", display: "block", borderRadius: 1, transform: mobileNavOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none", transition: "all 0.25s" }} />
              <span style={{ height: 1.5, background: "currentColor", display: "block", borderRadius: 1, opacity: mobileNavOpen ? 0 : 1, transition: "all 0.25s" }} />
              <span style={{ height: 1.5, background: "currentColor", display: "block", borderRadius: 1, transform: mobileNavOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none", transition: "all 0.25s" }} />
            </div>
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileNavOpen && (
          <div style={{ background: "rgba(5,5,8,0.98)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "8px 16px 16px" }}>
            {companies.map((c, i) => (
              <button
                key={c.id}
                onClick={() => scrollTo(c.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "11px 0",
                  background: "none",
                  border: "none",
                  borderBottom: i < companies.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, flexShrink: 0, boxShadow: active === c.id ? `0 0 8px ${c.color}` : "none" }} />
                <span style={{ fontFamily: "Orbitron, monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: active === c.id ? c.color : "rgba(255,255,255,0.75)" }}>
                  {c.name}
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: '"Noto Sans JP", sans-serif', fontWeight: 300 }}>
                  {c.role}
                </span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ─── Hero（ダーク維持） ─── */}
      <section style={{ position: "relative", zIndex: 1, minHeight: isMobile ? "auto" : "100vh", display: "flex", alignItems: isMobile ? "flex-start" : "center", padding: isMobile ? "80px 16px 24px" : "100px 24px 60px", overflow: "hidden", background: "#050508" }}>
        {/* Background blobs — hero only */}
        {blobs.map((b, i) => (
          <div
            key={i}
            className="blob"
            style={{
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              background: b.color,
            }}
          />
        ))}
        {/* Soft bottom veil — midtones from higher up, eases into bridge overlap */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "clamp(260px, 42vw, 520px)",
            pointerEvents: "none",
            zIndex: 2,
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(5,5,8,0.02) 6%, rgba(8,12,18,0.06) 14%, rgba(12,18,28,0.10) 22%, rgba(18,28,42,0.14) 32%, rgba(28,42,62,0.16) 42%, rgba(44,64,90,0.14) 52%, rgba(68,96,126,0.12) 62%, rgba(100,130,162,0.10) 72%, rgba(140,168,196,0.08) 82%, rgba(180,200,220,0.06) 92%, rgba(215,228,240,0.04) 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? 16 : 88 }}>

          {/* Text */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <Image
              src="/logos/aile-illust.png"
              alt=""
              aria-hidden="true"
              width={110}
              height={110}
              priority
              style={{
                display: "block",
                margin: "0 auto clamp(12px, 2.2vw, 22px)",
                height: "clamp(64px, 10vw, 110px)",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 0 20px rgba(0,210,239,0.5))",
              }}
            />
            <h1
              aria-label="AiLE GROUP"
              style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "clamp(12px, 2vw, 22px)", marginBottom: 6 }}
            >
              <Image
                src="/logos/aile-text.png"
                alt="AiLE"
                width={158}
                height={70}
                priority
                style={{ height: "clamp(40px, 6.5vw, 68px)", width: "auto", filter: "drop-shadow(0 0 16px rgba(0,210,239,0.45))" }}
              />
              <Image
                src="/logos/aile-group-text.png"
                alt="GROUP"
                width={146}
                height={20}
                priority
                style={{ height: "clamp(14px, 2.2vw, 24px)", width: "auto", marginBottom: "clamp(4px, 0.8vw, 9px)", filter: "drop-shadow(0 0 10px rgba(0,210,239,0.4))" }}
              />
            </h1>
            <p
              className="font-orbitron"
              style={{ fontSize: "clamp(11px, 1.6vw, 16px)", color: "rgba(0,210,239,0.75)", letterSpacing: "0.22em", fontWeight: 400, marginTop: 0 }}
            >
              すべてを、翼にして。
            </p>
          </div>

          {/* Orbital Diagram */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
            <OrbitalDiagram onSelect={(id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }} />
          </div>
        </div>

        {/* Scroll cue */}
        {!isMobile && (
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.25em" }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(0,210,239,0.5), transparent)" }} />
        </div>
        )}
      </section>

      {/* ─── Dark → Light（ロング・透き通るフェード） ─── */}
      <div className="theme-bridge" aria-hidden="true" />

      {/* ─── Light zone: ヒーローより下 ─── */}
      <div className="light-zone">
      {/* ─── Main Content ─── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto", padding: isMobile ? "0 12px" : "0 24px", display: "flex", gap: 32, alignItems: "flex-start" }}>

        {/* ─── Sidebar ─── */}
        <aside
          className="hidden lg:block"
          style={{ width: 200, flexShrink: 0, position: "sticky", top: 80, paddingBottom: 40 }}
        >
          <div style={{ marginBottom: 12, padding: "0 14px" }}>
            <span style={{ fontSize: 10, color: "#98a2b3", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Group
            </span>
          </div>
          {companies.map((c) => (
            <button
              key={c.id}
              onClick={() => scrollTo(c.id)}
              className="nav-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                marginBottom: 4,
                background: active === c.id ? `${c.color}18` : "transparent",
                borderColor: active === c.id ? `${c.color}40` : "transparent",
                color: active === c.id ? c.color : "#667085",
                textAlign: "left",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <div
                className="nav-dot"
                style={{ background: c.color, opacity: active === c.id ? 1 : 0.4 }}
              />
              <div>
                <div className="font-orbitron" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 9, opacity: 0.65, marginTop: 1, lineHeight: 1.3 }}>{c.role.split("・")[0]}</div>
              </div>
            </button>
          ))}

        </aside>

        {/* ─── Sections ─── */}
        <main style={{ flex: 1, minWidth: 0, paddingBottom: isMobile ? 60 : 120, paddingTop: isMobile ? 16 : 60 }}>
          {companies.map((c) => (
            <CompanySection key={c.id} company={c} isMobile={isMobile} />
          ))}

          {/* ─── Phase Roadmap ─── */}
          <div id="roadmap" className="section-anchor" style={{ marginTop: isMobile ? 24 : 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isMobile ? 20 : 32, flexWrap: "wrap" }}>
              <div style={{ width: 3, height: 24, borderRadius: 2, background: "#00d2ef" }} />
              <h2 className="font-orbitron" style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, color: "#00d2ef", letterSpacing: "0.1em" }}>
                Group Roadmap
              </h2>
              {!isMobile && (
                <span style={{ fontSize: 12, color: "#667085", marginLeft: 4 }}>
                  AiLE GROUPの拡張フェーズ
                </span>
              )}
            </div>

            <div className="glass-card" style={{ padding: isMobile ? "16px" : "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: isMobile ? 10 : 20 }}>
                {[
                  { n: "01", title: "グループ基盤確立", desc: "5社の体制を整備し、グループ経営の基盤を構築", done: true },
                  { n: "02", title: "各社サービス拡充", desc: "IWiLL・TiTAN・NLG・LiEN・BRAVOの各サービスを深化", done: true },
                  { n: "03", title: "デジタル化推進", desc: "FiNEDGEアプリ・BRANDVOXアプリの機能強化", done: true },
                  { n: "04", title: "AI機能統合", desc: "NLGのAI開発を軸に、各社サービスへのAI実装", done: false },
                  { n: "05", title: "グループシナジー最大化", desc: "5社のクロスセル・コラボレーション施策を本格展開", done: false },
                  { n: "06", title: "全国展開・海外視野", desc: "大阪から全国へ、そして海外マーケットへの進出", done: false },
                ].map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: "16px",
                      borderRadius: 14,
                      border: "1px solid",
                      borderColor: p.done ? "rgba(22,163,74,0.28)" : "rgba(18,36,56,0.09)",
                      background: p.done ? "rgba(22,163,74,0.06)" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    <div
                      className="phase-dot font-orbitron"
                      style={{
                        background: p.done ? "rgba(22,163,74,0.12)" : "rgba(18,36,56,0.05)",
                        color: p.done ? "#15803d" : "#98a2b3",
                        border: `1px solid ${p.done ? "rgba(22,163,74,0.3)" : "rgba(18,36,56,0.1)"}`,
                      }}
                    >
                      {p.n}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: p.done ? "#0c1220" : "#667085" }}>
                          {p.title}
                        </span>
                        {p.done && <Badge status="active" />}
                      </div>
                      <p style={{ fontSize: 11, color: "#667085", lineHeight: 1.6, fontWeight: 300 }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Contact ─── */}
          <div style={{ marginTop: isMobile ? 32 : 60, padding: isMobile ? "28px 20px" : "48px 40px", borderRadius: isMobile ? 16 : 24, border: "1px solid rgba(14,165,190,0.22)", background: "linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(236,246,250,0.55) 50%, rgba(255,255,255,0.7) 100%)", boxShadow: "0 1px 0 rgba(255,255,255,0.95) inset, 0 16px 48px rgba(30,50,80,0.06)", textAlign: "center", position: "relative", overflow: "hidden", backdropFilter: "blur(12px)" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 1, height: 40, background: "linear-gradient(to bottom, rgba(8,145,178,0.45), transparent)" }} />
            <p className="font-orbitron" style={{ fontSize: 11, color: "#0e7490", letterSpacing: "0.3em", marginBottom: 20 }}>CONTACT</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, marginBottom: 0, color: "#0c1220" }}>
              ともに、<span style={{ color: "#0e7490" }}>飛躍しよう。</span>
            </h2>
          </div>
        </main>
      </div>

      {/* ─── Footer ─── */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(18,36,56,0.09)",
          marginTop: 80,
          padding: "32px 24px",
          background: "linear-gradient(180deg, rgba(245,247,251,0) 0%, rgba(242,246,250,0.5) 8%, #eef2f7 22%, #e8eef5 55%, #e2e8f0 100%)",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logos/aile-illust.png" alt="AiLE" width={24} height={24} style={{ objectFit: "contain", opacity: 0.7 }} />
            <span className="font-orbitron" style={{ fontSize: 12, color: "#0e7490", letterSpacing: "0.15em" }}>
              AiLE GROUP
            </span>
          </div>
          {/* Group logos */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", opacity: 0.55 }}>
            {[
              { src: "/logos/iwill-logo.png", alt: "IWiLL" },
              { src: "/logos/titan-logo.png", alt: "TiTAN" },
              { src: "/logos/finedge-logo.png", alt: "FiNEDGE" },
              { src: "/logos/nlg-logo.png", alt: "NLG" },
              { src: "/logos/lien-logo.png", alt: "LiEN" },
              { src: "/logos/brandvox-logo.png", alt: "BRANDVOX" },
            ].map((l, i) => (
              <Image key={i} src={l.src} alt={l.alt} width={50} height={24} style={{ objectFit: "contain", maxHeight: 24, width: "auto" }} />
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#98a2b3", letterSpacing: "0.1em" }}>
            © 2025 AiLE GROUP. All rights reserved.
          </p>
        </div>
      </footer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
