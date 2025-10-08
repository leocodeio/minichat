"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserPlus } from "lucide-react";
import { ContactList } from "@/components/contacts/contact-list";

export default function ContactsPage() {
  const router = useRouter();

  const handleMessage = (_contactId: string) => {
    // Navigate to chat with this contact
    // For now, we'll navigate back to dashboard
    // In a real implementation, this would create/find a chat
    router.push("/dashboard");
  };

  const handleAddContact = () => {
    router.push("/dashboard/contacts/add");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
            <h1 className="text-2xl font-bold">Contacts</h1>
          </div>
          <Button onClick={handleAddContact}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Your Contacts</CardTitle>
              <CardDescription>
                Manage your contacts and start conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactList
                onMessage={handleMessage}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}