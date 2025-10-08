"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserMinus, UserX } from "lucide-react";

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

interface ContactProfileProps {
  contact: Contact;
  onMessage?: (contactId: string) => void;
  onRemove?: (contactId: string) => void;
  onBlock?: (contactId: string) => void;
  onClose?: () => void;
}

export function ContactProfile({ contact, onMessage, onRemove, onBlock, onClose }: ContactProfileProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src={contact.contact.image} alt={contact.contact.name} />
          <AvatarFallback className="text-2xl">
            {contact.contact.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <CardTitle>{contact.nickname || contact.contact.name}</CardTitle>
        <p className="text-muted-foreground">{contact.contact.email}</p>
        <Badge variant={contact.status === "accepted" ? "default" : "secondary"}>
          {contact.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {contact.contact.uniqueCode && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Unique Code</label>
            <p className="font-mono text-sm bg-muted p-2 rounded mt-1">
              {contact.contact.uniqueCode}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {onMessage && (
            <Button onClick={() => onMessage(contact.contact.id)} className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          )}
          {onRemove && (
            <Button
              variant="outline"
              onClick={() => onRemove(contact.id)}
              className="flex-1"
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Remove
            </Button>
          )}
          {onBlock && (
            <Button
              variant="destructive"
              onClick={() => onBlock(contact.id)}
              className="flex-1"
            >
              <UserX className="w-4 h-4 mr-2" />
              Block
            </Button>
          )}
        </div>

        {onClose && (
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        )}
      </CardContent>
    </Card>
  );
}