// Generates the animated SVGs in /assets used by the profile README.
// Run: node scripts/build-assets.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "assets");
mkdirSync(out, { recursive: true });

const anton = readFileSync(join(root, "scripts", "Anton.woff2")).toString("base64");
const FONT = `@font-face{font-family:'Anton';src:url(data:font/woff2;base64,${anton}) format('woff2');}`;
const MONO = "ui-monospace,SFMono-Regular,Consolas,'Liberation Mono','Courier New',monospace";
const r = (n) => Math.round(n * 10) / 10;

// ---------- spinning wireframe cube (real 3D projected per frame) ----------
function cubePaths({ cx, cy, size, tilt, frames, reverse = false }) {
  const V = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) V.push([x, y, z]);
  const E = [];
  for (let i = 0; i < 8; i++)
    for (let j = i + 1; j < 8; j++) {
      const d = V[i].reduce((s, v, k) => s + (v !== V[j][k] ? 1 : 0), 0);
      if (d === 1) E.push([i, j]);
    }
  const values = [];
  for (let f = 0; f <= frames; f++) {
    const a = ((reverse ? -1 : 1) * (f / frames) * Math.PI) / 2; // 90° turn loops seamlessly
    const P = V.map(([x, y, z]) => {
      let X = x * Math.cos(a) + z * Math.sin(a);
      let Z = -x * Math.sin(a) + z * Math.cos(a);
      let Y = y * Math.cos(tilt) - Z * Math.sin(tilt);
      Z = y * Math.sin(tilt) + Z * Math.cos(tilt);
      const p = 4 / (4 + Z);
      return [cx + X * size * p, cy + Y * size * p];
    });
    values.push(E.map(([i, j]) => `M${r(P[i][0])} ${r(P[i][1])}L${r(P[j][0])} ${r(P[j][1])}`).join(""));
  }
  return values.join(";");
}

