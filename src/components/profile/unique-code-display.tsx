"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, QrCode } from "lucide-react";
import { toast } from "sonner";

interface UniqueCodeDisplayProps {
  uniqueCode?: string;
  onRegenerate?: () => Promise<void>;
  isLoading?: boolean;
}

export function UniqueCodeDisplay({ uniqueCode, onRegenerate, isLoading }: UniqueCodeDisplayProps) {
  const copyToClipboard = async () => {
    if (!uniqueCode) return;

    try {
      await navigator.clipboard.writeText(uniqueCode);
      toast.success("Unique code copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const shareCode = () => {
    if (!uniqueCode) return;

    if (navigator.share) {
      navigator.share({
        title: "My Unique Code",
        text: `Add me on MiniChat using this code: ${uniqueCode}`,
      });
    } else {
      copyToClipboard();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Unique Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {uniqueCode ? (
          <>
            <div className="text-center">
              <code className="text-2xl font-mono bg-muted p-4 rounded-lg block">
                {uniqueCode}
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                Share this code with others to add you as a contact
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={shareCode} variant="outline" className="flex-1">
                Share
              </Button>
              {onRegenerate && (
                <Button
                  onClick={onRegenerate}
                  disabled={isLoading}
                  variant="outline"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No unique code generated yet
            </p>
            {onRegenerate && (
              <Button onClick={onRegenerate} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Generate Code
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}