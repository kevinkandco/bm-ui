import { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Person, ValidationError } from "../types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/onboarding/priority-people/types";

interface ProviderSettingsModalProps {
  open: boolean;
  onClose: () => void;
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  saveLoading?: boolean;
  hasTriedToSave?: boolean;
  setHasTriedToSave?: React.Dispatch<React.SetStateAction<boolean>>;
  validationErrors: ValidationError[];
  onSave: () => Promise<void>;
  provider: { id: number; name: string };
}

const AddEmailModal = ({
  open,
  onClose,
  people,
  setPeople,
  saveLoading,
  hasTriedToSave,
  setHasTriedToSave,
  validationErrors,
  onSave,
  provider,
}: ProviderSettingsModalProps) => {
  useEffect(() => {
    // Remove any fully empty row that is not the last one
    if (people.length > 1) {
      const filtered = people.filter((person, index) => {
        const isLast = index === people.length - 1;
        const isEmpty = !person.name.trim() && !person.email.trim();
        return !isEmpty || isLast;
      });

      if (filtered.length !== people.length) {
        setPeople(filtered);
      }
    }
  }, [people, setPeople]);

  const labels: Label[] = [
    "Spouse",
    "Manager",
    "Collaborator",
    "CFO",
    "Team Member",
    "Client",
    "Other",
  ];

  const handleChange = useCallback(
    (index: number, field: keyof Person, value: string) => {
      setHasTriedToSave(false);
      setPeople((prev) => {
        const updated = [...prev];
        updated[index][field] = value;

        const isLast = index === updated.length - 1;
        const last = updated[updated.length - 1];

        // If typing into last row, auto-add one more row
        if (isLast && last.email.trim()) {
          updated.push({ name: "", email: "", label: "" });
        }

        return updated;
      });
    },
    [setPeople, setHasTriedToSave]
  );

  const addLabel = useCallback(
    (index: number, label: string) => {
      setPeople((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          label,
        };
        return updated;
      });
    },
    [setPeople]
  );

  const removePerson = useCallback(
    (index: number) => {
      const updated = people.filter((_, i) => i !== index);
      setPeople(
        updated.length === 0 ? [{ name: "", email: "", label: "" }] : updated
      );
    },
    [people, setPeople]
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[60rem] max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border border-gray-700/40">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-medium text-white">
              Add Priority People
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 pl-6 flex flex-col">
            <div className="flex-1 overflow-y-auto px-2 pb-2">
              {people.map((person, index) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-white/80 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={person.name}
                        onChange={(e) =>
                          handleChange(index, "name", e.target.value)
                        }
                        className="w-full h-11 px-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-white/80 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={person.email}
                        onChange={(e) =>
                          handleChange(index, "email", e.target.value)
                        }
                        className="w-full h-11 px-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                        placeholder="Enter email"
                      />
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={index === people.length - 1}
                          className={`sm:mt-6 sm:min-w-28 h-[44px] p-[10px] min-w-full sm:w-auto w-full text-sm rounded-lg transition font-medium
                            ${
                              index === people.length - 1
                                ? "bg-white/10 border-white/20 text-white/50 !cursor-not-allowed opacity-50"
                                : "bg-white/20 dark:bg-white/10 border-black/30 dark:border-white/20 text-foreground/80 dark:text-white/70 hover:bg-white/30"
                            }`}
                        >
                          {person?.label ? person.label : "Add Label"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-0 bg-card border-border">
                        <div className="p-2">
                          <div className="space-y-1">
                            {labels.map((label) => (
                              <div
                                key={label}
                                className="flex items-center p-2 hover:bg-accent/15 dark:hover:bg-white/10 rounded cursor-pointer"
                                onClick={() => addLabel(index, label)}
                              >
                                <span className="text-foreground dark:text-white text-sm">
                                  {label}
                                </span>
                              </div>
                            ))}
                            {person?.label && (
                              <div
                                className="flex items-center p-2 hover:bg-accent/15 dark:hover:bg-white/10 rounded cursor-pointer"
                                onClick={() => addLabel(index, "")}
                              >
                                <span className="text-foreground/70 dark:text-white/70 text-xs">
                                  Remove Label
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <div className="sm:w-auto w-full">
                      <button
                        onClick={() =>
                          index < people.length - 1 && removePerson(index)
                        }
                        disabled={index === people.length - 1}
                        className={`self-end sm:mt-6 p-[10px] sm:h-[44px] h-11 sm:w-auto w-full text-sm rounded-lg transition font-medium border
                          ${
                            index === people.length - 1
                              ? "text-red-400 border-red-400 bg-transparent cursor-not-allowed opacity-50"
                              : "text-red-700 border-red-700 hover:text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
                          }`}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                  {hasTriedToSave &&
                    validationErrors.find((err) => err.index === index) && (
                      <div className="text-red-400 text-sm mt-1 sm:col-span-2">
                        {
                          validationErrors.find((err) => err.index === index)
                            ?.message
                        }
                      </div>
                    )}
                </div>
              ))}
            </div>

            <div className="flex justify-end items-center pt-4 mt-auto border-t border-white/10">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="text-white/80 border-white/20 hover:bg-white/10 hover:text-white"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 min-w-32"
                  onClick={onSave}
                  disabled={saveLoading}
                >
                  {saveLoading ? "Saving..." : "Add Email"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmailModal;
