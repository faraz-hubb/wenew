import { useEffect, useRef, useState } from 'react';
import CursorRobotMascot, { type ShipStopId } from './CursorRobotMascot';
import type { Language } from '../i18n';

interface FloatingStudioBotProps {
  language: Language;
  servicesDockRef: React.RefObject<HTMLDivElement | null>;
  aboutDockRef: React.RefObject<HTMLDivElement | null>;
  contactDockRef: React.RefObject<HTMLDivElement | null>;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export default function FloatingStudioBot({
  language,
  servicesDockRef,
  aboutDockRef,
  contactDockRef,
}: FloatingStudioBotProps) {
  const moverRef = useRef<HTMLDivElement>(null);
  const [activeStop, setActiveStop] = useState<ShipStopId>('overview');
  const [isFlying, setIsFlying] = useState(false);
  const lastStopRef = useRef<ShipStopId>('overview');
  const lastFlyingRef = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;
    let coastUntil = 0;

    const updateStopState = (stop: ShipStopId, flying: boolean) => {
      if (lastStopRef.current !== stop) {
        lastStopRef.current = stop;
        setActiveStop(stop);
      }
      if (lastFlyingRef.current !== flying) {
        lastFlyingRef.current = flying;
        setIsFlying(flying);
      }
    };

    const updatePosition = () => {
      const mover = moverRef.current;
      const servicesDock = servicesDockRef.current;
      const aboutDock = aboutDockRef.current;
      const contactDock = contactDockRef.current;
      if (!mover || !servicesDock || !aboutDock || !contactDock) return;

      const sRect = servicesDock.getBoundingClientRect();
      const aRect = aboutDock.getBoundingClientRect();
      const cRect = contactDock.getBoundingClientRect();

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const isMobile = vw < 640;

      const botW = cRect.width || 144;
      const botH = cRect.height || 144;

      if (prefersReduced) {
        mover.style.transform = `translate3d(${cRect.left.toFixed(1)}px, ${cRect.top.toFixed(1)}px, 0) scale(1)`;
        updateStopState('contact', false);
        return;
      }

      // Hero / Overview corner resting coordinates
      const startX = vw - botW - (isMobile ? 14 : 36);
      const startY = vh - botH - (isMobile ? 16 : 34);
      const startScale = isMobile ? 0.58 : 0.74;

      // Document Y positions of each section's dock bay
      const docY1 = sRect.top + scrollY;
      const docY2 = aRect.top + scrollY;
      const docY3 = cRect.top + scrollY;

      // Exact monotonic scroll milestones:
      // Seat 0: Overview (#overview) -> flies to Seat 1 (#services) -> seats in #services
      // -> flies to Seat 2 (#about) -> seats in #about
      // -> flies to Seat 3 (#contact) -> stays seated in Start a Project
      const settleY1 = Math.min(vh * 0.44, isMobile ? 250 : 340);
      const f1End = Math.max(220, docY1 - settleY1);
      const f1Start = Math.max(60, f1End - Math.min(480, vh * 0.6));

      const leaveNavY = isMobile ? 76 : 92;
      const f2Start = Math.max(f1End + 160, docY1 - leaveNavY);
      const settleY2 = Math.min(vh * 0.42, isMobile ? 240 : 320);
      const f2End = Math.max(f2Start + 260, docY2 - settleY2);

      const f3Start = Math.max(f2End + 160, docY2 - leaveNavY);
      const settleY3 = Math.min(vh * 0.66, vh - botH - 36);
      const f3End = Math.max(f3Start + 260, docY3 - settleY3);

      let x = startX;
      let y = startY;
      let scale = startScale;
      let rotate = 0;

      if (scrollY <= f1Start) {
        // Seated in Stop 0: Overview (#overview)
        x = startX;
        y = startY;
        scale = startScale;
        rotate = 0;
        updateStopState('overview', false);
      } else if (scrollY < f1End) {
        // Flight 1: Overview -> Services
        const t = smoothstep(clamp01((scrollY - f1Start) / (f1End - f1Start)));
        const fromX = startX;
        const fromY = startY;
        const toX = sRect.left;
        const toY = docY1 - f1End;

        x = lerp(fromX, toX, t) - Math.sin(t * Math.PI) * (isMobile ? 24 : 75);
        y = lerp(fromY, toY, t) - Math.sin(t * Math.PI) * (isMobile ? 60 : 120);
        scale = lerp(startScale, 0.92, t);
        rotate = -Math.sin(t * Math.PI) * (toX >= fromX ? -9 : 11);
        updateStopState(t > 0.55 ? 'services' : 'overview', true);
      } else if (scrollY <= f2Start) {
        // Seated pixel-identically in Stop 1: Services (#services)
        x = sRect.left;
        y = sRect.top;
        scale = 0.92;
        rotate = 0;
        updateStopState('services', false);
      } else if (scrollY < f2End) {
        // Flight 2: Services -> About
        const t = smoothstep(clamp01((scrollY - f2Start) / (f2End - f2Start)));
        const fromX = sRect.left;
        const fromY = docY1 - f2Start;
        const toX = aRect.left;
        const toY = docY2 - f2End;

        x = lerp(fromX, toX, t) + Math.sin(t * Math.PI) * (isMobile ? 28 : 85);
        y = lerp(fromY, toY, t) - Math.sin(t * Math.PI) * (isMobile ? 55 : 115);
        scale = lerp(0.92, 0.92, t);
        rotate = Math.sin(t * Math.PI) * (toX >= fromX ? 11 : -10);
        updateStopState(t > 0.55 ? 'about' : 'services', true);
      } else if (scrollY <= f3Start) {
        // Seated pixel-identically in Stop 2: About (#about)
        x = aRect.left;
        y = aRect.top;
        scale = 0.92;
        rotate = 0;
        updateStopState('about', false);
      } else if (scrollY < f3End) {
        // Flight 3: About -> Start a Project (#contact)
        const t = smoothstep(clamp01((scrollY - f3Start) / (f3End - f3Start)));
        const fromX = aRect.left;
        const fromY = docY2 - f3Start;
        const toX = cRect.left;
        const toY = docY3 - f3End;

        x = lerp(fromX, toX, t) + Math.sin(t * Math.PI) * (isMobile ? 22 : 70);
        y = lerp(fromY, toY, t) - Math.sin(t * Math.PI) * (isMobile ? 55 : 110);
        scale = lerp(0.92, 1.0, t);
        rotate = -Math.sin(t * Math.PI) * (toX < fromX ? 11 : -9);
        updateStopState(t > 0.65 ? 'contact' : 'about', true);
      } else {
        // Seated pixel-identically in Stop 3: Start a Project (#contact) above Footer
        x = cRect.left;
        y = cRect.top;
        scale = 1.0;
        rotate = 0;
        updateStopState('contact', false);
      }

      mover.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(4)}) rotate(${rotate.toFixed(2)}deg)`;
    };

    const runCoast = () => {
      updatePosition();
      if (performance.now() < coastUntil) {
        rafId = requestAnimationFrame(runCoast);
      } else {
        rafId = 0;
      }
    };

    const onActivity = () => {
      updatePosition();
      coastUntil = performance.now() + 750;
      if (!rafId) {
        rafId = requestAnimationFrame(runCoast);
      }
    };

    updatePosition();
    window.addEventListener('scroll', onActivity, { passive: true });
    window.addEventListener('resize', onActivity, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(onActivity)
        : null;
    if (resizeObserver) {
      resizeObserver.observe(document.body);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onActivity);
      window.removeEventListener('resize', onActivity);
      resizeObserver?.disconnect();
    };
  }, [servicesDockRef, aboutDockRef, contactDockRef]);

  return (
    <div
      ref={moverRef}
      className="fixed top-0 left-0 z-30 pointer-events-none will-change-transform origin-center"
    >
      <div className="pointer-events-auto">
        <CursorRobotMascot
          language={language}
          activeStop={activeStop}
          isFlying={isFlying}
        />
      </div>
    </div>
  );
}
