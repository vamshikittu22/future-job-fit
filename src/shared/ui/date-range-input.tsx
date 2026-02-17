import React, { useEffect, useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { cn } from '@/shared/lib/utils';
import { AlertCircle, CheckCircle2, Calendar } from 'lucide-react';

interface DateRangeInputProps {
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onCurrentChange?: (checked: boolean) => void;
    startLabel?: string;
    endLabel?: string;
    currentLabel?: string;
    showCurrent?: boolean;
    required?: boolean;
    className?: string;
}

/**
 * Reusable Date Range Input component with validation
 * - Validates that start date is before end date
 * - Shows clear error messages
 * - Supports "current" checkbox for ongoing entries
 */
export const DateRangeInput: React.FC<DateRangeInputProps> = ({
    startDate,
    endDate,
    isCurrent = false,
    onStartDateChange,
    onEndDateChange,
    onCurrentChange,
    startLabel = 'Start Date',
    endLabel = 'End Date',
    currentLabel = 'Currently here',
    showCurrent = true,
    required = false,
    className,
}) => {
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState({ start: false, end: false });

    // Validate date range
    useEffect(() => {
        if (startDate && endDate && !isCurrent) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start > end) {
                setError('Start date must be before end date');
            } else {
                setError(null);
            }
        } else {
            setError(null);
        }
    }, [startDate, endDate, isCurrent]);

    // Check if dates are valid
    const isStartValid = startDate && startDate.length > 0;
    const isEndValid = (isCurrent || (endDate && endDate.length > 0));
    const isRangeValid = !error && isStartValid && isEndValid;

    // Format helper text
    const getFormattedDate = (dateStr: string): string => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr + '-01');
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className={cn('space-y-4', className)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {startLabel}
                        {required && <span className="text-destructive">*</span>}
                        {touched.start && isStartValid && (
                            <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
                        )}
                    </Label>
                    <Input
                        type="month"
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                        onBlur={() => setTouched(prev => ({ ...prev, start: true }))}
                        required={required}
                        className={cn(
                            'transition-colors duration-200',
                            touched.start && isStartValid && 'border-green-500',
                            touched.start && !isStartValid && required && 'border-destructive',
                            error && 'border-destructive'
                        )}
                    />
                    <p className="text-xs text-muted-foreground">
                        Format: YYYY-MM (e.g., 2023-01)
                        {startDate && (
                            <span className="ml-2 text-foreground font-medium">
                                → {getFormattedDate(startDate)}
                            </span>
                        )}
                    </p>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {endLabel}
                        {!isCurrent && required && <span className="text-destructive">*</span>}
                        {touched.end && isEndValid && !error && (
                            <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
                        )}
                    </Label>
                    <Input
                        type="month"
                        value={endDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                        onBlur={() => setTouched(prev => ({ ...prev, end: true }))}
                        disabled={isCurrent}
                        required={required && !isCurrent}
                        className={cn(
                            'transition-colors duration-200',
                            isCurrent && 'bg-muted cursor-not-allowed',
                            touched.end && isEndValid && !isCurrent && !error && 'border-green-500',
                            touched.end && !isEndValid && !isCurrent && required && 'border-destructive',
                            error && 'border-destructive'
                        )}
                    />
                    <p className="text-xs text-muted-foreground">
                        {isCurrent ? (
                            <span className="text-green-600 dark:text-green-400 font-medium">Currently active</span>
                        ) : (
                            <>
                                Format: YYYY-MM (e.g., 2024-06)
                                {endDate && (
                                    <span className="ml-2 text-foreground font-medium">
                                        → {getFormattedDate(endDate)}
                                    </span>
                                )}
                            </>
                        )}
                    </p>
                </div>
            </div>

            {/* Current Checkbox */}
            {showCurrent && onCurrentChange && (
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="current-checkbox"
                        checked={isCurrent}
                        onCheckedChange={(checked) => onCurrentChange(checked as boolean)}
                    />
                    <Label
                        htmlFor="current-checkbox"
                        className="text-sm font-normal cursor-pointer"
                    >
                        {currentLabel}
                    </Label>
                </div>
            )}

            {/* Date Range Error */}
            {error && (
                <div className="flex items-center gap-2 text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}

            {/* Date Range Summary */}
            {isRangeValid && startDate && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 animate-in fade-in duration-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                        {getFormattedDate(startDate)} – {isCurrent ? 'Present' : getFormattedDate(endDate)}
                    </span>
                </div>
            )}
        </div>
    );
};

export default DateRangeInput;
