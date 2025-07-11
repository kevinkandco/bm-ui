import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from 'lucide-react';

interface FollowUpItem {
  id: string;
  title: string;
  from: string;
  priority: 'Critical' | 'urgent' | 'medium';
  tags: string[];
  isStarred?: boolean;
}

const followUpItems: FollowUpItem[] = [
  {
    id: '1',
    title: 'Approve Q3 budget proposal and financial projections',
    from: 'Sarah Chen',
    priority: 'Critical',
    tags: ['budget'],
    isStarred: true
  },
  {
    id: '2',
    title: 'Sign off on marketing campaign launch plan',
    from: 'Mike Johnson',
    priority: 'Critical',
    tags: ['urgent'],
    isStarred: true
  },
  {
    id: '3',
    title: 'Review contract terms and conditions',
    from: 'Alex Smith',
    priority: 'medium',
    tags: ['legal']
  }
];

export const FollowUpsSection = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'urgent':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'budget':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'urgent':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'legal':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white mb-4">Follow ups</h2>
      
      <div className="space-y-4">
        {followUpItems.map((item) => (
          <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg bg-surface-raised/30 border border-white/10">
            {/* Purple icon placeholder */}
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
              <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-sm font-medium text-white leading-relaxed">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-white/70">from {item.from}</span>
                  {item.isStarred && <Star className="w-4 h-4 text-green-400 fill-green-400" />}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                  {item.from.split(' ')[0]} {item.from.split(' ')[1].charAt(0)}
                </Badge>
                
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className={getTagColor(tag)}>
                    {tag}
                  </Badge>
                ))}
                
                <Badge variant="secondary" className={getPriorityColor(item.priority)}>
                  {item.priority}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};