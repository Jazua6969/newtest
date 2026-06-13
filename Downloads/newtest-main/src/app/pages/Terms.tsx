export function Terms() {
  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8 py-20" style={{ fontFamily: 'var(--font-ui)' }}>
      <h1 className="text-4xl font-semibold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--abyss-ink)' }}>
        Terms of Service
      </h1>
      <p className="text-base leading-relaxed mb-4" style={{ color: '#475569' }}>
        Welcome to TapeItOut. These terms govern your use of the Atlas platform and related services.
      </p>
      <section className="space-y-4 text-sm leading-relaxed" style={{ color: '#64748B' }}>
        <div>
          <h2 className="font-semibold mb-2" style={{ color: 'var(--abyss-ink)' }}>Use of the Service</h2>
          <p>
            By using Atlas, you agree to follow our guidelines and not misuse the platform for any unlawful or prohibited activities.
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-2" style={{ color: 'var(--abyss-ink)' }}>Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-2" style={{ color: 'var(--abyss-ink)' }}>Intellectual Property</h2>
          <p>
            TapeItOut and its licensors retain ownership of all product content, trademarks, and proprietary technology.
          </p>
        </div>
      </section>
    </div>
  );
}
