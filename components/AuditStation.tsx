```typescript
'use client'

import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import axios from 'axios'

export default function AuditStation({ setAuditData, setLoading }: any) {
  const [zone_a, setZoneA] = useState<File | null>(null)
  const [zone_b, setZoneB] = useState<File[]>([])
  const fileInputA = useRef<HTMLInputElement>(null)
  const fileInputB = useRef<HTMLInputElement>(null)

  const handleZoneAChange = (files: FileList | null) => {
    if (files && files[0]) {
      setZoneA(files[0])
    }
  }

  const handleZoneBChange = (files: FileList | null) => {
    if (files) {
      setZoneB([...zone_b, ...Array.from(files)])
    }
  }

  const removeZoneA = () => setZoneA(null)

  const removeZoneB = (index: number) => {
    setZoneB(zone_b.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!zone_a || zone_b.length === 0) {
      alert('Please upload files in both zones')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('zone_a', zone_a)
    zone_b.forEach((file) => {
      formData.append('zone_b', file)
    })

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/audit`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )

      setAuditData(response.data)
    } catch (error) {
      console.error('Audit error:', error)
      alert('Error processing documents. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Zone A: Target Checklist
        </h2>
        <p className="text-slate-400 text-sm mb-4">Upload the ICEGATE Checklist PDF for verification</p>

        <div
          className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
          onDrop={(e) => {
            e.preventDefault()
            handleZoneAChange(e.dataTransfer.files)
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputA.current?.click()}
        >
          {zone_a ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <div className="text-left">
                  <p className="text-white font-medium">{zone_a.name}</p>
                  <p className="text-slate-400 text-sm">{(zone_a.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeZoneA()
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-300 font-medium">Drag & drop or click to upload</p>
              <p className="text-slate-500 text-sm mt-1">PDF only</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputA}
          type="file"
          accept=".pdf"
          onChange={(e) => handleZoneAChange(e.target.files)}
          className="hidden"
        />
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
          Zone B: Supporting Documents
        </h2>
        <p className="text-slate-400 text-sm mb-4">Upload Invoices, Packing Lists, etc. (PDF/Images)</p>

        <div
          className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
          onDrop={(e) => {
            e.preventDefault()
            handleZoneBChange(e.dataTransfer.files)
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputB.current?.click()}
        >
          {zone_b.length > 0 ? (
            <div className="space-y-2">
              {zone_b.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-700 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                    </svg>
                    <span className="text-white text-sm">{file.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeZoneB(idx)
                    }}
                    className="p-1 hover:bg-slate-600 rounded transition"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputB.current?.click()}
                className="w-full mt-3 py-2 text-blue-400 hover:text-blue-300 transition"
              >
                + Add more files
              </button>
            </div>
          ) : (
            <div>
              <Upload className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-300 font-medium">Drag & drop or click to upload</p>
              <p className="text-slate-500 text-sm mt-1">PDF/Images</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputB}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleZoneBChange(e.target.files)}
          className="hidden"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!zone_a || zone_b.length === 0}
        className="btn btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start High-Precision Audit
      </button>
    </div>
  )
}
```
