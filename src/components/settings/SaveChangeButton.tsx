import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveChangeButtonProps {
  onClick: () => void;
}

const SaveChangeButton = ({ onClick }) => {
  return (
    <div className="flex justify-end">
      <Button
        onClick={onClick}
        className="shadow-subtle hover:shadow-glow transition-all"
      >
        <Save className="mr-2 h-5 w-5" /> Save Changes
      </Button>
    </div>
  );
};

export default SaveChangeButton;
