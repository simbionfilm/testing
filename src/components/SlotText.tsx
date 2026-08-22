import { useState, useEffect, useRef, useId } from 'react';
import gsap from 'gsap';

interface SlotTextProps {
  text: string;
  className?: string;
}

export function SlotText({ text, className = '' }: SlotTextProps) {
  const baseId = useId();
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Words and character separation to maintain correct word wrap
  const words = text.split(' ');
  const totalChars = text.replace(/\s/g, '').length;

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let isTicking = false;

    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const deltaY = currentScrollY - lastScrollY;
          lastScrollY = currentScrollY;

          // If stationary, do nothing
          if (Math.abs(deltaY) < 0.5) {
            isTicking = false;
            return;
          }

          // Calculate displacement based on direction and speed
          // Limit max shift to 33.33% (1 whole slot step)
          const direction = deltaY > 0 ? 1 : -1; // 1 = scrolling down, -1 = scrolling up
          const rawShift = (deltaY / 40) * 18; // responsive roll displacement
          const clampedShiftPercent = Math.max(-33.33, Math.min(33.33, rawShift));

          // Animate each letter rolling with a staggered cascade
          letterRefs.current.forEach((el, idx) => {
            if (!el) return;

            // Sequential stagger delay based on letter index
            const staggerDelay = direction === 1 ? idx * 0.012 : (totalChars - idx) * 0.012;

            gsap.to(el, {
              yPercent: -33.333 + clampedShiftPercent,
              duration: 0.22,
              delay: staggerDelay,
              ease: 'power1.out',
              overwrite: 'auto',
            });
          });

          // Smoothly spring back to middle resting layer (-33.333%) when scrolling stops
          if (scrollTimeout) clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            letterRefs.current.forEach((el, idx) => {
              if (!el) return;
              gsap.to(el, {
                yPercent: -33.333,
                duration: 0.6,
                delay: idx * 0.015,
                ease: 'elastic.out(1.1, 0.45)',
                overwrite: 'auto',
              });
            });
          }, 70);

          isTicking = false;
        });
        isTicking = true;
      }
    };

    // Set initial position precisely to center layer (-33.333%)
    letterRefs.current.forEach((el) => {
      if (el) gsap.set(el, { yPercent: -33.333 });
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [totalChars]);

  // Hover kinetic flip roll (rolls from center -33.333% to top -66.666% in one crisp motion)
  useEffect(() => {
    letterRefs.current.forEach((el, idx) => {
      if (!el) return;
      const hoverDelay = idx * 0.02;
      gsap.to(el, {
        yPercent: isHovered ? -66.666 : -33.333,
        duration: 0.45,
        delay: hoverDelay,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  }, [isHovered]);

  let charCounter = 0;

  return (
    <span
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-flex flex-wrap items-baseline gap-x-[0.28em] cursor-pointer interactive-el select-none ${className}`}
      style={{ verticalAlign: 'baseline' }}
    >
      {words.map((word, wordIdx) => {
        const chars = word.split('');
        return (
          <span
            key={`${baseId}-w-${wordIdx}`}
            className="inline-flex items-baseline whitespace-nowrap"
            style={{ verticalAlign: 'baseline' }}
          >
            {chars.map((char, charIdx) => {
              const currentIdx = charCounter++;

              return (
                <span
                  key={`${baseId}-char-${wordIdx}-${charIdx}`}
                  className="relative inline-flex flex-col overflow-hidden h-[1.12em] leading-none align-baseline px-[0.01em]"
                  style={{ verticalAlign: 'baseline' }}
                >
                  <span
                    ref={(el) => {
                      letterRefs.current[currentIdx] = el;
                    }}
                    className="flex flex-col will-change-transform"
                    style={{ transform: 'translateY(-33.333%)' }}
                  >
                    {/* Layer 1: Upper Roll Duplicate (Monochrome White) */}
                    <span className="block h-[1.12em] leading-none text-white font-extrabold select-none">
                      {char}
                    </span>

                    {/* Layer 2: Default Center Visible Character (Monochrome White) */}
                    <span className="block h-[1.12em] leading-none text-white font-extrabold select-none">
                      {char}
                    </span>

                    {/* Layer 3: Lower Roll Duplicate (Monochrome White) */}
                    <span className="block h-[1.12em] leading-none text-white font-extrabold select-none">
                      {char}
                    </span>
                  </span>
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
