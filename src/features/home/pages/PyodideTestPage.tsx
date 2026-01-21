import React, { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Loader2, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { usePyNLP } from "@/shared/hooks/usePyNLP";

const PyodideTest = () => {
    const { status, parseResume, isReady, error: pyError } = usePyNLP();
    const [inputText, setInputText] = useState("");
    const [output, setOutput] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTest = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await parseResume(inputText || "Sample Resume Text");
            setOutput(result);
        } catch (err: any) {
            console.error("Execution Error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-4xl py-12 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight">Pyodide Offline NLP POC</h1>
                <p className="text-muted-foreground">
                    Test the Python NLP core running directly in your browser without any server.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Status:
                        {status === "loading" && <span className="flex items-center text-yellow-500 gap-1 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Initializing Python...</span>}
                        {status === "ready" && <span className="flex items-center text-green-500 gap-1 text-sm"><CheckCircle2 className="w-4 h-4" /> Ready</span>}
                        {status === "error" && <span className="flex items-center text-red-500 gap-1 text-sm"><AlertCircle className="w-4 h-4" /> Error: {pyError}</span>}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Paste resume text here..."
                        className="min-h-[200px]"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <Button
                        onClick={handleTest}
                        disabled={status !== "ready" || isLoading}
                        className="w-full"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        Run Offline Parse
                    </Button>
                </CardContent>
            </Card>

            {output && (
                <Card>
                    <CardHeader>
                        <CardTitle>Output JSON</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[400px] text-xs">
                            {JSON.stringify(output, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            )}

            {error && status === "ready" && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}
        </div>
    );
};

export default PyodideTest;
