import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import LoadingSkeleton from './LoadingSkeleton'

function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
      <p className="text-sm text-gray-400">
        Sayfa {meta.current_page} / {meta.last_page} &mdash; toplam {meta.total} kayıt
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(meta.current_page - 1)}
          disabled={meta.current_page === 1}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(meta.current_page + 1)}
          disabled={meta.current_page === meta.last_page}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default function DataTable({
  columns, data = [], meta, onPageChange, isLoading,
  emptyMessage = 'Kayıt bulunamadı.',
  expandedRow, renderExpanded,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        {isLoading ? (
          <LoadingSkeleton rows={5} cols={columns.length} />
        ) : (
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-14 text-center text-gray-400 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                const isExpanded = renderExpanded && expandedRow === (row.id ?? i)
                return (
                  <React.Fragment key={row.id ?? i}>
                    <tr className={`transition-colors ${isExpanded ? 'bg-teal-50/40' : 'hover:bg-gray-50/80'}`}>
                      {columns.map((col) => (
                        <td key={col.key} className="px-5 py-3.5 text-gray-700">
                          {col.render ? col.render(row) : (row[col.key] ?? '—')}
                        </td>
                      ))}
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={columns.length} className="p-0 border-b border-teal-100 bg-teal-50/20">
                          {renderExpanded(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })
            )}
          </tbody>
        )}
      </table>
      <Pagination meta={meta} onPageChange={onPageChange} />
    </div>
  )
}
