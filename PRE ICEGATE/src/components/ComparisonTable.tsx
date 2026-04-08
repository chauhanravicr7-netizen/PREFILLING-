import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { VerificationField } from '../types';
import { motion } from 'motion/react';

interface ComparisonTableProps {
  fields: VerificationField[];
}

export function ComparisonTable({ fields }: ComparisonTableProps) {
  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[200px] font-mono text-[11px] uppercase tracking-wider">Field Name</TableHead>
            <TableHead className="font-mono text-[11px] uppercase tracking-wider">Checklist Value</TableHead>
            <TableHead className="font-mono text-[11px] uppercase tracking-wider">Source Value</TableHead>
            <TableHead className="w-[120px] text-right font-mono text-[11px] uppercase tracking-wider">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <motion.tr
              key={field.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-medium text-sm text-slate-700">
                {field.name}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {field.checklistValue || <span className="text-muted-foreground italic">Not found</span>}
              </TableCell>
              <TableCell className="font-mono text-sm">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  {field.sourceValue || <span className="text-muted-foreground italic">Not found</span>}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {field.status === 'match' ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Match
                  </Badge>
                ) : field.status === 'mismatch' ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Mismatch
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 gap-1">
                    <HelpCircle className="w-3 h-3" />
                    Pending
                  </Badge>
                )}
              </TableCell>
            </motion.tr>
          ))}
          {fields.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                No audit data available. Upload documents to begin verification.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
