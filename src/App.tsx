/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import HeroScrollytelling from './components/HeroScrollytelling';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingStudioBot from './components/FloatingStudioBot';
import type { Language } from './i18n';

export default function App() {
  const [overWebGL, setOverWebGL] = useState(true);
  const [preselectedTopic, setPreselectedTopic] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const servicesDockRef = useRef<HTMLDivElement | null>(null);
  const aboutDockRef = useRef<HTMLDivElement | null>(null);
  const botDockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      document.documentElement.style.setProperty('--glass-mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--glass-my', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  const handleRequestAccess = (topic?: string) => {
    if (topic) {
      setPreselectedTopic(topic);
    }
    const contactEl = document.querySelector('#contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => {
        nameInputRef.current?.focus({ preventScroll: true });
      }, 650);
    }
  };

  return (
    <div className="min-h-screen bg-[#050607] text-zinc-100">
      <Navbar
        language={language}
        onChangeLanguage={setLanguage}
        onRequestAccess={() => handleRequestAccess()}
        overWebGL={overWebGL}
      />
      <main>
        <HeroScrollytelling
          language={language}
          onRequestAccess={() => handleRequestAccess()}
          onOverWebGLChange={setOverWebGL}
        />
        <ServicesSection
          language={language}
          onSelectService={(title) => handleRequestAccess(title)}
          dockRef={servicesDockRef}
        />
        <AboutSection
          language={language}
          onRequestAccess={() => handleRequestAccess()}
          dockRef={aboutDockRef}
        />
        <ContactSection
          language={language}
          preselectedTopic={preselectedTopic}
          nameInputRef={nameInputRef}
          botDockRef={botDockRef}
        />
      </main>
      <Footer language={language} />
      <FloatingStudioBot
        language={language}
        servicesDockRef={servicesDockRef}
        aboutDockRef={aboutDockRef}
        contactDockRef={botDockRef}
      />
    </div>
  );
}
