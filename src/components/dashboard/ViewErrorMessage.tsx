import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BaseURL = import.meta.env.VITE_API_HOST;
interface BriefModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const ViewErrorMessage = ({ open, onClose, message }: BriefModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-96 overflow-y-auto bg-background/80 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-white">Error</DialogTitle>
        </DialogHeader>
        <div className="p-2">
          <p className="text-white/90 text-md">{message || "Something gone Wrong"}</p>
        </div> 
      </DialogContent>
    </Dialog>
  );
};

export default ViewErrorMessage;
