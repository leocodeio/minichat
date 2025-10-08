"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  name: string;
  email: string;
  image?: string;
  uniqueCode?: string;
}

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactAdded: () => void;
}

export function AddContactDialog({ open, onOpenChange, onContactAdded }: AddContactDialogProps) {
  const [uniqueCode, setUniqueCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    if (!uniqueCode.trim()) {
      toast.error("Please enter a unique code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/by-code/${uniqueCode}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults([data.user]);
      } else {
        setSearchResults([]);
        toast.error("User not found");
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      toast.error("Failed to search for user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (_userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contacts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uniqueCode }),
      });

      if (response.ok) {
        toast.success("Contact added successfully!");
        onContactAdded();
        setUniqueCode("");
        setSearchResults([]);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add contact");
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("Failed to add contact");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUniqueCode("");
    setSearchResults([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="uniqueCode">Enter Unique Code</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="uniqueCode"
                value={uniqueCode}
                onChange={(e) => setUniqueCode(e.target.value)}
                placeholder="Enter user's unique code"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <Label>Search Results</Label>
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Button onClick={() => handleAddContact(user.id)} disabled={isLoading}>
                    Add Contact
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}