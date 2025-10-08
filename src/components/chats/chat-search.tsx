"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ChatSearch({ value, onChange, placeholder = "Search chats..." }: ChatSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}