
import { useCallback } from "react";

interface FeedbackEvent {
  type: 'summary_up' | 'summary_down' | 'summary_comment' | 'action_relevant' | 'action_irrelevant' | 'manual_add' | 'personalization_reset';
  briefId?: number;
  itemId?: string;
  comment?: string;
  timestamp: Date;
}

export const useFeedbackTracking = () => {
  const trackFeedback = useCallback((event: Omit<FeedbackEvent, 'timestamp'>) => {
    const feedbackEvent: FeedbackEvent = {
      ...event,
      timestamp: new Date()
    };
    
    // Log to console for now - in production this would send to analytics
    console.log('Feedback tracked:', feedbackEvent);
    
    // Store locally for immediate personalization
    const existingFeedback = JSON.parse(localStorage.getItem('briefme_feedback') || '[]');
    existingFeedback.push(feedbackEvent);
    localStorage.setItem('briefme_feedback', JSON.stringify(existingFeedback));
    
    // In production, this would also send to your analytics service
    // analytics.track(event.type, feedbackEvent);
  }, []);

  const handleSummaryFeedback = useCallback((briefId: number, type: 'up' | 'down', comment?: string) => {
    trackFeedback({
      type: type === 'up' ? 'summary_up' : 'summary_down',
      briefId,
      comment
    });
    
    if (comment) {
      trackFeedback({
        type: 'summary_comment',
        briefId,
        comment
      });
    }
  }, [trackFeedback]);

  const handleActionRelevance = useCallback((briefId: number, itemId: string, relevant: boolean) => {
    trackFeedback({
      type: relevant ? 'action_relevant' : 'action_irrelevant',
      briefId,
      itemId
    });
  }, [trackFeedback]);

  const handleAddMissingContent = useCallback((briefId: number, content: string) => {
    trackFeedback({
      type: 'manual_add',
      briefId,
      comment: content
    });
  }, [trackFeedback]);

  const handlePersonalizationReset = useCallback(() => {
    trackFeedback({
      type: 'personalization_reset'
    });
    
    // Clear local feedback data
    localStorage.removeItem('briefme_feedback');
  }, [trackFeedback]);

  return {
    handleSummaryFeedback,
    handleActionRelevance,
    handleAddMissingContent,
    handlePersonalizationReset
  };
};
