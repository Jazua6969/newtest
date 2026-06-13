import { Link, useParams } from 'react-router';
import { ChevronRight } from 'lucide-react';
import docs from './docs/content';

export function DocPage() {
  const { slug } = useParams();
  const doc = slug ? docs[slug] : null;

  if (!doc) {
    return (
      <div style={{ background: 'transparent', minHeight: '100vh', fontFamily: 'var(--font-ui)' }} className="flex items-center justify-center p-12">
        <div className="max-w-2xl text-center">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--abyss-ink)' }}>Documentation page not found</h2>
          <p style={{ color: '#64748B' }} className="mt-4">The doc you requested doesn't exist yet. Browse the docs hub to find available guides.</p>
          <div className="mt-6">
            <Link to="/docs" className="px-4 py-2 rounded-lg" style={{ background: 'var(--meridian-gold)', color: 'var(--abyss-ink)' }}>Back to Docs</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', fontFamily: 'var(--font-ui)' }}>
      {/* Doc Header */}
      <div className="border-b" style={{ background: '#FFFFFF', borderColor: 'var(--stone-ridge)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'var(--abyss-ink)' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--meridian-gold)', fontFamily: 'var(--font-mono)' }}>T</span>
                </div>
                <span className="font-semibold" style={{ color: 'var(--abyss-ink)' }}>TapeItOut Docs</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/docs" className="text-sm" style={{ color: '#64748B' }}>Docs Hub</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 flex" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <main className="flex-1 min-w-0 px-10 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-6" style={{ color: '#94A3B8' }}>
            {doc.breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                <span>{crumb}</span>
              </span>
            ))}
          </div>

          <div className="flex items-start gap-4 mb-2">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--abyss-ink)' }}>
              {doc.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 mb-8 text-xs" style={{ color: '#94A3B8' }}>
            <span>Updated {doc.lastUpdated}</span>
            <span>·</span>
            <span>{doc.readTime}</span>
          </div>

          <div className="space-y-8 max-w-2xl">
            {doc.content.map((section: any, i: number) => (
              <div key={i} id={section.heading.toLowerCase().replace(/\s/g, '-')}>
                <h2 className="mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--abyss-ink)' }}>
                  {section.heading}
                </h2>
                <div className="prose text-sm leading-relaxed mb-4" style={{ color: '#475569', fontFamily: 'var(--font-editorial)', whiteSpace: 'pre-wrap' }}>
                  {section.body}
                </div>
                {section.code && (
                  <div className="rounded-lg overflow-hidden" style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161B22' }}>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{section.codeLanguage || 'bash'}</span>
                    </div>
                    <pre className="p-4 text-sm overflow-x-auto" style={{ fontFamily: 'var(--font-mono)', color: '#E6EDF3', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                      {section.code}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-16 pt-8 border-t max-w-2xl" style={{ borderColor: 'var(--stone-ridge)' }}>
            <Link to={doc.prev || '/docs'} className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
              ← {doc.prevTitle || 'Previous'}
            </Link>
            <Link to={doc.next || '/docs'} className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
              {doc.nextTitle || 'Next'} →
            </Link>
          </div>
        </main>

        {/* Right - TOC */}
        <aside className="w-52 shrink-0 border-l hidden lg:block sticky top-16 self-start" style={{ borderColor: 'var(--stone-ridge)', height: 'calc(100vh - 120px)', paddingTop: '1.5rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>On This Page</p>
          <div className="space-y-1">
            {doc.toc.map((item: string) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="block text-xs py-1.5 hover:underline" style={{ color: '#64748B' }}>
                {item}
              </a>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--stone-ridge)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Related</p>
            {doc.related.map((page: any) => (
              <Link key={page.title} to={page.href} className="block text-xs py-1.5 hover:underline" style={{ color: '#64748B' }}>
                {page.title}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default DocPage;
