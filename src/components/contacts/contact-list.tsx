"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2 } from "lucide-react";
import { ContactCard } from "./contact-card";
import { AddContactDialog } from "./add-contact-dialog";

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

interface ContactListProps {
  onMessage?: (contactId: string) => void;
  onRemove?: (contactId: string) => void;
  onBlock?: (contactId: string) => void;
}

export function ContactList({ onMessage, onRemove, onBlock }: ContactListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredContacts(
        contacts.filter(
          (contact) =>
            contact.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (contact.nickname && contact.nickname.toLowerCase().includes(searchQuery.toLowerCase()))
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

  const handleAddContact = () => {
    setShowAddDialog(true);
  };

  const handleContactAdded = () => {
    fetchContacts();
    setShowAddDialog(false);
  };

  const handleRemoveContact = async (contactId: string) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setContacts(contacts.filter((c) => c.id !== contactId));
      } else {
        console.error("Failed to remove contact");
      }
    } catch (error) {
      console.error("Error removing contact:", error);
    }
  };

  const handleBlockContact = async (contactId: string) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}/block`, {
        method: "POST",
      });

      if (response.ok) {
        setContacts(contacts.filter((c) => c.id !== contactId));
      } else {
        console.error("Failed to block contact");
      }
    } catch (error) {
      console.error("Error blocking contact:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAddContact}>
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="space-y-2">
        {filteredContacts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {contacts.length === 0 ? "No contacts yet" : "No contacts match your search"}
          </p>
        ) : (
          filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onMessage={onMessage}
              onRemove={onRemove || handleRemoveContact}
              onBlock={onBlock || handleBlockContact}
            />
          ))
        )}
      </div>

      <AddContactDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onContactAdded={handleContactAdded}
      />
    </div>
  );
}