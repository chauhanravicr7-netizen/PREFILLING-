export interface VerificationField {
  id: string;
  name: string;
  checklistValue: string;
  sourceValue: string;
  status: 'match' | 'mismatch' | 'pending';
}

export interface ExtractionResult {
  fields: VerificationField[];
  summary: {
    totalFields: number;
    matches: number;
    mismatches: number;
  };
}

export interface DocumentFile {
  id: string;
  file: File;
  type: 'checklist' | 'supporting';
  previewUrl?: string;
}
