import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowRight, BookOpen, CheckCircle, Clock, ChevronRight, Play, Lock } from 'lucide-react';
import {
  getModuleBySlug,
  getPathBySlug,
  getModuleStatus,
  getNextUnfinishedModule,
  getPathProgress,
  loadLearningProgress,
  makeModuleKey,
  saveLearningProgress,
  LearningProgressState,
} from '../data/learningPaths';

export function LearningModulePage() {
  const { pathSlug, moduleSlug } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<LearningProgressState>(() => loadLearningProgress());

  const path = useMemo(() => (pathSlug ? getPathBySlug(pathSlug) : undefined), [pathSlug]);
  const module = useMemo(() => (pathSlug && moduleSlug ? getModuleBySlug(pathSlug, moduleSlug) : undefined), [pathSlug, moduleSlug]);

  useEffect(() => {
    if (!pathSlug || !moduleSlug) return;
    setProgress(prev => {
      const next = {
        ...prev,
        activeLearningPath: pathSlug,
        lastVisitedModule: makeModuleKey(pathSlug, moduleSlug),
      };
      saveLearningProgress(next);
      return next;
    });
  }, [pathSlug, moduleSlug]);

  useEffect(() => {
    saveLearningProgress(progress);
  }, [progress]);

  if (!pathSlug || !moduleSlug || !path || !module) {
    return (
      <div style={{ background: 'transparent', minHeight: '100vh', fontFamily: 'var(--font-ui)' }} className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--abyss-ink)' }}>
          Learning Module Not Found
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
          The learning path or lesson you requested does not exist. Please return to the learning hub and select an available module.
        </p>
        <Link to="/learn" className="px-5 py-3 rounded-lg text-sm font-semibold text-white transition-all" style={{ background: 'var(--abyss-ink)' }}>
          Back to Learning Hub
        </Link>
      </div>
    );
  }

  const moduleKey = makeModuleKey(path.slug, module.slug);
  const moduleStatus = getModuleStatus(path, module.slug, progress);
  const pathProgress = getPathProgress(path, progress);
  const nextUnfinishedModule = getNextUnfinishedModule(path, progress) ?? path.modules[0];
  const isCompleted = progress.completedModules.includes(moduleKey);
  const isUnlocked = moduleStatus !== 'Locked';
  const moduleIndex = path.modules.findIndex(item => item.slug === module.slug);
  const completedCount = path.modules.filter(item => progress.completedModules.includes(makeModuleKey(path.slug, item.slug))).length;

  const handleMarkComplete = () => {
    if (isCompleted) return;
    setProgress(prev => {
      const completedModules = [...prev.completedModules, moduleKey];
      const next = {
        ...prev,
        completedModules,
        lastVisitedModule: moduleKey,
        totalLearningTimeMinutes: prev.totalLearningTimeMinutes + module.minutes,
      };
      saveLearningProgress(next);
      return next;
    });
  };

  const handleContinue = () => {
    navigate(`/learn/${path.slug}/${nextUnfinishedModule.slug}`);
  };

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', fontFamily: 'var(--font-ui)' }}>
      <div style={{ background: 'var(--abyss-ink)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-12 pb-10">
          <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'rgba(243,242,237,0.4)' }}>
            <Link to="/learn" className="hover:underline" style={{ color: 'rgba(243,242,237,0.4)' }}>Learning Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{path.title}</span>
            <ChevronRight className="w-3 h-3" />
            <span>{module.title}</span>
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--meridian-gold)' }}>Learning Module</p>
          <h1 className="mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: '#FFFFFF' }}>
            {module.title}
          </h1>
          <p style={{ color: 'rgba(243,242,237,0.6)', maxWidth: '40rem' }}>
            {module.description}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8">
          <main className="space-y-8">
            <section className="rounded-xl border p-6" style={{ background: '#FFFFFF', borderColor: 'var(--stone-ridge)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--abyss-ink)' }}>{path.title}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{completedCount} of {path.modules.length} modules complete · {pathProgress}% progress</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--meridian-gold)' }}>
                    <CheckCircle className="w-3.5 h-3.5" /> {moduleStatus}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(59,130,246,0.08)', color: '#3B82F6' }}>
                    <Clock className="w-3.5 h-3.5" /> {module.duration}
                  </span>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--abyss-ink)' }}>What you'll learn</h2>
                  <ul className="space-y-2 text-sm" style={{ color: '#64748B' }}>
                    {module.objectives.map(objective => (
                      <li key={objective} className="flex items-start gap-2">
                        <span className="mt-1 text-meridian-gold">•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--abyss-ink)' }}>Prerequisites</h2>
                  <div className="flex flex-wrap gap-2">
                    {module.prerequisites.map(prereq => (
                      <span key={prereq} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(243,242,237,0.7)', color: 'var(--abyss-ink)' }}>
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {module.sections.map(section => (
              <section key={section.heading} className="rounded-xl border p-6" style={{ background: '#FFFFFF', borderColor: 'var(--stone-ridge)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--abyss-ink)' }}>{section.heading}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{section.body}</p>
                {section.code && (
                  <div className="mt-4 rounded-xl overflow-hidden" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="px-4 py-3 text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)' }}>
                      {section.codeLanguage || 'Code'}
                    </div>
                    <pre className="p-4 text-sm overflow-x-auto" style={{ fontFamily: 'var(--font-mono)', color: '#E6EDF3', lineHeight: 1.6 }}>
                      {section.code}
                    </pre>
                  </div>
                )}
              </section>
            ))}

            <section className="rounded-xl border p-6" style={{ background: '#FFFFFF', borderColor: 'var(--stone-ridge)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--abyss-ink)' }}>Module Summary</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{module.summary}</p>
            </section>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleMarkComplete}
                className="rounded-xl px-5 py-3 text-sm font-semibold transition-all"
                style={{ background: isCompleted ? 'rgba(16,185,129,0.12)' : 'var(--abyss-ink)', color: isCompleted ? 'var(--abyss-ink)' : '#FFFFFF' }}
              >
                {isCompleted ? 'Module Complete' : 'Mark Module Complete'}
              </button>
              <button
                onClick={handleContinue}
                className="rounded-xl px-5 py-3 text-sm font-semibold border transition-all"
                style={{ borderColor: 'var(--stone-ridge)', background: '#FFFFFF', color: 'var(--abyss-ink)' }}
              >
                Continue to next lesson <ArrowRight className="w-4 h-4 inline-block ml-1" />
              </button>
            </div>
          </main>

          <aside className="space-y-6">
            <section className="rounded-xl border p-6" style={{ background: '#FFFFFF', borderColor: 'var(--stone-ridge)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--abyss-ink)' }}>Path Progress</h3>
              <div className="mb-4">
                <div className="w-full h-2.5 rounded-full" style={{ background: 'var(--secondary)' }}>
                  <div className="h-2.5 rounded-full" style={{ width: `${pathProgress}%`, background: 'var(--meridian-gold)' }} />
                </div>
                <p className="text-xs mt-2" style={{ color: '#64748B' }}>{pathProgress}% complete • {completedCount}/{path.modules.length} modules done</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: '#64748B' }}>
                <div className="rounded-xl p-3" style={{ background: 'rgba(243,242,237,0.65)' }}>
                  <p className="font-semibold" style={{ color: 'var(--abyss-ink)' }}>Path</p>
                  <p>{path.title}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'rgba(243,242,237,0.65)' }}>
                  <p className="font-semibold" style={{ color: 'var(--abyss-ink)' }}>Total Study</p>
                  <p>{Math.floor(progress.totalLearningTimeMinutes / 60)}h {progress.totalLearningTimeMinutes % 60}m</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border p-6" style={{ background: '#FFFFFF', borderColor: 'var(--stone-ridge)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--abyss-ink)' }}>Lesson Queue</h3>
              <div className="space-y-3">
                {path.modules.map((item, index) => {
                  const itemKey = makeModuleKey(path.slug, item.slug);
                  const itemStatus = progress.completedModules.includes(itemKey) ? 'Completed' : index === 0 || progress.completedModules.includes(makeModuleKey(path.slug, path.modules[index - 1]?.slug)) ? 'Available' : 'Locked';
                  return (
                    <Link
                      key={item.slug}
                      to={itemStatus === 'Locked' ? '/learn' : `/learn/${path.slug}/${item.slug}`}
                      className="flex items-center justify-between gap-3 rounded-3xl border px-4 py-3 text-sm transition-all"
                      style={{ background: '#F8FAFC', borderColor: 'var(--stone-ridge)', color: 'var(--abyss-ink)' }}
                    >
                      <span>{item.title}</span>
                      <span className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: itemStatus === 'Completed' ? '#10B981' : '#64748B' }}>
                        {itemStatus === 'Completed' ? <CheckCircle className="w-3.5 h-3.5" /> : itemStatus === 'Locked' ? <Lock className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {itemStatus}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
