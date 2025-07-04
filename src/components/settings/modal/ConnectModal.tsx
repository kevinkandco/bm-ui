import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Check, X } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";

interface ConnectModalProps {
  open: boolean;
  onClose: () => void;
  onConnect: () => void;
  providerName?: string; // optional, default to Google Calendar
}

const ConnectModal = ({
  open,
  onClose,
  onConnect,
  providerName = "Google Calendar"
}: ConnectModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-background/80 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-green-400" />
            Connect {capitalizeFirstLetter(providerName)}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Do you want to connect your {capitalizeFirstLetter(providerName)} account?
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
            onClick={onConnect}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Yes, Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectModal;
