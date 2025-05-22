
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Headphones, Monitor, Wifi, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Http from "@/Http";

const BaseURL = import.meta.env.VITE_API_HOST;

interface FocusModeProps {
  open: boolean;
  onClose: () => void;
  SaveChangesAndClose: (focusTime: number) => void;
}

const FocusMode = ({ open, onClose, SaveChangesAndClose }: FocusModeProps) => {
  const { toast } = useToast();
  const [focusTime, setFocusTime] = useState(30);
  const [options, setOptions] = useState({
    updateStatus: true,
    closeApps: false,
    monitorNotifications: true,
    enableDnd: true
  });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartFocus = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			if (!token) {
				setLoading(false);
				navigate("/");
				return;
			}
			Http.setBearerToken(token);
			const response = await Http.callApi(
				"post",
				`${BaseURL}/api/focus-mode`,
				{...options, focusDuration: focusTime }
			);
			if (response) {
				toast({
					title: "Focus Mode Activated",
					description: `Focus mode activated for ${focusTime} minutes`,
				});
				SaveChangesAndClose(focusTime);
			} else {
				console.error("Failed to fetch user data");
        toast({
					title: "Focus Mode Activation Failed",
					description: "Focus mode activation failed. please try again sometime later.",
				});
			}
		} catch (error) {
			console.error("Error fetching user data:", error);
			const errorMessage =
				error?.response?.data?.message ||
				error?.message ||
				"Focus mode activation failed. please try again sometime later.";

			toast({
				title: "Focus Mode Activation failed",
				description: errorMessage,
			});
		} finally {
			setLoading(false);
		}
	};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-background/80 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Headphones className="mr-2 h-5 w-5 text-blue-400" />
            Focus Mode
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Minimize distractions and focus on what matters most
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="bg-white/10 rounded-lg border border-white/10 p-4">
            <h4 className="text-sm font-medium text-white mb-2">Focus Duration</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-white/70">Time: {focusTime} minutes</span>
                <div className="flex gap-2">
                  {[25, 50, 90].map(time => (
                    <Button 
                      key={time} 
                      variant="outline"
                      size="sm"
                      className={`${focusTime === time ? "bg-blue-500/20 text-blue-400 border-blue-500/50" : "bg-white/5 text-white/70 border-white/10"} hover:bg-white/10`}
                      onClick={() => setFocusTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Slider
                value={[focusTime]}
                min={5}
                max={120}
                step={5}
                onValueChange={(value) => setFocusTime(value[0])}
                className="py-2"
              />
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-medium text-white">Options</h4>
            
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-blue-400" />
                <Label htmlFor="update-status" className="text-white">Update status on connected apps</Label>
              </div>
              <Switch 
                id="update-status"
                checked={options.updateStatus}
                onCheckedChange={() => handleOptionChange("updateStatus")}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-blue-400" />
                <Label htmlFor="close-apps" className="text-white">Close distracting applications</Label>
              </div>
              <Switch 
                id="close-apps"
                checked={options.closeApps}
                onCheckedChange={() => handleOptionChange("closeApps")}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
              <div className="flex items-center space-x-2">
                <Headphones className="h-4 w-4 text-blue-400" />
                <Label htmlFor="enable-dnd" className="text-white">Enable Do Not Disturb</Label>
              </div>
              <Switch 
                id="enable-dnd"
                checked={options.enableDnd}
                onCheckedChange={() => handleOptionChange("enableDnd")}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-blue-400" />
                <Label htmlFor="monitor-notifs" className="text-white">Continue monitoring for urgent messages</Label>
              </div>
              <Switch 
                id="monitor-notifs"
                checked={options.monitorNotifications}
                onCheckedChange={() => handleOptionChange("monitorNotifications")}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleStartFocus} className="bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
            {loading ? (
              <svg aria-hidden="true" className="w-8 h-8 text-white animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              ) : <Headphones className="mr-2 h-4 w-4" />
            } Start Focus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FocusMode;
