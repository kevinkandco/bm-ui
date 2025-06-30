
import React, { useState } from "react";
import { X, Users, Mail, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamsInviteModalProps {
  open: boolean;
  onClose: () => void;
}

const TeamsInviteModal = ({ open, onClose }: TeamsInviteModalProps) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [teamMembers] = useState([
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah@company.com",
      avatar: "/placeholder.svg",
      status: "active"
    },
    {
      id: 2,
      name: "Mike Johnson",
      email: "mike@company.com",
      avatar: "/placeholder.svg",
      status: "pending"
    }
  ]);

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      console.log("Inviting:", inviteEmail);
      setInviteEmail("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInvite();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-surface border border-border-subtle">
        <DialogHeader>
          <DialogTitle className="text-text-primary flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite Section */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Invite Team Member</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-white/5 border-white/20 text-text-primary"
              />
              <Button onClick={handleInvite} className="bg-primary-teal hover:bg-accent-green">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Current Team */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Current Team</h3>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-primary-teal/20 text-primary-teal">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{member.name}</p>
                      <p className="text-xs text-text-secondary">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        member.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {member.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-text-secondary hover:text-red-400">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Team Members</span>
              <span className="text-text-primary font-medium">2 / 5</span>
            </div>
            <div className="mt-2 text-xs text-text-secondary">
              You can add 3 more team members to your current plan.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamsInviteModal;
