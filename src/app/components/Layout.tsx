import { Outlet, useLocation } from 'react-router';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  const isAtlasWorkspace = location.pathname === '/atlas';
  const isLoginPage = location.pathname === '/login';

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
