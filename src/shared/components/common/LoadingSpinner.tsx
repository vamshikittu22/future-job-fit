interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
}

export default function LoadingSpinner({ 
  message = "Loading...", 
  submessage 
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-transparent border-r-accent/40 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-xl font-semibold mb-2">{message}</h2>
        {submessage && (
          <p className="text-muted-foreground max-w-md mx-auto">{submessage}</p>
        )}
      </div>
    </div>
  );
}