import { useEffect, useRef, useState } from 'react';
import type { Language } from '../i18n';

export type ShipStopId = 'overview' | 'services' | 'about' | 'contact';

interface CursorRobotMascotProps {
  language: Language;
  activeStop: ShipStopId;
  isFlying: boolean;
}

const STOP_CONTENT: Record<ShipStopId, { en: { tag: string; line: string }; hy: { tag: string; line: string } }> = {
  overview: {
    en: { tag: 'WENEW Bot', line: 'Can I help you?' },
    hy: { tag: 'WENEW Bot', line: 'Կարո՞ղ եմ օգնել ձեզ։' },
  },
  services: {
    en: { tag: 'WENEW Bot', line: 'Can I help you?' },
    hy: { tag: 'WENEW Bot', line: 'Կարո՞ղ եմ օգնել ձեզ։' },
  },
  about: {
    en: { tag: 'WENEW Bot', line: 'Can I help you?' },
    hy: { tag: 'WENEW Bot', line: 'Կարո՞ղ եմ օգնել ձեզ։' },
  },
  contact: {
    en: { tag: 'WENEW Bot', line: 'Can I help you?' },
    hy: { tag: 'WENEW Bot', line: 'Կարո՞ղ եմ օգնել ձեզ։' },
  },
};

export default function CursorRobotMascot({
  language,
  activeStop,
  isFlying,
}: CursorRobotMascotProps) {
  const wrapperRef = useRef<HTMLButtonElement>(null);
  const headGroupRef = useRef<SVGGElement>(null);
  const leftPupilRef = useRef<SVGGElement>(null);
  const rightPupilRef = useRef<SVGGElement>(null);
  const antennaRef = useRef<SVGGElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const happyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.44;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const strength = Math.min(1, dist / 260);
      target.x = (dx / dist) * strength;
      target.y = (dy / dist) * strength;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.14;
      current.y += (target.y - current.y) * 0.14;

      const eyeX = current.x * 4.4;
      const eyeY = current.y * 3.4;
      const eyeTransform = `translate(${eyeX.toFixed(2)}px, ${eyeY.toFixed(2)}px)`;

      if (leftPupilRef.current) {
        leftPupilRef.current.style.transform = eyeTransform;
      }
      if (rightPupilRef.current) {
        rightPupilRef.current.style.transform = eyeTransform;
      }
      if (headGroupRef.current) {
        headGroupRef.current.style.transform = `translate(${(current.x * 2.4).toFixed(2)}px, ${(current.y * 1.6).toFixed(2)}px) rotate(${(current.x * 4.5).toFixed(2)}deg)`;
      }
      if (antennaRef.current) {
        antennaRef.current.style.transform = `rotate(${(current.x * 12).toFixed(2)}deg)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let blinkTimeout = 0;
    const scheduleBlink = () => {
      const delay = 2500 + Math.random() * 2800;
      blinkTimeout = window.setTimeout(() => {
        setIsBlinking(true);
        window.setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 145);
      }, delay);
    };

    scheduleBlink();
    return () => window.clearTimeout(blinkTimeout);
  }, []);

  useEffect(() => {
    return () => {
      if (happyTimerRef.current !== null) {
        window.clearTimeout(happyTimerRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    setIsHappy(true);
    if (happyTimerRef.current !== null) {
      window.clearTimeout(happyTimerRef.current);
    }
    happyTimerRef.current = window.setTimeout(() => {
      setIsHappy(false);
    }, 750);
  };

  const stopInfo = STOP_CONTENT[activeStop][language];
  const showFloatingContent = activeStop !== 'contact';

  return (
    <button
      ref={wrapperRef}
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`WENEW Space Ship companion — ${stopInfo.line}`}
      className="group relative flex items-center justify-center w-36 h-36 sm:w-40 sm:h-40 bg-transparent border-0 cursor-pointer shrink-0 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#44D62C]"
    >
      {/* Floating section content tag above the ship when seated/flying in Overview, Services & About */}
      {showFloatingContent && (
        <div
          className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.85)] transition-all duration-300 ${
            isFlying ? 'opacity-80 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {stopInfo.tag && (
            <span className="text-[10px] font-semibold text-[#44D62C] mr-1.5">
              {stopInfo.tag}
            </span>
          )}
          <span className="text-[11px] font-medium text-zinc-200">
            {stopInfo.line}
          </span>
        </div>
      )}

      {/* Transparent Space Ship + Cursor-Tracking Robot Pilot SVG */}
      <svg
        viewBox="0 0 144 136"
        className={`w-36 h-36 sm:w-40 sm:h-40 overflow-visible drop-shadow-[0_18px_24px_rgba(0,0,0,0.75)] transition-transform duration-200 group-hover:-translate-y-1 active:scale-95 ${
          isFlying ? '' : 'wenew-anim-ship-hover'
        }`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ship-hull-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#353d4a" />
            <stop offset="45%" stopColor="#141922" />
            <stop offset="100%" stopColor="#07090d" />
          </linearGradient>
          <linearGradient id="ship-rim-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="ship-dome-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(226, 232, 240, 0.24)" />
            <stop offset="55%" stopColor="rgba(68, 214, 44, 0.08)" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0.04)" />
          </linearGradient>
          <linearGradient id="ship-flame-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b9ff9f" />
            <stop offset="45%" stopColor="#44D62C" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#44D62C" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pilot-head-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#262e3a" />
            <stop offset="55%" stopColor="#10141c" />
            <stop offset="100%" stopColor="#05070a" />
          </linearGradient>
          <linearGradient id="pilot-visor-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#070a0e" />
            <stop offset="100%" stopColor="#020304" />
          </linearGradient>
        </defs>

        {/* Grounded neon-green hover shadow disc beneath ship */}
        <ellipse
          cx="72"
          cy="126"
          rx={isFlying ? '22' : '38'}
          ry="5"
          fill="rgba(68, 214, 44, 0.22)"
          className="transition-all duration-300"
        />

        {/* Ion Thruster Plumes underneath ship */}
        <g
          className={isFlying || isHovered || isHappy ? 'wenew-anim-thruster' : ''}
          opacity={isFlying ? 1 : isHovered || isHappy ? 0.85 : 0.48}
        >
          {/* Left booster flame */}
          <path
            d={isFlying ? 'M 38 103 L 43 130 L 48 103 Z' : 'M 39 103 L 43 116 L 47 103 Z'}
            fill="url(#ship-flame-grad)"
          />
          {/* Main center ion flame */}
          <path
            d={isFlying ? 'M 63 106 L 72 142 L 81 106 Z' : 'M 65 106 L 72 122 L 79 106 Z'}
            fill="url(#ship-flame-grad)"
          />
          {/* Right booster flame */}
          <path
            d={isFlying ? 'M 96 103 L 101 130 L 106 103 Z' : 'M 97 103 L 101 116 L 105 103 Z'}
            fill="url(#ship-flame-grad)"
          />
        </g>

        {/* Landing Skids & Underbelly Thruster Pods */}
        <path d="M 39 98 L 33 112 L 41 112" fill="none" stroke="rgba(226, 232, 240, 0.45)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 105 98 L 111 112 L 103 112" fill="none" stroke="rgba(226, 232, 240, 0.45)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="37" y="97" width="12" height="6" rx="2" fill="#0f141c" stroke="rgba(68,214,44,0.45)" strokeWidth="1" />
        <rect x="62" y="99" width="20" height="7" rx="3" fill="#0f141c" stroke="rgba(68,214,44,0.65)" strokeWidth="1.2" />
        <rect x="95" y="97" width="12" height="6" rx="2" fill="#0f141c" stroke="rgba(68,214,44,0.45)" strokeWidth="1" />

        {/* Sleek Wing Stabilizers */}
        <path
          d="M 22 86 L 6 77 L 16 93 L 32 94 Z"
          fill="#151b24"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M 122 86 L 138 77 L 128 93 L 112 94 Z"
          fill="#151b24"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Lower Space Ship Saucer Body */}
        <ellipse
          cx="72"
          cy="86"
          rx="54"
          ry="17"
          fill="url(#ship-hull-grad)"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1.4"
        />

        {/* Chrome & Neon Perimeter Belt */}
        <path
          d="M 20 84 Q 72 99 124 84"
          fill="none"
          stroke="url(#ship-rim-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.72"
        />

        {/* Glowing Navigation Lights along the ship hull */}
        <circle cx="30" cy="87" r="2.2" fill="#44D62C" />
        <circle cx="50" cy="92" r="2.2" fill="#44D62C" />
        <circle cx="72" cy="94" r="2.6" fill="#68e853" />
        <circle cx="94" cy="92" r="2.2" fill="#44D62C" />
        <circle cx="114" cy="87" r="2.2" fill="#44D62C" />

        {/* Cockpit Collar Seat */}
        <ellipse
          cx="72"
          cy="76"
          rx="34"
          ry="9.5"
          fill="#0a0e14"
          stroke="rgba(255, 255, 255, 0.24)"
          strokeWidth="1.2"
        />

        {/* WENEW Robot Pilot inside the Cockpit (transparently tracks cursor!) */}
        <g ref={headGroupRef} style={{ transformOrigin: '72px 54px' }}>
          {/* Pilot shoulders seated in cockpit */}
          <path
            d="M 48 77 C 49 69, 58 66, 72 66 C 86 66, 95 69, 96 77 Z"
            fill="#171d27"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
          />

          {/* Side ear pods */}
          <rect x="43" y="45" width="5.5" height="14" rx="2.7" fill="#1b222c" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <rect x="95.5" y="45" width="5.5" height="14" rx="2.7" fill="#1b222c" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <circle cx="45.75" cy="52" r="1.5" fill="#44D62C" />
          <circle cx="98.25" cy="52" r="1.5" fill="#44D62C" />

          {/* Springy glowing antenna */}
          <g ref={antennaRef} style={{ transformOrigin: '72px 32px' }}>
            <line
              x1="72"
              y1="33"
              x2="72"
              y2="21"
              stroke="rgba(226, 232, 240, 0.78)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="72" cy="18.5" r={isHappy ? '4.4' : '3.4'} fill="#44D62C" />
            <circle cx="71" cy="17.5" r="1.15" fill="#ffffff" opacity="0.9" />
          </g>

          {/* Rounded obsidian robot head */}
          <rect
            x="47"
            y="32"
            width="50"
            height="38"
            rx="15"
            fill="url(#pilot-head-grad)"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="1.25"
          />

          {/* Recessed visor */}
          <rect
            x="52"
            y="38"
            width="40"
            height="23"
            rx="8.5"
            fill="url(#pilot-visor-grad)"
            stroke={isHovered || isHappy ? 'rgba(68, 214, 44, 0.75)' : 'rgba(255, 255, 255, 0.16)'}
            strokeWidth="1.1"
          />

          {/* Expressive Eyes */}
          {isHappy ? (
            <>
              <path
                d="M 58.5 50.5 Q 62 44.5 65.5 50.5"
                fill="none"
                stroke="#44D62C"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <path
                d="M 78.5 50.5 Q 82 44.5 85.5 50.5"
                fill="none"
                stroke="#44D62C"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </>
          ) : isBlinking ? (
            <>
              <line x1="57.5" y1="49.5" x2="66.5" y2="49.5" stroke="#44D62C" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="77.5" y1="49.5" x2="86.5" y2="49.5" stroke="#44D62C" strokeWidth="2.4" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="62" cy="49.5" r="6.4" fill="#0c1117" stroke="rgba(255,255,255,0.12)" strokeWidth="0.9" />
              <g ref={leftPupilRef}>
                <circle cx="62" cy="49.5" r="3.7" fill="#44D62C" />
                <circle cx="62" cy="49.5" r="1.6" fill="#050709" />
                <circle cx="60.6" cy="48.0" r="1.1" fill="#ffffff" />
              </g>

              <circle cx="82" cy="49.5" r="6.4" fill="#0c1117" stroke="rgba(255,255,255,0.12)" strokeWidth="0.9" />
              <g ref={rightPupilRef}>
                <circle cx="82" cy="49.5" r="3.7" fill="#44D62C" />
                <circle cx="82" cy="49.5" r="1.6" fill="#050709" />
                <circle cx="80.6" cy="48.0" r="1.1" fill="#ffffff" />
              </g>
            </>
          )}

          {/* Mouth line */}
          <path
            d={isHappy ? 'M 66 64 Q 72 68.5 78 64' : 'M 67.5 64.5 Q 72 66.5 76.5 64.5'}
            fill="none"
            stroke={isHappy || isHovered ? '#44D62C' : 'rgba(255,255,255,0.45)'}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </g>

        {/* Glass Canopy Dome Rim curving over the pilot */}
        <path
          d="M 36 76 C 36 22, 108 22, 108 76"
          fill="url(#ship-dome-grad)"
          stroke="rgba(255, 255, 255, 0.34)"
          strokeWidth="1.25"
          className="pointer-events-none"
        />
        {/* Crisp glass highlight reflection arc */}
        <path
          d="M 46 50 C 52 33, 64 28, 76 29"
          fill="none"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="pointer-events-none"
        />
      </svg>
    </button>
  );
}
