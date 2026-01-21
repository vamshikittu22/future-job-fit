import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Shield, Key, Server, CheckCircle2, Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { useToast } from '@/shared/hooks/use-toast';

interface AIConnectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AIConnectionModal: React.FC<AIConnectionModalProps> = ({
    open,
    onOpenChange,
}) => {
    const { toast } = useToast();

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({
            title: "Copied to clipboard",
            description: "You can now paste this into your .env file.",
        });
    };

    const steps = [
        {
            title: "Supabase Setup",
            description: "Ensure your Supabase project is initialized with Edge Functions support.",
            icon: Server,
        },
        {
            title: "Secrets Configuration",
            description: "Add your AI provider's API key (OpenAI/Gemini) to Supabase Secrets.",
            icon: Key,
        },
        {
            title: "Environment Variable",
            description: "Set VITE_AI_DEMO_MODE=false in your .env file.",
            icon: CheckCircle2,
        }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl overflow-hidden p-0 border-none shadow-2xl">
                <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-8 text-white relative">
                    <div className="absolute top-4 right-4 opacity-10">
                        <Shield className="w-32 h-32" />
                    </div>

                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <Badge variant="outline" className="text-[10px] text-primary border-primary/30 uppercase tracking-widest">
                                Security & Connectivity
                            </Badge>
                        </div>
                        <DialogTitle className="text-3xl font-bold text-white">Unlock Full AI Power</DialogTitle>
                        <DialogDescription className="text-slate-400 text-lg">
                            Follow these steps to connect your own AI provider via Supabase Edge Functions.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-8 bg-card">
                    <div className="grid gap-6">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border group-hover:bg-primary/10 group-hover:border-primary/50 group-hover:text-primary transition-all">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        {idx < steps.length - 1 && <div className="w-px h-full bg-border my-2" />}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <h4 className="font-bold text-base mb-1">{step.title}</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-muted/50 rounded-xl p-5 border border-dashed space-y-4">
                        <h5 className="font-bold text-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Local Configuration
                        </h5>
                        <div className="bg-slate-950 rounded-lg p-3 relative group">
                            <code className="text-pink-400 text-xs font-mono">
                                VITE_AI_DEMO_MODE=false
                            </code>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 absolute right-2 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleCopyCode("VITE_AI_DEMO_MODE=false")}
                            >
                                <Copy className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Note: You must have the <code>supabase-mcp-server</code> or your own Supabase instance running.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-amber-500/5 rounded-lg border border-amber-500/10">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-700 leading-tight">
                            Using your own API keys ensures your data is private and you have full control over the generation quality.
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-muted/30 border-t flex justify-between gap-3">
                    <Button variant="ghost" className="gap-2" asChild>
                        <a href="https://supabase.com/docs/guides/functions" target="_blank" rel="noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            API Documentation
                        </a>
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                        <Button onClick={() => onOpenChange(false)}>
                            Got it!
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
