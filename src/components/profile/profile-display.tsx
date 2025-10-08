"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Edit, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  uniqueCode?: string;
  role?: string;
  phone?: string;
  phoneVerified?: boolean;
  profileCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProfileDisplayProps {
  user?: User;
  onEdit?: () => void;
  onRegenerateCode?: () => void;
}

export function ProfileDisplay({ user, onEdit, onRegenerateCode }: ProfileDisplayProps) {


  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-2xl">{user.name}</CardTitle>
        <p className="text-muted-foreground">{user.email}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Unique Code</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                {user.uniqueCode || "Not generated"}
              </code>
              {user.uniqueCode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(user.uniqueCode!)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Role</label>
            <p className="mt-1">{user.role || "User"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Phone</label>
            <p className="mt-1">{user.phone || "Not provided"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Profile Status</label>
            <div className="mt-1">
              <Badge variant={user.profileCompleted ? "default" : "secondary"}>
                {user.profileCompleted ? "Complete" : "Incomplete"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          {onEdit && (
            <Button onClick={onEdit} className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
          {onRegenerateCode && (
            <Button
              variant="outline"
              onClick={onRegenerateCode}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Code
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}