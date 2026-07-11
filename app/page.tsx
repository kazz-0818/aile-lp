"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import OrbitalDiagram from "./OrbitalDiagram";

/* ─── Data ─── */
const companies = [
  {
    id: "iwill",
    name: "IWiLL",
    nameJP: "株式会社 IWiLL",
    role: "営業代行・人材教育",
    logo: "/logos/iwill-logo.png",
    color: "#f97316",
    desc: "IWiLLです。営業の最前線に立ち、御社の成長を力強く後押しします。",
    longDesc:
      "高品質な営業代行サービスと、次世代を担う人材の教育・育成を通じて、企業の成長エンジンとして機能します。",
    capabilities: [
      { name: "営業代行", status: "active", since: "2023-04" },
      { name: "人材研修プログラム", status: "active", since: "2023-06" },
      { name: "組織コンサルティング", status: "active", since: "2024-01" },
      { name: "採用支援サービス", status: "active", since: "2024-03" },
      { name: "オンライン研修プラットフォーム", status: "new", since: "2025-09" },
      { name: "グローバル人材育成", status: "planned" },
    ],
    evolutions: [
      { date: "2025-09", title: "オンライン研修開始", desc: "動画・テスト形式での研修コンテンツを本格展開" },
      { date: "2024-03", title: "採用支援サービス拡充", desc: "採用戦略立案から面接同席まで一気通貫でサポート" },
      { date: "2023-04", title: "サービス開始", desc: "営業代行を中核サービスとして立ち上げ" },
    ],
  },
  {
    id: "titan",
    name: "TiTAN",
    nameJP: "株式会社 TiTAN",
    role: "金融教育 / FiNEDGE",
    logo: "/logos/titan-logo.png",
    subLogo: "/logos/finedge-logo.png",
    color: "#b0b8c8",
    desc: "TiTANです。お金の知識を、すべての人へ。FiNEDGEで未来を変える。",
    longDesc:
      "誰もが資産形成の知識を持てる社会を目指し、投資・金融リテラシーを高めるオンライン教育プラットフォーム「FiNEDGE」を運営します。",
    capabilities: [
      { name: "FiNEDGE 金融教育コース", status: "active", since: "2023-08" },
      { name: "投資入門カリキュラム", status: "active", since: "2023-10" },
      { name: "資産形成シミュレーター", status: "active", since: "2024-02" },
      { name: "メンター制度", status: "active", since: "2024-05" },
      { name: "FiNEDGE アプリ版", status: "new", since: "2025-10" },
      { name: "法人向け金融研修", status: "planned" },
    ],
    evolutions: [
      { date: "2025-10", title: "FiNEDGE アプリ版リリース", desc: "スマホでいつでも学べる金融教育アプリを展開" },
      { date: "2024-05", title: "メンター制度導入", desc: "現役FPによる1on1メンタリングプランを追加" },
      { date: "2023-08", title: "FiNEDGE 開校", desc: "オンライン金融教育スクールとして本格ローンチ" },
    ],
  },
  {
    id: "nlg",
    name: "NLG",
    nameJP: "株式会社 NLG",
    role: "フルオーダーメイドシステム開発",
    logo: "/logos/nlg-logo.png",
    color: "#60a5fa",
    desc: "NLGです。御社の課題を深く理解し、一からカスタムシステムを構築します。",
    longDesc:
      "企業の業務課題を深く理解し、フルスクラッチでカスタムするシステム開発で業務効率化・DX推進を実現。自社サービス「ラクシズ」も展開中。",
    capabilities: [
      { name: "フルオーダーシステム開発", status: "active", since: "2022-06" },
      { name: "DX コンサルティング", status: "active", since: "2022-09" },
      { name: "ラクシズ（業務効率化SaaS）", status: "active", since: "2024-01" },
      { name: "API 連携・基盤構築", status: "active", since: "2023-03" },
      { name: "AI 機能組み込み", status: "new", since: "2025-11" },
      { name: "クラウドマイグレーション支援", status: "planned" },
    ],
    evolutions: [
      { date: "2025-11", title: "AI 機能組み込み対応", desc: "LLM・画像認識のシステム統合を本格提供開始" },
      { date: "2024-01", title: "ラクシズ リリース", desc: "中小企業向け業務効率化SaaS「ラクシズ」の正式公開" },
      { date: "2022-06", title: "開発事業スタート", desc: "フルオーダーメイドシステム開発として事業を立ち上げ" },
    ],
  },
  {
    id: "lien",
    name: "LiEN",
    nameJP: "株式会社 LiEN",
    role: "飲食店事業",
    logo: "/logos/lien-logo.png",
    color: "#c084fc",
    desc: "LiENです。大阪に、くつろぎと洗練の時間を届けます。",
    longDesc:
      "大阪を中心に、シーシャバー・シーシャカフェ・ヘアサロンを展開。都市の中に心安らぐ特別な空間を創り続けます。",
    capabilities: [
      { name: "Shisha Bar BLUE（梅田）", status: "active", since: "2023-02" },
      { name: "Shisha Cafe GREEN（アメ村）", status: "active", since: "2023-07" },
      { name: "Salon de LILAC（東心斎橋）", status: "active", since: "2024-04" },
      { name: "会員制プレミアムプラン", status: "new", since: "2025-08" },
      { name: "オリジナルフレーバー開発", status: "new", since: "2025-09" },
      { name: "FC展開・多店舗化", status: "planned" },
    ],
    evolutions: [
      { date: "2025-09", title: "オリジナルフレーバー開発", desc: "LiEN独自ブレンドのシーシャフレーバーラインアップを展開" },
      { date: "2024-04", title: "Salon de LILAC オープン", desc: "東心斎橋にヘアサロン複合型の新業態を出店" },
      { date: "2023-07", title: "GREEN オープン", desc: "アメ村にシーシャカフェ2号店をオープン" },
      { date: "2023-02", title: "BLUE オープン", desc: "梅田に1号店シーシャバーをオープン" },
    ],
  },
  {
    id: "bravo",
    name: "BRAVO",
    nameJP: "株式会社 BRAVO",
    role: "BRANDVOX / ポイ活アプリ",
    logo: "/logos/bravo-logo.png",
    color: "#facc15",
    desc: "BRAVOです。BRANDVOX で、消費を楽しく・賢く・お得に変えます。",
    longDesc:
      "ポイ活・SNS・ショッピングを一つに融合したアプリ「BRANDVOX」で、消費者の新しいライフスタイルを創出します。",
    capabilities: [
      { name: "BRANDVOX ショッピング機能", status: "active", since: "2024-06" },
      { name: "ポイント還元システム", status: "active", since: "2024-06" },
      { name: "SNS シェア機能", status: "active", since: "2024-09" },
      { name: "インフルエンサー連携", status: "new", since: "2025-07" },
      { name: "法人向け広告プラットフォーム", status: "new", since: "2025-11" },
      { name: "海外展開", status: "planned" },
    ],
    evolutions: [
      { date: "2025-11", title: "広告プラットフォーム β版", desc: "ブランドがユーザーへ直接アプローチできる広告機能を追加" },
      { date: "2025-07", title: "インフルエンサー連携", desc: "インフルエンサーとユーザーをつなぐ紹介機能を実装" },
      { date: "2024-06", title: "BRANDVOX ローンチ", desc: "ポイ活×SNS×ショッピングアプリとして正式リリース" },
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
function CompanySection({ company }: { company: typeof companies[0] }) {
  return (
    <div id={company.id} className="section-anchor" style={{ marginBottom: 80 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {/* カラーバー */}
        <div
          style={{ width: 3, borderRadius: 2, alignSelf: "stretch", flexShrink: 0, background: company.color, minHeight: 64 }}
        />
        {/* ロゴ（左・大） */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <Image
            src={company.logo}
            alt={company.name}
            width={80}
            height={80}
            className="object-contain"
            style={{ maxHeight: 80, width: "auto", opacity: 0.95 }}
          />
          {company.subLogo && (
            <Image
              src={company.subLogo}
              alt="sub"
              width={70}
              height={70}
              className="object-contain"
              style={{ maxHeight: 70, width: "auto", opacity: 0.8 }}
            />
          )}
        </div>
        {/* テキスト */}
        <div style={{ flex: 1 }}>
          <h2
            className="font-orbitron"
            style={{ fontSize: 28, fontWeight: 800, letterSpacing: "0.06em", color: company.color, marginBottom: 6 }}
          >
            {company.nameJP}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 300, letterSpacing: "0.05em" }}>
            {company.role}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2" style={{ gap: 24 }}>
        {/* Capabilities */}
        <div className="glass-card" style={{ padding: "32px" }}>
          <h3 style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 24 }}>
            Capabilities
          </h3>
          <div>
            {company.capabilities.map((cap, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  borderBottom: i < company.capabilities.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      flexShrink: 0,
                      backgroundColor: company.color,
                      opacity: cap.status === "planned" ? 0.25 : 1,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      color: cap.status === "planned" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.72)",
                      fontWeight: 300,
                    }}
                  >
                    {cap.name}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: 16 }}>
                  {cap.since && (
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }} className="hidden sm:block">
                      since {cap.since}
                    </span>
                  )}
                  <Badge status={cap.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Evolution */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Evolution log */}
          <div className="glass-card" style={{ padding: "28px 32px" }}>
            <h3 style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 28 }}>
              Evolution Log
            </h3>
            <div style={{ position: "relative", paddingLeft: 20 }}>
              <div className="timeline-line" />
              {company.evolutions.map((ev, i) => (
                <div key={i} style={{ position: "relative", marginBottom: i < company.evolutions.length - 1 ? 28 : 0 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: -20,
                      top: 4,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: i === 0 ? company.color : "rgba(255,255,255,0.15)",
                      border: `2px solid ${i === 0 ? company.color : "rgba(255,255,255,0.1)"}`,
                    }}
                  />
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginBottom: 4, fontFamily: "monospace" }}>{ev.date}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.78)", marginBottom: 6 }}>{ev.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.33)", fontWeight: 300, lineHeight: 1.7 }}>{ev.desc}</div>
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
    setMobileNavOpen(false);
  };

  const activeCompany = companies.find((c) => c.id === active) ?? companies[0];

  return (
    <div style={{ background: "#050508", minHeight: "100vh", position: "relative" }}>
      {/* Background blobs */}
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

      {/* ─── Header ─── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(5,5,8,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          transition: "all 0.3s",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Image src="/logos/aile-illust.png" alt="AiLE" width={32} height={32} style={{ objectFit: "contain" }} />
            <span
              className="font-orbitron"
              style={{ fontSize: 16, fontWeight: 700, color: "#00d2ef", letterSpacing: "0.1em" }}
            >
              AiLE GROUP
            </span>
          </div>

          {/* Desktop quick nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden md:flex">
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
            style={{ color: "rgba(255,255,255,0.6)", padding: "8px" }}
          >
            <div style={{ width: 22, display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ height: 1, background: "currentColor", display: "block", transform: mobileNavOpen ? "rotate(45deg) translate(4px,4px)" : "none", transition: "all 0.2s" }} />
              <span style={{ height: 1, background: "currentColor", display: "block", opacity: mobileNavOpen ? 0 : 1, transition: "all 0.2s" }} />
              <span style={{ height: 1, background: "currentColor", display: "block", transform: mobileNavOpen ? "rotate(-45deg) translate(4px,-4px)" : "none", transition: "all 0.2s" }} />
            </div>
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileNavOpen && (
          <div style={{ background: "rgba(5,5,8,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px" }}>
            {companies.map((c) => (
              <button
                key={c.id}
                onClick={() => scrollTo(c.id)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 0", color: active === c.id ? c.color : "rgba(255,255,255,0.5)", fontFamily: "Orbitron, monospace", fontSize: 13, background: "none", border: "none", cursor: "pointer" }}
              >
                {c.name} <span style={{ opacity: 0.4, fontSize: 11 }}>— {c.role}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ─── Hero ─── */}
      <section style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 24px 60px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", width: "100%", display: "flex", flexDirection: "row", alignItems: "center", gap: 40, flexWrap: "wrap" }}>

          {/* Left: Text */}
          <div style={{ flex: "1 1 340px", minWidth: 0 }}>
            <h1
              className="font-orbitron glow-text"
              style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16, letterSpacing: "0.05em", color: "#e2e8f0" }}
            >
              AiLE GROUP
            </h1>
            <p
              className="font-orbitron"
              style={{ fontSize: "clamp(13px, 2vw, 20px)", color: "rgba(0,210,239,0.8)", letterSpacing: "0.25em", fontWeight: 400 }}
            >
              すべてを、翼にして。
            </p>
          </div>

          {/* Right: Orbital Diagram */}
          <div style={{ flex: "1 1 500px", display: "flex", justifyContent: "center", alignItems: "center", minWidth: 0 }}>
            <OrbitalDiagram onSelect={(id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }} />
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.25em" }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(0,210,239,0.5), transparent)" }} />
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto", padding: "0 24px", display: "flex", gap: 32, alignItems: "flex-start" }}>

        {/* ─── Sidebar ─── */}
        <aside
          className="hidden lg:block"
          style={{ width: 200, flexShrink: 0, position: "sticky", top: 80, paddingBottom: 40 }}
        >
          <div style={{ marginBottom: 12, padding: "0 14px" }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
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
                background: active === c.id ? `${c.color}12` : "transparent",
                borderColor: active === c.id ? `${c.color}30` : "transparent",
                color: active === c.id ? c.color : "rgba(255,255,255,0.4)",
                textAlign: "left",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <div
                className="nav-dot"
                style={{ background: c.color, opacity: active === c.id ? 1 : 0.3 }}
              />
              <div>
                <div className="font-orbitron" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 9, opacity: 0.5, marginTop: 1, lineHeight: 1.3 }}>{c.role.split("・")[0]}</div>
              </div>
            </button>
          ))}

          {/* AiLE tag at bottom */}
          <div style={{ marginTop: 24, padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(0,210,239,0.15)", background: "rgba(0,210,239,0.04)" }}>
            <Image src="/logos/aile-logo.png" alt="AiLE" width={90} height={36} style={{ objectFit: "contain" }} />
          </div>
        </aside>

        {/* ─── Sections ─── */}
        <main style={{ flex: 1, minWidth: 0, paddingBottom: 120, paddingTop: 60 }}>
          {companies.map((c) => (
            <CompanySection key={c.id} company={c} />
          ))}

          {/* ─── Phase Roadmap ─── */}
          <div id="roadmap" className="section-anchor" style={{ marginTop: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <div style={{ width: 3, height: 24, borderRadius: 2, background: "#00d2ef" }} />
              <h2 className="font-orbitron" style={{ fontSize: 18, fontWeight: 700, color: "#00d2ef", letterSpacing: "0.1em" }}>
                Group Roadmap
              </h2>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>
                AiLE GROUPの拡張フェーズ
              </span>
            </div>

            <div className="glass-card" style={{ padding: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
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
                      borderColor: p.done ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)",
                      background: p.done ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <div
                      className="phase-dot font-orbitron"
                      style={{
                        background: p.done ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                        color: p.done ? "#4ade80" : "rgba(255,255,255,0.3)",
                        border: `1px solid ${p.done ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      {p.n}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: p.done ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)" }}>
                          {p.title}
                        </span>
                        {p.done && <Badge status="active" />}
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, fontWeight: 300 }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Contact ─── */}
          <div style={{ marginTop: 60, padding: "48px 40px", borderRadius: 24, border: "1px solid rgba(0,210,239,0.2)", background: "rgba(0,210,239,0.04)", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 1, height: 40, background: "linear-gradient(to bottom, rgba(0,210,239,0.5), transparent)" }} />
            <p className="font-orbitron" style={{ fontSize: 11, color: "#00d2ef", letterSpacing: "0.3em", marginBottom: 20 }}>CONTACT</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, marginBottom: 12, color: "#e2e8f0" }}>
              ともに、<span style={{ color: "#00d2ef" }}>飛躍しよう。</span>
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 2, marginBottom: 36, fontWeight: 300 }}>
              事業連携・採用・メディア取材など、お気軽にご連絡ください。
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="mailto:info@aile-group.jp"
                style={{ padding: "12px 32px", borderRadius: 99, background: "#00d2ef", color: "#050508", fontWeight: 700, fontSize: 13, letterSpacing: "0.05em", textDecoration: "none", transition: "all 0.2s" }}
              >
                メールで問い合わせる
              </a>
              <a
                href="#"
                style={{ padding: "12px 32px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", fontSize: 13, letterSpacing: "0.05em", textDecoration: "none" }}
              >
                採用情報を見る
              </a>
            </div>
          </div>
        </main>
      </div>

      {/* ─── Footer ─── */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          marginTop: 80,
          padding: "32px 24px",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logos/aile-illust.png" alt="AiLE" width={24} height={24} style={{ objectFit: "contain", opacity: 0.5 }} />
            <span className="font-orbitron" style={{ fontSize: 12, color: "rgba(0,210,239,0.4)", letterSpacing: "0.15em" }}>
              AiLE GROUP
            </span>
          </div>
          {/* Group logos */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", opacity: 0.25 }}>
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
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
            © 2025 AiLE GROUP. All rights reserved.
          </p>
        </div>
      </footer>

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
