"use client";

import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageStatusProps {
  status: string;
  className?: string;
}

export function MessageStatus({ status, className }: MessageStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "sent":
        return <Check className="w-3 h-3" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      {getStatusIcon()}
    </div>
  );
}