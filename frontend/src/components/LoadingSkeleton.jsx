export function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 bg-gray-200 rounded-md animate-pulse" style={{ width: `${55 + Math.random() * 35}%` }} />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
      </div>
      <div className="h-8 bg-gray-200 rounded-lg w-16 mb-2" />
      <div className="h-4 bg-gray-200 rounded-md w-24 mb-1" />
      <div className="h-3 bg-gray-100 rounded-md w-20" />
    </div>
  )
}

export default function LoadingSkeleton({ rows = 5, cols = 5 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </tbody>
  )
}
