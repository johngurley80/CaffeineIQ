type IconName = "cup" | "clock" | "moon" | "spark" | "arrow" | "check" | "ring" | "leaf" | "drop" | "lock";

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className = "h-4 w-4" }: IconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...common}>
      {name === "cup" && (
        <>
          <path d="M6 8h10v6a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8Z" />
          <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
          <path d="M7 4c1 1 1 2 0 3M11 4c1 1 1 2 0 3M15 4c1 1 1 2 0 3" />
        </>
      )}
      {name === "clock" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5l3 2" />
        </>
      )}
      {name === "moon" && <path d="M18 15.5A7.5 7.5 0 0 1 8.5 6 7.5 7.5 0 1 0 18 15.5Z" />}
      {name === "spark" && (
        <>
          <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" />
          <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
        </>
      )}
      {name === "arrow" && (
        <>
          <path d="M5 12h13" />
          <path d="M13 6l6 6-6 6" />
        </>
      )}
      {name === "check" && <path d="M5 12.5l4.2 4.2L19 7" />}
      {name === "ring" && (
        <>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
      {name === "leaf" && (
        <>
          <path d="M5 19c9 0 14-5 14-14-9 0-14 5-14 14Z" />
          <path d="M5 19 15 9" />
        </>
      )}
      {name === "drop" && <path d="M12 3.5s6 6.5 6 11A6 6 0 0 1 6 14.5c0-4.5 6-11 6-11Z" />}
      {name === "lock" && (
        <>
          <rect x="6.5" y="10.5" width="11" height="9" rx="2" />
          <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
        </>
      )}
    </svg>
  );
}
