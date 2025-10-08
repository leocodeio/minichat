"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  nickname?: string;
  status: string;
  contact: {
    id: string;
    name: string;
    email: string;
    image?: string;
    uniqueCode?: string;
  };
}

interface NewChatDialogProps {
  children: React.ReactNode;
  onChatCreated?: (chatId: string) => void;
}

export function NewChatDialog({ children, onChatCreated }: NewChatDialogProps) {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [creatingChat, setCreatingChat] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchContacts();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredContacts(
        contacts.filter(
          (contact) =>
            contact.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (contact.nickname && contact.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (contact.contact.uniqueCode && contact.contact.uniqueCode.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    } else {
      setFilteredContacts(contacts);
    }
  }, [contacts, searchQuery]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contacts");
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      } else {
        console.error("Failed to fetch contacts");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async (contactId: string) => {
    try {
      setCreatingChat(contactId);
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantIds: [contactId],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Chat created",
          description: "You can now start messaging!",
        });
        onChatCreated?.(data.chat.id);
        setOpen(false);
      } else {
        const error = await response.json();
        toast({
          title: "Failed to create chat",
          description: error.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast({
        title: "Failed to create chat",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setCreatingChat(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : filteredContacts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {contacts.length === 0 ? "No contacts yet" : "No contacts match your search"}
              </p>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
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

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStartChat(contact.contact.id)}
                    disabled={creatingChat === contact.contact.id || contact.status !== "accepted"}
                  >
                    {creatingChat === contact.contact.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MessageCircle className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}