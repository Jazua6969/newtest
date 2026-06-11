import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollTrack() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    // 1. Measure the exact path length in SVG units
    const pathLength = path.getTotalLength();

    // 2. Set up initial dash properties
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    // 3. Create ScrollTrigger mapping strokeDashoffset to scroll progress
    const anim = gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15, // Smooth trailing follow
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return (
    <div className="hidden lg:block fixed top-0 left-6 w-6 h-screen pointer-events-none z-20">
      <svg
        className="w-full h-full"
        viewBox="0 0 24 1000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background track line (faint guide track) */}
        <path
          d="M 12,0 
             C 24,100  0,150  12,250
             C 24,350  0,400  12,500
             C 24,600  0,650  12,750
             C 24,850  0,900  12,1000"
          stroke="rgba(15, 23, 42, 0.04)"
          strokeWidth="1.5"
        />
        {/* Foreground scroll progress indicator (glowing gold) */}
        <path
          ref={pathRef}
          d="M 12,0 
             C 24,100  0,150  12,250
             C 24,350  0,400  12,500
             C 24,600  0,650  12,750
             C 24,850  0,900  12,1000"
          stroke="var(--meridian-gold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
