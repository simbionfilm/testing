import { RecentRelease } from '../types';

interface RecentReleaseBadgeProps {
  recentRelease: RecentRelease;
  onPlayVideo: (videoId: string) => void;
}

export function RecentReleaseBadge({ recentRelease, onPlayVideo }: RecentReleaseBadgeProps) {
  return (
    <div
      onClick={() => {
        if (recentRelease.videoId) {
          onPlayVideo(recentRelease.videoId);
        } else if (recentRelease.link) {
          window.open(recentRelease.link, '_blank');
        }
      }}
      className="fixed top-5 right-6 md:right-12 z-[105] flex items-center gap-3 group cursor-pointer interactive-el transition-all select-none"
    >
      <div className="text-right hidden sm:block">
        <span className="text-xs md:text-sm tracking-[0.15em] font-bold text-white block uppercase font-syne">
          NEW RELEASE
        </span>
        <span className="text-[11px] font-bold tracking-tight text-white block uppercase group-hover:text-[#0616C6] transition-colors max-w-[200px] truncate font-syne">
          {recentRelease.title}
        </span>
      </div>

      <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0616C6] shadow-2xl flex items-center justify-center animate-[spin_6s_linear_infinite] group-hover:scale-110 transition-transform">
        <div className="absolute inset-1 rounded-full border border-white/20 pointer-events-none" />
        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden border border-white/20 relative z-10 bg-black">
          <img
            src={`https://img.youtube.com/vi/${recentRelease.videoId}/maxresdefault.jpg`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${recentRelease.videoId}/hqdefault.jpg`;
            }}
            alt={recentRelease.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute w-1.5 h-1.5 bg-black rounded-full z-20" />
      </div>
    </div>
  );
}
