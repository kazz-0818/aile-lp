"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const orbitCompanies = [
  {
    id: "iwill",
    name: "IWiLL",
    nameJP: "株式会社I WiLL",
    sub: "営業代行・人材教育",
    logo: "/logos/iwill-logo.png",
    color: "#f97316",
    angle: 0,       // top
  },
  {
    id: "nlg",
    name: "NLG",
    nameJP: "株式会社NLG",
    sub: "ラクシス\n業務効率化SaaS",
    logo: "/logos/nlg-logo.png",
    color: "#60a5fa",
    angle: 68,      // upper right
  },
  {
    id: "bravo",
    name: "BRAVO",
    nameJP: "株式会社BRAVO",
    sub: "アパレルブランド事業\nBRANDVOX（ファッション×ポイ活）",
    logo: "/logos/bravo-logo.png",
    color: "#facc15",
    angle: 136,     // lower right
  },
  {
    id: "lien",
    name: "LiEN",
    nameJP: "株式会社LiEN",
    sub: "飲食店事業",
    logo: "/logos/lien-logo.png",
    color: "#c084fc",
    angle: 224,     // lower left
  },
  {
    id: "titan",
    name: "TiTAN",
    nameJP: "株式会社TiTAN",
    sub: "オンライン金融教育\nFiNEDGE",
    logo: "/logos/titan-logo.png",
    color: "#b0b8c8",
    angle: 292,     // upper left
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

  const SIZE = 560;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R_OUTER = 220;
  const R_MID   = 160;
  const R_INNER  = 95;

  // Slow rotation for the dashed rings
  const rot1 = (tick / 60000) * 360;      // very slow clockwise
  const rot2 = -(tick / 45000) * 360;     // counter-clockwise
  const rot3 = (tick / 80000) * 360;

  // Pulse scale for center
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
          {/* Glow filter */}
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Radial gradient for center */}
          <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,210,239,0.15)" />
            <stop offset="100%" stopColor="rgba(0,210,239,0)" />
          </radialGradient>
          {/* Ring gradient */}
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

        {/* Outermost ambient glow */}
        <circle cx={CX} cy={CY} r={R_OUTER + 30} fill="url(#ring-glow)" />

        {/* ── Rotating ring 1: outer dashed ── */}
        <g transform={`rotate(${rot1}, ${CX}, ${CY})`}>
          <circle
            cx={CX} cy={CY} r={R_OUTER}
            fill="none"
            stroke="rgba(0,210,239,0.2)"
            strokeWidth="1"
            strokeDasharray="4 12"
          />
        </g>

        {/* ── Solid outer ring ── */}
        <circle
          cx={CX} cy={CY} r={R_OUTER}
          fill="none"
          stroke="rgba(0,210,239,0.12)"
          strokeWidth="1"
        />

        {/* ── Mid ring rotating ── */}
        <g transform={`rotate(${rot2}, ${CX}, ${CY})`}>
          <circle
            cx={CX} cy={CY} r={R_MID}
            fill="none"
            stroke="rgba(0,210,239,0.1)"
            strokeWidth="1"
            strokeDasharray="2 8"
          />
        </g>
        <circle
          cx={CX} cy={CY} r={R_MID}
          fill="none"
          stroke="rgba(0,210,239,0.07)"
          strokeWidth="1"
        />

        {/* ── Inner ring ── */}
        <g transform={`rotate(${rot3}, ${CX}, ${CY})`}>
          <circle
            cx={CX} cy={CY} r={R_INNER}
            fill="none"
            stroke="rgba(0,210,239,0.15)"
            strokeWidth="1"
            strokeDasharray="3 10"
          />
        </g>

        {/* ── Spoke lines to each company ── */}
        {orbitCompanies.map((c) => {
          const outer = toXY(CX, CY, R_OUTER, c.angle);
          const inner = toXY(CX, CY, R_INNER + 10, c.angle);
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

        {/* ── Orbit dot on mid ring (animated position) ── */}
        {[0, 72, 144, 216, 288].map((offset, i) => {
          const angle = (offset + rot1 * 3) % 360;
          const pos = toXY(CX, CY, R_MID, angle);
          return (
            <circle
              key={i}
              cx={pos.x} cy={pos.y} r={2}
              fill="rgba(0,210,239,0.5)"
            />
          );
        })}
        {[0, 60, 120, 180, 240, 300].map((offset, i) => {
          const angle = (offset + rot2 * 4) % 360;
          const pos = toXY(CX, CY, R_OUTER, angle);
          return (
            <circle
              key={i}
              cx={pos.x} cy={pos.y} r={1.5}
              fill="rgba(0,210,239,0.35)"
            />
          );
        })}

        {/* ── Company nodes: glow circles only (logos are HTML overlay) ── */}
        {orbitCompanies.map((c) => {
          const pos = toXY(CX, CY, R_OUTER, c.angle);
          const isHov = hovered === c.id;
          return (
            <g key={c.id}>
              {isHov && (
                <circle cx={pos.x} cy={pos.y} r={44} fill={`${c.color}12`} />
              )}
              <circle
                cx={pos.x} cy={pos.y} r={isHov ? 40 : 36}
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
              {isHov && (
                <circle cx={pos.x} cy={pos.y} r={48} fill="none" stroke={c.color} strokeWidth="1" opacity={0.2} />
              )}
            </g>
          );
        })}

        {/* ── Center glow ── */}
        <circle
          cx={CX} cy={CY} r={R_INNER - 10}
          fill="url(#center-grad)"
          transform={`scale(${pulse})`}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />
        <circle
          cx={CX} cy={CY} r={R_INNER}
          fill="none"
          stroke="rgba(0,210,239,0.25)"
          strokeWidth="1"
          filter="url(#glow-cyan)"
        />
        <circle
          cx={CX} cy={CY} r={R_INNER - 5}
          fill="rgba(5,5,8,0.85)"
        />
      </svg>

      {/* ── Company logos ON the ring (HTML overlay) ── */}
      {orbitCompanies.map((c) => {
        const pos = toXY(CX, CY, R_OUTER, c.angle);
        const isHov = hovered === c.id;

        // Label offset direction (push text away from center)
        const angleMod = ((c.angle % 360) + 360) % 360;
        const isTop    = angleMod <= 45 || angleMod >= 315;
        const isBottom = angleMod > 135 && angleMod < 225;
        const isRight  = angleMod > 45 && angleMod <= 135;
        const isLeft   = angleMod >= 225 && angleMod < 315;

        const labelOffset = 58;
        const labelPos = toXY(CX, CY, R_OUTER + labelOffset, c.angle);

        return (
          <div key={c.id}>
            {/* Logo box — centered on the ring dot position */}
            <div
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { onSelect?.(c.id); document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              style={{
                position: "absolute",
                left: `${(pos.x / SIZE) * 100}%`,
                top: `${(pos.y / SIZE) * 100}%`,
                transform: "translate(-50%, -50%)",
                width: 70,
                height: 70,
                borderRadius: 16,
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
                width={52}
                height={52}
                style={{ objectFit: "contain", maxWidth: 52, maxHeight: 44, width: "auto", height: "auto" }}
              />
            </div>

            {/* Label — offset outward from the ring */}
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
              }}
            >
              <div style={{
                fontSize: 13,
                fontFamily: '"Noto Sans JP", sans-serif',
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: isHov ? c.color : "rgba(255,255,255,0.55)",
                marginBottom: 4,
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}>
                {c.nameJP}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                {c.sub}
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Center logo: SIZE全体をflexboxでセンタリング ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {/* アニメーションはこの内側divのみ（translateYだけ動く） */}
        <div style={{ position: "relative", width: 160, height: 160, animation: "centerFloat 5s ease-in-out infinite" }}>
          {/* 背面: 翼イラスト（透過） */}
          <Image
            src="/logos/aile-illust.png"
            alt=""
            width={160}
            height={160}
            style={{
              position: "absolute",
              inset: 0,
              objectFit: "contain",
              opacity: 0.22,
              filter: "drop-shadow(0 0 24px rgba(0,210,239,0.6))",
              width: "100%",
              height: "100%",
            }}
          />
          {/* 前面: AiLE GROUP フルロゴ */}
          <Image
            src="/logos/aile-logo.png"
            alt="AiLE GROUP"
            width={130}
            height={130}
            style={{
              position: "absolute",
              inset: 0,
              margin: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 0 14px rgba(0,210,239,0.45))",
              width: 130,
              height: 130,
            }}
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
