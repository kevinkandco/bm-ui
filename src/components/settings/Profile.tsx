import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import SaveChangeButton from "./SaveChangeButton";
import TextInput from "./TextInput";

const Profile = () => {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
    });
  };
  return (
    <div className="md:col-span-3 p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        Profile Settings
      </h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-text-primary mb-4">
          Personal Information
        </h3>
        <div className="space-y-4 max-w-2xl">
          <TextInput label="Full Name" defaultValue="Alex Johnson" />
          <TextInput
            label="Email Address"
            defaultValue="alex.johnson@example.com"
            type="email"
          />
          <TextInput label="Job Title" defaultValue="Senior Product Manager" />
          <TextInput label="Department" defaultValue="Product Development" />
        </div>
      </div>

      <Separator className="bg-border-subtle my-8" />

      <div className="mb-8">
        <h3 className="text-lg font-medium text-text-primary mb-4">
          Brief Preferences
        </h3>
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-text-primary">Daily Briefs</h4>
              <p className="text-sm text-text-secondary">
                Receive a summary of your day every morning
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-text-primary">
                Weekly Summaries
              </h4>
              <p className="text-sm text-text-secondary">
                Get a comprehensive summary at the end of each week
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <SaveChangeButton onClick={handleSaveSettings} />
    </div>
  );
};

export default Profile;
