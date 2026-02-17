import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/shared/hooks/use-toast';

export type UndoableAction = {
    id: string;
    type: 'delete';
    category: 'experience' | 'education' | 'certification' | 'project' | 'achievement';
    index: number;
    data: any;
    timestamp: number;
};

interface UseUndoOptions {
    timeoutMs?: number;
    onUndo?: (action: UndoableAction) => void;
}

/**
 * Custom hook for managing undoable deletions with toast notifications
 */
export const useUndo = (options: UseUndoOptions = {}) => {
    const { timeoutMs = 5000, onUndo } = options;
    const { toast } = useToast();
    const [pendingAction, setPendingAction] = useState<UndoableAction | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Clear timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Get friendly name for category
    const getCategoryName = (category: UndoableAction['category']): string => {
        switch (category) {
            case 'experience':
                return 'work experience';
            case 'education':
                return 'education';
            case 'certification':
                return 'certification';
            case 'project':
                return 'project';
            case 'achievement':
                return 'achievement';
            default:
                return 'item';
        }
    };

    // Get item title for display
    const getItemTitle = (action: UndoableAction): string => {
        const { data, category } = action;
        switch (category) {
            case 'experience':
                return data.title || data.company || 'Work Experience';
            case 'education':
                return data.institution || data.degree || 'Education';
            case 'certification':
                return data.name || 'Certification';
            case 'project':
                return data.name || 'Project';
            case 'achievement':
                return data.title || 'Achievement';
            default:
                return 'Item';
        }
    };

    // Register a deletable action
    const registerDeletion = useCallback(
        (
            category: UndoableAction['category'],
            index: number,
            data: any,
            performDelete: () => void
        ) => {
            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Create the action
            const action: UndoableAction = {
                id: `${category}-${Date.now()}`,
                type: 'delete',
                category,
                index,
                data,
                timestamp: Date.now(),
            };

            // Perform the deletion
            performDelete();

            // Store the pending action
            setPendingAction(action);

            // Show toast with undo button
            const categoryName = getCategoryName(category);
            const itemTitle = getItemTitle(action);

            const { dismiss } = toast({
                title: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} deleted`,
                description: `"${itemTitle}" was removed.`,
                duration: timeoutMs,
                action: (
                    <button
                        onClick={() => {
                            // Trigger undo
                            if (onUndo) {
                                onUndo(action);
                            }
                            setPendingAction(null);
                            dismiss();
                        }}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                    >
                        Undo
                    </button>
                ),
            });

            // Set timeout to clear pending action
            timeoutRef.current = setTimeout(() => {
                setPendingAction(null);
            }, timeoutMs);
        },
        [toast, timeoutMs, onUndo]
    );

    // Clear pending action (called on step change)
    const clearPendingAction = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setPendingAction(null);
    }, []);

    return {
        pendingAction,
        registerDeletion,
        clearPendingAction,
    };
};

export default useUndo;
