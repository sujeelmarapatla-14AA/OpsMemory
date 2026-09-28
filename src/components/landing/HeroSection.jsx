import React, { useEffect, useState } from 'react';
import { ArrowDown, Sparkles, ChevronRight } from 'lucide-react';

/**
 * Authentic ASCII Telemetry & Memory Matrix Wave
 * Matches the ASCII landscape graphic in the reference image.
 */
function AsciiTelemetryWave() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 60);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  const characters = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];
  const width = 86;
  const height = 18;

  const rows = [];
  for (let y = 0; y < height; y++) {
    let rowStr = '';
    for (let x = 0; x < width; x++) {
      const wave1 = Math.sin((x / 7) + (frame / 5) + (y / 4));
      const wave2 = Math.cos((x / 11) - (frame / 7) + (y / 3));
      const wave3 = Math.sin((x * 0.15) + (y * 0.25));
      const elevation = (wave1 + wave2 + wave3) / 3;

      const threshold = (y / height) * 0.9 - 0.2;

      if (elevation > threshold && elevation < threshold + 0.6) {
        const charIdx = Math.floor(Math.abs(elevation) * (characters.length - 1));
        rowStr += characters[Math.min(charIdx, characters.length - 1)];
      } else if (y > 14 && (x + y + frame) % 4 === 0) {
        rowStr += '.';
      } else {
        rowStr += ' ';
      }
    }
    rows.push(rowStr);
  }

  return (
    <div className="w-full flex justify-center overflow-hidden select-none pointer-events-none opacity-85 hover:opacity-100 transition-opacity">
      <pre
        className="font-mono text-[9px] sm:text-[11px] md:text-[12.5px] leading-[1.05] tracking-[0.2em] text-[#d4d4d8] text-center whitespace-pre max-w-full overflow-x-hidden font-bold"
        style={{
          textShadow: '0 0 12px rgba(255, 255, 255, 0.22)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)'
        }}
      >
        {rows.join('\n')}
      </pre>
    </div>
  );
}

export default function HeroSection({ onLaunchConsole }) {
  const triggerConsole = (autoDemo = false) => {
    if (onLaunchConsole) {
      onLaunchConsole(autoDemo);
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#050505] text-[#EDEDED] flex flex-col justify-between overflow-hidden">
      {/* Pure monochrome atmospheric glow and subtle stipple texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.05),rgba(0,0,0,0.98))] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. TOP NAVBAR (Matches PULSE.IO navigation in image)      */}
      {/* ========================================================= */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Left: Brand Logo & Links */}
        <div className="flex items-center gap-8 sm:gap-10">
          <div
            onClick={() => triggerConsole(false)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-mono font-bold tracking-[0.22em] text-sm sm:text-base text-white group-hover:text-white/80 transition-colors">
              OPSMEMORY.IO
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-[#8E95A0]">
            <button
              onClick={() => triggerConsole(false)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Incidents
            </button>
            <button
              onClick={() => triggerConsole(false)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Hindsight Bank
            </button>
            <button
              onClick={() => triggerConsole(false)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Telemetry
            </button>
            <span className="text-[#3a3f47]">·</span>
            <span className="text-[#949aa3] flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              FastAPI: Online
            </span>
          </nav>
        </div>

        {/* Right: Launch Console Button */}
        <div>
          <button
            onClick={() => triggerConsole(false)}
            className="px-4 sm:px-5 py-2 rounded-lg text-xs font-mono font-medium border border-white/20 bg-white/[0.04] hover:bg-white hover:text-black hover:border-white text-white transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
          >
            Launch Console
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. HERO CONTENT (Matches exact typography & layout)       */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-4 sm:pt-8 pb-4 text-center flex flex-col items-center my-auto">
        {/* Pill Badge */}
        <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-md border border-white/15 bg-white/[0.03] backdrop-blur-md shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-white/90 uppercase font-semibold">
            HINDSIGHT ENGINE ACTIVE
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className="text-3xl sm:text-5xl md:text-6xl text-white font-normal tracking-tight max-w-3xl leading-[1.12] mb-5 select-none"
          style={{
            fontFamily: "'DotGothic16', 'Silkscreen', 'JetBrains Mono', monospace",
            letterSpacing: '0.04em',
            textShadow: '0 0 25px rgba(255, 255, 255, 0.2)'
          }}
        >
          Autonomous SRE Memory
          <br />
          <span className="text-white/95">While You Sleep</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#949aa3] max-w-xl mx-auto mb-8 font-mono">
          Deploy a tireless SRE memory engine that synthesizes complex telemetry, recalls prior incident resolutions, and eliminates repeat outages while you&apos;re offline.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <button
            onClick={() => triggerConsole(false)}
            className="px-6 py-2.5 rounded-lg text-xs font-mono font-bold bg-white text-black hover:bg-neutral-200 border border-white/30 shadow-lg shadow-white/5 transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-2 group"
          >
            <span>Launch Console</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => triggerConsole(true)}
            className="px-4 py-2.5 rounded-lg text-xs font-mono border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
            <span>Interactive Demo</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* 3. ASCII TELEMETRY & MEMORY MATRIX                        */}
        {/* ========================================================= */}
        <div className="w-full relative mt-1">
          <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-10" />
          
          <AsciiTelemetryWave />

          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* Down arrow link into the live Console */}
      <div className="relative z-20 pb-6 flex justify-center">
        <button
          onClick={() => triggerConsole(false)}
          className="flex items-center gap-2 text-[11px] font-mono text-[#6E7681] hover:text-white transition-colors cursor-pointer group"
        >
          <span>Explore SRE Console</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}
