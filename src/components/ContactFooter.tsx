import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ContactFooter() {
  const footerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const quote = quoteRef.current;
    if (!footer || !quote) return;

    const st = ScrollTrigger.create({
      trigger: footer,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(quote, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="relative w-full h-[100dvh] bg-black flex flex-col justify-between px-6 md:px-12 py-16 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] select-none"
    >
      <div className="relative z-10 flex flex-col items-center text-center w-full my-auto">
        <div className="flex flex-col w-full font-black leading-[0.9] tracking-tighter">
          <div className="clip-mask w-full flex justify-center">
            <span className="contact-title-line font-syne block uppercase text-[13vw] md:text-[9vw] text-white interactive-el hover-text-fx transition-colors cursor-none">
              READY TO
            </span>
          </div>
          <div className="clip-mask w-full flex justify-center">
            <span className="contact-title-line font-syne block uppercase text-[13vw] md:text-[9vw] text-white interactive-el hover-text-fx transition-colors cursor-none">
              ROLL?
            </span>
          </div>
        </div>

        <p
          ref={quoteRef}
          className="text-xs md:text-sm font-mono tracking-widest text-white transform translate-y-6 opacity-0 mt-8 interactive-el hover-text-fx transition-all"
        >
          ( Guess we’ll see you at the first PPM )
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 z-10 text-[11px] font-mono tracking-widest text-neutral-400">
        <div className="flex gap-8">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=play@simbionfilm.com"
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-el hover-text-fx uppercase text-white"
          >
            play@simbionfilm.com
          </a>
        </div>

        <div className="flex gap-8">
          <a
            href="https://www.instagram.com/simbionfilm/"
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-el hover-text-fx uppercase text-white"
          >
            INSTAGRAM
          </a>
          <a
            href="https://id.linkedin.com/company/simbion-production"
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-el hover-text-fx uppercase text-white"
          >
            LINKEDIN
          </a>
        </div>

        <div className="hover-text-fx uppercase text-white">&copy; 2026 Simbion Film</div>
      </div>
    </footer>
  );
}
