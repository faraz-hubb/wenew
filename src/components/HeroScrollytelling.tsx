import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import ParticleBrainCanvas from './ParticleBrainCanvas';
import { COPY, type Language } from '../i18n';

interface HeroScrollytellingProps {
  language: Language;
  onRequestAccess: () => void;
  onOverWebGLChange: (over: boolean) => void;
}

const STAGE_TARGETS = [0.0, 0.28, 0.58, 0.91];

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export default function HeroScrollytelling({
  language,
  onRequestAccess,
  onOverWebGLChange,
}: HeroScrollytellingProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgressRef = useRef(0);
  const logoPulseRef = useRef(0);
  const [scrollRaw, setScrollRaw] = useState(0);
  const [beatOpacity, setBeatOpacity] = useState({ b1: 1, b2: 0, b3: 0, b4: 0 });
  const [isCanvasVisible, setIsCanvasVisible] = useState(true);
  const [logoPulsing, setLogoPulsing] = useState(false);
  const pulseTimeoutRef = useRef<number | null>(null);

  const t = COPY[language].hero;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsCanvasVisible(visible);
        onOverWebGLChange(visible);
      },
      { threshold: 0.02 }
    );
    observer.observe(section);

    let rafPending = false;

    const updateScroll = () => {
      rafPending = false;
      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(1, section.offsetHeight - window.innerHeight);
      const raw = clamp01(-rect.top / scrollableDistance);
      scrollProgressRef.current = raw;
      setScrollRaw(raw);

      const b1 = 1 - smoothstep(0.06, 0.16, raw);
      const b2In = smoothstep(0.16, 0.25, raw);
      const b2Out = 1 - smoothstep(0.36, 0.45, raw);
      const b2 = Math.min(b2In, b2Out);
      const b3In = smoothstep(0.45, 0.54, raw);
      const b3Out = 1 - smoothstep(0.66, 0.76, raw);
      const b3 = Math.min(b3In, b3Out);
      const b4 = smoothstep(0.77, 0.87, raw);

      setBeatOpacity({ b1, b2, b3, b4 });

      onOverWebGLChange(rect.bottom > 64 && rect.top <= 64);
    };

    const handleScroll = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (pulseTimeoutRef.current !== null) {
        window.clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, [onOverWebGLChange]);

  const jumpToProgress = (targetProgress: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollableDistance = Math.max(1, section.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: sectionTop + scrollableDistance * targetProgress,
      behavior: 'smooth',
    });
  };

  const scrollToServices = () => {
    const el = document.querySelector('#services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    logoPulseRef.current = performance.now();
    setLogoPulsing(true);
    if (pulseTimeoutRef.current !== null) {
      window.clearTimeout(pulseTimeoutRef.current);
    }
    pulseTimeoutRef.current = window.setTimeout(() => {
      setLogoPulsing(false);
    }, 520);
  };

  // Landing logo dissolves cleanly as Page 2 ("Software shaped around your audience.") enters;
  // zero hover or scroll-resize effects — only the tactile pulse effect remains
  const logoOpacity = 1 - smoothstep(0.08, 0.17, scrollRaw);
  const pulseScale = logoPulsing ? 1.09 : 1;

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    logoPulseRef.current = performance.now();
  };

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative h-[440vh] bg-[#030405]"
      aria-label="WENEW interactive web and application studio overview"
    >
      {/* Sticky 100vh Stage */}
      <div
        onClick={handleStageClick}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
      >
        {/* Atmospheric black, silver-chrome & glowing #44D62C center aura for Apple Glass refraction */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 34%, rgba(226, 232, 240, 0.16) 0%, rgba(68, 214, 44, 0.12) 28%, rgba(18, 22, 28, 0.36) 50%, rgba(3, 4, 5, 1) 76%)',
          }}
        />

        {/* Subtle dark architectural grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255, 255, 255, 0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.055) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        {/* Interactive 3D WENEW Particle + Light Photon Sculpture */}
        <ParticleBrainCanvas
          scrollProgressRef={scrollProgressRef}
          activeSectionVisible={isCanvasVisible}
          logoPulseRef={logoPulseRef}
        />

        {/* Landing Logo centered above 3D WENEW particle text; dissolves as Page 2 enters */}
        <div
          className="absolute left-1/2 top-[4.65rem] sm:top-[5.15rem] z-20 -translate-x-1/2 will-change-[opacity]"
          style={{
            opacity: logoOpacity,
            pointerEvents: logoOpacity > 0.2 ? 'auto' : 'none',
          }}
        >
          <button
            type="button"
            onClick={handleLogoClick}
            aria-label="Pulse WENEW emblem and particle wave"
            className="relative flex items-center justify-center rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#44D62C] transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: `scale(${pulseScale})`,
            }}
          >
            {/* Pulse halo on click */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl border border-[#44D62C]/75 pointer-events-none transition-all duration-200 ease-out"
              style={{
                opacity: logoPulsing ? 0.92 : 0,
                transform: logoPulsing ? 'scale(1.18)' : 'scale(0.96)',
                boxShadow: logoPulsing ? '0 0 26px rgba(68, 214, 44, 0.5)' : 'none',
              }}
            />

            {/* Cropped, crisp WENEW emblem */}
            <span className="relative w-28 h-[4rem] sm:w-36 sm:h-[5.15rem] overflow-hidden rounded-xl flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/LOGO_png_2cae51bd.png"
                alt="WENEW logo"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[205px] sm:w-[262px] max-w-none h-auto select-none pointer-events-none"
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(68, 214, 44, 0.42))',
                }}
              />
            </span>
          </button>
        </div>

        {/* Centered Editorial Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto w-full px-5 sm:px-8 pt-16 h-full flex flex-col items-center justify-end pb-24 sm:pb-28 pointer-events-none">
          {/* BEAT 1: Centered Hero Landing Copy & Centered Action Buttons */}
          <div
            className="w-full max-w-2xl mx-auto text-center will-change-[transform,opacity]"
            style={{
              opacity: beatOpacity.b1,
              transform: `translate3d(0, ${(1 - beatOpacity.b1) * -28}px, 0)`,
              pointerEvents: beatOpacity.b1 > 0.25 ? 'auto' : 'none',
            }}
          >
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <span className="w-6 h-[1.5px] bg-[#44D62C] rounded-full" aria-hidden="true" />
              <p className="text-xs sm:text-[13px] font-semibold tracking-[0.06em] uppercase text-[#44D62C]">
                {t.beat1.eyebrow}
              </p>
              <span className="w-6 h-[1.5px] bg-[#44D62C] rounded-full" aria-hidden="true" />
            </div>

            <h1
              className="font-display font-semibold tracking-[-0.035em] text-white leading-[1.04] mb-4"
              style={{
                fontSize: 'clamp(2.1rem, 4.1vw, 3.65rem)',
                textWrap: 'balance',
              }}
            >
              {t.beat1.titlePre}
              <span className="text-[#44D62C]">{t.beat1.titleAccent}</span>
            </h1>

            <p className="text-[15px] sm:text-[17px] text-zinc-300 leading-[1.65] max-w-[50ch] mx-auto mb-7">
              {t.beat1.summary}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={onRequestAccess}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-[15px] font-semibold text-black bg-[#44D62C] rounded-xl hover:bg-[#52E43B] active:scale-[0.98] shadow-[0_10px_28px_-6px_rgba(68,214,44,0.48)] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#44D62C]"
              >
                <span>{t.beat1.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={scrollToServices}
                className="sheer-glass inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-[15px] font-semibold text-zinc-100 rounded-xl hover:border-[#44D62C]/60 hover:text-[#44D62C] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#44D62C]"
              >
                <span>{t.beat1.ctaSecondary}</span>
              </button>
            </div>
          </div>

          {/* BEAT 2: Positioned cleanly lower so the widened WENEW 3D typography stays fully visible above */}
          <div
            className="absolute inset-0 px-5 sm:px-8 flex items-end justify-center pb-12 sm:pb-16 will-change-[transform,opacity]"
            style={{
              opacity: beatOpacity.b2,
              transform: `translate3d(0, ${(1 - beatOpacity.b2) * 28}px, 0)`,
              pointerEvents: beatOpacity.b2 > 0.25 ? 'auto' : 'none',
            }}
          >
            <div className="relative overflow-hidden bg-[#050709] border border-white/15 shadow-[0_26px_64px_-16px_rgba(0,0,0,0.92),inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_-1px_0_0_rgba(68,214,44,0.22)] max-w-xl sm:max-w-2xl w-full mx-auto rounded-2xl p-5 sm:p-7 text-center">
              {/* Crisp obsidian geometric & dot-matrix vector pattern */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="beat2-black-grid"
                    width="28"
                    height="28"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 28 0 L 0 0 0 28"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.055)"
                      strokeWidth="0.75"
                    />
                    <path
                      d="M 0 28 L 28 0"
                      fill="none"
                      stroke="rgba(68, 214, 44, 0.065)"
                      strokeWidth="0.6"
                    />
                    <circle cx="0" cy="0" r="1.05" fill="rgba(255, 255, 255, 0.18)" />
                    <circle cx="14" cy="14" r="0.8" fill="rgba(68, 214, 44, 0.28)" />
                  </pattern>
                  <radialGradient id="beat2-pattern-glow" cx="50%" cy="18%" r="72%">
                    <stop offset="0%" stopColor="rgba(68, 214, 44, 0.16)" />
                    <stop offset="55%" stopColor="rgba(255, 255, 255, 0.035)" />
                    <stop offset="100%" stopColor="rgba(5, 7, 9, 0)" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#beat2-black-grid)" />
                <rect width="100%" height="100%" fill="url(#beat2-pattern-glow)" />
              </svg>

              <div className="relative z-10">
                <p className="text-xs sm:text-[13px] font-semibold tracking-[0.05em] uppercase text-[#44D62C] mb-2">
                  {t.beat2.eyebrow}
                </p>
                <h2
                  className="font-display font-semibold tracking-[-0.03em] text-white leading-[1.08] mb-2.5"
                  style={{
                    fontSize: 'clamp(1.5rem, 2.6vw, 2.2rem)',
                    textWrap: 'balance',
                  }}
                >
                  {t.beat2.titlePre}
                  <span className="text-[#44D62C]">{t.beat2.titleAccent}</span>
                </h2>
                <p className="text-[14px] sm:text-[15.5px] text-zinc-300 leading-[1.58] mb-4 max-w-[48ch] mx-auto">
                  {t.beat2.summary}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3.5 border-t border-white/10 text-xs sm:text-[13px] font-medium text-zinc-400">
                  {t.beat2.pills.map((pill, i) => (
                    <span key={pill} className="inline-flex items-center gap-4">
                      {i > 0 && <span aria-hidden="true">·</span>}
                      <span>{pill}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BEAT 3: Centered horizontally & vertically inside the full WENEW particle POP dispersion */}
          <div
            className="absolute inset-0 px-5 sm:px-8 flex items-center justify-center will-change-[transform,opacity]"
            style={{
              opacity: beatOpacity.b3,
              transform: `translate3d(0, ${(1 - beatOpacity.b3) * 28}px, 0)`,
              pointerEvents: beatOpacity.b3 > 0.25 ? 'auto' : 'none',
            }}
          >
            <div className="sheer-glass max-w-xl sm:max-w-2xl w-full mx-auto rounded-2xl p-6 sm:p-8 text-center">
              <p className="text-xs sm:text-[13px] font-semibold tracking-[0.05em] uppercase text-[#44D62C] mb-3">
                {t.beat3.eyebrow}
              </p>
              <h2
                className="font-display font-semibold tracking-[-0.025em] text-white leading-[1.12] mb-3.5"
                style={{
                  fontSize: 'clamp(1.6rem, 2.8vw, 2.35rem)',
                  textWrap: 'balance',
                }}
              >
                {t.beat3.title}
              </h2>
              <p className="text-[14px] sm:text-[16px] text-zinc-300 leading-[1.62] max-w-[50ch] mx-auto mb-6">
                {t.beat3.summary}
              </p>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => jumpToProgress(STAGE_TARGETS[3])}
                  className="sheer-glass inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#44D62C] rounded-xl hover:border-[#44D62C]/60 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>{t.beat3.cta}</span>
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* BEAT 4: Positioned cleanly lower so the assembled bright-white 3D Particle Logo stays completely visible above */}
          <div
            className="absolute inset-0 px-5 sm:px-8 flex items-end justify-center pb-[5.25rem] sm:pb-[5.75rem] will-change-[transform,opacity]"
            style={{
              opacity: beatOpacity.b4,
              transform: `translate3d(0, ${(1 - beatOpacity.b4) * 28}px, 0)`,
              pointerEvents: beatOpacity.b4 > 0.25 ? 'auto' : 'none',
            }}
          >
            <div className="relative overflow-hidden bg-[#050709] border border-white/15 shadow-[0_26px_64px_-16px_rgba(0,0,0,0.92),inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_-1px_0_0_rgba(68,214,44,0.22)] max-w-xl sm:max-w-2xl w-full mx-auto rounded-2xl p-5 sm:p-7 text-center">
              {/* Crisp obsidian geometric & dot-matrix vector pattern */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="beat4-black-grid"
                    width="28"
                    height="28"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 28 0 L 0 0 0 28"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.055)"
                      strokeWidth="0.75"
                    />
                    <path
                      d="M 0 28 L 28 0"
                      fill="none"
                      stroke="rgba(68, 214, 44, 0.065)"
                      strokeWidth="0.6"
                    />
                    <circle cx="0" cy="0" r="1.05" fill="rgba(255, 255, 255, 0.18)" />
                    <circle cx="14" cy="14" r="0.8" fill="rgba(68, 214, 44, 0.28)" />
                  </pattern>
                  <radialGradient id="beat4-pattern-glow" cx="50%" cy="18%" r="72%">
                    <stop offset="0%" stopColor="rgba(68, 214, 44, 0.16)" />
                    <stop offset="55%" stopColor="rgba(255, 255, 255, 0.035)" />
                    <stop offset="100%" stopColor="rgba(5, 7, 9, 0)" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#beat4-black-grid)" />
                <rect width="100%" height="100%" fill="url(#beat4-pattern-glow)" />
              </svg>

              <div className="relative z-10">
                <p className="text-xs sm:text-[13px] font-semibold tracking-[0.05em] uppercase text-[#44D62C] mb-2.5">
                  {t.beat4.eyebrow}
                </p>
                <h2
                  className="font-display font-semibold tracking-[-0.025em] text-white leading-[1.1] mb-3"
                  style={{
                    fontSize: 'clamp(1.45rem, 2.5vw, 2.15rem)',
                    textWrap: 'balance',
                  }}
                >
                  {t.beat4.title}
                </h2>
                <p className="text-[14px] sm:text-[16px] text-zinc-300 leading-[1.6] max-w-[48ch] mx-auto mb-5">
                  {t.beat4.summary}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3.5">
                  <button
                    type="button"
                    onClick={onRequestAccess}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-black bg-[#44D62C] rounded-xl hover:bg-[#52E43B] shadow-[0_8px_24px_-6px_rgba(68,214,44,0.45)] transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>{t.beat4.ctaPrimary}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={scrollToServices}
                    className="sheer-glass inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-zinc-100 rounded-xl hover:border-[#44D62C]/60 hover:text-[#44D62C] transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>{t.beat4.ctaSecondary}</span>
                    <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
