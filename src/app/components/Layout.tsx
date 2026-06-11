import { Outlet, useLocation } from 'react-router';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { useEffect } from 'react';
import Lenis from 'lenis';

export function Layout() {
  const location = useLocation();
  const isAtlasWorkspace = location.pathname === '/atlas';
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    if (isAtlasWorkspace) return;

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Scroll to top immediately on route changes
    lenis.scrollTo(0, { immediate: true });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [location.pathname, isAtlasWorkspace]);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-ui)', background: 'var(--canvas-bone)' }}>
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAtlasWorkspace && !isLoginPage && <Footer />}
    </div>
  );
}
