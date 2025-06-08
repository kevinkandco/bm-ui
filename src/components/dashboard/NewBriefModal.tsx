
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface NewBriefModalProps {
  open: boolean;
  onClose: () => void;
}

const NewBriefModal = ({ open, onClose }: NewBriefModalProps) => {
  const { toast } = useToast();

  const handleCreateBrief = () => {
    toast({
      title: "Brief Created",
      description: "Your new brief has been created successfully"
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Brief</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            This will create a new brief with your current settings.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreateBrief}>
              Create Brief
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewBriefModal;
