```typescript
'use client'

import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react'

export default function AuditResults({ data }: { data: any }) {
  const results = data.results || []
  const matchCount = results.filter((r: any) => r.status === 'match').length
  const mismatchCount = results.filter((r: any) => r.status === 'mismatch').length
  const warningCount = results.filter((r: any) => r.status === 'warning').length

  return (
    <div className="space-y-4 fade-in">
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
          Audit Results
        </h3>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <p className="text-green-400 text-2xl font-bold">{matchCount}</p>
            <p className="text-slate-400 text-sm">Matches</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <p className="text-red-400 text-2xl font-bold">{mismatchCount}</p>
            <p className="text-slate-400 text-sm">Mismatches</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <p className="text-yellow-400 text-2xl font-bold">{warningCount}</p>
            <p className="text-slate-400 text-sm">Warnings</p>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.map((result: any, idx: number) => (
            <div key={idx} className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                {result.status === 'match' && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                )}
                {result.status === 'mismatch' && (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                )}
                {result.status === 'warning' && (
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                )}
                {result.status === 'info' && (
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                )}

                <div className="flex-1">
                  <p className="text-white font-medium">{result.field}</p>
                  <div className="grid grid-cols-2 gap-3 mt-2 text-sm">
                    <div>
                      <p className="text-slate-400">Checklist</p>
                      <p className="text-slate-200 font-mono">{result.checklist_value}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Invoice</p>
                      <p className="text-slate-200 font-mono">{result.invoice_value}</p>
                    </div>
                  </div>
                  {result.note && (
                    <p className="text-slate-300 text-xs mt-2">{result.note}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card border border-slate-600">
        <h4 className="font-semibold text-white mb-3">Summary</h4>
        <p className="text-slate-300 text-sm leading-relaxed">
          {mismatchCount === 0
            ? '✓ All documents verified successfully. No discrepancies found.'
            : `⚠ Found ${mismatchCount} discrepancy(ies) that require attention.`}
        </p>
      </div>
    </div>
  )
}
```
