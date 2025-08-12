import { useState, useCallback, useMemo } from 'react';
import { INITIAL_MEETINGS, SAMPLE_BRIEFS, UPCOMING_BRIEFS, SAMPLE_FOLLOW_UPS } from '@/constants/homeViewData';

// Meeting interface
export interface Meeting {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendees: Array<{
    name: string;
    email: string;
  }>;
  briefing: string;
  aiSummary: string;
  hasProxy: boolean;
  hasNotes: boolean;
  proxyNotes?: string;
  summaryReady: boolean;
  isRecording: boolean;
  minutesUntil: number;
}

// Consolidated state interface
interface HomeViewState {
  // Selection states
  selectedBrief: number | null;
  selectedCalendarItem: string | null;
  selectedMeeting: Meeting | null;
  selectedMessage: any;
  selectedTranscript: any;
  selectedFollowUp: any;
  selectedFollowUpId: number | null;
  
  // UI states
  showAllBriefs: boolean;
  openSection: 'briefs' | 'calendar' | 'followups' | null;
  leftRailTab: 'briefs' | 'calendar' | 'followups';
  isHomeSelected: boolean;
  followUpsFilter: 'all' | 'current';
  
  // Panel states
  showRightDrawer: boolean;
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  
  // Modal states
  showFollowUpModal: boolean;
  showPriorityConfirmModal: boolean;
  showStatusModal: boolean;
  showMobileBriefDrawer: boolean;
  showInstructionsDrawer: boolean;
  
  // Data states
  playingBrief: number | null;
  currentStatus: string;
  tempNotes: string;
  checkedFollowUps: Set<number>;
  priorityChangeData: any;
  snoozeReason: string;
  
  // Expand states
  showMoreToday: boolean;
  showAllFollowUps: boolean;
  showUpcomingBriefs: boolean;
}

const initialState: HomeViewState = {
  selectedBrief: null,
  selectedCalendarItem: null,
  selectedMeeting: null,
  selectedMessage: null,
  selectedTranscript: null,
  selectedFollowUp: null,
  selectedFollowUpId: null,
  showAllBriefs: false,
  openSection: null,
  leftRailTab: 'briefs',
  isHomeSelected: true,
  followUpsFilter: 'all',
  showRightDrawer: false,
  leftPanelCollapsed: false,
  rightPanelCollapsed: true,
  showFollowUpModal: false,
  showPriorityConfirmModal: false,
  showStatusModal: false,
  showMobileBriefDrawer: false,
  showInstructionsDrawer: false,
  playingBrief: null,
  currentStatus: 'online',
  tempNotes: '',
  checkedFollowUps: new Set<number>(),
  priorityChangeData: null,
  snoozeReason: 'message',
  showMoreToday: false,
  showAllFollowUps: false,
  showUpcomingBriefs: false,
};

export const useHomeViewState = () => {
  const [state, setState] = useState<HomeViewState>(initialState);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);

  // Memoized derived data
  const briefsData = useMemo(() => ({
    allBriefs: SAMPLE_BRIEFS,
    recentBriefs: SAMPLE_BRIEFS.slice(0, 3),
    upcomingBriefs: UPCOMING_BRIEFS,
    followUps: SAMPLE_FOLLOW_UPS
  }), []);

  const meetingsData = useMemo(() => {
    const hasUpcomingMeetings = meetings.some(m => m.minutesUntil < 120);
    const nextMeeting = meetings.find(m => m.minutesUntil < 120);
    const upcomingMeetings = meetings.filter(m => m.minutesUntil < 120).slice(0, 2);
    const remainingMeetings = meetings.filter(m => m.minutesUntil < 120).slice(2);
    
    const allMeetings = [...meetings].sort((a, b) => {
      const timeToMinutes = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        const hours24 = period === 'PM' && hours !== 12 ? hours + 12 : period === 'AM' && hours === 12 ? 0 : hours;
        return hours24 * 60 + (minutes || 0);
      };
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });

    return {
      hasUpcomingMeetings,
      nextMeeting,
      upcomingMeetings,
      remainingMeetings,
      allMeetings
    };
  }, [meetings]);

  // Optimized update function
  const updateState = useCallback((updates: Partial<HomeViewState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Meeting handlers
  const toggleProxy = useCallback((meetingId: string) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === meetingId 
        ? { ...meeting, hasProxy: !meeting.hasProxy }
        : meeting
    ));
  }, []);

  const saveNotes = useCallback(() => {
    if (state.selectedMeeting) {
      setMeetings(prev => prev.map(meeting => 
        meeting.id === state.selectedMeeting!.id 
          ? { ...meeting, proxyNotes: state.tempNotes, hasNotes: state.tempNotes.trim().length > 0 }
          : meeting
      ));
    }
    updateState({
      showInstructionsDrawer: false,
      selectedMeeting: null,
      tempNotes: ''
    });
  }, [state.selectedMeeting, state.tempNotes, updateState]);

  return {
    state,
    updateState,
    meetings,
    setMeetings,
    briefsData,
    meetingsData,
    toggleProxy,
    saveNotes
  };
};