import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Eye, EyeOff, X, Check, AlertTriangle, Sparkles, Trash2 } from 'lucide-react';
import { useAPIKey, AIProvider } from '@/shared/contexts/APIKeyContext';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Badge } from '@/shared/ui/badge';
import { useToast } from '@/shared/ui/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/shared/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';

interface APIKeySettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const providerInfo: Record<AIProvider, { name: string; placeholder: string; helpUrl: string }> = {
    gemini: {
        name: 'Google Gemini',
        placeholder: 'AIza...',
        helpUrl: 'https://aistudio.google.com/app/apikey',
    },
    openai: {
        name: 'OpenAI',
        placeholder: 'sk-...',
        helpUrl: 'https://platform.openai.com/api-keys',
    },
    groq: {
        name: 'Groq',
        placeholder: 'gsk_...',
        helpUrl: 'https://console.groq.com/keys',
    },
};

const APIKeySettingsModal: React.FC<APIKeySettingsModalProps> = ({ open, onOpenChange }) => {
    const { keyState, setAPIKey, clearAPIKey, isUsingCustomKey } = useAPIKey();
    const { toast } = useToast();

    const [provider, setProvider] = useState<AIProvider>(keyState.provider || 'gemini');
    const [apiKey, setApiKeyInput] = useState(keyState.apiKey || '');
    const [showKey, setShowKey] = useState(false);

    const handleSave = () => {
        if (!apiKey.trim()) {
            toast({
                title: 'API Key Required',
                description: 'Please enter a valid API key.',
                variant: 'destructive',
            });
            return;
        }

        // Basic validation
        const validations: Record<AIProvider, (key: string) => boolean> = {
            gemini: (key) => key.startsWith('AIza') && key.length > 30,
            openai: (key) => key.startsWith('sk-') && key.length > 40,
            groq: (key) => key.startsWith('gsk_') && key.length > 40,
        };

        if (!validations[provider](apiKey.trim())) {
            toast({
                title: 'Invalid API Key Format',
                description: `The key doesn't match the expected format for ${providerInfo[provider].name}.`,
                variant: 'destructive',
            });
            return;
        }

        setAPIKey(provider, apiKey.trim());
        toast({
            title: 'API Key Saved',
            description: `Your ${providerInfo[provider].name} API key has been saved for this session.`,
        });
        onOpenChange(false);
    };

    const handleClear = () => {
        clearAPIKey();
        setApiKeyInput('');
        toast({
            title: 'API Key Cleared',
            description: 'Your API key has been removed from this session.',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5 text-accent" />
                        API Key Settings
                    </DialogTitle>
                    <DialogDescription>
                        Use your own API key for AI features. Keys are stored only for this browser session
                        and are never sent to our servers.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Security Notice */}
                    <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                            <strong className="text-amber-500">Session Only:</strong> Your API key is stored in your browser's session
                            storage. It will be cleared when you close this browser tab/window. We never store or transmit your keys
                            to any server.
                        </div>
                    </div>

                    {/* Current Status */}
                    {isUsingCustomKey && (
                        <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-sm">
                                    Using <strong>{providerInfo[keyState.provider].name}</strong> key
                                </span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleClear} className="text-red-500 hover:text-red-600">
                                <Trash2 className="w-4 h-4 mr-1" /> Clear
                            </Button>
                        </div>
                    )}

                    {/* Provider Selection */}
                    <div className="space-y-2">
                        <Label>AI Provider</Label>
                        <Select value={provider} onValueChange={(v) => setProvider(v as AIProvider)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gemini">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Google Gemini
                                    </div>
                                </SelectItem>
                                <SelectItem value="openai">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        OpenAI (GPT-4)
                                    </div>
                                </SelectItem>
                                <SelectItem value="groq">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Groq (Llama)
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* API Key Input */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>API Key</Label>
                            <a
                                href={providerInfo[provider].helpUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-accent hover:underline"
                            >
                                Get a key →
                            </a>
                        </div>
                        <div className="relative">
                            <Input
                                type={showKey ? 'text' : 'password'}
                                placeholder={providerInfo[provider].placeholder}
                                value={apiKey}
                                onChange={(e) => setApiKeyInput(e.target.value)}
                                className="pr-10 font-mono text-sm"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                onClick={() => setShowKey(!showKey)}
                            >
                                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Your key will only be used for direct API calls from your browser.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="gap-2">
                        <Key className="w-4 h-4" />
                        Save Key
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default APIKeySettingsModal;
