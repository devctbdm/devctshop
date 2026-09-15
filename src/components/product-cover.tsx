import { cn } from "@/lib/utils";

const PALETTES = [
  "from-slate-500/90 via-slate-700/90 to-slate-900",
  "from-indigo-500/90 via-indigo-700/90 to-slate-900",
  "from-emerald-500/90 via-teal-700/90 to-slate-900",
  "from-sky-500/90 via-blue-700/90 to-slate-900",
  "from-amber-500/90 via-orange-700/90 to-slate-900",
  "from-rose-500/90 via-pink-700/90 to-slate-900",
  "from-violet-500/90 via-purple-700/90 to-slate-900",
  "from-cyan-500/90 via-sky-700/90 to-slate-900",
];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

type ProductCoverProps = {
  seed: string;
  label?: string;
  className?: string;
};

export function ProductCover({ seed, label, className }: ProductCoverProps) {
  const index = hashString(seed) % PALETTES.length;
  const monogram = (
    seed.replace(/[-_]/g, " ").trim().slice(0, 1) || "D"
  ).toUpperCase();

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-linear-to-br",
        PALETTES[index],
        className,
      )}
      role="img"
      aria-label={label ? `${label} preview` : undefined}
    >
      <div
        className="absolute inset-0 opacity-[0.18]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        className="absolute -top-1/3 -right-1/4 size-2/3 rounded-full bg-white/20 blur-2xl"
        aria-hidden
      />
      <span
        className="relative font-heading text-4xl font-semibold tracking-tight text-white/90 drop-shadow-sm"
        aria-hidden
      >
        {monogram}
      </span>
      {label ? (
        <span className="absolute bottom-2.5 left-3 rounded-md bg-black/25 px-2 py-0.5 text-[0.7rem] font-medium text-white/90 backdrop-blur-sm">
          {label}
        </span>
      ) : null}
    </div>
  );
}
