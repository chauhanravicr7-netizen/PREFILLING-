```typescript
'use client'

import { useState } from 'react'
import AuditStation from '@/components/AuditStation'
import AuditResults from '@/components/AuditResults'

export default function Home() {
  const [auditData, setAuditData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">CustomsVerify</h1>
          </div>
          <p className="text-slate-400 text-lg">AI-Powered Document Verification Platform</p>
          <p className="text-slate-500 text-sm mt-2">Verify shipping documents against customs regulations with precision</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <AuditStation 
              setAuditData={setAuditData} 
              setLoading={setLoading}
            />
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            {loading && (
              <div className="card flex flex-col items-center justify-center h-96">
                <div className="animate-spin">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="mt-4 text-slate-300">Processing documents...</p>
              </div>
            )}

            {auditData && !loading && (
              <AuditResults data={auditData} />
            )}

            {!auditData && !loading && (
              <div className="card h-96 flex flex-col items-center justify-center text-center">
                <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-400">Upload documents to start audit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
```
