import { useCallback } from "react";
import { useToast } from "@/shared/hooks/use-toast";

export interface ResumeSummary {
  name?: string;
  email?: string;
  phone?: string;
  summaryExcerpt?: string;
}

interface UseResumeUploadResult {
  uploadFile: (file: File) => Promise<string>;
  extractResumeSummary: (text: string) => ResumeSummary;
}

const EMAIL_PATTERN = /\S+@\S+\.\S+/;
const PHONE_PATTERN = /\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;

export function useResumeUpload(): UseResumeUploadResult {
  const { toast } = useToast();

  const uploadFile = useCallback(
    (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const lowerName = file.name.toLowerCase();
        const isTxt = lowerName.endsWith(".txt");
        const isPdf = lowerName.endsWith(".pdf");
        const isDocx = lowerName.endsWith(".docx");

        if (isDocx) {
          toast({
            title: "Unsupported file type",
            description: "DOCX files are not supported yet. Please upload TXT or text-based PDF."
          });
          reject(new Error("DOCX files are not supported"));
          return;
        }

        if (!isTxt && !isPdf) {
          toast({
            title: "Unsupported file type",
            description: "Please upload a .txt or text-based .pdf file."
          });
          reject(new Error("Unsupported file type"));
          return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
          const result = event.target?.result;
          if (typeof result === "string") {
            resolve(result);
            return;
          }

          reject(new Error("Failed to extract text from file"));
        };

        reader.onerror = () => {
          toast({
            title: "File read failed",
            description: "We could not read this file. Please try another file."
          });
          reject(new Error("File read failed"));
        };

        reader.readAsText(file);
      });
    },
    [toast]
  );

  const extractResumeSummary = useCallback((text: string): ResumeSummary => {
    const normalizedText = text.trim();
    if (!normalizedText) {
      return {};
    }

    const lines = normalizedText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const firstLine = lines[0];
    const emailMatch = normalizedText.match(EMAIL_PATTERN);
    const phoneMatch = normalizedText.match(PHONE_PATTERN);

    return {
      name: firstLine,
      email: emailMatch?.[0],
      phone: phoneMatch?.[0],
      summaryExcerpt: normalizedText.slice(0, 150)
    };
  }, []);

  return { uploadFile, extractResumeSummary };
}
