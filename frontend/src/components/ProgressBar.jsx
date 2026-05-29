export default function ProgressBar({ value = 0 }) {
  const pct = Math.min(Math.max(value, 0), 100)
  const color =
    pct >= 100 ? 'from-emerald-500 to-emerald-400' :
    pct >= 60  ? 'from-blue-500 to-blue-400' :
    pct >= 30  ? 'from-amber-500 to-amber-400' :
                 'from-red-500 to-rose-400'

  return (
    <div className="flex items-center gap-2.5 min-w-[100px]">
      <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-500 w-8 shrink-0 text-right">{pct}%</span>
    </div>
  )
}
