import React, { useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, MessageSquare, Plus, Check } from "lucide-react";

const BaseURL = import.meta.env.VITE_API_HOST;
interface BriefModalProps {
  open: boolean;
  onClose: () => void;
}

interface SlackMessage {
  id: string;
  type: 'slack';
  sender: string;
  channel: string;
  preview: string;
  time: string;
}

interface EmailMessage {
  id: string;
  type: 'email';
  sender: string;
  subject: string;
  preview: string;
  time: string;
}

type Message = SlackMessage | EmailMessage;

const BriefModal = ({ open, onClose }: BriefModalProps) => {
  const { toast } = useToast();
  const [markedImportant, setMarkedImportant] = useState(new Set<string>());
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  const handleMarkImportant = useCallback((messageId: string) => {
    setMarkedImportant(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  const handleSubmit = () => {
    toast({
      title: "Brief Submitted",
      description: "Your brief has been submitted for processing.",
    });
    onClose();
  };

  const messages: Message[] = [
    {
      id: "1",
      type: 'slack',
      sender: "John Doe",
      channel: "#general",
      preview: "Hey, did you see the latest update on the project?",
      time: "9:00 AM",
    },
    {
      id: "2",
      type: 'email',
      sender: "Jane Smith",
      subject: "Project Update",
      preview: "Attached is the latest project report for your review.",
      time: "10:30 AM",
    },
    {
      id: "3",
      type: 'slack',
      sender: "Peter Jones",
      channel: "#random",
      preview: "Anyone up for a coffee break?",
      time: "11:15 AM",
    },
  ];

  const renderMessageItem = (message: Message) => (
    <div key={message.id} className="group relative flex items-start gap-3 p-3 bg-surface-overlay/20 rounded-lg hover:bg-surface-overlay/30 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
        {message.type === 'slack' ? (
          <MessageSquare className="h-4 w-4 text-accent-primary" />
        ) : (
          <Mail className="h-4 w-4 text-accent-primary" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-text-primary text-sm">{message.sender}</span>
              <span className="text-xs text-text-secondary">
                {message.type === 'slack' ? (message as SlackMessage).channel : (message as EmailMessage).subject}
              </span>
            </div>
            <p className="text-sm text-text-secondary line-clamp-2 mb-1">
              {message.preview}
            </p>
            <span className="text-xs text-text-tertiary">{message.time}</span>
          </div>
          
          <div className="relative flex items-center">
            <div 
              className={`transition-all duration-300 ease-out ${
                hoveredMessage === message.id 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-2 pointer-events-none'
              }`}
            >
              <span className="text-xs text-text-secondary whitespace-nowrap mr-2">
                Include
              </span>
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleMarkImportant(message.id)}
              onMouseEnter={() => setHoveredMessage(message.id)}
              onMouseLeave={() => setHoveredMessage(null)}
              className={`h-7 w-7 transition-all duration-200 ${
                markedImportant.has(message.id)
                  ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                  : 'hover:bg-surface-overlay/50 text-text-secondary hover:text-text-primary'
              }`}
            >
              {markedImportant.has(message.id) ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      {/* SheetTrigger can be added here if needed */}
      <SheetContent className="sm:max-w-[480px]">
        <SheetHeader>
          <SheetTitle>Create New Brief</SheetTitle>
          <SheetDescription>
            Select the messages you want to include in your brief.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Input
              id="search"
              placeholder="Search messages..."
              className="pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full"
            >
              {/* Search Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search h-4 w-4 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Brief Name</Label>
            <Input id="name" placeholder="Brief Name" />
          </div>

          <div className="border-y border-border-subtle py-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-text-primary">
                Recent Messages
              </h4>
              <Button variant="link" size="sm">
                View All
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[300px]">
            <div className="pb-2">
              {messages.map(renderMessageItem)}
            </div>
          </ScrollArea>
        </div>
        <SheetFooter>
          <Button type="submit" onClick={handleSubmit}>
            Submit Brief
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BriefModal;
