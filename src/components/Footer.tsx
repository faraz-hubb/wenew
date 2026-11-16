import { COPY, type Language } from '../i18n';

interface FooterProps {
  language: Language;
}

export default function Footer({ language }: FooterProps) {
  const tNav = COPY[language].nav;
  const tFooter = COPY[language].footer;

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-black/88 backdrop-blur-[42px] saturate-150 border-t border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] py-12 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="relative w-10 h-7 overflow-hidden rounded-md flex items-center justify-center shrink-0">
            <img
              src="/assets/aistudio/LOGO_png_2cae51bd.png"
              alt="WENEW logo"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[66px] max-w-none h-auto select-none pointer-events-none"
            />
          </span>
          <span className="font-display font-bold text-white">WENEW</span>
          <span className="text-zinc-600" aria-hidden="true">·</span>
          <span className="text-sm text-zinc-400">{tFooter.tagline}</span>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-6 text-sm text-zinc-400">
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#overview');
            }}
            className="hover:text-[#44D62C] transition-colors"
          >
            {tNav.overview}
          </a>
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#services');
            }}
            className="hover:text-[#44D62C] transition-colors"
          >
            {tNav.services}
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#about');
            }}
            className="hover:text-[#44D62C] transition-colors"
          >
            {tNav.about}
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#contact');
            }}
            className="hover:text-[#44D62C] transition-colors"
          >
            {tNav.contact}
          </a>
        </nav>

        <p className="text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} {tFooter.rights}
        </p>
      </div>
    </footer>
  );
}
