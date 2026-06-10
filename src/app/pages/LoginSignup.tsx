import { useState } from 'react';
import { Link } from 'react-router';
import { Github, Mail, ArrowRight } from 'lucide-react';

export function LoginSignup() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--abyss-ink)', fontFamily: 'var(--font-ui)' }}>
      {/* Left - Illustration / Brand */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12" style={{ background: 'var(--abyss-ink)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'var(--meridian-gold)' }}>
            <span className="text-xs font-bold" style={{ color: 'var(--abyss-ink)', fontFamily: 'var(--font-mono)' }}>T</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white text-sm font-semibold">Ask</span>
            <span className="text-xs" style={{ color: 'var(--meridian-gold)', letterSpacing: '0.12em' }}>TAPEITOUT</span>
          </div>
        </Link>

        {/* Atlas Visualization */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-72 h-72">
            {/* Central Atlas node */}
            <div
              className="absolute inset-0 m-auto w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: 'var(--meridian-gold)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute' }}
            >
              <div className="text-center">
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--abyss-ink)' }}>A</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'rgba(15,23,42,0.6)' }}>ATLAS</div>
              </div>
            </div>

            {/* Orbit rings */}
            {[120, 180].map((r, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: r * 2,
                  height: r * 2,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: '1px solid rgba(212,175,55,0.15)',
                }}
              />
            ))}

            {/* Satellite nodes */}
            {[
              { label: 'CTS', angle: 0, r: 120, color: '#EC4899' },
              { label: 'Timing', angle: 60, r: 120, color: '#3B82F6' },
              { label: 'DRC', angle: 120, r: 120, color: '#F59E0B' },
              { label: 'Routing', angle: 180, r: 120, color: '#10B981' },
              { label: 'LVS', angle: 240, r: 120, color: '#8B5CF6' },
              { label: 'Power', angle: 300, r: 120, color: 'var(--topography-rust)' },
            ].map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              const x = Math.cos(rad) * node.r;
              const y = Math.sin(rad) * node.r;
              return (
                <div
                  key={node.label}
                  className="absolute flex items-center justify-center rounded-full"
                  style={{
                    width: 42,
                    height: 42,
                    top: '50%',
                    left: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    background: `${node.color}22`,
                    border: `1.5px solid ${node.color}44`,
                  }}
                >
                  <span style={{ fontSize: '0.55rem', fontWeight: 700, color: node.color, fontFamily: 'var(--font-ui)' }}>
                    {node.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <blockquote style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.0625rem', color: 'rgba(243,242,237,0.65)', lineHeight: 1.7 }}>
            "Routing a chip shouldn't feel like being lost in the dark."
          </blockquote>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-1 h-8 rounded-full" style={{ background: 'var(--meridian-gold)' }} />
            <div>
              <p className="text-xs font-semibold text-white">TapeItOut Brand Promise</p>
              <p className="text-xs" style={{ color: 'rgba(243,242,237,0.35)' }}>ask.tapeitout.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'var(--meridian-gold)' }}>
              <span className="text-xs font-bold" style={{ color: 'var(--abyss-ink)', fontFamily: 'var(--font-mono)' }}>T</span>
            </div>
            <span className="text-white font-semibold">Ask TapeItOut</span>
          </Link>

          <div className="mb-8">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              {mode === 'login' ? 'Welcome back.' : 'Start mapping.'}
            </h1>
            <p style={{ color: 'rgba(243,242,237,0.5)', fontSize: '0.9375rem' }}>
              {mode === 'login' ? 'Sign in to your TapeItOut account.' : 'Create your free account. No credit card required.'}
            </p>
          </div>

          {/* OAuth */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-medium transition-all" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF' }}>
              <Github className="w-4 h-4" />
              Continue with GitHub
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-medium transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(243,242,237,0.7)' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-xs" style={{ color: 'rgba(243,242,237,0.3)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(243,242,237,0.6)' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-lg outline-none text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontFamily: 'var(--font-ui)' }}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(243,242,237,0.6)' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 rounded-lg outline-none text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontFamily: 'var(--font-ui)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(243,242,237,0.6)' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg outline-none text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontFamily: 'var(--font-ui)' }}
              />
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <a href="#" className="text-xs" style={{ color: 'rgba(243,242,237,0.4)' }}>Forgot password?</a>
              </div>
            )}

            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all"
              style={{ background: 'var(--meridian-gold)', color: 'var(--abyss-ink)' }}
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: 'rgba(243,242,237,0.4)' }}>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-medium"
              style={{ color: 'var(--meridian-gold)' }}
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {mode === 'signup' && (
            <p className="text-center mt-4 text-xs" style={{ color: 'rgba(243,242,237,0.25)' }}>
              By creating an account, you agree to our{' '}
              <a href="#" style={{ color: 'rgba(243,242,237,0.4)' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: 'rgba(243,242,237,0.4)' }}>Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
