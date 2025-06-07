
import React, { useState } from "react";
import { Edit2, Trash2, Merge, X, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag } from "./types";

interface TagManagerProps {
  tags: Tag[];
  onUpdateTag: (tagId: number, updates: Partial<Tag>) => void;
  onDeleteTag: (tagId: number) => void;
  onMergeTag: (sourceTagId: number, targetTagId: number) => void;
  onClose: () => void;
}

const TagManager = ({
  tags,
  onUpdateTag,
  onDeleteTag,
  onMergeTag,
  onClose
}: TagManagerProps) => {
  const [editingTag, setEditingTag] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [mergingFrom, setMergingFrom] = useState<number | null>(null);

  const predefinedColors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#F97316", "#06B6D4", "#84CC16"
  ];

  const predefinedEmojis = ["🏷️", "💼", "👤", "🎯", "🚀", "📧", "💡", "⭐"];

  const startEdit = (tag: Tag) => {
    setEditingTag(tag.id);
    setEditName(tag.name);
  };

  const saveEdit = (tagId: number) => {
    if (editName.trim()) {
      onUpdateTag(tagId, { name: editName.trim() });
    }
    setEditingTag(null);
    setEditName("");
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setEditName("");
  };

  const handleMerge = (targetTagId: number) => {
    if (mergingFrom && mergingFrom !== targetTagId) {
      onMergeTag(mergingFrom, targetTagId);
      setMergingFrom(null);
    }
  };

  return (
    <div className="bg-white/5 rounded-lg border border-white/10 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-text-primary">Manage Tags</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {mergingFrom && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-400 mb-2">
            Select a tag to merge "{tags.find(t => t.id === mergingFrom)?.name}" into:
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMergingFrom(null)}
            className="text-text-secondary hover:text-text-primary"
          >
            Cancel merge
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              mergingFrom === tag.id 
                ? 'border-blue-500/50 bg-blue-500/10' 
                : mergingFrom && mergingFrom !== tag.id
                ? 'border-green-500/50 bg-green-500/5 cursor-pointer hover:bg-green-500/10'
                : 'border-white/10 bg-white/5'
            }`}
            onClick={() => mergingFrom && mergingFrom !== tag.id && handleMerge(tag.id)}
          >
            <div className="flex items-center space-x-3 flex-1">
              {/* Emoji & Color Selectors */}
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-xl hover:bg-white/10 rounded p-1 transition-colors">
                      {tag.emoji}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <div className="grid grid-cols-4 gap-1 p-2">
                      {predefinedEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => onUpdateTag(tag.id, { emoji })}
                          className="w-8 h-8 rounded hover:bg-white/10 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="w-4 h-4 rounded-full border-2 border-white/20 hover:border-white/40 transition-colors"
                      style={{ backgroundColor: tag.color }}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <div className="grid grid-cols-4 gap-1 p-2">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => onUpdateTag(tag.id, { color })}
                          className="w-6 h-6 rounded-full transition-all hover:scale-110"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tag Name */}
              <div className="flex-1">
                {editingTag === tag.id ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-white/5 border-white/20 h-8"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(tag.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <Button size="icon" variant="ghost" onClick={() => saveEdit(tag.id)} className="h-8 w-8">
                      <Check className="h-4 w-4 text-green-400" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={cancelEdit} className="h-8 w-8">
                      <X className="h-4 w-4 text-text-secondary" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="secondary" 
                      style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                    >
                      {tag.name}
                    </Badge>
                    {tag.isDefault && (
                      <span className="text-xs text-text-secondary">(Default)</span>
                    )}
                    {mergingFrom && mergingFrom !== tag.id && (
                      <ArrowRight className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {!mergingFrom && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEdit(tag)}
                  className="h-8 w-8"
                >
                  <Edit2 className="h-4 w-4 text-text-secondary" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMergingFrom(tag.id)}
                  className="h-8 w-8"
                  disabled={tags.length <= 1}
                >
                  <Merge className="h-4 w-4 text-text-secondary" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteTag(tag.id)}
                  className="h-8 w-8"
                  disabled={tag.isDefault}
                >
                  <Trash2 className="h-4 w-4 text-text-secondary" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagManager;
