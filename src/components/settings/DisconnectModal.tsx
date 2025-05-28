import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut, X } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";

interface SignOutModalProps {
  provider: {id: number, name: string};
  open: boolean;
  onClose: () => void;
  onDisconnect: (provider: {id: number, name: string}) => void;
}

const DisconnectModal = ({ provider, open, onClose, onDisconnect }: SignOutModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-background/80 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <LogOut className="mr-2 h-5 w-5 text-red-400" />
            Disconnect {capitalizeFirstLetter(provider?.name)}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Are you sure you want to Disconnect {capitalizeFirstLetter(provider?.name)}?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={() => onDisconnect(provider)}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Yes, Disconnect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisconnectModal;
