import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, ArrowRight, TrendingUp, CheckCircle, Clock, Users, Zap, BookOpen, Map, Activity } from 'lucide-react';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { StatusBadge } from '../components/StatusBadge';

const searchExamples = [
  'What caused my CTS failure?',
  'Why am I seeing hold violations?',
  'How do I reduce routing congestion?',
  'What causes antenna violations?',
  'Why is my placement density too high?',
];

const categories = [
  { name: 'Timing', icon: '⏱', count: 847, color: '#3B82F6' },
  { name: 'Placement', icon: '⊞', count: 623, color: '#8B5CF6' },
  { name: 'Routing', icon: '↗', count: 1204, color: '#10B981' },
  { name: 'CTS', icon: '🌳', count: 389, color: '#F59E0B' },
  { name: 'Floorplanning', icon: '⬚', count: 512, color: '#EC4899' },
  { name: 'Power', icon: '⚡', count: 298, color: '#EF4444' },
  { name: 'DRC', icon: '✓', count: 734, color: '#06B6D4' },
  { name: 'LVS', icon: '≡', count: 445, color: '#84CC16' },
];

const recentQuestions = [
  { id: 1, title: 'OpenROAD CTS failing with "no clock defined" after synthesis', confidence: 94, views: 2847, solved: true, tags: ['CTS', 'OpenROAD', 'Sky130'], time: '2h ago' },
  { id: 2, title: 'Hold violation slack of -0.23ns persists after hold repair in GF180', confidence: 88, views: 1923, solved: true, tags: ['Timing', 'GF180', 'Hold'], time: '4h ago' },
  { id: 3, title: 'Routing congestion hotspot in upper-left corner of die area', confidence: 76, views: 1456, solved: false, tags: ['Routing', 'Congestion'], time: '6h ago' },
  { id: 4, title: 'Antenna violations on metal3 after global routing', confidence: 91, views: 3201, solved: true, tags: ['DRC', 'Antenna', 'Routing'], time: '8h ago' },
  { id: 5, title: 'Power rail IR drop exceeding 5% in block-level implementation', confidence: 82, views: 987, solved: false, tags: ['Power', 'IR Drop'], time: '12h ago' },
];

const atlasStates = [
  { phase: 'Analyzing', status: 'analyzing' as const, desc: 'Parsing error context and log signatures' },
  { phase: 'Charting Path', status: 'charting' as const, desc: 'Cross-referencing failure patterns across 47,000 tapeouts' },
  { phase: 'Fixed', status: 'fixed' as const, desc: 'Root cause identified — recommended fix available' },
];

