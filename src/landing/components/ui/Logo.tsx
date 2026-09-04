import { cn } from "@/landing/lib/cn";

type LogoProps = {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
};

export function Logo({
  className,
  markClassName,
  showWordmark = true,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        className={cn("h-7 w-7 shrink-0", markClassName)}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M16 7.5L24.2 12.2V21.8L16 26.5L7.8 21.8V12.2L16 7.5Z"
          stroke="currentColor"
          className="text-accent"
          strokeWidth="1.15"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          d="M16 7.5V16M16 16L24.2 12.2M16 16L7.8 12.2M16 16V26.5"
          stroke="currentColor"
          className="text-accent"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="2.15" fill="currentColor" className="text-accent" />
        <circle cx="16" cy="7.5" r="1.35" fill="currentColor" className="text-accent" />
        <circle cx="24.2" cy="12.2" r="1.2" fill="currentColor" className="text-accent" />
        <circle cx="24.2" cy="21.8" r="1.2" fill="currentColor" className="text-accent" />
        <circle cx="7.8" cy="12.2" r="1.2" fill="currentColor" className="text-accent" />
        <circle cx="7.8" cy="21.8" r="1.2" fill="currentColor" className="text-accent" />
        <circle cx="16" cy="26.5" r="1.2" fill="currentColor" className="text-accent" />
      </svg>
      {showWordmark ? (
        <span className="text-[15px] font-semibold tracking-[0.04em] text-foreground">
          THALAMUS{" "}
          <span className="text-accent">AI</span>
        </span>
      ) : null}
    </span>
  );
}
