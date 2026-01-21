import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import {
    FileText,
    FileCode,
    Download,
    Copy,
    Check,
    Loader2,
    Eye,
    Palette
} from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { motion } from "framer-motion";
import { TEMPLATE_STYLES, getTemplateStyle, TemplateStyleConfig } from "@/shared/templates/templateStyles";

interface ExportOptimizedModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resumeText: string;
    atsScore?: number;
}

export default function ExportOptimizedModal({
    open,
    onOpenChange,
    resumeText,
    atsScore,
}: ExportOptimizedModalProps) {
    const [isExporting, setIsExporting] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState("preview");
    const [selectedTemplate, setSelectedTemplate] = useState("modern");
    const { toast } = useToast();

    const templateStyle = getTemplateStyle(selectedTemplate);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(resumeText);
            setCopied(true);
            toast({
                title: "Copied!",
                description: "Resume text copied to clipboard",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast({
                title: "Failed to copy",
                description: "Please try again",
                variant: "destructive",
            });
        }
    };

    const handleExport = async (format: string) => {
        try {
            setIsExporting(format);
            let blob: Blob;
            let filename = `optimized-resume-${selectedTemplate}`;

            switch (format) {
                case "txt":
                    blob = new Blob([resumeText], { type: "text/plain" });
                    filename += ".txt";
                    break;

                case "docx":
                    blob = await generateDocxFromText(resumeText, templateStyle);
                    filename += ".docx";
                    break;

                case "html":
                    const html = generateHtmlFromText(resumeText, templateStyle, atsScore);
                    blob = new Blob([html], { type: "text/html" });
                    filename += ".html";
                    break;

                case "pdf":
                    // Use print dialog for PDF (most reliable cross-browser)
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                        printWindow.document.write(generatePrintHtml(resumeText, templateStyle, atsScore));
                        printWindow.document.close();
                        printWindow.focus();
                        setTimeout(() => {
                            printWindow.print();
                        }, 250);
                    }
                    setIsExporting(null);
                    return;

                default:
                    throw new Error("Unsupported format");
            }

            saveAs(blob, filename);
            toast({
                title: "Success",
                description: `Resume exported as ${format.toUpperCase()}`,
            });
        } catch (error) {
            console.error("Export failed:", error);
            toast({
                title: "Export failed",
                description: `Could not export as ${format.toUpperCase()}`,
                variant: "destructive",
            });
        } finally {
            setIsExporting(null);
        }
    };

    const generateDocxFromText = async (text: string, style: TemplateStyleConfig): Promise<Blob> => {
        const lines = text.split("\n");
        const paragraphs: Paragraph[] = [];

        lines.forEach((line, index) => {
            const trimmed = line.trim();

            // First line is likely the name
            if (index === 0 && trimmed) {
                paragraphs.push(
                    new Paragraph({
                        children: [new TextRun({
                            text: trimmed,
                            bold: true,
                            size: style.sizes.titleSize * 2, // Convert pt to half-points
                            color: style.colors.title,
                            font: style.fonts.heading
                        })],
                        heading: HeadingLevel.TITLE,
                        spacing: { after: 200 },
                    })
                );
            }
            // Detect section headers (ALL CAPS or ending with colon)
            else if (trimmed.match(/^[A-Z][A-Z\s]+$/) || (trimmed.endsWith(':') && trimmed.length < 30)) {
                paragraphs.push(
                    new Paragraph({
                        children: [new TextRun({
                            text: trimmed.replace(':', ''),
                            bold: true,
                            size: style.sizes.headingSize * 2,
                            color: style.colors.heading,
                            font: style.fonts.heading
                        })],
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 300, after: 100 },
                    })
                );
            }
            // Detect bullet points
            else if (trimmed.match(/^[•\-\*]\s/)) {
                paragraphs.push(
                    new Paragraph({
                        children: [new TextRun({
                            text: trimmed.replace(/^[•\-\*]\s*/, "• "),
                            size: style.sizes.bodySize * 2,
                            color: style.colors.body,
                            font: style.fonts.body
                        })],
                        spacing: { after: 80 },
                    })
                );
            }
            // Regular content
            else if (trimmed) {
                paragraphs.push(
                    new Paragraph({
                        children: [new TextRun({
                            text: trimmed,
                            size: style.sizes.bodySize * 2,
                            color: style.colors.body,
                            font: style.fonts.body
                        })],
                        spacing: { after: 80 },
                    })
                );
            }
            // Empty line
            else {
                paragraphs.push(new Paragraph({ children: [] }));
            }
        });

        const doc = new Document({
            sections: [{
                properties: {},
                children: paragraphs,
            }],
        });

        return await Packer.toBlob(doc);
    };

    const generateHtmlFromText = (text: string, style: TemplateStyleConfig, score?: number): string => {
        const lines = text.split("\n");
        let htmlContent = "";

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            const escaped = trimmed.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            if (index === 0 && trimmed) {
                htmlContent += `<h1 style="font-size: ${style.sizes.titleSize}px; margin-bottom: 8px; color: #${style.colors.title};">${escaped}</h1>\n`;
            } else if (trimmed.match(/^[A-Z][A-Z\s]+$/) || (trimmed.endsWith(':') && trimmed.length < 30)) {
                htmlContent += `<h2 style="font-size: ${style.sizes.headingSize}px; margin-top: 20px; margin-bottom: 8px; color: #${style.colors.heading}; border-bottom: ${style.layout.showBorders ? '2px solid #' + style.colors.primary : 'none'}; padding-bottom: 4px;">${escaped.replace(':', '')}</h2>\n`;
            } else if (trimmed.match(/^[•\-\*]\s/)) {
                htmlContent += `<p style="margin: 4px 0 4px 20px; color: #${style.colors.body};">• ${escaped.replace(/^[•\-\*]\s*/, '')}</p>\n`;
            } else if (trimmed) {
                htmlContent += `<p style="margin: 4px 0; color: #${style.colors.body};">${escaped}</p>\n`;
            } else {
                htmlContent += `<br/>\n`;
            }
        });

        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Optimized Resume${score ? ` (ATS Score: ${score})` : ''}</title>
  <style>
    body {
      font-family: '${style.fonts.body}', ${style.fonts.fallback || 'sans-serif'};
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: ${style.layout.lineHeight};
      color: #${style.colors.body};
    }
    h1 { font-family: '${style.fonts.heading}', ${style.fonts.fallback || 'sans-serif'}; }
    h2 { 
      font-family: '${style.fonts.heading}', ${style.fonts.fallback || 'sans-serif'}; 
      text-transform: uppercase; 
      letter-spacing: 1px; 
    }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;
    };

    const generatePrintHtml = (text: string, style: TemplateStyleConfig, score?: number): string => {
        return generateHtmlFromText(text, style, score).replace(
            '</head>',
            `<style>@media print { body { margin: 0; padding: 20px; } }</style></head>`
        );
    };

    // Generate preview styles from template
    const getPreviewStyles = (): React.CSSProperties => ({
        fontFamily: `'${templateStyle.fonts.body}', ${templateStyle.fonts.fallback || 'sans-serif'}`,
        color: `#${templateStyle.colors.body}`,
        lineHeight: templateStyle.layout.lineHeight,
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b bg-gradient-to-r from-accent/5 to-transparent">
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                            <Download className="h-5 w-5 text-accent" />
                        </div>
                        Export Optimized Resume
                    </DialogTitle>
                    <DialogDescription>
                        Choose a template style and download your ATS-optimized resume
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                    <div className="px-6 py-3 border-b bg-muted/30 flex items-center justify-between flex-wrap gap-4">
                        <TabsList>
                            <TabsTrigger value="preview" className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Preview
                            </TabsTrigger>
                            <TabsTrigger value="download" className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Download
                            </TabsTrigger>
                        </TabsList>

                        {/* Template Selector */}
                        <div className="flex items-center gap-3">
                            <Label className="flex items-center gap-2 text-sm font-medium">
                                <Palette className="h-4 w-4 text-muted-foreground" />
                                Template:
                            </Label>
                            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(TEMPLATE_STYLES).map((template) => (
                                        <SelectItem key={template.id} value={template.id}>
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <TabsContent value="preview" className="flex-1 overflow-auto p-6 mt-0 ring-0 bg-muted/20">
                        <div
                            className="bg-white border rounded-lg shadow-lg p-8 max-h-[450px] overflow-auto mx-auto"
                            style={{ maxWidth: '700px' }}
                        >
                            <pre
                                className="text-sm whitespace-pre-wrap leading-relaxed"
                                style={getPreviewStyles()}
                            >
                                {resumeText}
                            </pre>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <Button
                                variant="outline"
                                onClick={handleCopy}
                                className="gap-2"
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Copied!" : "Copy to Clipboard"}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="download" className="flex-1 overflow-auto p-6 mt-0 ring-0">
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-semibold">Choose Export Format</h3>
                                <p className="text-sm text-muted-foreground">
                                    Using <span className="font-medium text-accent">{templateStyle.name}</span> template style
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        variant="outline"
                                        className="w-full h-20 justify-start p-4 hover:border-accent hover:bg-accent/5 transition-all group"
                                        onClick={() => handleExport("pdf")}
                                        disabled={!!isExporting}
                                    >
                                        <FileText className="h-8 w-8 text-red-500 mr-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-left">
                                            <div className="font-semibold">PDF Document</div>
                                            <div className="text-xs text-muted-foreground">Print to PDF (via browser)</div>
                                        </div>
                                        {isExporting === "pdf" && <Loader2 className="h-4 w-4 ml-auto animate-spin" />}
                                    </Button>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        variant="outline"
                                        className="w-full h-20 justify-start p-4 hover:border-accent hover:bg-accent/5 transition-all group"
                                        onClick={() => handleExport("docx")}
                                        disabled={!!isExporting}
                                    >
                                        <FileText className="h-8 w-8 text-blue-500 mr-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-left">
                                            <div className="font-semibold">Word Document</div>
                                            <div className="text-xs text-muted-foreground">Styled .docx format</div>
                                        </div>
                                        {isExporting === "docx" && <Loader2 className="h-4 w-4 ml-auto animate-spin" />}
                                    </Button>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        variant="outline"
                                        className="w-full h-20 justify-start p-4 hover:border-accent hover:bg-accent/5 transition-all group"
                                        onClick={() => handleExport("html")}
                                        disabled={!!isExporting}
                                    >
                                        <FileCode className="h-8 w-8 text-orange-500 mr-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-left">
                                            <div className="font-semibold">HTML File</div>
                                            <div className="text-xs text-muted-foreground">Self-contained web page</div>
                                        </div>
                                        {isExporting === "html" && <Loader2 className="h-4 w-4 ml-auto animate-spin" />}
                                    </Button>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        variant="outline"
                                        className="w-full h-20 justify-start p-4 hover:border-accent hover:bg-accent/5 transition-all group"
                                        onClick={() => handleExport("txt")}
                                        disabled={!!isExporting}
                                    >
                                        <FileText className="h-8 w-8 text-gray-500 mr-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-left">
                                            <div className="font-semibold">Plain Text</div>
                                            <div className="text-xs text-muted-foreground">Simple .txt file</div>
                                        </div>
                                        {isExporting === "txt" && <Loader2 className="h-4 w-4 ml-auto animate-spin" />}
                                    </Button>
                                </motion.div>
                            </div>

                            {isExporting && (
                                <div className="flex justify-center items-center gap-2 text-accent animate-pulse py-2">
                                    <Download className="h-4 w-4 animate-bounce" />
                                    <span className="text-sm font-medium">Preparing your file...</span>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
