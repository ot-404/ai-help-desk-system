export default function Logo({ size = 28, withWordmark = true, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#0E1219" />
        <rect x="3.5" y="3.5" width="25" height="25" rx="6.5" fill="none" stroke="#222A36" strokeWidth="1" />
        <path
          d="M16 7 L17.95 13.2 L24.3 13.6 L19.35 17.55 L21 23.7 L16 20.2 L11 23.7 L12.65 17.55 L7.7 13.6 L14.05 13.2 Z"
          fill="#2DD4BF"
        />
        <circle cx="16" cy="15.6" r="2" fill="#0E1219" />
      </svg>
      {withWordmark && (
        <span className="text-ink font-semibold tracking-tight" style={{ fontSize: size * 0.62 }}>
          Lumo
        </span>
      )}
    </span>
  );
}
