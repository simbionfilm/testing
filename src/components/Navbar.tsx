import { SimbionLogo } from './SimbionLogo';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export function Navbar({ onOpenAdmin }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-[100] px-6 py-5 md:px-12 md:py-6 flex justify-between items-center pointer-events-none text-xs md:text-sm tracking-widest text-white select-none">
      <div className="pointer-events-auto flex items-center">
        <a
          href="#hero"
          className="group hover:opacity-90 transition-opacity interactive-el flex items-center"
          title="SIMBION FILM"
        >
          <SimbionLogo className="h-7 md:h-9 w-auto drop-shadow-lg" />
        </a>
      </div>

      <div className="pointer-events-auto flex items-center gap-4">
        <button
          onClick={onOpenAdmin}
          className="text-[10px] font-syne tracking-widest text-neutral-400 hover:text-white uppercase interactive-el px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 bg-black/40 backdrop-blur-md transition-colors"
          title="Admin CMS Settings"
        >
          CMS
        </button>
      </div>
    </nav>
  );
}
