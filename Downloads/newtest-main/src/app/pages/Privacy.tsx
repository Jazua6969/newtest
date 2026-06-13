export function Privacy() {
  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8 py-20" style={{ fontFamily: 'var(--font-ui)' }}>
      <h1 className="text-4xl font-semibold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--abyss-ink)' }}>
        Privacy Policy
      </h1>
      <p className="text-base leading-relaxed mb-4" style={{ color: '#475569' }}>
        At TapeItOut, we respect your privacy and strive to protect your personal information.
        This page describes how we collect, use, and safeguard data when you use the Atlas platform.
      </p>
      <section className="space-y-4 text-sm leading-relaxed" style={{ color: '#64748B' }}>
        <div>
          <h2 className="font-semibold mb-2" style={{ color: 'var(--abyss-ink)' }}>Information We Collect</h2>
          <p>
            We may collect information you provide directly, such as account details and support requests, as well as usage
            data to improve product performance and recommendations.
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-2" style={{ color: 'var(--abyss-ink)' }}>How We Use Information</h2>
          <p>
            Data is used to operate the platform, personalize your experience, deliver customer support, and maintain security.
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-2" style={{ color: 'var(--abyss-ink)' }}>Your Choices</h2>
          <p>
            You can manage communication preferences, request access to your information, or ask us to update or delete your data.
          </p>
        </div>
      </section>
    </div>
  );
}
