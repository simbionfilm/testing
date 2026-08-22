interface FilmGrainOverlayProps {
  opacity?: number;
}

export function FilmGrainOverlay({ opacity = 0.045 }: FilmGrainOverlayProps) {
  return (
    <div
      id="film-grain-overlay"
      className="fixed inset-0 pointer-events-none z-[85] overflow-hidden select-none"
      aria-hidden="true"
    >
      <div
        className="film-grain-layer absolute -inset-[100%] w-[300%] h-[300%] mix-blend-screen pointer-events-none will-change-transform"
        style={{ opacity }}
      />
    </div>
  );
}
