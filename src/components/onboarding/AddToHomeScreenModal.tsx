import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddToHomeScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddToHomeScreenModal = ({ isOpen, onClose }: AddToHomeScreenModalProps) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Detect platform and set default tab
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);
    
    if (isMobile) {
      // Remember last selected tab or default to platform
      const savedTab = localStorage.getItem('homeScreenModalTab');
      if (savedTab && (savedTab === 'ios' || savedTab === 'android')) {
        setActiveTab(savedTab);
      } else {
        setActiveTab(isIOS ? 'ios' : 'android');
      }
    } else {
      setActiveTab('desktop');
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem('homeScreenModalTab', value);
  };

  const copyUrl = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The URL has been copied to your clipboard."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually.",
        variant: "destructive"
      });
    }
  };

  const generateQRCodeUrl = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentUrl}`;
  };

  const isMobile = activeTab === 'ios' || activeTab === 'android';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-text-primary">
            Add Brief Me to your Home Screen
          </DialogTitle>
        </DialogHeader>

        {isMobile ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ios">iOS</TabsTrigger>
              <TabsTrigger value="android">Android</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ios" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium">
                    1
                  </div>
                  <p className="text-sm text-text-secondary">Open this page in Safari.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium">
                    2
                  </div>
                  <p className="text-sm text-text-secondary">Tap the Share icon.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium">
                    3
                  </div>
                  <p className="text-sm text-text-secondary">Tap "Add to Home Screen".</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium">
                    4
                  </div>
                  <p className="text-sm text-text-secondary">Tap "Add".</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="android" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium">
                    1
                  </div>
                  <p className="text-sm text-text-secondary">Open this page in Chrome.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium">
                    2
                  </div>
                  <p className="text-sm text-text-secondary">Tap the ⋮ menu.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium">
                    3
                  </div>
                  <p className="text-sm text-text-secondary">Tap "Add to Home screen" (or "Install App").</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium">
                    4
                  </div>
                  <p className="text-sm text-text-secondary">Tap "Add".</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <img 
                  src={generateQRCodeUrl()} 
                  alt="QR code to open on phone"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-text-secondary text-center">
                Scan on your phone, then follow the steps.
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyUrl}
                className="text-accent-primary hover:text-accent-primary/80"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToHomeScreenModal;