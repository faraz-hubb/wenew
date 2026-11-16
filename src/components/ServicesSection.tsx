import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CalendarSync,
  Check,
  CreditCard,
  Globe,
  Layers,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { COPY, type Language } from '../i18n';

type ServiceCategory = 'all' | 'websites' | 'apps' | 'design';
type ServiceKey = 'websites' | 'web-apps' | 'interactive-ui' | 'growth-support';

interface ServiceConfig {
  id: ServiceKey;
  number: string;
  category: Exclude<ServiceCategory, 'all'>;
  span: 'wide' | 'standard';
  icon: typeof Globe;
}

const SERVICE_CONFIGS: ServiceConfig[] = [
  { id: 'websites', number: '01.', category: 'websites', span: 'wide', icon: Globe },
  { id: 'web-apps', number: '02.', category: 'apps', span: 'standard', icon: Smartphone },
  { id: 'interactive-ui', number: '03.', category: 'design', span: 'standard', icon: Sparkles },
  { id: 'growth-support', number: '04.', category: 'apps', span: 'wide', icon: Layers },
];

interface ServicesSectionProps {
  language: Language;
  onSelectService: (serviceId: string) => void;
  dockRef: React.RefObject<HTMLDivElement | null>;
}

export default function ServicesSection({
  language,
  onSelectService,
  dockRef,
}: ServicesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ServiceCategory>('all');
  const [expandedId, setExpandedId] = useState<string | null>('websites');
  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metricRefs = useRef<(HTMLDivElement | null)[]>([]);

  const t = COPY[language].services;

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
        orb1Ref.current.style.transform = `translate3d(0, ${(norm * 44).toFixed(1)}px, 0)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate3d(-50%, ${(norm * -36).toFixed(1)}px, 0)`;
      }
      if (orb3Ref.current) {
        orb3Ref.current.style.transform = `translate3d(0, ${(norm * 32).toFixed(1)}px, 0)`;
      }

      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const speed = idx % 2 === 0 ? 8 : -8;
        card.style.transform = `translate3d(0, ${(norm * speed).toFixed(1)}px, 0)`;
      });

      metricRefs.current.forEach((metric, idx) => {
        if (!metric) return;
        const speed = 4 + (idx % 2 === 0 ? 3 : 7);
        metric.style.transform = `translate3d(0, ${(norm * speed).toFixed(1)}px, 0)`;
      });
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
  }, [activeFilter]);

  const filterTabs: { id: ServiceCategory; label: string }[] = [
    { id: 'all', label: t.filters.all },
    { id: 'websites', label: t.filters.websites },
    { id: 'apps', label: t.filters.apps },
    { id: 'design', label: t.filters.design },
  ];

  const visibleServices =
    activeFilter === 'all'
      ? SERVICE_CONFIGS
      : SERVICE_CONFIGS.filter((s) => s.category === activeFilter);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-5 sm:px-8 bg-[#050608] overflow-hidden border-t border-white/10"
    >
      {/* Luminous #44D62C & silver-white ambient light pools with scroll parallax */}
      <div
        ref={orb1Ref}
        aria-hidden="true"
        className="absolute -top-20 left-[12%] w-[680px] h-[680px] rounded-full pointer-events-none will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(68, 214, 44, 0.17) 0%, rgba(68, 214, 44, 0.05) 42%, transparent 72%)',
        }}
      />
      <div
        ref={orb2Ref}
        aria-hidden="true"
        className="absolute top-[36%] left-[44%] -translate-x-1/2 w-[720px] h-[460px] rounded-full pointer-events-none will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(226, 232, 240, 0.1) 0%, rgba(68, 214, 44, 0.09) 40%, transparent 74%)',
        }}
      />
      <div
        ref={orb3Ref}
        aria-hidden="true"
        className="absolute bottom-6 right-[10%] w-[620px] h-[620px] rounded-full pointer-events-none will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(68, 214, 44, 0.15) 0%, rgba(255, 255, 255, 0.06) 44%, transparent 72%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header + Interactive Filter Controls */}
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#44D62C] mb-3">
                {t.eyebrow}
              </p>
              <h2
                className="font-display font-semibold tracking-[-0.03em] text-white leading-[1.08] mb-4"
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 3.1rem)',
                  textWrap: 'balance',
                }}
              >
                {t.title}
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            {/* Space Ship Services Dock + Dark Glassmorphic Segmented Filter Bar */}
            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              <div
                ref={dockRef}
                aria-hidden="true"
                className="w-36 h-36 sm:w-40 sm:h-40 self-center lg:self-end shrink-0 pointer-events-none"
              />
              <div
                className="glass-panel inline-flex flex-wrap items-center gap-1 p-1.5 rounded-xl self-start lg:self-auto"
                role="group"
                aria-label="Filter WENEW services by specialty"
              >
                {filterTabs.map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFilter(tab.id)}
                      aria-pressed={isActive}
                      className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#44D62C] text-black font-semibold shadow-sm'
                          : 'text-zinc-300 hover:text-[#44D62C] hover:bg-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Asymmetric Dark Glassmorphic Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {visibleServices.map((service, idx) => {
            const Icon = service.icon;
            const serviceCopy = t.items[service.id];
            const isWide = service.span === 'wide' && activeFilter === 'all';
            const isSelected = expandedId === service.id;
            const isWebsites = service.id === 'websites';
            const isGrowthSupport = service.id === 'growth-support';

            return (
              <ScrollReveal
                key={service.id}
                delayMs={idx * 80}
                className={`flex ${isWide ? 'lg:col-span-2' : 'lg:col-span-1'}`}
              >
                <div
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className="w-full flex will-change-transform"
                >
                  <article
                    onClick={() => setExpandedId(service.id)}
                    className={`glass-panel group w-full rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-[#44D62C]/50 hover:shadow-[0_18px_42px_-14px_rgba(68,214,44,0.16)] cursor-pointer ${
                      isSelected
                        ? 'border-[#44D62C]/45 ring-1 ring-[#44D62C]/25'
                        : ''
                    }`}
                  >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400">
                        <span className="font-display font-semibold text-[#44D62C] tabular-nums">
                          {service.number}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{serviceCopy.categoryLabel}</span>
                      </div>

                      <div className="apple-glass-sub w-10 h-10 rounded-xl flex items-center justify-center text-[#44D62C] group-hover:bg-[#44D62C] group-hover:text-black group-hover:border-[#44D62C] transition-colors duration-200 shrink-0">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </div>

                    {isWebsites ? (
                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center mb-6">
                        <div className="xl:col-span-6">
                          <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white mb-3 group-hover:text-[#44D62C] transition-colors">
                            {serviceCopy.title}
                          </h3>

                          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-5">
                            {serviceCopy.summary}
                          </p>

                          <ul className="space-y-2.5">
                            {serviceCopy.deliverables.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2.5 text-sm text-zinc-300"
                              >
                                <Check
                                  className="w-4 h-4 text-[#44D62C] shrink-0 mt-0.5"
                                  aria-hidden="true"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Live Animated Website Stage for Card 01 */}
                        <div
                          className="xl:col-span-6 relative rounded-2xl apple-glass-sub p-4 sm:p-5 overflow-hidden select-none min-h-[228px]"
                          aria-hidden="true"
                        >
                          {/* Subtle radial green spotlight */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                'radial-gradient(circle at 25% 20%, rgba(68, 214, 44, 0.2) 0%, rgba(68, 214, 44, 0.04) 42%, transparent 74%)',
                            }}
                          />

                          {/* Browser Window Frame */}
                          <div className="relative z-10 rounded-xl bg-[#07090C]/90 border border-white/15 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
                            {/* Window Chrome Header + Shimmering Load Bar */}
                            <div className="relative flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10 bg-white/[0.03]">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-zinc-600" />
                                <span className="w-2 h-2 rounded-full bg-zinc-500" />
                                <span className="w-2 h-2 rounded-full bg-[#44D62C]" />
                              </div>

                              <div className="px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-[10px] font-medium text-zinc-300 tracking-wide">
                                wenew.studio
                              </div>

                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#44D62C]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#44D62C] animate-pulse" />
                                99
                              </span>

                              {/* Animated progress shimmer sweep */}
                              <div className="absolute bottom-0 inset-x-0 h-[1.5px] overflow-hidden bg-white/5">
                                <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#44D62C] to-transparent wenew-anim-sweep" />
                              </div>
                            </div>

                            {/* Interactive Mini Webpage Canvas */}
                            <div className="relative p-3.5 sm:p-4 space-y-3">
                              {/* Animated Hero Section Inside Browser */}
                              <div className="relative rounded-lg bg-white/[0.04] border border-white/10 p-3 flex items-center justify-between gap-3 overflow-hidden">
                                <div className="space-y-1.5 flex-1">
                                  <div className="h-1.5 w-12 rounded-full bg-[#44D62C]/80" />
                                  <div className="h-2.5 w-4/5 rounded-full bg-white/85" />
                                  <div className="h-2 w-3/5 rounded-full bg-zinc-400/50" />
                                  <div className="pt-1 flex items-center gap-2">
                                    <div className="relative px-2.5 py-1 rounded-md bg-[#44D62C] text-[9px] font-bold text-black wenew-anim-cta">
                                      {language === 'hy' ? 'Մեկնարկել' : 'Launch'}
                                      <span className="absolute inset-0 rounded-md border border-[#44D62C] wenew-anim-ripple pointer-events-none" />
                                    </div>
                                    <div className="h-4 w-10 rounded-md bg-white/10 border border-white/10" />
                                  </div>
                                </div>

                                {/* Floating Hero Accent Card */}
                                <div className="w-16 h-14 rounded-lg bg-gradient-to-br from-[#44D62C]/25 via-white/10 to-transparent border border-[#44D62C]/35 flex items-center justify-center shrink-0 wenew-anim-float-slow">
                                  <Sparkles className="w-5 h-5 text-[#44D62C]" />
                                </div>
                              </div>

                              {/* Staggered Floating Bento Preview Tiles */}
                              <div className="grid grid-cols-2 gap-2.5">
                                <div className="rounded-lg bg-white/[0.035] border border-white/10 p-2.5 space-y-1.5 wenew-anim-float-slow">
                                  <div className="flex items-center justify-between">
                                    <span className="h-1.5 w-10 rounded-full bg-white/60" />
                                    <span className="w-2 h-2 rounded-full bg-[#44D62C]/70" />
                                  </div>
                                  <div className="h-1.5 w-full rounded-full bg-zinc-600/70" />
                                  <div className="h-1.5 w-2/3 rounded-full bg-zinc-700/70" />
                                </div>

                                <div className="rounded-lg bg-white/[0.035] border border-white/10 p-2.5 space-y-1.5 wenew-anim-float-delay">
                                  <div className="flex items-center justify-between">
                                    <span className="h-1.5 w-8 rounded-full bg-[#44D62C]/80" />
                                    <ArrowUpRight className="w-3 h-3 text-[#44D62C]" />
                                  </div>
                                  <div className="h-1.5 w-4/5 rounded-full bg-zinc-500/65" />
                                  <div className="h-1.5 w-3/5 rounded-full bg-zinc-700/70" />
                                </div>
                              </div>

                              {/* Animated Interactive Cursor Gliding Across Mini Site */}
                              <div className="absolute top-0 left-0 z-20 pointer-events-none wenew-anim-cursor">
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  className="drop-shadow-[0_3px_8px_rgba(68,214,44,0.6)]"
                                >
                                  <path
                                    d="M2.5 2L14.5 7.2L9.2 9.2L7.2 14.5L2.5 2Z"
                                    fill="#44D62C"
                                    stroke="#050709"
                                    strokeWidth="1.4"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : isGrowthSupport ? (
                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center mb-6">
                        <div className="xl:col-span-6">
                          <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white mb-3 group-hover:text-[#44D62C] transition-colors">
                            {serviceCopy.title}
                          </h3>

                          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-5">
                            {serviceCopy.summary}
                          </p>

                          <ul className="space-y-2.5">
                            {serviceCopy.deliverables.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2.5 text-sm text-zinc-300"
                              >
                                <Check
                                  className="w-4 h-4 text-[#44D62C] shrink-0 mt-0.5"
                                  aria-hidden="true"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Bespoke Vector Graphic Design Composition for Card 04 */}
                        <div
                          className="xl:col-span-6 relative rounded-2xl apple-glass-sub p-4 sm:p-5 overflow-hidden select-none"
                          aria-hidden="true"
                        >
                          {/* Radial green illumination & subtle blueprint dot grid */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                'radial-gradient(circle at 76% 24%, rgba(68, 214, 44, 0.22) 0%, rgba(68, 214, 44, 0.05) 38%, transparent 72%)',
                            }}
                          />
                          <div
                            className="absolute inset-0 opacity-30 pointer-events-none"
                            style={{
                              backgroundImage:
                                'radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)',
                              backgroundSize: '18px 18px',
                            }}
                          />

                          {/* Decorative geometric orbital arcs & Bezier flow connectors */}
                          <svg
                            viewBox="0 0 360 220"
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            preserveAspectRatio="none"
                          >
                            <defs>
                              <linearGradient id="wenew-flow-grad" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#44D62C" stopOpacity="0.95" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
                              </linearGradient>
                            </defs>
                            <circle
                              cx="285"
                              cy="55"
                              r="68"
                              fill="none"
                              stroke="rgba(68,214,44,0.14)"
                              strokeWidth="1"
                              strokeDasharray="4 4"
                            />
                            <circle
                              cx="285"
                              cy="55"
                              r="102"
                              fill="none"
                              stroke="rgba(255,255,255,0.06)"
                              strokeWidth="1"
                            />
                            <path
                              d="M 108 98 C 108 142, 72 142, 72 162"
                              fill="none"
                              stroke="url(#wenew-flow-grad)"
                              strokeWidth="1.6"
                              strokeDasharray="4 3"
                            />
                            <path
                              d="M 192 98 C 205 138, 254 136, 266 158"
                              fill="none"
                              stroke="url(#wenew-flow-grad)"
                              strokeWidth="1.6"
                            />
                            <circle cx="108" cy="98" r="3" fill="#44D62C" />
                            <circle cx="72" cy="162" r="3" fill="#44D62C" />
                            <circle cx="192" cy="98" r="3" fill="#44D62C" />
                            <circle cx="266" cy="158" r="3" fill="#ffffff" />
                          </svg>

                          {/* Layered Graphic UI Artboard + Workflow Nodes */}
                          <div className="relative z-10 flex flex-col gap-3.5">
                            <div className="flex items-start justify-between gap-3">
                              {/* Stylized Portal Interface Wireframe Card */}
                              <div className="flex-1 rounded-xl apple-glass-sub p-3.5 transition-transform duration-300 group-hover:-translate-y-0.5">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-zinc-500" />
                                    <span className="w-2 h-2 rounded-full bg-zinc-600" />
                                    <span className="w-2 h-2 rounded-full bg-[#44D62C]" />
                                  </div>
                                  <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#44D62C] bg-[#44D62C]/12 border border-[#44D62C]/30 px-2 py-0.5 rounded-md">
                                    {t.graphic.badge}
                                  </span>
                                </div>

                                <div className="mb-2.5">
                                  <div className="text-xs font-display font-semibold text-white">
                                    {t.graphic.portalTitle}
                                  </div>
                                  <div className="text-[11px] text-zinc-400">
                                    {t.graphic.portalSub}
                                  </div>
                                </div>

                                {/* Smooth SVG Waveform Graphic */}
                                <svg
                                  viewBox="0 0 180 38"
                                  className="w-full h-9 overflow-visible"
                                >
                                  <defs>
                                    <linearGradient id="portal-area" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#44D62C" stopOpacity="0.32" />
                                      <stop offset="100%" stopColor="#44D62C" stopOpacity="0.0" />
                                    </linearGradient>
                                  </defs>
                                  <path
                                    d="M 2 30 Q 26 28, 42 19 T 84 22 T 126 10 T 178 6 L 178 36 L 2 36 Z"
                                    fill="url(#portal-area)"
                                  />
                                  <path
                                    d="M 2 30 Q 26 28, 42 19 T 84 22 T 126 10 T 178 6"
                                    fill="none"
                                    stroke="#44D62C"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                  />
                                  <circle cx="126" cy="10" r="3" fill="#ffffff" />
                                  <circle cx="178" cy="6" r="3.5" fill="#44D62C" />
                                </svg>
                              </div>

                              {/* Right Floating Uptime & Care Crest Card */}
                              <div className="w-28 sm:w-32 rounded-xl apple-glass-sub border-[#44D62C]/35 p-3 text-center shadow-[0_12px_24px_-10px_rgba(68,214,44,0.28)] transition-transform duration-300 group-hover:translate-y-0.5 shrink-0">
                                <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-[#44D62C]/15 border border-[#44D62C]/40 flex items-center justify-center text-[#44D62C]">
                                  <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div className="font-display text-lg font-bold text-white leading-tight tabular-nums">
                                  {t.graphic.uptimeValue}
                                </div>
                                <div className="text-[10px] text-zinc-400 leading-tight mt-0.5">
                                  {t.graphic.uptimeLabel}
                                </div>
                                <div className="mt-2 pt-1.5 border-t border-white/15 text-[10px] font-semibold text-[#44D62C] truncate">
                                  {t.graphic.careLabel}
                                </div>
                              </div>
                            </div>

                            {/* Connected Modular Workflow Pills */}
                            <div className="grid grid-cols-2 gap-2.5 pt-1">
                              <div className="rounded-lg apple-glass-sub px-3 py-2 flex items-center gap-2 transition-colors group-hover:border-[#44D62C]/35">
                                <span className="w-6 h-6 rounded-md bg-[#44D62C]/15 text-[#44D62C] flex items-center justify-center shrink-0">
                                  <CreditCard className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[11px] font-medium text-zinc-200 truncate">
                                  {t.graphic.flowLabel}
                                </span>
                              </div>
                              <div className="rounded-lg apple-glass-sub px-3 py-2 flex items-center gap-2 transition-colors group-hover:border-[#44D62C]/35">
                                <span className="w-6 h-6 rounded-md bg-white/10 text-white flex items-center justify-center shrink-0">
                                  <CalendarSync className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[11px] font-medium text-zinc-200 truncate">
                                  {t.graphic.syncLabel}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white mb-3 group-hover:text-[#44D62C] transition-colors">
                          {serviceCopy.title}
                        </h3>

                        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-6 max-w-2xl">
                          {serviceCopy.summary}
                        </p>

                        <ul className="space-y-2.5 mb-7">
                          {serviceCopy.deliverables.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm text-zinc-300"
                            >
                              <Check
                                className="w-4 h-4 text-[#44D62C] shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs sm:text-sm font-medium text-zinc-400 tabular-nums">
                      {serviceCopy.metric}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectService(service.id);
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#44D62C] hover:text-[#68e853] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>{t.startWithThis}</span>
                      <ArrowUpRight
                        className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </article>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Studio Proof Metrics Strip in Dark Frosted Glass */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.metrics.map((item, idx) => (
            <ScrollReveal key={item.value} delayMs={idx * 65}>
              <div
                ref={(el) => {
                  metricRefs.current[idx] = el;
                }}
                className="h-full will-change-transform"
              >
                <div className="glass-panel h-full rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#44D62C]/45">
                  <div className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums mb-1.5">
                    {item.value}
                  </div>
                  <p className="text-sm text-zinc-400 leading-snug">
                    {item.label}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
