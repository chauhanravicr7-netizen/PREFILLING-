import React, { useState } from 'react';
import { ShieldCheck, LayoutDashboard, History, Settings, LogOut, FileCheck, AlertTriangle, Info } from 'lucide-react';
import { AuditStation } from './components/AuditStation';
import { ComparisonTable } from './components/ComparisonTable';
import { extractAndCompare } from './lib/gemini';
import { ExtractionResult } from './types';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from '@/lib/utils';

export default function App() {
  const [checklist, setChecklist] = useState<File | null>(null);
  const [supportingDocs, setSupportingDocs] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const handleStartAudit = async () => {
    if (!checklist || supportingDocs.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setLoadingMessage("Reading documents...");
    
    const messages = [
      "Analyzing ICEGATE Checklist...",
      "Extracting Invoice data...",
      "Verifying Item-level values...",
      "Comparing GSTIN and Financials...",
      "Finalizing Audit Report..."
    ];
    
    let msgIndex = 0;
    const interval = setInterval(() => {
      if (msgIndex < messages.length) {
        setLoadingMessage(messages[msgIndex]);
        msgIndex++;
      }
    }, 2500);

    try {
      const data = await extractAndCompare(checklist, supportingDocs);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred during the audit.");
    } finally {
      setIsProcessing(false);
      clearInterval(interval);
      setLoadingMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      {/* Sidebar - Professional Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white hidden lg:flex flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">CustomsVerify</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Audit Station" active />
          <NavItem icon={<History className="w-4 h-4" />} label="Audit History" />
          <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <NavItem icon={<LogOut className="w-4 h-4" />} label="Logout" />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="lg:ml-64 flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-bottom flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">CHA Dashboard</h2>
            <Separator orientation="vertical" className="h-4" />
            <p className="text-sm font-medium">Document Verification Station</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
              System Active
            </Badge>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold">
              RA
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <ScrollArea className="flex-1 p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Intro Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-slate-900">Audit Station</h3>
                <p className="text-slate-500 mt-1">Verify ICEGATE checklists against source documents with high precision.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                LAST SYNC: {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Audit Station Components */}
            <AuditStation
              checklist={checklist}
              supportingDocs={supportingDocs}
              onChecklistChange={setChecklist}
              onSupportingDocsChange={setSupportingDocs}
              isProcessing={isProcessing}
              onStartAudit={handleStartAudit}
              loadingMessage={loadingMessage}
            />

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-800"
              >
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Audit Failed</p>
                  <p className="text-xs mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Results Section */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-green-600" />
                    Audit Results
                  </h4>
                  <div className="flex gap-4 items-center">
                    <Sheet>
                      <SheetTrigger
                        render={
                          <button className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-bold hover:bg-red-100 transition-colors">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            View {result.summary.mismatches} Mismatches
                          </button>
                        }
                      />
                      <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Critical Mismatches
                          </SheetTitle>
                          <SheetDescription>
                            The following fields do not match the source documents.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                          {result.fields.filter(f => f.status === 'mismatch').map((field) => (
                            <div key={field.id} className="p-4 border border-red-100 bg-red-50/30 rounded-lg space-y-2">
                              <p className="text-sm font-bold text-slate-900">{field.name}</p>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <p className="text-slate-500 uppercase font-bold text-[9px]">Checklist</p>
                                  <p className="font-mono text-red-700">{field.checklistValue || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 uppercase font-bold text-[9px]">Invoice</p>
                                  <p className="font-mono text-slate-700">{field.sourceValue || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {result.summary.mismatches === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                              <ShieldCheck className="w-12 h-12 mb-2 text-green-500 opacity-20" />
                              <p className="text-sm">No mismatches found.</p>
                            </div>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>

                    <div className="text-center">
                      <p className="text-[10px] uppercase text-slate-400 font-bold">Matches</p>
                      <p className="text-xl font-bold text-green-600">{result.summary.matches}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase text-slate-400 font-bold">Mismatches</p>
                      <p className="text-xl font-bold text-red-600">{result.summary.mismatches}</p>
                    </div>
                  </div>
                </div>

                <ComparisonTable fields={result.fields} />

                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4 flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0" />
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>Note:</strong> This audit is powered by AI extraction. While highly precise, please manually verify any critical mismatches before finalizing the shipping bill. Any discrepancies in GSTIN or FOB values should be cross-checked with the original physical documents.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Empty State / Placeholder */}
            {!result && !isProcessing && (
              <div className="h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 bg-white/50">
                <LayoutDashboard className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">Upload documents to generate audit report</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    )}>
      {icon}
      {label}
    </button>
  );
}
