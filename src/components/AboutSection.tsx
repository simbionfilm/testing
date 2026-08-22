import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SlotText } from './SlotText';

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSlotTriggered, setIsSlotTriggered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => setIsSlotTriggered(true),
      onLeaveBack: () => setIsSlotTriggered(false),
    });

    return () => st.kill();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] bg-black text-white flex flex-col justify-center px-6 md:px-16 py-20 z-40 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] select-none"
    >
      {/* Pinned / Floating Section Title - High contrast & always visible */}
      <div className="absolute top-24 md:top-28 left-6 md:left-12 z-50 pointer-events-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
        <h2
          id="about-title"
          className="text-2xl md:text-4xl font-extrabold tracking-tight text-white uppercase font-syne"
        >
          <SlotText text="ABOUT US" />
        </h2>
      </div>

      <div className="max-w-6xl w-full text-left space-y-6 md:space-y-8 my-auto pt-24 md:pt-32">
        <div className="clip-mask">
          <p className="text-lg md:text-2xl lg:text-3xl font-bold tracking-widest leading-tight uppercase font-syne">
            <span className="about-line interactive-el">
              SIMBION IS AN INDEPENDENT FILMMAKING BOUTIQUE BASED IN SOUTH JAKARTA, INDONESIA.
            </span>
          </p>
        </div>

        <div className="clip-mask">
          <p className="text-lg md:text-2xl lg:text-3xl font-bold tracking-widest leading-tight uppercase font-syne">
            <span className="about-line interactive-el">
              WE STARTED FROM THE GROUND UP, DRIVEN BY A GROUP OF PASSIONATE FILMMAKERS WITH A SHARED LOVE FOR THE CRAFT AND A CURIOSITY FOR WHERE IT CAN TAKE US.
            </span>
          </p>
        </div>

        <div className="clip-mask">
          <p className="text-lg md:text-2xl lg:text-3xl font-bold tracking-widest leading-tight uppercase font-syne">
            <span className="about-line interactive-el">
              WORKING INDEPENDENTLY HAS ALWAYS BEEN PART OF WHO WE ARE. IT KEEPS US CLOSE TO THE WORK, OPEN TO DIFFERENT PERSPECTIVES, AND CONNECTED TO THE PEOPLE WE WORK WITH.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
