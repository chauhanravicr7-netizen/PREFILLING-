import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Files, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AuditStationProps {
  checklist: File | null;
  supportingDocs: File[];
  onChecklistChange: (file: File | null) => void;
  onSupportingDocsChange: (files: File[]) => void;
  isProcessing: boolean;
  onStartAudit: () => void;
  loadingMessage?: string;
}

export function AuditStation({
  checklist,
  supportingDocs,
  onChecklistChange,
  onSupportingDocsChange,
  isProcessing,
  onStartAudit,
  loadingMessage
}: AuditStationProps) {
  const onDropChecklist = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onChecklistChange(acceptedFiles[0]);
    }
  }, [onChecklistChange]);

  const onDropSupporting = useCallback((acceptedFiles: File[]) => {
    onSupportingDocsChange([...supportingDocs, ...acceptedFiles]);
  }, [supportingDocs, onSupportingDocsChange]);

  const { getRootProps: getChecklistProps, getInputProps: getChecklistInput, isDragActive: isChecklistDrag } = useDropzone({
    onDrop: onDropChecklist,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isProcessing
  } as any);

  const { getRootProps: getSupportingProps, getInputProps: getSupportingInput, isDragActive: isSupportingDrag } = useDropzone({
    onDrop: onDropSupporting,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    disabled: isProcessing
  } as any);

  const removeSupporting = (index: number) => {
    const newDocs = [...supportingDocs];
    newDocs.splice(index, 1);
    onSupportingDocsChange(newDocs);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Zone A: Target Checklist */}
      <Card className={cn(
        "border-2 transition-colors duration-200",
        isChecklistDrag ? "border-primary bg-primary/5" : "border-dashed"
      )}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Zone A: Target Checklist
          </CardTitle>
          <CardDescription>Upload the single ICEGATE Checklist PDF for verification.</CardDescription>
        </CardHeader>
        <CardContent>
          {!checklist ? (
            <div
              {...getChecklistProps()}
              className="h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <input {...getChecklistInput()} />
              <Upload className="w-10 h-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PDF only</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-muted rounded-lg border"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-blue-100 rounded">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{checklist.name}</p>
                  <p className="text-xs text-muted-foreground">{(checklist.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChecklistChange(null)}
                disabled={isProcessing}
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Zone B: Supporting Documents */}
      <Card className={cn(
        "border-2 transition-colors duration-200",
        isSupportingDrag ? "border-primary bg-primary/5" : "border-dashed"
      )}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Files className="w-5 h-5 text-orange-600" />
            Zone B: Supporting Documents
          </CardTitle>
          <CardDescription>Upload Invoices, Packing Lists, etc. (PDF/Images)</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getSupportingProps()}
            className="h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors mb-4"
          >
            <input {...getSupportingInput()} />
            <Upload className="w-6 h-6 text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Add supporting files</p>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            <AnimatePresence>
              {supportingDocs.map((doc, index) => (
                <motion.div
                  key={`${doc.name}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded border text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Files className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{doc.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeSupporting(index)}
                    disabled={isProcessing}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            {supportingDocs.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-4 italic">
                No supporting documents added yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 flex justify-center pt-4">
        <Button
          size="lg"
          className="w-full md:w-64 font-bold tracking-tight"
          disabled={!checklist || supportingDocs.length === 0 || isProcessing}
          onClick={onStartAudit}
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="mr-2"
              >
                <Upload className="w-4 h-4" />
              </motion.div>
              {loadingMessage || "Auditing Documents..."}
            </>
          ) : (
            "Start High-Precision Audit"
          )}
        </Button>
      </div>
    </div>
  );
}
