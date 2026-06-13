export function Cookies() {
  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8 py-20" style={{ fontFamily: 'var(--font-ui)' }}>
      <h1 className="text-4xl font-semibold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--abyss-ink)' }}>
        Cookie Policy
      </h1>
      <p className="text-base leading-relaxed mb-4" style={{ color: '#475569' }}>
        TapeItOut uses cookies and similar technologies to improve the Atlas experience, personalize content, and analyze usage.
      </p>
      <section className="space-y-4 text-sm leading-relaxed" style={{ color: '#64748B' }}>
        <div>
          <h2 className="font-semibold mb-2" style={{ color: 'var(--abyss-ink)' }}>What We Use</h2>
          <p>
            We use essential cookies for authentication and preferences, analytics cookies to understand product usage, and optional cookies to personalize features.
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-2" style={{ color: 'var(--abyss-ink)' }}>Managing Cookies</h2>
          <p>
            You can control cookie preferences through your browser settings, and some features may be limited if cookies are disabled.
          </p>
        </div>
      </section>
    </div>
  );
}
