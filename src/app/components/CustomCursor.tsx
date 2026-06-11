import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Semiconductor Wafer Alignment Mark / CAD Reticle SVG
function ReticleSvg() {
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 32 32" 
      fill="none" 
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Lithography Corner Brackets */}
      <path d="M 4,10 L 4,4 L 10,4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 28,10 L 28,4 L 22,4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 4,22 L 4,28 L 10,28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 28,22 L 28,28 L 22,28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Laser Alignment Ticks */}
      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.2" />
      <line x1="16" y1="26" x2="16" y2="30" strokeWidth="1.2" />
      <line x1="2" y1="16" x2="6" y2="16" strokeWidth="1.2" />
      <line x1="26" y1="16" x2="30" y2="16" strokeWidth="1.2" />
    </svg>
  );
}

// Micro-Plus Crosshair Target SVG
function MicroPlusSvg() {
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 12 12" 
      fill="none" 
      stroke="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="6" y1="2" x2="6" y2="10" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="2" y1="6" x2="10" y2="6" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // 1. Detect touch devices to disable custom cursor
  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsTouchDevice(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 2. Trailing Animation & Interactions
  useEffect(() => {
    if (isTouchDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Center layout registration
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' });

    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    let lastClientX = 0;
    let lastClientY = 0;
    let activeInteractiveEl: HTMLElement | null = null;

    const resetActiveElement = () => {
      if (activeInteractiveEl) {
        const el = activeInteractiveEl;
        
        // Reset element position
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: 'elastic.out(1.1, 0.4)',
          overwrite: 'auto'
        });
        
        // Reset Wafer Reticle
        gsap.to(ring, {
          width: 32,
          height: 32,
          color: 'var(--meridian-gold)',
          rotate: 0,
          mixBlendMode: 'normal',
          duration: 0.3,
          ease: 'power2.out'
        });
        
        // Restore gold micro-plus
        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out'
        });
        
        delete el.dataset.magneticActive;
        activeInteractiveEl = null;
      }
    };

    const handleElementHover = (interactive: HTMLElement, clientX: number, clientY: number) => {
      if (activeInteractiveEl !== interactive) {
        resetActiveElement();
        activeInteractiveEl = interactive;
        interactive.dataset.magneticActive = 'true';

        // Animate Wafer Reticle hover
        gsap.to(ring, {
          width: 46,
          height: 46,
          color: '#FFFFFF',
          rotate: 90,
          mixBlendMode: 'difference',
          duration: 0.3,
          ease: 'power2.out',
        });

        // Hide inner gold crosshair
        gsap.to(dot, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out',
        });
      }

      // Calculate magnetic pull
      const rect = interactive.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      const pullX = deltaX * 0.22;
      const pullY = deltaY * 0.22;

      gsap.to(interactive, {
        x: pullX,
        y: pullY,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const onMouseMoveGlobal = (e: MouseEvent) => {
      setIsVisible(true);
      lastClientX = e.clientX;
      lastClientY = e.clientY;

      setDotX(lastClientX);
      setDotY(lastClientY);
      setRingX(lastClientX);
      setRingY(lastClientY);

      const target = e.target as HTMLElement;
      const interactive = target?.closest(
        'button, a, [data-magnetic], input[type="submit"], input[type="button"], .interactive-element'
      ) as HTMLElement;

      if (interactive) {
        handleElementHover(interactive, lastClientX, lastClientY);
      } else {
        resetActiveElement();
      }
    };

    const onScrollGlobal = () => {
      // Find element under current cursor screen coordinates
      const target = document.elementFromPoint(lastClientX, lastClientY) as HTMLElement;
      const interactive = target?.closest(
        'button, a, [data-magnetic], input[type="submit"], input[type="button"], .interactive-element'
      ) as HTMLElement;

      if (interactive) {
        handleElementHover(interactive, lastClientX, lastClientY);
      } else {
        resetActiveElement();
      }
    };

    const onMouseLeaveWindow = () => {
      setIsVisible(false);
      resetActiveElement();
    };

    window.addEventListener('mousemove', onMouseMoveGlobal);
    window.addEventListener('scroll', onScrollGlobal, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', onMouseMoveGlobal);
      window.removeEventListener('scroll', onScrollGlobal);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* 1. Inner Crosshair (Gold Micro-Plus) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none select-none z-[99999]"
        style={{
          width: '12px',
          height: '12px',
          color: 'var(--meridian-gold)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <MicroPlusSvg />
      </div>

      {/* 2. Outer Trailing Target (Semiconductor Lithography Reticle) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none select-none z-[99998]"
        style={{
          width: '32px',
          height: '32px',
          color: 'var(--meridian-gold)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <ReticleSvg />
      </div>
    </>
  );
}
