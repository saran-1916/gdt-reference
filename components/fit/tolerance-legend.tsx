export function ToleranceLegend() {
  const symbols = [
    {
      symbol: "ES",
      type: "Upper Deviation (Hole)",
      description: "Maximum tolerance limit above nominal size for the hole",
      example: "+21 µm",
    },
    {
      symbol: "EI",
      type: "Lower Deviation (Hole)",
      description: "Minimum tolerance limit below nominal size for the hole",
      example: "0 µm",
    },
    {
      symbol: "es",
      type: "Upper Deviation (Shaft)",
      description: "Maximum tolerance limit above nominal size for the shaft",
      example: "-7 µm",
    },
    {
      symbol: "ei",
      type: "Lower Deviation (Shaft)",
      description: "Minimum tolerance limit below nominal size for the shaft",
      example: "-20 µm",
    },
  ];

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-950/30 p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-100">Symbol Definitions</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {symbols.map((item) => (
          <div key={item.symbol} className="rounded border border-slate-600/30 bg-slate-950/50 p-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-sky-300">{item.symbol}</span>
              <span className="text-xs font-medium text-slate-400">{item.type}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-300">{item.description}</p>
            <p className="mt-2 text-xs font-mono text-emerald-300">{item.example}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
