import * as React from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Input } from "@/shared/ui/input"

export interface ValidatedInputProps extends React.ComponentProps<"input"> {
  isValid?: boolean
  isInvalid?: boolean
  showValidation?: boolean
  validationMessage?: string
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ className, isValid, isInvalid, showValidation = true, validationMessage, ...props }, ref) => {
    // Determine the validation state
    const hasValue = props.value !== undefined && props.value !== null && props.value !== ''
    const showValidIcon = showValidation && isValid && hasValue && !isInvalid
    const showInvalidIcon = showValidation && isInvalid

    return (
      <div className="relative">
        <Input
          className={cn(
            // Valid state
            showValidIcon && "border-green-500 focus-visible:ring-green-500/30 pr-10",
            // Invalid state  
            showInvalidIcon && "border-destructive focus-visible:ring-destructive/30 pr-10",
            // Transition for smooth state changes
            "transition-colors duration-200",
            className
          )}
          ref={ref}
          {...props}
        />
        {/* Validation icons */}
        {showValidIcon && (
          <CheckCircle2 
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 pointer-events-none animate-in fade-in zoom-in duration-200" 
            aria-hidden="true"
          />
        )}
        {showInvalidIcon && (
          <AlertCircle 
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive pointer-events-none animate-in fade-in zoom-in duration-200" 
            aria-hidden="true"
          />
        )}
      </div>
    )
  }
)
ValidatedInput.displayName = "ValidatedInput"

export { ValidatedInput }
