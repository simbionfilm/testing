import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CustomCursor } from './components/CustomCursor';
import { FilmGrainOverlay } from './components/FilmGrainOverlay';
import { Navbar } from './components/Navbar';
import { RecentReleaseBadge } from './components/RecentReleaseBadge';
import { HeroSection } from './components/HeroSection';
import { WeAreSection } from './components/WeAreSection';
import { SelectedWorksSection } from './components/SelectedWorksSection';
import { AboutSection } from './components/AboutSection';
import { ContactFooter } from './components/ContactFooter';
import { VideoModal } from './components/VideoModal';
import { ChatModal } from './components/ChatModal';
import { CmsAdminModal } from './components/CmsAdminModal';
import { CMSData } from './types';
import { DEFAULT_CMS_DATA } from './data/defaultWorks';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [cmsData, setCmsData] = useState<CMSData>(() => {
    try {
      const saved = localStorage.getItem('simbion_cms');
      return saved ? JSON.parse(saved) : DEFAULT_CMS_DATA;
    } catch {
      return DEFAULT_CMS_DATA;
    }
  });

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Initialize Lenis Smooth Scroll with Subtle Magnetic Snap
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let snapTimeout: ReturnType<typeof setTimeout> | null = null;
    let isSnapping = false;

    const cancelSnap = () => {
      if (snapTimeout) clearTimeout(snapTimeout);
      isSnapping = false;
    };

    window.addEventListener('wheel', cancelSnap, { passive: true });
    window.addEventListener('touchstart', cancelSnap, { passive: true });

    const onScroll = () => {
      ScrollTrigger.update();

      if (isSnapping) return;

      if (snapTimeout) clearTimeout(snapTimeout);

      snapTimeout = setTimeout(() => {
        const sectionSelectors = [
          '#hero',
          '#we-are-made',
          '#selected-work',
          '#about',
          '#contact',
        ];

        const sectionEls = sectionSelectors
          .map((sel) => document.querySelector<HTMLElement>(sel))
          .filter((el): el is HTMLElement => el !== null);

        if (!sectionEls.length) return;

        const currentScrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Check if inside selected-work horizontal pin scrub range
        const selectedWorkEl = document.querySelector<HTMLElement>('#selected-work');
        if (selectedWorkEl) {
          const rect = selectedWorkEl.getBoundingClientRect();
          const workTop = rect.top + currentScrollY;
          const workHeight = selectedWorkEl.offsetHeight;
          if (
            workHeight > windowHeight * 1.5 &&
            currentScrollY > workTop + windowHeight * 0.4 &&
            currentScrollY < workTop + workHeight - windowHeight * 0.4
          ) {
            // Keep user free to explore horizontal reel without jarring snaps
            return;
          }
        }

        // Find the nearest section to gently align into viewport center
        let bestTarget: { targetScroll: number; diff: number } | null = null;

        for (const el of sectionEls) {
          const rect = el.getBoundingClientRect();
          const elTop = rect.top + currentScrollY;
          const elHeight = el.offsetHeight;

          let targetY = elTop;
          if (elHeight < windowHeight) {
            targetY = elTop - (windowHeight - elHeight) / 2;
          }

          targetY = Math.max(
            0,
            Math.min(
              document.documentElement.scrollHeight - windowHeight,
              targetY
            )
          );

          const diff = Math.abs(currentScrollY - targetY);

          // Magnetic attraction zone: gently snaps if close enough (diff < 42% of screen)
          if (diff > 8 && diff < windowHeight * 0.42) {
            if (!bestTarget || diff < bestTarget.diff) {
              bestTarget = { targetScroll: targetY, diff };
            }
          }
        }

        if (bestTarget) {
          isSnapping = true;
          lenis.scrollTo(bestTarget.targetScroll, {
            duration: 1.4,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            lock: false,
            onComplete: () => {
              setTimeout(() => {
                isSnapping = false;
              }, 80);
            },
          });
        }
      }, 220);
    };

    lenis.on('scroll', onScroll);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Top progress bar with GSAP
    gsap.to('#progress-bar', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
      },
    });

    return () => {
      if (snapTimeout) clearTimeout(snapTimeout);
      window.removeEventListener('wheel', cancelSnap);
      window.removeEventListener('touchstart', cancelSnap);
      lenis.destroy();
    };
  }, []);

  // Secret keyword listener ("fundamental")
  useEffect(() => {
    let typedBuffer = '';
    const SECRET_KEYWORD = 'fundamental';

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT'
      ) {
        return;
      }

      typedBuffer += e.key.toLowerCase();
      if (typedBuffer.length > 20) typedBuffer = typedBuffer.slice(-20);
      if (typedBuffer.includes(SECRET_KEYWORD)) {
        typedBuffer = '';
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveCMS = (newData: CMSData) => {
    setCmsData(newData);
    localStorage.setItem('simbion_cms', JSON.stringify(newData));
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#0616C6] selection:text-white relative">
      {/* Cinematic Film Grain / Noise Texture Overlay */}
      <FilmGrainOverlay opacity={0.04} />

      {/* Custom Elliptical Difference Cursor */}
      <CustomCursor />

      {/* Top Scroll Indicator */}
      <div
        id="progress-bar"
        className="fixed top-0 left-0 h-1 bg-[#0616C6] w-full origin-left scale-x-0 z-[100]"
      />

      {/* Top Nav */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* New Release Floating Badge */}
      <RecentReleaseBadge
        recentRelease={cmsData.recentRelease}
        onPlayVideo={(id) => setActiveVideoId(id)}
      />

      {/* Core Showcase Experience */}
      <main>
        <HeroSection />
        <WeAreSection />
        <SelectedWorksSection
          works={cmsData.works}
          onPlayVideo={(id) => setActiveVideoId(id)}
        />
        <AboutSection />
      </main>

      {/* Contact & PPM Quote Footer */}
      <ContactFooter />

      {/* Interactive Modals */}
      <VideoModal
        videoId={activeVideoId}
        onClose={() => setActiveVideoId(null)}
      />

      <ChatModal
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
      />

      <CmsAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        cmsData={cmsData}
        onSave={handleSaveCMS}
      />
    </div>
  );
}
