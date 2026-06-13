import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { BookOpen, Clock, CheckCircle, ArrowRight, Play, Lock, Star } from 'lucide-react';
import {
  learningPaths,
  loadLearningProgress,
  saveLearningProgress,
  getPathBySlug,
  getNextUnfinishedModule,
  getPathProgress,
} from '../data/learningPaths';

const stages = [
  { name: 'RTL Design', icon: '⟨/⟩', modules: 8, duration: '4h 20m', color: '#8B5CF6' },
  { name: 'Synthesis', icon: '⚙', modules: 12, duration: '6h 15m', color: '#3B82F6' },
  { name: 'Floorplanning', icon: '⬚', modules: 7, duration: '3h 45m', color: '#10B981' },
  { name: 'Placement', icon: '⊞', modules: 10, duration: '5h 30m', color: '#F59E0B' },
  { name: 'CTS', icon: '🌳', modules: 9, duration: '4h 50m', color: '#EC4899' },
  { name: 'Routing', icon: '↗', modules: 14, duration: '7h 20m', color: '#EF4444' },
  { name: 'Signoff', icon: '✓', modules: 11, duration: '6h 00m', color: '#06B6D4' },
  { name: 'Tapeout', icon: '◎', modules: 6, duration: '3h 10m', color: 'var(--meridian-gold)' },
];

const featuredModules = [
  { title: 'Understanding Clock Tree Synthesis', stage: 'CTS', duration: '28 min', free: true },
  { title: 'SDC Constraint Writing for Beginners', stage: 'Synthesis', duration: '35 min', free: true },
  { title: 'Routing Congestion Analysis & Fixes', stage: 'Routing', duration: '42 min', free: false },
  { title: 'DRC Violation Debugging in KLayout', stage: 'Signoff', duration: '31 min', free: false },
  { title: 'Floorplanning Best Practices', stage: 'Floorplanning', duration: '38 min', free: true },
  { title: 'Hold Timing Repair Strategies', stage: 'Signoff', duration: '45 min', free: false },
];

