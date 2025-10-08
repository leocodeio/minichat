"use client";

import { cn } from "@/lib/utils";

interface MessageTimestampProps {
  timestamp: string;
  className?: string;
  format?: "short" | "full";
}

export function MessageTimestamp({ timestamp, className, format = "short" }: MessageTimestampProps) {
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (format === "full") {
      return date.toLocaleString();
    }

    if (diffInMinutes < 1) {
      return "now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <span className={cn("text-muted-foreground", className)}>
      {formatTimestamp(timestamp)}
    </span>
  );
}