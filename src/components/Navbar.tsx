import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { COPY, type Language } from '../i18n';

interface NavbarProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onRequestAccess: () => void;
  overWebGL: boolean;
}

function UsaFlagIcon() {
  return (
    <svg
      viewBox="0 0 24 16"
      className="w-4.5 h-3 rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(255,255,255,0.18)]"
      aria-hidden="true"
    >
      <rect width="24" height="16" fill="#ffffff" />
      <rect y="0" width="24" height="2.2" fill="#dc2626" />
      <rect y="4.5" width="24" height="2.2" fill="#dc2626" />
      <rect y="9.1" width="24" height="2.2" fill="#dc2626" />
      <rect y="13.7" width="24" height="2.3" fill="#dc2626" />
      <rect width="11" height="8.9" fill="#1e3a8a" />
      <circle cx="2.3" cy="2.1" r="0.65" fill="#ffffff" />
      <circle cx="5.4" cy="2.1" r="0.65" fill="#ffffff" />
      <circle cx="8.5" cy="2.1" r="0.65" fill="#ffffff" />
      <circle cx="3.85" cy="4.45" r="0.65" fill="#ffffff" />
      <circle cx="7.0" cy="4.45" r="0.65" fill="#ffffff" />
      <circle cx="2.3" cy="6.8" r="0.65" fill="#ffffff" />
      <circle cx="5.4" cy="6.8" r="0.65" fill="#ffffff" />
      <circle cx="8.5" cy="6.8" r="0.65" fill="#ffffff" />
    </svg>
  );
}

function ArmeniaFlagIcon() {
  return (
    <svg
      viewBox="0 0 24 16"
      className="w-4.5 h-3 rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(255,255,255,0.18)]"
      aria-hidden="true"
    >
      <rect y="0" width="24" height="5.34" fill="#d90012" />
      <rect y="5.33" width="24" height="5.34" fill="#0033a0" />
      <rect y="10.66" width="24" height="5.34" fill="#f2a800" />
    </svg>
  );
}

export default function Navbar({
  language,
  onChangeLanguage,
  onRequestAccess,
  overWebGL,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = COPY[language].nav;

  const navLinks = [
    { label: t.overview, href: '#overview' },
    { label: t.services, href: '#services' },
    { label: t.about, href: '#about' },
    { label: t.contact, href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 border-b backdrop-blur-2xl saturate-150 ${
        overWebGL
          ? 'bg-black/82 border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_32px_-12px_rgba(0,0,0,0.9)]'
          : 'bg-black/92 border-white/14 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_36px_-10px_rgba(0,0,0,0.95)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-line WENEW Brand Wordmark */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#overview');
          }}
          className="flex items-center gap-2.5 text-lg font-display font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#44D62C] rounded-md"
        >
          <span className="relative w-11 h-8 overflow-hidden rounded-md flex items-center justify-center shrink-0">
            <img
              src="/assets/aistudio/LOGO_png_2cae51bd.png"
              alt="WENEW logo"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[74px] max-w-none h-auto select-none pointer-events-none drop-shadow-[0_0_8px_rgba(68,214,44,0.4)]"
            />
          </span>
          <span>WENEW</span>
        </a>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300"
        >
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.href);
              }}
              className="relative py-1 text-zinc-300 hover:text-[#44D62C] transition-colors duration-150 whitespace-nowrap shrink-0 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[#44D62C] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#44D62C] rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Armenian / USA Flag Language Toggle + Primary Action */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div
            role="group"
            aria-label={t.switchLangAria}
            className="apple-glass-sub inline-flex items-center gap-0.5 p-1 rounded-xl"
          >
            <button
              type="button"
              onClick={() => onChangeLanguage('en')}
              aria-pressed={language === 'en'}
              aria-label="English (USA)"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                language === 'en'
                  ? 'bg-[#44D62C] text-black shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <UsaFlagIcon />
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeLanguage('hy')}
              aria-pressed={language === 'hy'}
              aria-label="Հայերեն (Armenian)"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                language === 'hy'
                  ? 'bg-[#44D62C] text-black shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ArmeniaFlagIcon />
              <span>ՀԱՅ</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onRequestAccess}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-black bg-[#44D62C] rounded-lg hover:bg-[#52E43B] active:scale-[0.98] shadow-[0_6px_20px_-4px_rgba(68,214,44,0.45)] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#44D62C]"
          >
            {t.startProject}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? t.closeMenu : t.openMenu}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-zinc-200 hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/15 sheer-glass px-5 py-4 space-y-2">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.href);
              }}
              className="block py-2.5 px-3 text-base font-medium text-zinc-200 hover:text-[#44D62C] hover:bg-white/5 rounded-lg transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onRequestAccess();
            }}
            className="w-full mt-2 py-3 px-4 text-sm font-semibold text-black bg-[#44D62C] hover:bg-[#52E43B] rounded-lg transition-colors cursor-pointer"
          >
            {t.startProject}
          </button>
        </div>
      )}
    </header>
  );
}
