"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Reply, Edit, Trash2, Copy, MoreVertical } from "lucide-react";

interface MessageContextMenuProps {
  children: ReactNode;
  isOwn: boolean;
  onReply?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
}

export function MessageContextMenu({
  children,
  isOwn,
  onReply,
  onEdit,
  onDelete,
  onCopy
}: MessageContextMenuProps) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {onReply && (
              <DropdownMenuItem onClick={onReply}>
                <Reply className="w-4 h-4 mr-2" />
                Reply
              </DropdownMenuItem>
            )}

            {onCopy && (
              <DropdownMenuItem onClick={onCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </DropdownMenuItem>
            )}

            {isOwn && onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}

            {isOwn && onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}