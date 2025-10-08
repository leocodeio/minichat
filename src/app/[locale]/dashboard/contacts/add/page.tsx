"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { AddContactDialog } from "@/components/contacts/add-contact-dialog";

export default function AddContactPage() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const handleContactAdded = () => {
    setShowDialog(false);
    router.push("/dashboard/contacts");
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
              onClick={() => router.push("/dashboard/contacts")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Contacts
            </Button>
            <h1 className="text-2xl font-bold">Add Contact</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add New Contact</CardTitle>
              <CardDescription>
                Find and add new contacts using their unique code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How to add contacts</h3>
                  <p className="text-muted-foreground">
                    Ask your friends for their unique code or share yours to connect.
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button size="lg" onClick={() => setShowDialog(true)}>
                    Search by Unique Code
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Tips:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 text-left max-w-md mx-auto">
                    <li>• Unique codes are 8-10 characters long</li>
                    <li>• Codes contain letters and numbers</li>
                    <li>• You can find your code in your profile settings</li>
                    <li>• Only accepted contacts can message you</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <AddContactDialog
            open={showDialog}
            onOpenChange={setShowDialog}
            onContactAdded={handleContactAdded}
          />
        </div>
      </main>
    </div>
  );
}