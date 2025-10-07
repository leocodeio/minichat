"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBetterAuthSignout, getSession } from "@/server/services/auth/auth-client";
import { User, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const signout = useBetterAuthSignout();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        if (session?.data?.user) {
          setUser({
            id: session.data.user.id,
            name: session.data.user.name || "User",
            email: session.data.user.email,
            image: session.data.user.image || undefined,
          });
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to get session:", error);
        toast.error("Failed to load session");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t("loading")}</p>
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
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={signout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("signOut")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Welcome Card */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("welcome.title")}
              </CardTitle>
              <CardDescription>
                {t("welcome.description", { name: user.name })}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("profile.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">{t("profile.name")}</p>
                <p className="text-sm text-muted-foreground">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{t("profile.email")}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                {t("profile.edit")}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t("actions.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                {t("actions.createProject")}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                {t("actions.viewProjects")}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                {t("actions.settings")}
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>{t("stats.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">{t("stats.projects")}</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("stats.storage")}</span>
                <span className="font-medium">0 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("stats.members")}</span>
                <span className="font-medium">1</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}