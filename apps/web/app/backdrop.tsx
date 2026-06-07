// Shared page atmosphere for the marketing surface (landing + legal pages).
// A "pattern-paper" backdrop: a fine cutting-table grid (a nod to garment
// patterns / tech packs) under a soft indigo dawn and a warm counter-glow,
// finished with a whisper of paper grain so the canvas reads as designed, not
// blank. Purely decorative — sits behind content as an absolute layer.
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Cutting-table grid — fine 28px lines with a stronger 140px major grid,
          masked so it's present up top-left and dissolves into the page. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(to right, rgba(22,22,26,0.035) 1px, transparent 1px)",
            "linear-gradient(to bottom, rgba(22,22,26,0.035) 1px, transparent 1px)",
            "linear-gradient(to right, rgba(22,22,26,0.05) 1px, transparent 1px)",
            "linear-gradient(to bottom, rgba(22,22,26,0.05) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "28px 28px, 28px 28px, 140px 140px, 140px 140px",
          maskImage: "radial-gradient(115% 85% at 18% -5%, #000 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(115% 85% at 18% -5%, #000 0%, transparent 72%)",
        }}
      />
      {/* Indigo dawn — soft accent wash, top-right (echoes the brand accent). */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 52% at 100% 0%, rgba(79,70,229,0.10), transparent 66%)",
        }}
      />
      {/* Warm counter-glow, bottom-left — a fabric-toned hue for depth. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 46% at 0% 100%, rgba(176,138,110,0.06), transparent 70%)",
        }}
      />
      {/* Paper grain — barely there, just enough tooth to kill the flatness. */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
