import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function WeAreSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const wraps = section.querySelectorAll<HTMLElement>('.we-are-word-wrap');
    const words = section.querySelectorAll<HTMLElement>('.we-are-word');
    
    gsap.fromTo(
      wraps,
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.08,
      }
    );

    // Dynamic scroll direction & velocity tilt response
    let lastY = window.scrollY;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastY;
      lastY = currentY;

      const skewVal = Math.max(-6, Math.min(6, deltaY * 0.12));

      words.forEach((w, i) => {
        gsap.to(w, {
          skewX: skewVal * (i % 2 === 0 ? 1 : -1),
          duration: 0.25,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      });

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        words.forEach((w) => {
          gsap.to(w, {
            skewX: 0,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
      }, 90);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timeout) clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      id="we-are-made"
      ref={sectionRef}
      className="relative w-full h-[100dvh] bg-black flex flex-col justify-center items-center px-6 md:px-24 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-hidden select-none"
    >
      <div className="we-are-container relative z-25 my-auto flex flex-col items-center justify-center gap-2 md:gap-4 select-none w-full max-w-7xl">
        <div className="flex justify-center gap-x-3 md:gap-x-6 clip-mask">
          <div className="we-are-word-wrap">
            <span className="we-are-word font-black uppercase text-[11vw] md:text-[9vw] leading-[1.1] tracking-tighter text-white italic transform -rotate-1 cursor-none interactive-el font-syne">
              WE
            </span>
          </div>
          <div className="we-are-word-wrap">
            <span className="we-are-word font-black uppercase text-[11vw] md:text-[9vw] leading-[1.1] tracking-tighter text-white italic transform -rotate-1 cursor-none interactive-el font-syne">
              ARE
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-x-3 md:gap-x-6 clip-mask mt-1 md:mt-3">
          <div className="we-are-word-wrap">
            <span className="we-are-word font-black uppercase text-[11vw] md:text-[9vw] leading-[1.1] tracking-tighter text-white italic transform -rotate-1 cursor-none interactive-el font-syne">
              WHAT
            </span>
          </div>
          <div className="we-are-word-wrap">
            <span className="we-are-word font-black uppercase text-[11vw] md:text-[9vw] leading-[1.1] tracking-tighter text-white italic transform -rotate-1 cursor-none interactive-el font-syne">
              WE'VE
            </span>
          </div>
          <div className="we-are-word-wrap">
            <span className="we-are-word font-black uppercase text-[11vw] md:text-[9vw] leading-[1.1] tracking-tighter text-white italic transform -rotate-1 cursor-none interactive-el font-syne">
              MADE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
