interface SimbionLogoProps {
  className?: string;
}

export function SimbionLogo({ className = 'h-7 md:h-8 w-auto' }: SimbionLogoProps) {
  return (
    <svg
      viewBox="0 0 360 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none transition-transform duration-300 group-hover:scale-105`}
      aria-label="SIMBION"
    >
      {/* Black Ellipse with sleek crisp border */}
      <ellipse
        cx="180"
        cy="55"
        rx="175"
        ry="50"
        fill="#000000"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="2.5"
      />
      {/* White Bold Typographic Mark */}
      <text
        x="180"
        y="58"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#FFFFFF"
        fontFamily="'Google Sans', 'Syne', -apple-system, sans-serif"
        fontWeight="800"
        fontSize="64"
        letterSpacing="-0.03em"
        className="font-syne select-none"
      >
        SIMBION
      </text>
    </svg>
  );
}
