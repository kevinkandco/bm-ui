import React, { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag } from "./types";

interface TagSelectorProps {
  tags: Tag[];
  selectedTagId: number;
  accountId: number;
  onSelect: (tagId: number) => void;
  onCreateTag: (name: string, color: string, emoji: string, accountId: number) => void;
  onCancel: () => void;
}

const TagSelector = ({
  tags,
  selectedTagId,
  accountId,
  onSelect,
  onCreateTag,
  onCancel
}: TagSelectorProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagEmoji, setNewTagEmoji] = useState("🏷️");
  const [newTagColor, setNewTagColor] = useState("#3B82F6");

  const predefinedColors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#F97316", // Orange
    "#06B6D4", // Cyan
    "#84CC16", // Lime
  ];

  const predefinedEmojis = ["🏷️", "💼", "👤", "🎯", "🚀", "📧", "💡", "⭐"];

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag(newTagName.trim(), newTagColor, newTagEmoji, accountId);
      setIsCreating(false);
      setNewTagName("");
      setNewTagEmoji("🏷️");
      setNewTagColor("#3B82F6");
    }
  };

  return (
    <div className="bg-white/10 rounded-lg border border-white/20 p-3 min-w-64">
      {!isCreating ? (
        <div className="space-y-2">
          {/* Existing Tags */}
          <div className="space-y-1">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onSelect(tag.id)}
                className={`w-full flex items-center space-x-2 p-2 rounded hover:bg-white/5 transition-colors ${
                  selectedTagId === tag.id ? 'bg-white/10' : ''
                }`}
              >
                <span className="text-lg">{tag.emoji}</span>
                <Badge 
                  variant="secondary" 
                  style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                  className="text-xs"
                >
                  {tag.name}
                </Badge>
                {selectedTagId === tag.id && (
                  <Check className="h-4 w-4 text-green-400 ml-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Create New Tag */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center space-x-2 p-2 rounded hover:bg-white/5 transition-colors text-blue-400"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">Create new tag...</span>
            </button>
          </div>

          {/* Cancel */}
          <div className="pt-2 border-t border-white/10">
            <Button variant="ghost" size="sm" onClick={onCancel} className="w-full">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="font-medium text-text-primary">Create New Tag</h4>
          
          {/* Tag Name */}
          <Input
            placeholder="Tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="bg-white/5 border-white/20"
            autoFocus
          />

          {/* Emoji Selection */}
          <div>
            <label className="text-sm text-text-secondary mb-2 block">Emoji</label>
            <div className="flex flex-wrap gap-1">
              {predefinedEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setNewTagEmoji(emoji)}
                  className={`w-8 h-8 rounded hover:bg-white/10 transition-colors ${
                    newTagEmoji === emoji ? 'bg-white/20' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="text-sm text-text-secondary mb-2 block">Color</label>
            <div className="flex flex-wrap gap-1">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className={`w-6 h-6 rounded-full transition-all ${
                    newTagColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Button size="sm" onClick={handleCreateTag} disabled={!newTagName.trim()}>
              <Check className="mr-2 h-4 w-4" />
              Create
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