// ---------- HERO ----------
function hero() {
  const W = 1200, H = 420, HZ = 300, VPX = 900;
  const vLines = [];
  for (let i = -14; i <= 14; i++) {
    const xb = VPX + i * 90;
    vLines.push(`<line x1="${VPX}" y1="${HZ}" x2="${xb}" y2="${H}"/>`);
  }
  const hLines = [];
  const N = 6, dur = 3;
  for (let i = 0; i < N; i++) {
    hLines.push(`<line x1="0" x2="${W}" y1="${HZ}" y2="${HZ}"><animate attributeName="y1" values="${HZ};${H}" keyTimes="0;1" calcMode="spline" keySplines="0.55 0 1 1" dur="${dur}s" begin="${-(i * dur) / N}s" repeatCount="indefinite"/><animate attributeName="y2" values="${HZ};${H}" keyTimes="0;1" calcMode="spline" keySplines="0.55 0 1 1" dur="${dur}s" begin="${-(i * dur) / N}s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" values="0.15;0.9" dur="${dur}s" begin="${-(i * dur) / N}s" repeatCount="indefinite"/></line>`);
  }
  const sunStripes = [];
  for (let i = 0; i < 6; i++) {
    const y = 205 + i * 15, h = 2 + i * 1.6;
    sunStripes.push(`<rect x="700" y="${y}" width="400" height="${r(h)}" fill="#000"/>`);
  }
  const outer = cubePaths({ cx: 900, cy: 170, size: 62, tilt: 0.52, frames: 18 });
  const inner = cubePaths({ cx: 900, cy: 170, size: 30, tilt: 0.52, frames: 18, reverse: true });
  const name = "FAHMI PAHREZI";
  const jitter = "0 0;0 0;-6 0;3 0;0 0;0 0;0 0;0 0;5 0;-2 0;0 0;0 0";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Fahmi Pahrezi — Motion Designer and 3D Web Developer">
<defs>
<style>${FONT}
.name{font-family:'Anton',Impact,'Arial Narrow Bold',sans-serif;font-size:118px;letter-spacing:2px}
.mono{font-family:${MONO};font-weight:700}
</style>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="22"/></clipPath>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07061a"/><stop offset="0.7" stop-color="#1c1240"/><stop offset="1" stop-color="#3a1550"/></linearGradient>
<linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd166"/><stop offset="0.55" stop-color="#ff6b6b"/><stop offset="1" stop-color="#c2185b"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0f3d"/><stop offset="1" stop-color="#090514"/></linearGradient>
<linearGradient id="nameFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="#ffe3e3"/><stop offset="1" stop-color="#ff9a9a"/></linearGradient>
<mask id="sunMask"><rect width="${W}" height="${H}" fill="#fff"/>${sunStripes.join("")}</mask>
<pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#000" opacity="0.28"/></pattern>
<radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.65"/></radialGradient>
<filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.09"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>
<g clip-path="url(#frame)">
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <!-- stars -->
  <g fill="#fff">${Array.from({ length: 40 }, (_, i) => {
    const x = (i * 197) % W, y = (i * 71) % (HZ - 40) + 10, o = 0.25 + ((i * 37) % 60) / 100;
    return `<circle cx="${x}" cy="${y}" r="${i % 5 === 0 ? 1.6 : 1}" opacity="${r(o)}">${i % 4 === 0 ? `<animate attributeName="opacity" values="${r(o)};0.1;${r(o)}" dur="${2 + (i % 5)}s" repeatCount="indefinite"/>` : ""}</circle>`;
  }).join("")}</g>
  <!-- sun -->
  <circle cx="${VPX}" cy="${HZ}" r="150" fill="url(#sun)" mask="url(#sunMask)" filter="url(#glow)" opacity="0.95"/>
  <!-- floor grid -->
  <rect y="${HZ}" width="${W}" height="${H - HZ}" fill="url(#floor)"/>
  <g stroke="#ff4fd8" stroke-width="1.4" stroke-opacity="0.55" filter="url(#glow)">${vLines.join("")}</g>
  <g stroke="#ff4fd8" stroke-width="1.6" filter="url(#glow)">${hLines.join("")}</g>
  <line x1="0" x2="${W}" y1="${HZ}" y2="${HZ}" stroke="#ff9de6" stroke-width="2" filter="url(#glow)"/>
  <!-- 3D cube -->
  <g fill="none" stroke-linecap="round" filter="url(#glow)">
    <path stroke="#7df9ff" stroke-width="2.6"><animate attributeName="d" values="${outer}" dur="3.6s" repeatCount="indefinite"/></path>
    <path stroke="#ffd166" stroke-width="1.8" opacity="0.9"><animate attributeName="d" values="${inner}" dur="2.4s" repeatCount="indefinite"/></path>
    <animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>
  </g>
  <!-- name with RGB split glitch -->
  <g>
    <text x="64" y="200" class="name" fill="#00e5ff" opacity="0.75"><animateTransform attributeName="transform" type="translate" values="${jitter}" calcMode="discrete" dur="2.4s" repeatCount="indefinite"/>${name}</text>
    <text x="64" y="200" class="name" fill="#ff2e63" opacity="0.75"><animateTransform attributeName="transform" type="translate" values="${jitter.split(";").map((p) => p.split(" ").map((n) => -n).join(" ")).join(";")}" calcMode="discrete" dur="2.4s" repeatCount="indefinite"/>${name}</text>
    <text x="64" y="200" class="name" fill="url(#nameFill)">${name}</text>
  </g>
  <text x="68" y="246" class="mono" font-size="21" fill="#7df9ff" letter-spacing="4">MOTION DESIGNER <tspan fill="#ff6b6b">×</tspan> 3D WEB DEVELOPER</text>
  <text x="68" y="278" class="mono" font-size="15" fill="#c9b8ff" opacity="0.85" letter-spacing="1">three.js · react three fiber · remotion · typescript</text>
  <!-- VHS HUD -->
  <g class="mono" font-size="20" fill="#fff">
    <text x="36" y="48" letter-spacing="2">▶ PLAY</text>
    <g><circle cx="${W - 130}" cy="41" r="8" fill="#ff2e63"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.5;1" dur="1.2s" repeatCount="indefinite"/></circle><text x="${W - 114}" y="48" letter-spacing="2">REC</text></g>
    <text x="36" y="${H - 26}" font-size="18" opacity="0.9" letter-spacing="2">SP  CH-03</text>
    <text x="${W - 36}" y="${H - 26}" font-size="18" opacity="0.9" text-anchor="end" letter-spacing="2">NOV 17 2026  00<tspan><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>:</tspan>07<tspan><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>:</tspan>26</text>
  </g>
  <!-- CRT overlays -->
  <rect width="${W}" height="${H}" fill="url(#scan)"/>
  <rect x="0" width="${W}" height="60" fill="url(#band)"><animate attributeName="y" values="-80;${H + 20}" dur="5s" repeatCount="indefinite"/></rect>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <rect width="${W}" height="${H}" fill="#fff" opacity="0"><animate attributeName="opacity" values="0;0;0.05;0;0;0.03;0" keyTimes="0;0.6;0.62;0.64;0.9;0.92;1" dur="6s" repeatCount="indefinite"/></rect>
</g>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="21" fill="none" stroke="#ff4fd8" stroke-opacity="0.35" stroke-width="2"/>
</svg>`;
}

// ---------- VHS CASSETTE CARD ----------
function cassette({ title, sub, tags, color, side }) {
  const W = 600, H = 340;
  const reel = (cx, tapeR, dur) => `
    <g transform="translate(${cx} 252)">
      <circle r="${tapeR}" fill="#3b2a22"/>
      <circle r="${tapeR}" fill="none" stroke="#5a4033" stroke-width="1" opacity="0.6"/>
      <g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${dur}s" repeatCount="indefinite"/>
        <circle r="20" fill="#e9e4da"/>
        ${[0, 60, 120, 180, 240, 300].map((a) => `<rect x="-2.5" y="-19" width="5" height="9" fill="#222" transform="rotate(${a})"/>`).join("")}
        <circle r="7" fill="#222"/>
      </g>
    </g>`;
  const tagW = (t) => t.length * 9.6 + 22;
  let tx = 52;
  const tagEls = tags.map((t) => {
    const w = tagW(t), el = `<g transform="translate(${r(tx)} 150)"><rect width="${r(w)}" height="24" rx="12" fill="${color}"/><text x="${r(w / 2)}" y="17" text-anchor="middle" class="mono" font-size="13" fill="#111">${t}</text></g>`;
    tx += w + 8;
    return el;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${title} — ${sub}">
<defs>
<style>${FONT}
.t{font-family:'Anton',Impact,'Arial Narrow Bold',sans-serif}
.mono{font-family:${MONO};font-weight:700}
</style>
<linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#262626"/><stop offset="1" stop-color="#0e0e0e"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1b22"/><stop offset="1" stop-color="#0a0a0f"/></linearGradient>
<linearGradient id="shine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.18"/><stop offset="0.4" stop-color="#fff" stop-opacity="0"/></linearGradient>
<pattern id="grip" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="3" fill="#000" opacity="0.35"/></pattern>
</defs>
<g>
  <animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>
  <rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="18" fill="url(#body)" stroke="#3a3a3a" stroke-width="2"/>
  <rect x="10" y="${H - 50}" width="${W - 20}" height="40" rx="0" fill="url(#grip)" opacity="0.6"/>
  <!-- label -->
  <rect x="36" y="30" width="${W - 72}" height="160" rx="8" fill="#f4ecdc"/>
  <rect x="36" y="30" width="${W - 72}" height="26" rx="8" fill="${color}"/>
  <rect x="36" y="46" width="${W - 72}" height="10" fill="${color}"/>
  <text x="52" y="49" class="mono" font-size="14" fill="#111" letter-spacing="3">SIDE ${side} · SP · T-120</text>
  <text x="${W - 52}" y="49" class="mono" font-size="14" fill="#111" text-anchor="end" letter-spacing="2">▶ PLAY</text>
  <text x="50" y="122" class="t" font-size="58" fill="#141414" letter-spacing="1">${title}</text>
  <line x1="52" y1="134" x2="${W - 52}" y2="134" stroke="#141414" stroke-opacity="0.15" stroke-dasharray="4 4"/>
  <text x="${W - 52}" y="88" class="mono" font-size="13" fill="#555" text-anchor="end">${sub}</text>
  ${tagEls.join("")}
  <!-- window -->
  <rect x="140" y="206" width="${W - 280}" height="94" rx="10" fill="url(#glass)" stroke="#444" stroke-width="2"/>
  <rect x="210" y="246" width="${W - 420}" height="12" fill="#3b2a22"/>
  ${reel(215, 44, 2.2)}
  ${reel(W - 215, 30, 1.6)}
  <rect x="140" y="206" width="${W - 280}" height="94" rx="10" fill="url(#shine)"/>
  <!-- screws & logo -->
  ${[[34, 214], [W - 34, 214], [34, H - 34], [W - 34, H - 34]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#1a1a1a" stroke="#555"/><line x1="${x - 4}" y1="${y}" x2="${x + 4}" y2="${y}" stroke="#666" stroke-width="1.5"/>`).join("")}
  <text x="70" y="262" class="t" font-size="26" fill="#bdbdbd" letter-spacing="2">VHS</text>
  <text x="${W - 70}" y="262" class="mono" font-size="14" fill="#bdbdbd" text-anchor="end">HQ</text>
</g>
</svg>`;
}

writeFileSync(join(out, "hero.svg"), hero());
const tapes = [
  { file: "tape-syva.svg", title: "SYVA NETLAB", sub: "simulasi praktikum 3D + AI", tags: ["THREE.JS", "AI VOICE", "EDU"], color: "#2ee6c5", side: "A" },
  { file: "tape-bioorg.svg", title: "BIO-ORG", sub: "link-in-bio rak kaset VHS", tags: ["HTML", "CSS", "VERCEL"], color: "#ff6b6b", side: "B" },
  { file: "tape-sentra.svg", title: "SENTRA", sub: "web app full-stack", tags: ["NEXT.JS", "TYPESCRIPT"], color: "#a78bfa", side: "A" },
  { file: "tape-motion.svg", title: "MOTION LAB", sub: "video + 3D dari kode", tags: ["REMOTION", "R3F", "BLENDER"], color: "#ffd166", side: "B" },
];
for (const t of tapes) writeFileSync(join(out, t.file), cassette(t));
console.log("built:", ["hero.svg", ...tapes.map((t) => t.file)].join(", "));
