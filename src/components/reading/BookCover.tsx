const palettes: Record<
  string,
  { background: string; ink: string; accent: string }
> = {
  Fiction: { background: "#e9d9be", ink: "#324d3e", accent: "#b97750" },
  "Non-Fiction": { background: "#2b5145", ink: "#faf2df", accent: "#c0b281" },
  "Sci-Fi": { background: "#25364e", ink: "#f0e8d9", accent: "#a7b9cd" },
  Biography: { background: "#a66a52", ink: "#fff0d7", accent: "#e1b89d" },
  Other: { background: "#d8dfcd", ink: "#3f5546", accent: "#9caf87" },
};

function titleLines(title: string) {
  const lines: string[] = [];
  let line = "";
  for (const word of title.trim().split(/\s+/)) {
    if ((line + " " + word).trim().length > 13 && line) {
      lines.push(line);
      line = word;
    } else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  return lines
    .slice(0, 4)
    .map((text, index) =>
      text.length > 15 || (index === 3 && lines.length > 4)
        ? text.slice(0, 12) + "…"
        : text,
    );
}

/** An original illustrated cover, not a publisher's official book jacket. */
export function BookCover({ title, genre }: { title: string; genre: string }) {
  const palette = palettes[genre] ?? palettes.Other;
  return (
    <figure className="reading-cover" title="Illustrated book cover">
      <svg
        viewBox="0 0 116 160"
        role="img"
        aria-label={`Illustrated cover for ${title}`}
      >
        <rect width="116" height="160" rx="5" fill={palette.background} />
        <path
          d="M4 0v160"
          stroke={palette.ink}
          strokeOpacity=".14"
          strokeWidth="8"
        />
        <rect
          x="13"
          y="12"
          width="90"
          height="136"
          rx="1"
          fill="none"
          stroke={palette.ink}
          strokeOpacity=".35"
        />
        <text
          x="23"
          y="28"
          fill={palette.ink}
          fontFamily="Arial, sans-serif"
          fontSize="5.5"
          letterSpacing="1.3"
        >
          THE READING JOURNAL
        </text>
        <path d="M23 38h27" stroke={palette.accent} strokeWidth="2" />
        <text
          x="23"
          y="57"
          fill={palette.ink}
          fontFamily="Georgia, serif"
          fontSize="11.5"
        >
          {titleLines(title).map((line, index) => (
            <tspan x="23" dy={index ? 14 : 0} key={index}>
              {line}
            </tspan>
          ))}
        </text>
        {genre === "Sci-Fi" ? (
          <g fill="none" stroke={palette.accent} strokeWidth="1.4">
            <circle cx="64" cy="121" r="13" />
            <ellipse
              cx="64"
              cy="121"
              rx="27"
              ry="6"
              transform="rotate(-23 64 121)"
            />
            <path d="M30 105h4m-2-2v4m51-4h4m-2-2v4" />
          </g>
        ) : (
          <g fill="none" stroke={palette.accent} strokeWidth="1.5">
            <path d="M53 137c0-15 14-17 18-34M56 129c-14 0-19-8-15-14 11-1 16 4 15 14Zm8-13c1-11 9-14 16-10-1 8-7 12-16 10Z" />
          </g>
        )}
        <text
          x="23"
          y="143"
          fill={palette.ink}
          fontFamily="Arial, sans-serif"
          fontSize="5"
          letterSpacing=".7"
        >
          {genre.toUpperCase()}
        </text>
      </svg>
    </figure>
  );
}
