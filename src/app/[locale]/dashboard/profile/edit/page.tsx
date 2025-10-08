"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/server/services/auth/auth-client";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ProfileEdit } from "@/components/profile/profile-edit";
import { ProfilePictureUpload } from "@/components/profile/profile-picture-upload";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  uniqueCode?: string;
  role?: string;
  phoneVerified?: boolean;
  profileCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const session = await getSession();
        if (session?.data?.user) {
          // Fetch full profile data
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const profileData = await response.json();
            setUser(profileData.user);
          } else {
            // Fallback to session data
            setUser({
              id: session.data.user.id,
              name: session.data.user.name || "",
              email: session.data.user.email,
              image: session.data.user.image || undefined,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleSaveProfile = async (updatedUser: Partial<User>) => {
    if (!user) return;

    setSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        toast.success("Profile updated successfully");
        router.push("/dashboard/profile");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/profile")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/settings")}
          >
            Settings
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Picture Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Upload a new profile picture or change your current one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfilePictureUpload
                currentImage={user.image}
                userName={user.name}
                onUpload={async (file) => {
                  const formData = new FormData();
                  formData.append('image', file);

                  const response = await fetch('/api/user/profile-picture', {
                    method: 'PUT',
                    body: formData,
                  });

                  if (response.ok) {
                    const data = await response.json();
                    setUser(prev => prev ? { ...prev, image: data.imageUrl } : null);
                  } else {
                    throw new Error('Upload failed');
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Profile Edit Form */}
          <ProfileEdit
            user={user}
            onSave={handleSaveProfile}
            onCancel={() => router.push("/dashboard/profile")}
          />

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/profile")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/settings")}
                  className="flex-1"
                >
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}