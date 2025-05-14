
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";
import { PriorityPeopleList } from "./priority-people/PriorityPeopleList";
import { SuggestedContacts } from "./priority-people/SuggestedContacts";
import { ManualInputSection } from "./priority-people/ManualInputSection";
import { usePriorityPeopleState } from "./priority-people/usePriorityPeopleState";
import { PriorityPerson } from "./priority-people/types";
import { memo } from "react";

interface PriorityPeopleStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    priorityPeople: Array<PriorityPerson>;
    [key: string]: any;
  };
}

const PriorityPeopleStep = memo(({ onNext, onBack, updateUserData, userData }: PriorityPeopleStepProps) => {
  // Get the state and functions from the custom hook
  const {
    inputValue,
    setInputValue,
    searchQuery,
    setSearchQuery,
    selectedLabel,
    setSelectedLabel,
    priorityPeople,
    platformContacts,
    suggestedContacts,
    filteredManualContacts,
    addPerson,
    removePerson,
    designateContact,
    addLabel
  } = usePriorityPeopleState(
    // Convert userData.priorityPeople to the correct type
    (userData.priorityPeople || []).map(person => ({
      name: person.name,
      role: person.role,
      email: person.email,
      contactName: person.contactName,
      label: person.label
    }))
  );
  
  const handleContinue = () => {
    // Update user data with the current priority people list
    updateUserData({ priorityPeople });
    onNext();
  };

  const handleSkip = () => {
    // Just proceed to next step without saving any priority people
    onNext();
  };

  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={4} totalSteps={9} />
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">Who are your priority people?</h2>
        <p className="text-white/70">Designate important people who should be able to break through Brief-Me barriers.</p>
      </div>
      
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-ice-grey placeholder:text-white/50"
          />
        </div>
        
        {/* Added people list */}
        <PriorityPeopleList
          priorityPeople={priorityPeople}
          removePerson={removePerson}
          designateContact={designateContact}
          addLabel={addLabel}
          contacts={platformContacts}
        />
        
        {/* Manual input with dropdown */}
        <ManualInputSection
          inputValue={inputValue}
          setInputValue={setInputValue}
          selectedLabel={selectedLabel}
          setSelectedLabel={setSelectedLabel}
          addPerson={addPerson}
          filteredManualContacts={filteredManualContacts}
        />

        {/* Suggested contacts */}
        <SuggestedContacts
          suggestedContacts={suggestedContacts}
          priorityPeople={priorityPeople}
          platformContacts={platformContacts}
          addPerson={addPerson}
          removePerson={removePerson}
          designateContact={designateContact}
          addLabel={addLabel}
          searchQuery={searchQuery}
        />
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          onClick={onBack} 
          variant="plain"
          size="none"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          variant="black"
          size="pill"
        >
          Continue
        </Button>
      </div>
      
      <div className="text-center">
        <Button
          variant="link"
          onClick={handleSkip}
          className="text-white/50 hover:text-white"
        >
          Skip this step
        </Button>
      </div>
    </div>
  );
});

PriorityPeopleStep.displayName = 'PriorityPeopleStep';

export default PriorityPeopleStep;
