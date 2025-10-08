"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Archive, Trash2, UserMinus, VolumeX, Volume2 } from "lucide-react";

interface ChatParticipant {
  user: {
    id: string;
    name: string;
    image?: string;
    uniqueCode?: string;
  };
}

interface Chat {
  id: string;
  isGroup: boolean;
  name?: string;
  description?: string;
  participants: ChatParticipant[];
}

interface ChatActionsProps {
  chat: Chat;
  onArchive?: () => void;
  onDelete?: () => void;
  onMute?: () => void;
  onUnmute?: () => void;
  onBlock?: () => void;
  isMuted?: boolean;
}

export function ChatActions({
  chat,
  onArchive,
  onDelete,
  onMute,
  onUnmute,
  onBlock,
  isMuted = false
}: ChatActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={isMuted ? onUnmute : onMute}>
          {isMuted ? (
            <>
              <Volume2 className="w-4 h-4 mr-2" />
              Unmute
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 mr-2" />
              Mute
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onArchive}>
          <Archive className="w-4 h-4 mr-2" />
          Archive Chat
        </DropdownMenuItem>

        {!chat.isGroup && onBlock && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onBlock} className="text-destructive">
              <UserMinus className="w-4 h-4 mr-2" />
              Block Contact
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}