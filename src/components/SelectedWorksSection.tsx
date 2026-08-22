import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WorkItem } from '../types';
import { SlotText } from './SlotText';

gsap.registerPlugin(ScrollTrigger);

interface SelectedWorksSectionProps {
  works: WorkItem[];
  onPlayVideo: (videoId: string) => void;
}

interface MagneticWorkCardProps {
  key?: string;
  item: WorkItem;
  idx: number;
  rowSeed: number;
  baseTopPercent: number;
  onPlayVideo: (videoId: string) => void;
}

function MagneticWorkCard({ item, idx, rowSeed, baseTopPercent, onPlayVideo }: MagneticWorkCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Deterministic seed for layout
  const seed = rowSeed * 13 + idx * 17;
  
  // Horizontal offset (-4vw to +5vw)
  const xJitter = ((seed * 23) % 10) - 5;
  const leftPosVw = 110 + idx * 23 + xJitter;

  // Vertical offset (-7% to +7%)
  const yJitter = ((seed * 31) % 14) - 7;
  const topPercent = Math.max(5, Math.min(82, baseTopPercent + yJitter));

  // Initial natural tilt rotation (-8deg to +8deg)
  const initialRotation = ((seed * 41) % 16) - 8;

  // Varying widths
  const widthClass = idx % 3 === 0 
    ? 'w-[48vw] md:w-[19vw]' 
    : idx % 3 === 1 
      ? 'w-[44vw] md:w-[17vw]' 
      : 'w-[52vw] md:w-[21vw]';

  // Parallax factors
  const mx = ((seed * 7) % 9) - 4;
  const my = ((seed * 11) % 9) - 4;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Magnetic pull calculation
    const magnetLimitX = rect.width * 0.16; // Max horizontal movement range
    const magnetLimitY = rect.height * 0.16; // Max vertical movement range
    const pullRate = 0.28;

    const moveX = Math.max(-magnetLimitX, Math.min(magnetLimitX, deltaX * pullRate));
    const moveY = Math.max(-magnetLimitY, Math.min(magnetLimitY, deltaY * pullRate));

    // Magnetic movement on the image inside the container
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        x: moveX * 1.3,
        y: moveY * 1.3,
        scale: 1.14,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    // Subtle magnetic attraction on the card itself
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        x: moveX * 0.45,
        y: moveY * 0.45,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = () => {
    // Reset image position smoothly on cursor exit
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        x: 0,
        y: 0,
        scale: 1.05,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }

    // Reset card position smoothly
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };

  return (
    <div
      key={item.id || `${item.videoId}-${idx}`}
      className={`gallery-item ${widthClass}`}
      style={{
        left: `${leftPosVw}vw`,
        top: `${topPercent}%`,
        zIndex: 10 + (idx % 5),
      }}
    >
      <div
        className="parallax-wrap w-full h-full"
        data-mx={mx === 0 ? 3 : mx}
        data-my={my === 0 ? -3 : my}
      >
        <div
          className="idle-float w-full h-full"
          style={{ transform: `rotate(${initialRotation}deg)` }}
        >
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-full group"
          >
            <div
              ref={cardRef}
              onClick={() => onPlayVideo(item.videoId)}
              className="gallery-item-inner block relative w-full aspect-video overflow-hidden bg-black rounded-none cursor-pointer interactive-el transition-transform duration-500 group-hover:scale-125 group-hover:!rotate-0 group-hover:z-50 shadow-2xl will-change-transform"
            >
              <img
                ref={imgRef}
                src={`https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`}
                alt={item.title}
                className="w-full h-full object-cover select-none rounded-none scale-105 will-change-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`;
                }}
              />

              {/* Play Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 bg-white text-black flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Bottom Overlay Details on Hover */}
              <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-left pointer-events-none z-20">
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent -z-10" />
                <span className="text-[8px] text-gray-300 tracking-[0.2em] font-bold block uppercase font-syne">
                  {item.year} — {item.artist}
                </span>
                <h3 className="text-[11px] md:text-xs font-bold tracking-tight text-white mt-0.5 uppercase truncate font-syne">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SelectedWorksSection({ works, onPlayVideo }: SelectedWorksSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isSlotTriggered, setIsSlotTriggered] = useState(false);

  const row1 = useMemo(() => works.filter((w) => w.row === 1), [works]);
  const row2 = useMemo(() => works.filter((w) => w.row === 2), [works]);
  const row3 = useMemo(() => works.filter((w) => w.row === 3), [works]);

  const maxItems = Math.max(row1.length, row2.length, row3.length, 1);
  const dynamicWidthVw = 110 + maxItems * 25 + 90;

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    // Trigger slot machine effect on entry
    const stSlot = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => setIsSlotTriggered(true),
      onLeaveBack: () => setIsSlotTriggered(false),
    });

    // Pinned horizontal track animation
    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 250),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(track.scrollWidth * 1.1, window.innerWidth * 2.2)}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Soft subtle opacity shift instead of disappearing completely
    const titleFade = gsap.to('#selected-title-wrap', {
      opacity: 0.85,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=300',
        scrub: 0.8,
      },
    });

    // Continuous dynamic organic idle floating for all items
    const idleTweens: gsap.core.Tween[] = [];
    const floatElements = section.querySelectorAll<HTMLElement>('.idle-float');

    floatElements.forEach((el, index) => {
      // Deterministic pseudo-random values based on index
      const seed = index + 1;
      const randX = ((seed * 47) % 110) - 55; // -55px to +55px
      const randY = ((seed * 73) % 110) - 55; // -55px to +55px
      const randRot = ((seed * 29) % 22) - 11; // -11deg to +11deg
      const randDur = 3.2 + ((seed * 17) % 30) / 10; // 3.2s to 6.2s
      const randDelay = ((seed * 13) % 20) / 10; // 0s to 2s

      const t = gsap.to(el, {
        x: `+=${randX}`,
        y: `+=${randY}`,
        rotation: `+=${randRot}`,
        duration: randDur,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: randDelay,
      });
      idleTweens.push(t);
    });

    // Mouse parallax tilt on items
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      const parallaxWraps = section.querySelectorAll<HTMLElement>('.parallax-wrap');
      parallaxWraps.forEach((wrap) => {
        const mx = parseFloat(wrap.dataset.mx || '0');
        const my = parseFloat(wrap.dataset.my || '0');
        gsap.to(wrap, {
          x: x * mx * 10,
          y: y * my * 10,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      stSlot.kill();
      tween.kill();
      titleFade.kill();
      idleTweens.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [works, dynamicWidthVw]);

  return (
    <section
      id="selected-work"
      ref={sectionRef}
      className="relative bg-black z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] w-full h-[100dvh] overflow-hidden flex flex-col select-none"
    >
      {/* Title Pinned Top Left - High contrast & always visible */}
      <div
        id="selected-title-wrap"
        className="absolute top-24 md:top-28 left-6 md:left-12 z-50 pointer-events-auto will-change-transform drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
      >
        <h2
          id="selected-title"
          className="text-2xl md:text-4xl font-extrabold tracking-tight text-white uppercase font-syne"
        >
          <SlotText text="SELECTED WORKS" />
        </h2>
      </div>

      {/* Horizontal Moving Reel Track with Scattered Floating Cards */}
      <div className="relative w-full flex-1 overflow-hidden">
        <div
          ref={trackRef}
          className="film-track"
          id="film-track"
          style={{ width: `${dynamicWidthVw}vw` }}
        >
          {row1.map((item, idx) => (
            <MagneticWorkCard
              key={item.id || `${item.videoId}-1-${idx}`}
              item={item}
              idx={idx}
              rowSeed={1}
              baseTopPercent={13}
              onPlayVideo={onPlayVideo}
            />
          ))}
          {row2.map((item, idx) => (
            <MagneticWorkCard
              key={item.id || `${item.videoId}-2-${idx}`}
              item={item}
              idx={idx}
              rowSeed={2}
              baseTopPercent={41}
              onPlayVideo={onPlayVideo}
            />
          ))}
          {row3.map((item, idx) => (
            <MagneticWorkCard
              key={item.id || `${item.videoId}-3-${idx}`}
              item={item}
              idx={idx}
              rowSeed={3}
              baseTopPercent={69}
              onPlayVideo={onPlayVideo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