export function Homepage() {
  const [query, setQuery] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);
  const [atlasPhase, setAtlasPhase] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setExampleIndex(i => (i + 1) % searchExamples.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setAtlasPhase(p => (p + 1) % 3), 2500);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
      <div className="font-ui bg-canvas-bone text-abyss-ink">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 lg:px-8 text-center" style={{ background: 'var(--canvas-bone)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 border" style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.2)', color: 'var(--meridian-gold)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Atlas v2.1 — 47,000+ Tapeout Failures Mapped
          </div>

          <h1 className="mb-6 tracking-tight font-bold text-abyss-ink leading-tight text-5xl md:text-7xl">
            Map the Unknown.
          </h1>

          <p className="max-w-2xl mx-auto mb-12 leading-relaxed" style={{ fontSize: '1.1875rem', color: '#475569' }}>
            Atlas explains implementation failures, routing bottlenecks, timing violations, congestion hotspots, and physical design issues <em>before</em> they become tapeout blockers.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-4">
            <div
              className="flex items-center rounded-xl shadow-lg"
              style={{ background: '#FFFFFF', border: '1.5px solid var(--stone-ridge)' }}
            >
              <Search className="ml-5 w-5 h-5 shrink-0" style={{ color: '#94A3B8' }} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={searchExamples[exampleIndex]}
                className="flex-1 px-4 py-4 outline-none bg-transparent text-base"
                style={{ color: 'var(--abyss-ink)', fontFamily: 'var(--font-ui)' }}
              />
              <button
                type="submit"
                className="mr-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{ background: 'var(--abyss-ink)', color: 'var(--canvas-bone)' }}
              >
                Ask Atlas
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2">
            {['hold violations', 'CTS failure', 'antenna DRC', 'routing congestion', 'IR drop'].map(tag => (
              <button
                key={tag}
                onClick={() => navigate(`/search?q=${tag}`)}
                className="px-3 py-1 rounded-full text-xs transition-colors"
                style={{ background: 'rgba(15,23,42,0.06)', color: '#64748B', border: '1px solid var(--stone-ridge)' }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Atlas Preview */}
      <section className="py-16 px-6 lg:px-8" style={{ background: '#FFFFFF', borderTop: '1px solid var(--stone-ridge)', borderBottom: '1px solid var(--stone-ridge)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--meridian-gold)' }}>Atlas Intelligence</p>
              <h2 className="mb-4 text-3xl font-display font-semibold text-abyss-ink">
                From confusion to confidence in three steps.
              </h2>
              <p className="leading-relaxed mb-8" style={{ color: '#64748B', fontSize: '0.9375rem' }}>
                Atlas analyzes your implementation failure against a corpus of 47,000+ real tapeout scenarios. Every diagnosis includes evidence, reasoning, and an actionable fix.
              </p>
              <Link
                to="/atlas-platform"
                className="inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: 'var(--meridian-gold)' }}
              >
                How Atlas works <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="rounded-xl overflow-hidden border" style={{ border: '1px solid var(--stone-ridge)' }}>
              {/* Atlas Card Header */}
              <div className="px-5 py-4 flex items-center justify-between border-b" style={{ background: 'var(--abyss-ink)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'var(--meridian-gold)' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--abyss-ink)', fontFamily: 'var(--font-mono)' }}>A</span>
                  </div>
                  <span className="text-sm font-medium text-white">Atlas Analysis</span>
                </div>
                <StatusBadge status={atlasStates[atlasPhase].status} pulse />
              </div>

              <div className="p-5 space-y-4" style={{ background: '#FAFAF7' }}>
                <div>
                  <p className="text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>Query</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--abyss-ink)', fontFamily: 'var(--font-ui)' }}>
                    What caused my CTS failure in OpenROAD?
                  </p>
                </div>

                <div className="h-px" style={{ background: 'var(--stone-ridge)' }} />

                <div>
                  <p className="text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>Atlas Status</p>
                  <p className="text-sm" style={{ color: '#475569' }}>{atlasStates[atlasPhase].desc}</p>
                </div>

                {atlasPhase >= 1 && (
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: '#94A3B8' }}>Root Cause</p>
                    <div className="rounded-lg p-3 text-sm" style={{ background: 'rgba(194,65,12,0.06)', border: '1px solid rgba(194,65,12,0.15)', color: 'var(--topography-rust)' }}>
                      Clock source not propagated through synthesis — missing <code style={{ fontFamily: 'var(--font-mono)' }}>create_clock</code> constraint
                    </div>
                  </div>
                )}

                {atlasPhase >= 2 && (
                  <>
                    <ConfidenceMeter score={94} />
                    <div className="rounded-lg p-3 text-sm" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <p className="font-medium mb-1" style={{ color: 'var(--meridian-gold)' }}>Recommended Fix</p>
                      <p style={{ color: '#475569' }}>Add clock constraint to SDC file before running CTS. Seen 2,847 times — 96% fix rate.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-6 lg:px-8" style={{ background: 'var(--canvas-bone)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--meridian-gold)' }}>Failure Categories</p><h2 className="text-3xl font-display font-semibold text-abyss-ink">
              Every stage. Every failure type.
            </h2>
            </div>
            <Link to="/errors" className="text-sm font-medium flex items-center gap-1" style={{ color: '#64748B' }}>
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/errors?category=${cat.name.toLowerCase()}`}
                className="group rounded-lg p-5 transition-all hover:-translate-y-0.5"
                style={{ background: '#FFFFFF', border: '1px solid var(--stone-ridge)' }}
              >
                <div className="text-2xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--abyss-ink)', fontSize: '0.9375rem' }}>{cat.name}</h3>
                <p className="text-xs" style={{ color: '#94A3B8' }}>{cat.count.toLocaleString()} patterns</p>
                <div className="mt-3 w-8 h-0.5 rounded-full transition-all group-hover:w-12" style={{ background: cat.color }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Questions */}
      <section className="py-16 px-6 lg:px-8" style={{ background: '#FFFFFF', borderTop: '1px solid var(--stone-ridge)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--meridian-gold)' }}>Live Intelligence</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--abyss-ink)' }}>
                Recent questions, mapped by Atlas.
              </h2>
            </div>
            <Link to="/community" className="text-sm font-medium flex items-center gap-1" style={{ color: '#64748B' }}>
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y" style={{ borderTop: '1px solid var(--stone-ridge)', borderBottom: '1px solid var(--stone-ridge)' }}>
            {recentQuestions.map(q => (
              <Link
                key={q.id}
                to={`/questions/${q.id}`}
                className="flex items-start gap-4 py-5 group hover:bg-gray-50 transition-colors px-1 rounded"
              >
                <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0 w-12">
                  {q.solved ? (
                    <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                  ) : (
                    <Clock className="w-5 h-5" style={{ color: '#F59E0B' }} />
                  )}
                  <span className="text-xs text-center leading-tight" style={{ color: q.solved ? '#10B981' : '#F59E0B', fontFamily: 'var(--font-mono)' }}>
                    {q.confidence}%
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium mb-2 group-hover:underline" style={{ color: 'var(--abyss-ink)' }}>
                    {q.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {q.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--secondary)', color: '#475569' }}>
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs" style={{ color: '#94A3B8' }}>{q.time}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right hidden md:block">
                  <div className="flex items-center gap-1 text-xs" style={{ color: '#94A3B8' }}>
                    <Users className="w-3.5 h-3.5" />
                    {q.views.toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 lg:px-8" style={{ background: 'var(--abyss-ink)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Failures Mapped', value: '47,293', icon: Map, color: 'var(--meridian-gold)' },
              { label: 'Questions Answered', value: '12,847', icon: Activity, color: '#3B82F6' },
              { label: 'Fixes Discovered', value: '8,934', icon: CheckCircle, color: '#10B981' },
              { label: 'Routes Charted', value: '31,204', icon: TrendingUp, color: '#8B5CF6' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-3" style={{ color: stat.color }} />
                <div className="mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {stat.value}
                </div>
                <p className="text-xs font-medium" style={{ color: 'rgba(243,242,237,0.5)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 lg:px-8 text-center" style={{ background: 'var(--canvas-bone)', borderTop: '1px solid var(--stone-ridge)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--abyss-ink)' }}>
            Ready to route your design?
          </h2>
          <p className="mb-8" style={{ color: '#64748B', fontSize: '1.0625rem' }}>
            Join 3,400+ engineers who use Atlas to navigate implementation complexity with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-lg font-semibold text-sm transition-all"
              style={{ background: 'var(--abyss-ink)', color: 'var(--canvas-bone)' }}
            >
              Tape It Out →
            </Link>
            <Link
              to="/atlas-platform"
              className="px-8 py-3.5 rounded-lg font-medium text-sm border transition-all"
              style={{ border: '1.5px solid var(--stone-ridge)', color: '#475569' }}
            >
              Learn About Atlas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
