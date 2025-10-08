"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface BlockContactConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  contactName?: string;
}

export function BlockContactConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  contactName
}: BlockContactConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Block Contact
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to block {contactName || "this contact"}?
            This will remove them from your contacts and prevent them from messaging you.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Block Contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}