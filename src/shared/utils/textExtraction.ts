import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker
// In a Vite environment, we can use the bundled worker
// @ts-ignore
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Extracts raw text from various file formats
 * Supported: PDF, DOCX, TXT
 */
export async function extractTextFromFile(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'pdf':
            return extractTextFromPDF(file);
        case 'docx':
            return extractTextFromDOCX(file);
        case 'txt':
            return extractTextFromTXT(file);
        default:
            throw new Error(`Unsupported file format: ${extension}`);
    }
}

async function extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
        fullText += pageText + '\n';
    }

    return fullText;
}

async function extractTextFromDOCX(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

async function extractTextFromTXT(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}
