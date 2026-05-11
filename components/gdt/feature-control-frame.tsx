import { cn } from "@/lib/utils";

type FeatureControlFrameProps = {
  symbol: string;
  tolerance: string;
  diameter?: boolean;
  modifier?: string;
  datums?: string[];
  className?: string;
};

export function FeatureControlFrame({
  symbol,
  tolerance,
  diameter,
  modifier,
  datums = [],
  className,
}: FeatureControlFrameProps) {
  return (
    <div
      className={cn(
        "inline-flex overflow-hidden border-2 border-slate-950 bg-white font-mono text-lg text-slate-950 shadow-sm",
        className,
      )}
      aria-label="Feature control frame"
    >
      <div className="grid min-w-12 place-items-center border-r-2 border-slate-950 px-3 py-2 text-2xl">
        {symbol}
      </div>
      <div className="flex min-w-24 items-center justify-center gap-1 border-r-2 border-slate-950 px-3 py-2">
        {diameter ? <span aria-label="diameter">{"\u00d8"}</span> : null}
        <span>{tolerance}</span>
        {modifier ? (
          <span className="ml-1 grid h-5 w-5 place-items-center rounded-full border border-slate-950 text-xs">
            {modifier}
          </span>
        ) : null}
      </div>
      {datums.map((datum) => (
        <div
          key={datum}
          className="grid min-w-12 place-items-center border-r-2 border-slate-950 px-3 py-2 last:border-r-0"
        >
          {datum}
        </div>
      ))}
    </div>
  );
}
