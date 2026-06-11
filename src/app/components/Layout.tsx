import { Outlet, useLocation, useNavigate } from 'react-router';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAtlasWorkspace = location.pathname === '/atlas';
  const isLoginPage = location.pathname === '/login';

  const [isPreloading, setIsPreloading] = useState(true);
  const transitionContainerRef = useRef<HTMLDivElement>(null);
  const preloaderContainerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // 1. Initial Preloader & Lenis Setup
  useEffect(() => {
    // Initialize Lenis
    if (!isAtlasWorkspace) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    // Play Initial GSAP Preloader
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsPreloading(false);
          if (preloaderContainerRef.current) {
            preloaderContainerRef.current.style.display = 'none';
          }
        }
      });

      // Stagger logo reveal
      tl.fromTo('.preloader-logo', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )
      .to('.preloader-line', 
        { width: 140, duration: 0.6, ease: 'power2.inOut' }, 
        '-=0.2'
      )
      .to('.preloader-logo, .preloader-line', 
        { opacity: 0, y: -20, duration: 0.5, ease: 'power3.in' },
        '+=0.5'
      )
      // Curtain split wipe reveal
      .to('.preloader-curtain', {
        yPercent: -100,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power4.inOut'
      }, '-=0.1');

    }, preloaderContainerRef);

    return () => {
      ctx.revert();
      if (lenisRef.current) lenisRef.current.destroy();
    };
  }, [isAtlasWorkspace]);

  // 2. Entrance Route Transition
  useEffect(() => {
    if (isPreloading) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    const ctx = gsap.context(() => {
      // Stagger slide panels out of view
      gsap.fromTo('.transition-panel',
        { yPercent: 0 },
        {
          yPercent: -100,
          stagger: 0.05,
          duration: 0.6,
          ease: 'power3.inOut'
        }
      );
    }, transitionContainerRef);

    return () => ctx.revert();
  }, [location.pathname, isPreloading]);

  // 3. Intercept Clicks for Exit Route Transition
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      // Verify it's an internal link
      if (
        anchor &&
        anchor.href &&
        anchor.target !== '_blank' &&
        anchor.origin === window.location.origin &&
        !anchor.hasAttribute('download')
      ) {
        const targetPath = anchor.pathname + anchor.search + anchor.hash;

        // Only animate if navigating to a different page
        if (targetPath !== location.pathname + location.search + location.hash) {
          e.preventDefault();

          // Trigger Exit Transition
          gsap.context(() => {
            gsap.fromTo('.transition-panel',
              { yPercent: 100 },
              {
                yPercent: 0,
                stagger: 0.05,
                duration: 0.5,
                ease: 'power3.inOut',
                onComplete: () => {
                  navigate(targetPath);
                }
              }
            );
          }, transitionContainerRef);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col relative" style={{ fontFamily: 'var(--font-ui)', background: 'var(--canvas-bone)' }}>
      {/* 1. INITIAL PRELOADER OVERLAY */}
      <div 
        ref={preloaderContainerRef} 
        className="fixed inset-0 z-[99999] flex pointer-events-auto select-none"
      >
        {/* Curtains */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="preloader-curtain flex-1 h-full bg-[#0F172A]" />
          ))}
        </div>
        
        {/* Brand Text Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="overflow-hidden h-9">
            <span className="preloader-logo block text-[#D4AF37] font-bold text-2xl tracking-widest font-mono">
              ATLAS / TAPEITOUT
            </span>
          </div>
          <div className="preloader-line w-0 h-[2px] bg-[#D4AF37] mt-3" />
        </div>
      </div>

      {/* 2. ROUTE PAGE TRANSITION PANELS */}
      <div 
        ref={transitionContainerRef} 
        className="fixed inset-0 z-[9999] flex flex-col pointer-events-none select-none"
      >
        <div className="transition-panel w-full h-[51vh] bg-[#D4AF37]" style={{ transform: 'translateY(100%)' }} />
        <div className="transition-panel w-full h-[51vh] bg-[#0F172A] -mt-1" style={{ transform: 'translateY(100%)' }} />
      </div>

      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAtlasWorkspace && !isLoginPage && <Footer />}
    </div>
  );
}
