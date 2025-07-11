import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import HomePage from "@/components/dashboard/HomePage";

interface HomeViewProps {
  onOpenBrief?: (briefId: number) => void;
  onViewTranscript?: (briefId: number) => void;
  onToggleFocusMode?: () => void;
  onToggleCatchMeUp?: () => void;
  onOpenBriefModal?: () => void;
  onStartFocusMode?: () => void;
  onSignOffForDay?: () => void;
}

export default function HomeView({
  onOpenBrief,
  onViewTranscript,
  onToggleFocusMode,
  onToggleCatchMeUp,
  onOpenBriefModal,
  onStartFocusMode,
  onSignOffForDay
}: HomeViewProps) {
  return (
    <AppLayout>
      <HomePage
        onOpenBrief={onOpenBrief}
        onViewTranscript={onViewTranscript}
        onToggleFocusMode={onToggleFocusMode}
        onToggleCatchMeUp={onToggleCatchMeUp}
        onOpenBriefModal={onOpenBriefModal}
        onStartFocusMode={onStartFocusMode}
        onSignOffForDay={onSignOffForDay}
      />
    </AppLayout>
  );
}