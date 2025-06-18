import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { SettingsTabProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import suggestedTopicsData from "@/data/suggestedTopics.json";
import { cn } from "@/lib/utils";
import { Plus, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PriorityTopics = ({
  slackData,
  setSlackData,
  SyncLoading,
  syncData,
  provider
}: SettingsTabProps) => {
  const [inputValue, setInputValue] = useState("");
  const isMobile = useIsMobile();

  const [suggestedTopics] = useState(suggestedTopicsData);

  const addTopic = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || slackData?.priorityTopics?.includes(trimmed)) return;

    setSlackData((prev) => ({
      ...prev,
      priorityTopics: [...(prev.priorityTopics ?? []), trimmed],
    }));

    setInputValue("");
  };

  const removeTopic = (topic: string) => {
    setSlackData((prev) => ({
      ...prev,
      priorityTopics: (prev.priorityTopics ?? []).filter(
        (item) => item !== topic
      ),
    }));
  };

  const addSuggestedTopic = (topic: { name: string }) => {
    setSlackData((prev) => {
      const currentTopics = prev.priorityTopics ?? [];
      if (currentTopics.includes(topic.name)) return prev;

      return {
        ...prev,
        priorityTopics: [...currentTopics, topic.name],
      };
    });
  };

  return (
    <>
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-white mb-4">
          What topics matter most?
        </h2>
        {syncData && <Button
          variant="outline"
          size="none"
          onClick={syncData}
          disabled={SyncLoading}
          className="text-white/80 border-white/20 hover:bg-white/10 hover:text-white px-2 py-1"
        >
          {SyncLoading && (
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-white animate-spin dark:text-white fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
          {SyncLoading ? "Syncing" : "Sync"}
        </Button>}
      </div>
      <p className="text-white/60 text-sm">
        Add keywords or topics that are important across your communications.
        We'll flag any messages containing these keywords.
      </p>
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="priority-topic" className="text-off-white text-sm">
            Add important topics
          </Label>
          <p className="text-xs sm:text-sm text-off-white/70 -mt-1">
            Enter keywords like "urgent", "site down", or specific project names
            that should be highlighted.
          </p>
          <div className="flex gap-2">
            <Input
              id="priority-topic"
              placeholder="Enter keyword or topic"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTopic()}
              className="bg-white/15 border-white/20 text-off-white placeholder:text-white/50 text-sm"
            />
            <Button
              onClick={addTopic}
              variant="outline"
              className="shrink-0"
              size={isMobile ? "sm" : "default"}
            >
              <Plus size={isMobile ? 14 : 16} />
              <span className={isMobile ? "ml-1" : "ml-2"}>Add</span>
            </Button>
          </div>

          {slackData?.priorityTopics?.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2 pt-2">
              {slackData?.priorityTopics?.map((topic) => (
                <div
                  key={topic}
                  className="flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-glass-blue/10 border border-glass-blue/40 text-xs sm:text-sm text-off-white"
                >
                  <Tag
                    size={isMobile ? 12 : 14}
                    className="text-glass-blue/80"
                  />
                  {topic}
                  <button
                    onClick={() => removeTopic(topic)}
                    className="ml-1 focus:outline-none text-off-white/70 hover:text-bright-orange"
                  >
                    <X size={isMobile ? 12 : 14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggested topics section */}
        <div className="space-y-2 sm:space-y-3 pt-1 sm:pt-2">
          <h3 className="text-base sm:text-lg font-medium text-off-white">
            Common Topics
          </h3>
          <p className="text-xs sm:text-sm text-off-white/70">
            Click to add these suggested topics to your priority list.
          </p>

          <div className="flex flex-wrap gap-1 sm:gap-2">
            {suggestedTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => addSuggestedTopic(topic)}
                className={cn(
                  "px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs sm:text-sm",
                  slackData?.priorityTopics?.includes(topic.name)
                    ? "bg-glass-blue/10 border-glass-blue/40 text-glass-blue"
                    : "bg-white/10 border-white/20 text-off-white hover:border-white/40"
                )}
              >
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Tag size={isMobile ? 10 : 12} />
                  {topic.name}
                </div>
              </button>
            ))}
          </div>

          {/* Topics by category - stack vertically on mobile */}
          <div
            className={`${
              isMobile ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 gap-4"
            } mt-4`}
          >
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-medium text-off-white/80">
                Priority & Work
              </h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {suggestedTopics
                  .filter(
                    (t) => t.category === "Priority" || t.category === "Work"
                  )
                  .map((topic) => (
                    <button
                      key={`cat-${topic.id}`}
                      onClick={() => addSuggestedTopic(topic)}
                      className={cn(
                        "px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs",
                        slackData?.priorityTopics?.includes(topic.name)
                          ? "bg-glass-blue/10 border border-glass-blue/40 text-glass-blue"
                          : "bg-white/10 text-off-white/70 hover:text-off-white"
                      )}
                    >
                      {topic.name}
                    </button>
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-medium text-off-white/80">
                Technical
              </h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {suggestedTopics
                  .filter((t) => t.category === "Technical")
                  .map((topic) => (
                    <button
                      key={`cat-${topic.id}`}
                      onClick={() => addSuggestedTopic(topic)}
                      className={cn(
                        "px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs",
                        slackData?.priorityTopics?.includes(topic.name)
                          ? "bg-glass-blue/10 border border-glass-blue/40 text-glass-blue"
                          : "bg-white/10 text-off-white/70 hover:text-off-white"
                      )}
                    >
                      {topic.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriorityTopics;
