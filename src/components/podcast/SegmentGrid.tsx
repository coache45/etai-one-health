const SEGMENTS = [
  {
    title: "Origin / Deep Dive",
    body: "The story behind the thing. Where it came from, why it matters, what it actually does.",
  },
  {
    title: "ELI5",
    body: "Explained like you're five. AI concepts in language anyone at your kitchen table can follow.",
  },
  {
    title: "We Tried It",
    body: "We used AI for something real this week. Sometimes it works. Sometimes it doesn't. We tell you both.",
  },
  {
    title: "Couple in AI",
    body: "What AI did to (and for) our marriage this week. The honest part.",
  },
] as const;

export function SegmentGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {SEGMENTS.map((seg, i) => (
        <div
          key={seg.title}
          className="rounded-xl border border-[#C9A84C]/20 bg-[#0A1126]/40 p-6"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            Segment {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="mb-2 font-serif text-xl text-[#ECE2C8]">{seg.title}</h3>
          <p className="text-sm text-[#ECE2C8]/70">{seg.body}</p>
        </div>
      ))}
    </div>
  );
}
