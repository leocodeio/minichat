"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MessageCircle, UserMinus, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: string;
  nickname?: string;
  status: string;
  createdAt: string;
  contact: {
    id: string;
    name: string;
    email: string;
    image?: string;
    uniqueCode?: string;
  };
}

interface ContactCardProps {
  contact: Contact;
  onMessage?: (contactId: string) => void;
  onRemove?: (contactId: string) => void;
  onBlock?: (contactId: string) => void;
}

export function ContactCard({ contact, onMessage, onRemove, onBlock }: ContactCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={contact.contact.image} alt={contact.contact.name} />
            <AvatarFallback>
              {contact.contact.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">
                {contact.nickname || contact.contact.name}
              </h3>
              <Badge variant={contact.status === "accepted" ? "default" : "secondary"}>
                {contact.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {contact.contact.email}
            </p>
            {contact.contact.uniqueCode && (
              <p className="text-xs text-muted-foreground font-mono">
                {contact.contact.uniqueCode}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onMessage && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMessage(contact.contact.id)}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onRemove && (
                  <DropdownMenuItem onClick={() => onRemove(contact.id)}>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Remove Contact
                  </DropdownMenuItem>
                )}
                {onBlock && (
                  <DropdownMenuItem onClick={() => onBlock(contact.id)}>
                    <UserX className="w-4 h-4 mr-2" />
                    Block Contact
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}