const levelColors = {
  Beginner: { color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
  Intermediate: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  Advanced: { color: 'var(--topography-rust)', bg: 'rgba(194,65,12,0.08)' },
};

export function LearningHub() {
  const [activeStage, setActiveStage] = useState('All');
  const [progress, setProgress] = useState(() => loadLearningProgress());
  const navigate = useNavigate();

  useEffect(() => {
    saveLearningProgress(progress);
  }, [progress]);

  const activePath = useMemo(() => getPathBySlug(progress.activeLearningPath) ?? learningPaths[0], [progress.activeLearningPath]);
  const continueModule = useMemo(() => getNextUnfinishedModule(activePath, progress) ?? activePath.modules[0], [activePath, progress]);
  const activePathProgress = useMemo(() => getPathProgress(activePath, progress), [activePath, progress]);

  const filteredFeaturedModules = useMemo(() => {
    if (activeStage === 'All') return featuredModules;
    return featuredModules.filter(module => module.stage === activeStage);
  }, [activeStage]);

  const handlePathSelect = (pathSlug: string) => {
    const path = getPathBySlug(pathSlug);
    if (!path) return;
    const nextModule = getNextUnfinishedModule(path, progress) ?? path.modules[0];
    const updatedProgress = {
      ...progress,
      activeLearningPath: pathSlug,
      lastVisitedModule: `${pathSlug}/${nextModule.slug}`,
    };
    setProgress(updatedProgress);
    navigate(`/learn/${pathSlug}/${nextModule.slug}`);
  };

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', fontFamily: 'var(--font-ui)' }}>
      {/* Header */}
      <div style={{ background: 'var(--abyss-ink)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-12 pb-10">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--meridian-gold)' }}>Learning Hub</p>
          <h1 className="mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: '#FFFFFF' }}>
            From RTL to GDSII.
          </h1>
          <p style={{ color: 'rgba(243,242,237,0.6)', maxWidth: '40rem' }}>
            Structured learning paths and modules for every stage of physical design, guided by Atlas.
          </p>
        </div>
      </div>

      <div className="border-b" style={{ background: '#FFFFFF', borderColor: 'var(--stone-ridge)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--abyss-ink)' }}>Your Progress</p>
              <p className="text-xs" style={{ color: '#64748B' }}>{activePath.title} · {activePathProgress}% complete</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48 h-1.5 rounded-full" style={{ background: 'var(--secondary)' }}>
                <div className="h-1.5 rounded-full" style={{ width: `${activePathProgress}%`, background: 'var(--meridian-gold)' }} />
              </div>
              <Link to={`/learn/${activePath.slug}/${continueModule.slug}`} className="text-sm font-medium" style={{ color: 'var(--meridian-gold)' }}>
                Continue →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
        {/* Pipeline Stage Nav */}
        <div className="mb-10">
          <h2 className="mb-5" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--abyss-ink)' }}>Browse by Stage</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {stages.map(stage => (
              <button
                key={stage.name}
                onClick={() => setActiveStage(stage.name)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all"
                style={{
                  background: activeStage === stage.name ? 'var(--abyss-ink)' : '#FFFFFF',
                  border: activeStage === stage.name ? `2px solid var(--abyss-ink)` : '1px solid var(--stone-ridge)',
                }}
              >
                <span className="text-xl">{stage.icon}</span>
                <span className="text-xs font-medium text-center leading-tight" style={{ color: activeStage === stage.name ? '#FFFFFF' : 'var(--abyss-ink)' }}>
                  {stage.name}
                </span>
                <span className="text-xs" style={{ color: activeStage === stage.name ? 'rgba(243,242,237,0.5)' : '#94A3B8' }}>
                  {stage.modules} modules
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--abyss-ink)' }}>Atlas Suggested Learning Paths</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="learning-paths">
            {learningPaths.map(path => {
              const level = levelColors[path.level as keyof typeof levelColors];
              const progressValue = getPathProgress(path, progress);
              const nextModule = getNextUnfinishedModule(path, progress) ?? path.modules[0];
              return (
                <button
                  key={path.slug}
                  onClick={() => handlePathSelect(path.slug)}
                  className="scroll-reveal-card group rounded-xl border p-6 transition-all hover:shadow-md text-left"
                  style={{ background: '#FFFFFF', border: '1px solid var(--stone-ridge)' }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap gap-2">
                      {path.recommended && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--meridian-gold)' }}>
                          <Star className="w-3 h-3" /> Atlas Pick
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: level.bg, color: level.color }}>
                        {path.level}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold mb-2 group-hover:underline" style={{ color: 'var(--abyss-ink)', fontSize: '1rem' }}>{path.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>{path.description}</p>

                  <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: '#94A3B8' }}>
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {path.modules.length} modules</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {path.duration}</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> {(path.modules.length * 40).toLocaleString()} mins est.</span>
                  </div>

                  {progressValue > 0 ? (
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span style={{ color: '#64748B' }}>Progress</span>
                        <span style={{ color: 'var(--meridian-gold)' }}>{progressValue}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'var(--secondary)' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${progressValue}%`, background: 'var(--meridian-gold)' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--abyss-ink)' }}>
                      Start path <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Modules */}
        <div>
          <h2 className="mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--abyss-ink)' }}>Featured Modules</h2>
          <div id="featured-modules" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeaturedModules.map((module, i) => (
              <Link
                key={i}
                to="/learn#featured-modules"
                className="group flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md"
                style={{ background: '#FFFFFF', border: '1px solid var(--stone-ridge)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: module.free ? 'rgba(16,185,129,0.08)' : 'var(--secondary)' }}
                >
                  {module.free ? <Play className="w-4 h-4" style={{ color: '#10B981' }} /> : <Lock className="w-4 h-4" style={{ color: '#94A3B8' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium mb-1 group-hover:underline" style={{ color: 'var(--abyss-ink)' }}>{module.title}</h4>
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#94A3B8' }}>
                    <span>{module.stage}</span>
                    <span>·</span>
                    <span>{module.duration}</span>
                    {module.free && <span style={{ color: '#10B981', fontWeight: 600 }}>FREE</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
