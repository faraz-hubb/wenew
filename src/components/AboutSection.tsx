import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { COPY, type Language } from '../i18n';

interface BuildNodeLayout {
  id: string;
  x: number;
  y: number;
  connections: string[];
}

const NODE_LAYOUTS: BuildNodeLayout[] = [
  { id: 'hub', x: 50, y: 50, connections: ['websites', 'apps', 'ui', 'cloud', 'launch'] },
  { id: 'websites', x: 18, y: 22, connections: ['hub', 'ui', 'launch'] },
  { id: 'apps', x: 82, y: 22, connections: ['hub', 'cloud'] },
  { id: 'cloud', x: 84, y: 76, connections: ['hub', 'apps', 'ui'] },
  { id: 'ui', x: 16, y: 78, connections: ['hub', 'websites', 'cloud'] },
  { id: 'launch', x: 50, y: 12, connections: ['hub', 'websites'] },
];

interface AboutSectionProps {
  language: Language;
  onRequestAccess: () => void;
  dockRef: React.RefObject<HTMLDivElement | null>;
}

export default function AboutSection({ language, onRequestAccess, dockRef }: AboutSectionProps) {
  const [activePrinciple, setActivePrinciple] = useState<string>('everyone');
  const [hoveredNode, setHoveredNode] = useState<string>('hub');
  const [canvasPaused, setCanvasPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const leftColParallaxRef = useRef<HTMLDivElement>(null);
  const rightColParallaxRef = useRef<HTMLDivElement>(null);

  // Live gentle cycling across Build Architecture nodes unless user is interacting
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || canvasPaused) return;

    const timer = window.setInterval(() => {
      setHoveredNode((prev) => {
        const idx = NODE_LAYOUTS.findIndex((n) => n.id === prev);
        const nextIdx = (idx + 1) % NODE_LAYOUTS.length;
        return NODE_LAYOUTS[nextIdx].id;
      });
    }, 2500);

    return () => window.clearInterval(timer);
  }, [canvasPaused]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let rafId = 0;
    let pending = false;

    const updateParallax = () => {
      pending = false;
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = Math.max(1, window.innerHeight);
      const centerOffset = rect.top + rect.height * 0.5 - vh * 0.5;
      const norm = Math.max(-1.25, Math.min(1.25, centerOffset / vh));

      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate3d(0, ${(norm * 40).toFixed(1)}px, 0)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate3d(0, ${(norm * -46).toFixed(1)}px, 0)`;
      }
      if (leftColParallaxRef.current) {
        leftColParallaxRef.current.style.transform = `translate3d(0, ${(norm * -9).toFixed(1)}px, 0)`;
      }
      if (rightColParallaxRef.current) {
        rightColParallaxRef.current.style.transform = `translate3d(0, ${(norm * 11).toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!pending) {
        pending = true;
        rafId = requestAnimationFrame(updateParallax);
      }
    };

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const t = COPY[language].about;
  const currentPrinciple =
    t.principles.find((p) => p.id === activePrinciple) || t.principles[0];
  const activeNodeLayout =
    NODE_LAYOUTS.find((n) => n.id === hoveredNode) || NODE_LAYOUTS[0];
  const activeNodeText = t.nodes[activeNodeLayout.id] || t.nodes.hub;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-5 sm:px-8 bg-[#06080B] border-t border-white/10 overflow-hidden"
    >
      {/* Luminous green & silver-chrome ambient glows with scroll parallax */}
      <div
        ref={orb1Ref}
        aria-hidden="true"
        className="absolute top-[18%] left-[18%] w-[600px] h-[520px] rounded-full pointer-events-none will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(226, 232, 240, 0.09) 0%, rgba(68, 214, 44, 0.07) 44%, transparent 74%)',
        }}
      />
      <div
        ref={orb2Ref}
        aria-hidden="true"
        className="absolute top-[28%] right-[8%] w-[680px] h-[580px] rounded-full pointer-events-none will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(68, 214, 44, 0.16) 0%, rgba(68, 214, 44, 0.045) 46%, transparent 74%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Studio Story, Philosophy Tabs & Client Quote */}
          <ScrollReveal className="lg:col-span-6 flex flex-col justify-between" delayMs={0}>
            <div ref={leftColParallaxRef} className="flex flex-col justify-between h-full will-change-transform">
              <div>
                <p className="text-sm font-semibold text-[#44D62C] mb-3">
                  {t.eyebrow}
                </p>
                <h2
                  className="font-display font-semibold tracking-[-0.03em] text-white leading-[1.08] mb-5"
                  style={{
                    fontSize: 'clamp(1.9rem, 3.3vw, 2.9rem)',
                    textWrap: 'balance',
                  }}
                >
                  {t.title}
                </h2>
                <p className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-8">
                  {t.subtitle}
                </p>

                {/* Interactive Studio Philosophy Switcher */}
                <div className="mb-8">
                  <div
                    className="flex flex-wrap gap-2 mb-5"
                    role="tablist"
                    aria-label="WENEW studio principles"
                  >
                    {t.principles.map((item) => {
                      const selected = item.id === activePrinciple;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          onClick={() => setActivePrinciple(item.id)}
                          className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                            selected
                              ? 'bg-[#44D62C] text-black font-semibold border-[#44D62C] shadow-sm'
                              : 'glass-panel text-zinc-300 hover:border-[#44D62C]/50 hover:text-[#44D62C]'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="glass-panel rounded-2xl p-6 sm:p-7">
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-white mb-2.5">
                      {currentPrinciple.headline}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-4">
                      {currentPrinciple.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-[#44D62C]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{currentPrinciple.studioNote}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Testimonial */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <p className="text-sm text-zinc-300 italic leading-relaxed mb-2 max-w-lg">
                    {t.quote}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                    <span className="font-semibold text-white">{t.quoteAuthor}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t.quoteRole}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onRequestAccess}
                  className="glass-panel inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#44D62C] rounded-xl hover:border-[#44D62C]/60 hover:text-[#68e853] transition-all cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-center"
                >
                  <span>{t.workWithUs}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Ship Landing Bay + Interactive WENEW Build Pipeline Graph */}
          <ScrollReveal className="lg:col-span-6 flex flex-col" delayMs={120}>
            <div className="flex justify-center lg:justify-end mb-3">
              <div
                ref={dockRef}
                aria-hidden="true"
                className="w-36 h-36 sm:w-40 sm:h-40 shrink-0 pointer-events-none"
              />
            </div>
            <div ref={rightColParallaxRef} className="glass-panel rounded-2xl p-6 sm:p-8 flex-1 flex flex-col justify-between relative overflow-hidden will-change-transform">
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(68, 214, 44, 0.08) 0%, transparent 65%)',
                }}
              />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {t.archTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    {t.archSub}
                  </p>
                </div>
                <span className="text-xs font-medium text-[#44D62C]">
                  {activeNodeText.detail}
                </span>
              </div>

              {/* Live Interactive Node Canvas */}
              <div
                onMouseEnter={() => setCanvasPaused(true)}
                onMouseLeave={() => setCanvasPaused(false)}
                className="relative w-full h-[320px] sm:h-[360px] my-2 rounded-xl apple-glass-sub overflow-hidden"
              >
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {/* Expanding live radar pulses from WENEW central hub */}
                  <circle
                    cx="50"
                    cy="50"
                    r="24"
                    fill="none"
                    stroke="rgba(68, 214, 44, 0.28)"
                    strokeWidth="0.4"
                    className="wenew-anim-radar-ring"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="24"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.16)"
                    strokeWidth="0.35"
                    className="wenew-anim-radar-ring-delay"
                  />

                  {NODE_LAYOUTS.map((node, connIdx) =>
                    node.connections.map((targetId, subIdx) => {
                      if (node.id > targetId) return null;
                      const target = NODE_LAYOUTS.find((n) => n.id === targetId);
                      if (!target) return null;
                      const isHighlighted =
                        hoveredNode === node.id || hoveredNode === target.id;
                      const forwardPath = `M ${node.x} ${node.y} L ${target.x} ${target.y}`;
                      const durSec = (2.1 + ((connIdx + subIdx) % 3) * 0.45).toFixed(2);

                      return (
                        <g key={`${node.id}-${targetId}`}>
                          {/* Base structural edge */}
                          <line
                            x1={node.x}
                            y1={node.y}
                            x2={target.x}
                            y2={target.y}
                            stroke={isHighlighted ? 'rgba(68, 214, 44, 0.35)' : '#3f4451'}
                            strokeWidth={isHighlighted ? '0.6' : '0.35'}
                            strokeDasharray={isHighlighted ? undefined : '1.5 1.5'}
                            className="transition-all duration-200"
                          />

                          {/* Animated flowing green stream + traveling data packet on highlighted links */}
                          {isHighlighted && (
                            <>
                              <line
                                x1={node.x}
                                y1={node.y}
                                x2={target.x}
                                y2={target.y}
                                stroke="#44D62C"
                                strokeWidth="0.7"
                                strokeDasharray="3 3"
                                className="wenew-anim-flow-dash"
                              />
                              <circle r="1.25" fill="#44D62C" opacity="0.35">
                                <animateMotion
                                  dur={`${durSec}s`}
                                  repeatCount="indefinite"
                                  path={forwardPath}
                                />
                              </circle>
                              <circle r="0.68" fill="#ffffff">
                                <animateMotion
                                  dur={`${durSec}s`}
                                  repeatCount="indefinite"
                                  path={forwardPath}
                                />
                              </circle>
                            </>
                          )}
                        </g>
                      );
                    })
                  )}
                </svg>

                {NODE_LAYOUTS.map((node, idx) => {
                  const isCenter = node.id === 'hub';
                  const isActive = hoveredNode === node.id;
                  const isConnected =
                    activeNodeLayout.connections.includes(node.id) || isActive;
                  const nodeCopy = t.nodes[node.id];

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onFocus={() => {
                        setCanvasPaused(true);
                        setHoveredNode(node.id);
                      }}
                      onBlur={() => setCanvasPaused(false)}
                      onClick={() => setHoveredNode(node.id)}
                      style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        animationDelay: `${idx * 0.45}s`,
                      }}
                      className={`-translate-x-1/2 -translate-y-1/2 absolute px-3.5 py-2 rounded-xl text-left transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#44D62C] ${
                        isCenter ? '' : 'wenew-anim-node-float'
                      } ${
                        isCenter
                          ? `bg-[#44D62C] text-black border border-[#68e853] ${
                              isActive
                                ? 'scale-105 shadow-[0_0_32px_rgba(68,214,44,0.65)]'
                                : 'shadow-[0_10px_28px_-5px_rgba(68,214,44,0.45)]'
                            }`
                          : isActive
                          ? 'sheer-glass text-[#44D62C] border-[#44D62C] scale-105 shadow-[0_0_24px_rgba(68,214,44,0.32)]'
                          : isConnected
                          ? 'apple-glass-sub text-zinc-100 border-[#44D62C]/45'
                          : 'apple-glass-sub text-zinc-400 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-semibold whitespace-nowrap">
                        {isActive && !isCenter && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#44D62C] animate-pulse shrink-0" />
                        )}
                        <span>{nodeCopy.label}</span>
                      </div>
                      <div
                        className={`text-[11px] whitespace-nowrap ${
                          isCenter ? 'text-black/75 font-medium' : 'text-zinc-400'
                        }`}
                      >
                        {nodeCopy.role}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Capability Inspection Bar */}
              <div className="relative z-10 mt-5 pt-5 border-t border-white/10 grid grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <div className="text-xs text-zinc-500 mb-0.5">{t.layerLabel}</div>
                  <div className="text-sm font-semibold text-white">
                    {activeNodeText.label}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 mb-0.5">{t.focusLabel}</div>
                  <div className="text-sm font-semibold text-white">
                    {activeNodeText.detail}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 mb-0.5">{t.integrationsLabel}</div>
                  <div className="text-sm font-semibold text-[#44D62C] tabular-nums">
                    {activeNodeLayout.connections.length} {t.modulesWord}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
