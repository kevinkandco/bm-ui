
import { useCallback } from "react";

interface FeedbackEvent {
  type: 'summary_up' | 'summary_down' | 'summary_comment' | 'action_relevant' | 'action_irrelevant' | 'manual_add' | 'personalization_reset' | 'action_positive_training' | 'action_negative_training';
  briefId?: string;
  itemId?: string;
  comment?: string;
  feedback?: string;
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

  const handleSummaryFeedback = useCallback((briefId: string, type: 'up' | 'down', comment?: string) => {
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

  const handleActionRelevance = useCallback((briefId: string, itemId: string, relevant: boolean, feedback?: string) => {
    if (feedback) {
      // If there's detailed feedback, track it as training data
      trackFeedback({
        type: relevant ? 'action_positive_training' : 'action_negative_training',
        briefId,
        itemId,
        feedback
      });
    } else {
      // Simple relevance feedback
      trackFeedback({
        type: relevant ? 'action_relevant' : 'action_irrelevant',
        briefId,
        itemId
      });
    }
  }, [trackFeedback]);

  const handleAddMissingContent = useCallback((briefId: string, content: string) => {
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
