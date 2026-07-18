"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const orbitCompanies = [
  {
    id: "iwill",
    name: "IWiLL",
    nameJP: "株式会社I WiLL",
    sub: "営業代行・人材教育",
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
    sub: "アパレルブランド事業 · BRANDVOX",
    logo: "/logos/bravo-icon.png",
    color: "#facc15",
    angle: 136,
  },
  {
    id: "lien",
    name: "LiEN",
    nameJP: "株式会社LiEN",
    sub: "飲食店事業",
    logo: "/logos/lien-icon.png",
    color: "#c084fc",
    angle: 224,
  },
  {
    id: "titan",
    name: "TiTAN",
    nameJP: "株式会社TiTAN",
    sub: "オンライン金融教育 · FiNEDGE",
    logo: "/logos/titan-icon.png",
    color: "#b0b8c8",
    angle: 292,
  },
];

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
  const LOGO_BOX = Math.round(108 * sc);
  const LOGO_RADIUS = Math.round(24 * sc);
  const LOGO_IMG = Math.round(82 * sc);
  const LOGO_IMG_MAX_H = Math.round(70 * sc);
  const NODE_R = 54 * sc;
  const NODE_R_HOV = 58 * sc;
  const NODE_GLOW_R = 62 * sc;
  const NODE_PULSE_R = 66 * sc;
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

        {orbitCompanies.map((c) => {
          const pos = toXY(CX, CY, R_OUTER, c.angle);
          const isHov = hovered === c.id;
          return (
            <g key={c.id}>
              {isHov && <circle cx={pos.x} cy={pos.y} r={NODE_GLOW_R} fill={`${c.color}12`} />}
              <circle
                cx={pos.x} cy={pos.y} r={isHov ? NODE_R_HOV : NODE_R}
                fill={isHov ? `${c.color}18` : "rgba(5,5,8,0.7)"}
                stroke={c.color}
                strokeWidth={isHov ? 1.5 : 1}
                strokeOpacity={isHov ? 0.7 : 0.35}
                filter={isHov ? "url(#glow-soft)" : undefined}
                style={{ transition: "all 0.2s", cursor: "pointer" }}
                onClick={() => { onSelect?.(c.id); }}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
              />
              {isHov && <circle cx={pos.x} cy={pos.y} r={NODE_PULSE_R} fill="none" stroke={c.color} strokeWidth="1" opacity={0.2} />}
            </g>
          );
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
                borderRadius: LOGO_RADIUS,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isHov ? `${c.color}18` : "rgba(5,5,8,0.8)",
                border: `1.5px solid ${isHov ? c.color + "80" : c.color + "30"}`,
                cursor: "pointer",
                transition: "all 0.25s",
                boxShadow: isHov ? `0 0 20px ${c.color}40` : "none",
                zIndex: 10,
              }}
            >
              <Image
                src={c.logo}
                alt={c.name}
                width={LOGO_IMG}
                height={LOGO_IMG}
                style={{ objectFit: "contain", maxWidth: LOGO_IMG, maxHeight: LOGO_IMG_MAX_H, width: "auto", height: "auto" }}
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

      {/* ── Center logo ── */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ position: "relative", width: centerSize, height: centerSize, animation: "centerFloat 5s ease-in-out infinite" }}>
          <Image
            src="/logos/aile-illust.png"
            alt=""
            width={centerSize}
            height={centerSize}
            style={{ position: "absolute", inset: 0, objectFit: "contain", opacity: 0.22, filter: "drop-shadow(0 0 24px rgba(0,210,239,0.6))", width: "100%", height: "100%" }}
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
