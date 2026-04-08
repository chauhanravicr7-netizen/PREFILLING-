import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { ExtractionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const EXTRACTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    fields: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          checklistValue: { type: Type.STRING },
          sourceValue: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['match', 'mismatch'] }
        },
        required: ['id', 'name', 'checklistValue', 'sourceValue', 'status']
      }
    }
  },
  required: ['fields']
};

export async function extractAndCompare(checklistFile: File, supportingFiles: File[]): Promise<ExtractionResult> {
  const model = "gemini-3-flash-preview";
  
  // Helper to convert File to base64
  const fileToPart = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return {
      inlineData: {
        data: btoa(binary),
        mimeType: file.type
      }
    };
  };

  const checklistPart = await fileToPart(checklistFile);
  const supportingParts = await Promise.all(supportingFiles.map(fileToPart));

  const prompt = `
    Senior Customs Audit: Compare 'ICEGATE Checklist' (Doc 1) vs 'Supporting Docs' (Invoices/Packing Lists).
    
    EXHAUSTIVE AUDIT REQUIRED:
    Verify EVERY field in the checklist. 
    Verify ALL items in 'ITEMS OF EXPORT' (Rate, Qty, Value) individually.
    
    Fields: Header (Job, Date, CHA, GSTIN, IEC, Port), Financials (FOB, DBK, ROSCTL, IGST, Exch Rate), Cargo (Weights, Pkgs, Containers), Item Level (SLNo, Desc, Qty, Rate, Value).
    
    Rule: EXACT match only. 0.01 diff = mismatch.
    Return JSON with 25+ fields.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          checklistPart,
          ...supportingParts,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: EXTRACTION_SCHEMA,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });

    const result = JSON.parse(response.text || '{"fields": []}');
    
    const matches = result.fields.filter((f: any) => f.status === 'match').length;
    const mismatches = result.fields.length - matches;

    return {
      fields: result.fields,
      summary: {
        totalFields: result.fields.length,
        matches,
        mismatches
      }
    };
  } catch (error) {
    console.error("Extraction error:", error);
    throw new Error("Failed to process documents. Please ensure they are clear and valid.");
  }
}
