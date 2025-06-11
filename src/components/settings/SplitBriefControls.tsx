import React from "react";
import { Clock, Mail, Volume2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag, SplitBriefSettings } from "./types";
interface SplitBriefControlsProps {
  tags: Tag[];
  onUpdateSettings: (tagId: string, settings: Partial<SplitBriefSettings>) => void;
}
const SplitBriefControls = ({
  tags,
  onUpdateSettings
}: SplitBriefControlsProps) => {
  const handleToggle = (tagId: string, enabled: boolean) => {
    onUpdateSettings(tagId, {
      enabled
    });
  };
  const handleTimeChange = (tagId: string, time: string) => {
    onUpdateSettings(tagId, {
      time
    });
  };
  const handleDeliveryChange = (tagId: string, type: 'email' | 'audio', enabled: boolean) => {
    onUpdateSettings(tagId, {
      [type]: enabled
    });
  };
  return <div className="space-y-4">
      <h3 className="text-lg font-medium text-text-primary">Split Brief Controls</h3>
      <p className="text-sm text-text-secondary">Configure separate briefs for each account with custom schedules and delivery preferences.</p>

      <div className="space-y-4">
        {tags.map(tag => <div key={tag.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{tag.emoji}</span>
                <Badge variant="secondary" style={{
              backgroundColor: `${tag.color}20`,
              color: tag.color
            }}>
                  {tag.name}
                </Badge>
                <span className="text-sm text-text-secondary">Split Brief</span>
              </div>
              
              <Switch checked={tag.splitBriefEnabled} onCheckedChange={enabled => handleToggle(tag.id, enabled)} />
            </div>

            {tag.splitBriefEnabled && <div className="space-y-4 pl-8 border-l-2 border-white/10">
                {/* Delivery Time */}
                <div className="flex items-center space-x-4">
                  <Clock className="h-4 w-4 text-text-secondary" />
                  <label className="text-sm text-text-secondary min-w-[80px]">
                    Send at
                  </label>
                  <input type="time" value={tag.splitBriefTime} onChange={e => handleTimeChange(tag.id, e.target.value)} className="px-3 py-1 bg-white/5 border border-white/20 rounded text-text-primary text-sm focus:ring-2 focus:ring-accent-primary focus:border-transparent" />
                </div>

                {/* Delivery Format */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-4 w-4 text-text-secondary" />
                    <label className="text-sm text-text-secondary min-w-[80px]">
                      Delivery
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id={`${tag.id}-email`} checked={tag.splitBriefEmail} onCheckedChange={checked => handleDeliveryChange(tag.id, 'email', checked as boolean)} />
                        <label htmlFor={`${tag.id}-email`} className="text-sm text-text-primary cursor-pointer">
                          Email
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id={`${tag.id}-audio`} checked={tag.splitBriefAudio} onCheckedChange={checked => handleDeliveryChange(tag.id, 'audio', checked as boolean)} />
                        <label htmlFor={`${tag.id}-audio`} className="text-sm text-text-primary cursor-pointer">
                          Audio
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-3 p-2 bg-white/5 rounded border border-white/5">
                  <p className="text-xs text-text-secondary">
                    Preview: "{tag.name} Brief" will be delivered at {tag.splitBriefTime} via{' '}
                    {[tag.splitBriefEmail && 'email', tag.splitBriefAudio && 'audio'].filter(Boolean).join(' and ') || 'no delivery method selected'}
                  </p>
                </div>
              </div>}
          </div>)}
      </div>

      {tags.filter(tag => tag.splitBriefEnabled).length === 0 && <div className="text-center py-6 text-text-secondary">
          <p className="text-sm">No split briefs configured yet.</p>
          <p className="text-xs mt-1">Enable split briefs for any tag to get started.</p>
        </div>}
    </div>;
};
export default SplitBriefControls;