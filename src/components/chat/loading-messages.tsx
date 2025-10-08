"use client";

interface LoadingMessagesProps {
  count?: number;
  className?: string;
}

export function LoadingMessages({ count = 5, className }: LoadingMessagesProps) {
  return (
    <div className={`space-y-4 p-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`flex gap-3 animate-pulse ${index % 2 === 0 ? "" : "flex-row-reverse"}`}>
          <div className="w-8 h-8 bg-muted rounded-full flex-shrink-0" />

          <div className={`flex flex-col space-y-2 max-w-[70%] ${index % 2 === 0 ? "" : "items-end"}`}>
            <div className="h-4 bg-muted rounded w-16" />
            <div className={`h-10 bg-muted rounded-2xl ${index % 2 === 0 ? "rounded-bl-md" : "rounded-br-md"} ${
              index % 3 === 0 ? "w-48" : index % 3 === 1 ? "w-32" : "w-64"
            }`} />
          </div>
        </div>
      ))}
    </div>
  );
}