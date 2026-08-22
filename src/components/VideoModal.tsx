import { useEffect } from 'react';

interface VideoModalProps {
  videoId: string | null;
  onClose: () => void;
}

export function VideoModal({ videoId, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (videoId) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [videoId, onClose]);

  if (!videoId) return null;

  return (
    <div
      id="video-modal"
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-8 text-white text-xs font-mono tracking-[0.3em] uppercase hover:opacity-70 transition-opacity z-10 p-4 interactive-el"
      >
        CLOSE [X]
      </button>

      <div
        className="w-[90vw] md:w-[75vw] aspect-video max-w-5xl bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl relative border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="Simbion Film Video Showcase"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
