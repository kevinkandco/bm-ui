import React from 'react';
import { X, Calendar, Mail, AlertTriangle, Clock, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface MessageDetailPanelProps {
  message: {
    id: number;
    platform: string;
    priority: string;
    message: string;
    sender: string;
    time: string;
    actionType: string;
    subject?: string;
    fullMessage?: string;
    from?: string;
    to?: string;
    relevancy?: string;
    reasoning?: string;
    created?: string;
    lastActivity?: string;
    source?: string;
    due?: string;
  } | null;
  onClose: () => void;
}

export function MessageDetailPanel({ message, onClose }: MessageDetailPanelProps) {
  if (!message) return null;

  // Get platform-specific styling
  const platformIcon = message.platform === 'S' ? Calendar : Mail;
  const platformName = message.platform === 'S' ? 'Slack' : 'Email';
  const platformColor = message.platform === 'S' ? 'text-purple-400' : 'text-blue-400';

  // Sample full content based on the reference image
  const sampleContent = message.fullMessage || `
From: ${message.from || message.sender}
Subject: ${message.subject || 'Upcoming Automatic Deposit'}

Full Message:

An automatic deposit of $1,500.00 is scheduled for August 5th, 2026, from your Mercury Uprise Checking account to your Retirement account. You can skip this deposit by 4:00 PM ET on the deposit initiation date if needed.

${message.message}

Best regards,
${message.sender.split('<')[0] || message.sender}
  `.trim();

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-surface-base border-l border-border-subtle shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          {React.createElement(platformIcon, { className: `h-4 w-4 ${platformColor}` })}
          <h2 className="text-lg font-semibold text-text-primary">Message Details</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 text-text-secondary hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Platform and Priority */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-transparent">
              {platformName}
            </Badge>
            <Badge 
              variant="outline" 
              className={`bg-transparent ${
                message.priority === "High" 
                  ? "border-orange-500 text-orange-400" 
                  : message.priority === "Medium"
                  ? "border-yellow-500 text-yellow-400"
                  : "border-green-500 text-green-400"
              }`}
            >
              {message.priority} Priority
            </Badge>
          </div>

          {/* Subject/Title */}
          <div>
            <h3 className="text-base font-medium text-text-primary mb-1">
              {message.subject || 'Upcoming Automatic Deposit'}
            </h3>
            <p className="text-sm text-text-secondary">
              From: {message.from || message.sender}
            </p>
            <p className="text-sm text-text-secondary">
              Time: {message.time}
            </p>
          </div>

          <Separator />

          {/* Message Content */}
          <div className="bg-surface-raised/30 rounded-lg p-4 border border-border-subtle">
            <h4 className="text-sm font-medium text-text-primary mb-2">Full Message:</h4>
            <div className="text-sm text-text-primary whitespace-pre-line leading-relaxed">
              {sampleContent}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            {message.relevancy && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-text-primary">Relevancy</p>
                  <p className="text-xs text-text-secondary">{message.relevancy}</p>
                </div>
              </div>
            )}

            {message.reasoning && (
              <div className="flex items-start gap-2">
                <Tag className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-text-primary">AI Reasoning</p>
                  <p className="text-xs text-text-secondary">{message.reasoning}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-text-secondary" />
                <span className="text-text-secondary">Created: {message.created || message.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-text-secondary" />
                <span className="text-text-secondary">Source: {message.source || platformName}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button className="w-full" size="sm">
              Add to Asana
            </Button>
            <Button variant="outline" className="w-full" size="sm">
              Open in {platformName}
            </Button>
            <Button variant="ghost" className="w-full text-text-secondary" size="sm">
              Mark as Done
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}