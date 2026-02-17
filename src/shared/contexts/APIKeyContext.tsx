import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type AIProvider = 'gemini' | 'openai' | 'groq';

interface APIKeyState {
    provider: AIProvider;
    apiKey: string;
    isConfigured: boolean;
}

interface APIKeyContextType {
    keyState: APIKeyState;
    setAPIKey: (provider: AIProvider, apiKey: string) => void;
    clearAPIKey: () => void;
    isUsingCustomKey: boolean;
}

const defaultState: APIKeyState = {
    provider: 'gemini',
    apiKey: '',
    isConfigured: false,
};

const APIKeyContext = createContext<APIKeyContextType | undefined>(undefined);

export const APIKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [keyState, setKeyState] = useState<APIKeyState>(() => {
        // Try to restore from sessionStorage (persists across page refreshes but not browser close)
        try {
            const stored = sessionStorage.getItem('user_api_key_config');
            if (stored) {
                const parsed = JSON.parse(stored);
                console.log('[APIKeyContext] Restored session API key for provider:', parsed.provider);
                return { ...parsed, isConfigured: !!parsed.apiKey };
            }
        } catch (e) {
            console.warn('[APIKeyContext] Failed to restore session key:', e);
        }
        return defaultState;
    });

    // Persist to sessionStorage when key changes
    useEffect(() => {
        if (keyState.isConfigured) {
            try {
                sessionStorage.setItem('user_api_key_config', JSON.stringify(keyState));
            } catch (e) {
                console.warn('[APIKeyContext] Failed to persist session key:', e);
            }
        } else {
            sessionStorage.removeItem('user_api_key_config');
        }
    }, [keyState]);

    const setAPIKey = useCallback((provider: AIProvider, apiKey: string) => {
        setKeyState({
            provider,
            apiKey,
            isConfigured: !!apiKey,
        });
        console.log(`[APIKeyContext] API key configured for: ${provider}`);
    }, []);

    const clearAPIKey = useCallback(() => {
        setKeyState(defaultState);
        sessionStorage.removeItem('user_api_key_config');
        console.log('[APIKeyContext] API key cleared');
    }, []);

    const isUsingCustomKey = keyState.isConfigured && !!keyState.apiKey;

    return (
        <APIKeyContext.Provider value={{ keyState, setAPIKey, clearAPIKey, isUsingCustomKey }}>
            {children}
        </APIKeyContext.Provider>
    );
};

export const useAPIKey = () => {
    const context = useContext(APIKeyContext);
    if (!context) {
        throw new Error('useAPIKey must be used within an APIKeyProvider');
    }
    return context;
};

// Helper to get API key for direct API calls
export const getSessionAPIKey = (): { provider: AIProvider; apiKey: string } | null => {
    try {
        const stored = sessionStorage.getItem('user_api_key_config');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.apiKey) {
                return { provider: parsed.provider, apiKey: parsed.apiKey };
            }
        }
    } catch (e) {
        // Ignore
    }
    return null;
};
