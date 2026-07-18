"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const orbitCompanies = [
  {
    id: "iwill",
    name: "IWiLL",
    nameJP: "株式会社I WiLL",
    sub: "営業代行事業・人材教育事業",
    logo: "/logos/iwill-icon.png",
    color: "#f97316",
    angle: 0,
  },
  {
    id: "nlg",
    name: "NLG",
    nameJP: "株式会社NLG",
    sub: "システム開発事業",
    logo: "/logos/nlg-icon.png",
    color: "#60a5fa",
    angle: 68,
  },
  {
    id: "bravo",
    name: "BRAVO",
    nameJP: "株式会社BRAVO",
    sub: "アパレルブランド事業",
    logo: "/logos/bravo-icon.png",
    color: "#facc15",
    angle: 136,
    logoScale: 0.75,
  },
  {
    id: "lien",
    name: "LiEN",
    nameJP: "株式会社LiEN",
    sub: "飲食事業",
    logo: "/logos/lien-icon.png",
    color: "#c084fc",
    angle: 224,
    logoScale: 0.88,
  },
  {
    id: "titan",
    name: "TiTAN",
    nameJP: "株式会社TiTAN",
    sub: "オンライン金融スクール事業",
    logo: "/logos/titan-icon.png",
    color: "#b0b8c8",
    angle: 292,
    logoScale: 1.28,
  },
];

/* 会社ノードの周りを衛星のように回るサブブランド（parentAngle = 親ノードの角度, phase = 初期位相） */
const subBrands: { name: string; color: string; parentAngle: number; phase: number; logo?: string }[] = [
  { name: "BLUE",     color: "#60a5fa", parentAngle: 224, phase: 0 },
  { name: "GREEN",    color: "#4ade80", parentAngle: 224, phase: 120 },
  { name: "LILAC",    color: "#c084fc", parentAngle: 224, phase: 240 },
  { name: "FiNEDGE",  color: "#cbd5e1", parentAngle: 292, phase: 90, logo: "/logos/finedge-logo.png" },
  { name: "BRANDVOX", color: "#facc15", parentAngle: 136, phase: 270, logo: "/logos/brandvox-logo.png" },
];
const satParentAngles = [...new Set(subBrands.map((b) => b.parentAngle))];

function toXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export default function OrbitalDiagram({ onSelect }: { onSelect?: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [diagramSize, setDiagramSize] = useState(460);
  const [showLabels, setShowLabels] = useState(true);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const loop = () => {
      setTick(Date.now() - startRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 540) setDiagramSize(Math.max(w - 40, 300));
      else if (w < 1024) setDiagramSize(Math.min(w - 80, 540));
      else setDiagramSize(460);
      setShowLabels(w >= 640);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const BASE = 560;
  const SIZE = diagramSize;
  const sc = SIZE / BASE;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  const R_OUTER = 220 * sc;
  const R_MID   = 160 * sc;
  const R_INNER  = 95 * sc;
  const LOGO_BOX = Math.round(138 * sc);
  const LOGO_IMG = Math.round(116 * sc);
  const NODE_R = 69 * sc;
  const SAT_ORBIT_R = 98 * sc;
  const satRot = -(tick / 30000) * 360;
  const labelOffset = 84 * sc;

  const centerSize = Math.round(176 * sc);
  const aileLogoSize = Math.round(148 * sc);

  const rot1 = (tick / 60000) * 360;
  const rot2 = -(tick / 45000) * 360;
  const rot3 = (tick / 80000) * 360;
  const pulse = 1 + 0.04 * Math.sin(tick / 1200);

  return (
    <div
      style={{
        position: "relative",
        width: SIZE,
        height: SIZE,
        maxWidth: "100%",
        margin: "0 auto",
        userSelect: "none",
      }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,210,239,0.15)" />
            <stop offset="100%" stopColor="rgba(0,210,239,0)" />
          </radialGradient>
          <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(0,210,239,0)" />
            <stop offset="100%" stopColor="rgba(0,210,239,0.06)" />
          </radialGradient>
          {orbitCompanies.map((c) => (
            <radialGradient key={c.id} id={`grad-${c.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={c.color} stopOpacity="0"  />
            </radialGradient>
          ))}
        </defs>

        <circle cx={CX} cy={CY} r={R_OUTER + 30 * sc} fill="url(#ring-glow)" />

        <g transform={`rotate(${rot1}, ${CX}, ${CY})`}>
          <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="rgba(0,210,239,0.2)" strokeWidth="1" strokeDasharray="4 12" />
        </g>
        <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="rgba(0,210,239,0.12)" strokeWidth="1" />

        <g transform={`rotate(${rot2}, ${CX}, ${CY})`}>
          <circle cx={CX} cy={CY} r={R_MID} fill="none" stroke="rgba(0,210,239,0.1)" strokeWidth="1" strokeDasharray="2 8" />
        </g>
        <circle cx={CX} cy={CY} r={R_MID} fill="none" stroke="rgba(0,210,239,0.07)" strokeWidth="1" />

        <g transform={`rotate(${rot3}, ${CX}, ${CY})`}>
          <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="rgba(0,210,239,0.15)" strokeWidth="1" strokeDasharray="3 10" />
        </g>

        {orbitCompanies.map((c) => {
          const outer = toXY(CX, CY, R_OUTER, c.angle);
          const inner = toXY(CX, CY, R_INNER + 10 * sc, c.angle);
          const isHov = hovered === c.id;
          return (
            <line
              key={c.id}
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke={isHov ? c.color : "rgba(0,210,239,0.12)"}
              strokeWidth={isHov ? 1.5 : 1}
              strokeDasharray={isHov ? "none" : "3 6"}
              style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
            />
          );
        })}

        {/* サブブランド衛星の軌道リング */}
        {showLabels && satParentAngles.map((pa) => {
          const parentPos = toXY(CX, CY, R_OUTER, pa);
          return (
            <circle
              key={`sat-orbit-${pa}`}
              cx={parentPos.x}
              cy={parentPos.y}
              r={SAT_ORBIT_R}
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
          );
        })}

        {/* サブブランド衛星ドット（ロゴを持つものはHTML側で画像表示） */}
        {showLabels && subBrands.filter((b) => !b.logo).map((b) => {
          const parentPos = toXY(CX, CY, R_OUTER, b.parentAngle);
          const dot = toXY(parentPos.x, parentPos.y, SAT_ORBIT_R, b.phase + satRot);
          return (
            <circle
              key={`sat-${b.name}`}
              cx={dot.x}
              cy={dot.y}
              r={5 * sc}
              fill={b.color}
              fillOpacity="0.95"
              filter="url(#glow-soft)"
            />
          );
        })}

        {[0, 72, 144, 216, 288].map((offset, i) => {
          const angle = (offset + rot1 * 3) % 360;
          const pos = toXY(CX, CY, R_MID, angle);
          return <circle key={i} cx={pos.x} cy={pos.y} r={2 * sc} fill="rgba(0,210,239,0.5)" />;
        })}
        {[0, 60, 120, 180, 240, 300].map((offset, i) => {
          const angle = (offset + rot2 * 4) % 360;
          const pos = toXY(CX, CY, R_OUTER, angle);
          return <circle key={i} cx={pos.x} cy={pos.y} r={1.5 * sc} fill="rgba(0,210,239,0.35)" />;
        })}

        <circle cx={CX} cy={CY} r={R_INNER - 10 * sc} fill="url(#center-grad)" transform={`scale(${pulse})`} style={{ transformOrigin: `${CX}px ${CY}px` }} />
        <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="rgba(0,210,239,0.25)" strokeWidth="1" filter="url(#glow-cyan)" />
        <circle cx={CX} cy={CY} r={R_INNER - 5 * sc} fill="rgba(5,5,8,0.85)" />
      </svg>

      {/* ── Company logos ── */}
      {orbitCompanies.map((c) => {
        const pos = toXY(CX, CY, R_OUTER, c.angle);
        const isHov = hovered === c.id;
        const angleMod = ((c.angle % 360) + 360) % 360;
        const isTop    = angleMod <= 45 || angleMod >= 315;
        const isBottom = angleMod > 135 && angleMod < 225;
        const isRight  = angleMod > 45 && angleMod <= 135;
        const isLeft   = angleMod >= 225 && angleMod < 315;
        const labelPos = toXY(CX, CY, R_OUTER + labelOffset, c.angle);

        return (
          <div key={c.id}>
            {/* Logo box */}
            <div
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { onSelect?.(c.id); document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              style={{
                position: "absolute",
                left: `${(pos.x / SIZE) * 100}%`,
                top: `${(pos.y / SIZE) * 100}%`,
                transform: "translate(-50%, -50%)",
                width: LOGO_BOX,
                height: LOGO_BOX,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.25s",
                filter: isHov ? `drop-shadow(0 0 14px ${c.color}90)` : "none",
                zIndex: 10,
              }}
            >
              {isHov && (
                <>
                  {/* 円と角丸四角を同じ親要素の中央に重ねて配置 */}
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: NODE_R * 2,
                      height: NODE_R * 2,
                      transform: "translate(-50%, -50%)",
                      borderRadius: "50%",
                      background: `${c.color}18`,
                      border: `1.5px solid ${c.color}b3`,
                      boxShadow: `0 0 22px ${c.color}45`,
                      pointerEvents: "none",
                      zIndex: 0,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: Math.round(8 * sc),
                      borderRadius: Math.round(26 * sc),
                      background: "rgba(5,5,8,0.7)",
                      border: `1.5px solid ${c.color}80`,
                      boxShadow: `0 0 20px ${c.color}40`,
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />
                </>
              )}
              <Image
                src={c.logo}
                alt={c.name}
                width={LOGO_IMG}
                height={LOGO_IMG}
                style={{ position: "relative", zIndex: 2, objectFit: "contain", width: Math.round(LOGO_IMG * ((c as { logoScale?: number }).logoScale ?? 1)), height: Math.round(LOGO_IMG * ((c as { logoScale?: number }).logoScale ?? 1)) }}
              />
            </div>

            {/* Label — only on larger screens */}
            {showLabels && (
              <div
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { onSelect?.(c.id); document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                style={{
                  position: "absolute",
                  left: `${(labelPos.x / SIZE) * 100}%`,
                  top: `${(labelPos.y / SIZE) * 100}%`,
                  transform: isTop
                    ? "translate(-50%, -100%)"
                    : isBottom
                    ? "translate(-50%, 0%)"
                    : isRight
                    ? "translate(0%, -50%)"
                    : "translate(-100%, -50%)",
                  textAlign: isRight ? "left" : isLeft ? "right" : "center",
                  cursor: "pointer",
                  pointerEvents: "none",
                  minWidth: Math.round((isTop || isBottom ? 180 : 150) * sc),
                  maxWidth: Math.round((isTop || isBottom ? 260 : 210) * sc),
                }}
              >
                <div style={{
                  fontSize: Math.max(Math.round(16 * sc), 12),
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: isHov ? c.color : "rgba(255,255,255,0.72)",
                  marginBottom: 5,
                  transition: "color 0.2s",
                  whiteSpace: "nowrap",
                }}>
                  {c.nameJP}
                </div>
                <div style={{
                  fontSize: Math.max(Math.round(12 * sc), 10),
                  color: "rgba(255,255,255,0.38)",
                  lineHeight: 1.5,
                  whiteSpace: "nowrap",
                  wordBreak: "keep-all",
                }}>
                  {c.sub}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ── サブブランド衛星ロゴ（軌道上を周回） ── */}
      {showLabels && subBrands.filter((b) => b.logo).map((b) => {
        const parentPos = toXY(CX, CY, R_OUTER, b.parentAngle);
        const dot = toXY(parentPos.x, parentPos.y, SAT_ORBIT_R, b.phase + satRot);
        const satSize = Math.round(84 * sc);
        return (
          <div
            key={b.name}
            style={{
              position: "absolute",
              left: `${(dot.x / SIZE) * 100}%`,
              top: `${(dot.y / SIZE) * 100}%`,
              width: satSize,
              height: satSize,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 11,
            }}
          >
            <Image
              src={b.logo!}
              alt={b.name}
              width={satSize}
              height={satSize}
              style={{
                width: satSize,
                height: satSize,
                objectFit: "contain",
                filter: `drop-shadow(0 0 8px ${b.color}60)`,
              }}
            />
          </div>
        );
      })}

      {/* ── サブブランド衛星ラベル（ドットに追従） ── */}
      {showLabels && subBrands.filter((b) => !b.logo).map((b) => {
        const parentPos = toXY(CX, CY, R_OUTER, b.parentAngle);
        const dot = toXY(parentPos.x, parentPos.y, SAT_ORBIT_R, b.phase + satRot);
        return (
          <div
            key={b.name}
            style={{
              position: "absolute",
              left: `${(dot.x / SIZE) * 100}%`,
              top: `${(dot.y / SIZE) * 100}%`,
              transform: "translate(-50%, calc(-100% - 8px))",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{
              fontFamily: "Orbitron, monospace",
              fontSize: Math.max(Math.round(13 * sc), 11),
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: b.color,
              opacity: 0.85,
            }}>
              {b.name}
            </span>
          </div>
        );
      })}

      {/* ── Center logo ── */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ position: "relative", width: centerSize, height: centerSize, animation: "centerFloat 5s ease-in-out infinite" }}>
          <Image
            src="/logos/aile-illust.png"
            alt=""
            width={centerSize}
            height={centerSize}
            style={{ position: "absolute", inset: 0, objectFit: "contain", opacity: 0.45, filter: "drop-shadow(0 0 24px rgba(0,210,239,0.6))", width: "100%", height: "100%" }}
          />
          <Image
            src="/logos/aile-logo.png"
            alt="AiLE GROUP"
            width={aileLogoSize}
            height={aileLogoSize}
            style={{ position: "absolute", inset: 0, margin: "auto", objectFit: "contain", filter: "drop-shadow(0 0 14px rgba(0,210,239,0.45))", width: aileLogoSize, height: aileLogoSize }}
          />
        </div>
      </div>

      <style>{`
        @keyframes centerFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
