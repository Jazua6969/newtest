import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Search, ChevronRight, ExternalLink } from 'lucide-react';
import docs, { type DocPageData, type DocLink, type DocSection } from './docs/content';

const categoriesOrder = [
  'Getting Started',
  'OpenROAD Flow',
  'Sky130 PDK',
  'GF180MCU PDK',
  'Timing Analysis',
  'Atlas API',
  'Error Reference',
];

const defaultCategory = categoriesOrder[0];

export function DocsHub() {
  const sections = useMemo(() => {
    const result: Record<string, { slug: string; title: string }[]> = {};
    categoriesOrder.forEach(category => {
      result[category] = [];
    });

    Object.entries(docs).forEach(([slug, page]) => {
      const category = page.breadcrumb?.[0] || defaultCategory;
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push({ slug, title: page.title });
    });

    Object.values(result).forEach(group => {
      group.sort((a, b) => a.title.localeCompare(b.title));
    });

    return result;
  }, []);

  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState(defaultCategory);
  const [activeDocSlug, setActiveDocSlug] = useState<string>(() => {
    return sections[defaultCategory]?.[0]?.slug || Object.keys(docs)[0];
  });
  const [activeToc, setActiveToc] = useState('Overview');

  const firstSlug = sections[defaultCategory]?.[0]?.slug || Object.keys(docs)[0];
  const previewDoc: DocPageData = docs[activeDocSlug] || docs[firstSlug];

  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return sections;
    }

    return Object.entries(sections).reduce((filtered, [category, pages]) => {
      const matches = pages.filter(page => page.title.toLowerCase().includes(query));
      if (matches.length > 0) {
        filtered[category] = matches;
      }
      return filtered;
    }, {} as Record<string, { slug: string; title: string }[]>);
  }, [search, sections]);

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', fontFamily: 'var(--font-ui)' }}>
      <div className="border-b" style={{ background: '#FFFFFF', borderColor: 'var(--stone-ridge)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'var(--abyss-ink)' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--meridian-gold)', fontFamily: 'var(--font-mono)' }}>T</span>
                </div>
                <span className="font-semibold" style={{ color: 'var(--abyss-ink)' }}>TapeItOut Docs</span>
              </div>
              <div className="w-px h-4" style={{ background: 'var(--stone-ridge)' }} />
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#94A3B8' }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search docs..."
                  className="pl-9 pr-4 py-1.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--canvas-bone)', border: '1px solid var(--stone-ridge)', fontFamily: 'var(--font-ui)', color: 'var(--abyss-ink)', width: '240px' }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/docs/openroad-cookbook" className="text-sm" style={{ color: '#64748B' }}>OpenROAD Cookbook</Link>
              <a href="https://github.com" target="_blank" rel="noreferrer noopener" className="flex items-center gap-1 text-sm" style={{ color: '#64748B' }}>
                GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 flex" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <aside className="w-60 shrink-0 border-r overflow-y-auto sticky top-16 self-start" style={{ borderColor: 'var(--stone-ridge)', height: 'calc(100vh - 120px)', background: '#FAFAF7', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
          {Object.entries(filteredSections).map(([section, pages]) => (
            <div key={section} className="mb-1 px-4">
              <button
                className="w-full flex items-center justify-between py-1.5 text-xs font-semibold text-left"
                style={{ color: activeSection === section ? 'var(--abyss-ink)' : '#94A3B8', letterSpacing: '0.06em' }}
                onClick={() => setActiveSection(activeSection === section ? '' : section)}
              >
                <span>{section.toUpperCase()}</span>
                <ChevronRight className={`w-3 h-3 transition-transform ${activeSection === section ? 'rotate-90' : ''}`} />
              </button>
              {activeSection === section && (
                <div className="ml-2 mt-1 mb-2 space-y-0.5">
                  {pages.map(page => (
                    <Link
                      key={page.slug}
                      to={`/docs/${page.slug}`}
                      onClick={() => setActiveDocSlug(page.slug)}
                      className="w-full text-left text-xs px-3 py-1.5 rounded transition-colors block"
                      style={{
                        color: page.slug === activeDocSlug ? 'var(--abyss-ink)' : '#64748B',
                        background: page.slug === activeDocSlug ? '#FFFFFF' : 'transparent',
                        fontWeight: page.slug === activeDocSlug ? 500 : 400,
                      }}
                    >
                      {page.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        <main className="flex-1 min-w-0 px-10 py-10">
          <div className="flex items-center gap-2 text-xs mb-6" style={{ color: '#94A3B8' }}>
            {previewDoc.breadcrumb.map((crumb, i) => (
              <span key={`${crumb}-${i}`} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                <span>{crumb}</span>
              </span>
            ))}
          </div>

          <div className="flex items-start gap-4 mb-2">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--abyss-ink)' }}>
              {previewDoc.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 mb-8 text-xs" style={{ color: '#94A3B8' }}>
            <span>Updated {previewDoc.lastUpdated}</span>
            <span>·</span>
            <span>{previewDoc.readTime}</span>
          </div>

          <div className="space-y-8 max-w-2xl">
            {previewDoc.content.map((section: DocSection, i: number) => (
              <div key={i} id={section.heading.toLowerCase().replace(/\s/g, '-') }>
                <h2 className="mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--abyss-ink)' }}>
                  {section.heading}
                </h2>
                <div className="prose text-sm leading-relaxed mb-4" style={{ color: '#475569', fontFamily: 'var(--font-editorial)', whiteSpace: 'pre-wrap' }}>
                  {section.body}
                </div>
                {section.code && (
                  <div className="rounded-lg overflow-hidden" style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161B22' }}>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{section.codeLanguage}</span>
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
            <Link to="/docs/placement-with-replace" className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
              ← Placement with RePlAce
            </Link>
            <Link to="/docs/routing-with-fastroute" className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
              Routing with FastRoute →
            </Link>
          </div>
        </main>

        <aside className="w-52 shrink-0 border-l hidden lg:block sticky top-16 self-start" style={{ borderColor: 'var(--stone-ridge)', height: 'calc(100vh - 120px)', paddingTop: '1.5rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>On This Page</p>
          <div className="space-y-1">
            {previewDoc.toc.map((item: string) => (
              <button
                key={item}
                onClick={() => setActiveToc(item)}
                className="w-full text-left text-xs py-1.5 px-2 rounded transition-colors"
                style={{
                  color: activeToc === item ? 'var(--abyss-ink)' : '#94A3B8',
                  fontWeight: activeToc === item ? 500 : 400,
                  background: activeToc === item ? 'rgba(15,23,42,0.05)' : 'transparent',
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--stone-ridge)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Related</p>
            {previewDoc.related?.map((link: DocLink) => (
              <Link key={link.title} to={link.href} className="block text-xs py-1.5 hover:underline" style={{ color: '#64748B' }}>
                {link.title}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
