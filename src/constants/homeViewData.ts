// Static data extracted from HomeView for performance optimization
export const SAMPLE_BRIEFS = [
  {
    id: 1,
    name: "Morning Brief",
    timeCreated: "Today, 8:00 AM",
    timeRange: "5:00 AM - 8:00 AM",
    slackMessages: {
      total: 12,
      fromPriorityPeople: 3
    },
    emails: {
      total: 5,
      fromPriorityPeople: 2
    },
    actionItems: 4,
    hasTranscript: true
  },
  {
    id: 2,
    name: "Evening Brief",
    timeCreated: "Yesterday, 8:00 PM",
    timeRange: "5:00 PM - 8:00 PM",
    slackMessages: {
      total: 8,
      fromPriorityPeople: 1
    },
    emails: {
      total: 3,
      fromPriorityPeople: 0
    },
    actionItems: 2,
    hasTranscript: true
  },
  {
    id: 3,
    name: "Midday Brief",
    timeCreated: "Yesterday, 12:30 PM",
    timeRange: "9:00 AM - 12:30 PM",
    slackMessages: {
      total: 15,
      fromPriorityPeople: 4
    },
    emails: {
      total: 7,
      fromPriorityPeople: 3
    },
    actionItems: 6,
    hasTranscript: true
  },
  {
    id: 4,
    name: "Weekend Brief",
    timeCreated: "2 days ago, 6:00 PM",
    timeRange: "12:00 PM - 6:00 PM",
    slackMessages: {
      total: 5,
      fromPriorityPeople: 1
    },
    emails: {
      total: 12,
      fromPriorityPeople: 4
    },
    actionItems: 3,
    hasTranscript: true
  },
  {
    id: 5,
    name: "Friday Brief",
    timeCreated: "3 days ago, 5:00 PM",
    timeRange: "1:00 PM - 5:00 PM",
    slackMessages: {
      total: 22,
      fromPriorityPeople: 8
    },
    emails: {
      total: 18,
      fromPriorityPeople: 6
    },
    actionItems: 9,
    hasTranscript: true
  }
];

export const UPCOMING_BRIEFS = [
  {
    id: 'upcoming-1',
    name: "Midday Brief",
    scheduledTime: "Today at 12:30 PM"
  },
  {
    id: 'upcoming-2',
    name: "Evening Brief", 
    scheduledTime: "Today at 6:00 PM"
  }
];

export const SAMPLE_FOLLOW_UPS = [
  {
    id: 1,
    platform: "G",
    priority: "High",
    message: "Review weekly performance report",
    sender: "kevin@uprise.is",
    time: "12:24 PM",
    actionType: "Decision"
  },
  {
    id: 2,
    platform: "G",
    priority: "High",
    message: "Schedule follow up with Mike",
    sender: "mike@company.com",
    time: "11:30 AM",
    actionType: "Action"
  },
  {
    id: 3,
    platform: "S",
    priority: "High",
    message: "Decide on new logo design direction",
    sender: "Sara Chen",
    time: "10:15 AM",
    actionType: "Decision"
  },
  {
    id: 4,
    platform: "G",
    priority: "Medium",
    message: "Respond to confirm funding details",
    sender: "investor@vc.com",
    time: "9:45 AM",
    actionType: "Decision"
  },
  {
    id: 5,
    platform: "S",
    priority: "Medium",
    message: "Update project timeline for Q1",
    sender: "Project Team",
    time: "8:30 AM",
    actionType: "Action"
  },
  {
    id: 6,
    platform: "G",
    priority: "Low",
    message: "Review contract terms and conditions",
    sender: "legal@company.com",
    time: "Yesterday",
    actionType: "Deadline"
  }
];

export const INITIAL_MEETINGS = [
  {
    id: "0",
    title: "internal project meeting",
    time: "9:00 AM",
    duration: "2 hours",
    attendees: [{
      name: "Project Team",
      email: "team@company.com"
    }],
    briefing: "Internal project meeting with the team",
    aiSummary: "Regular project sync to discuss progress and next steps.",
    hasProxy: false,
    hasNotes: false,
    summaryReady: false,
    isRecording: false,
    minutesUntil: -180
  },
  {
    id: "1.5",
    title: "demo with steve",
    time: "1:00 PM",
    duration: "1 hour", 
    attendees: [{
      name: "Steve Wilson",
      email: "steve@company.com"
    }],
    briefing: "Product demo with Steve Wilson",
    aiSummary: "Demo session to showcase new features and gather feedback.",
    hasProxy: true,
    hasNotes: false,
    summaryReady: false,
    isRecording: false,
    minutesUntil: -60
  },
  {
    id: "1",
    title: "Test demo",
    time: "2:00 PM",
    duration: "1 hour",
    attendees: [{
      name: "Kevin Kirkpatrick",
      email: "kirkpatrick.kevin.j@gmail.com"
    }, {
      name: "Kevin Kirkpatrick",
      email: "kevin@uprise.is"
    }],
    briefing: "Test demo with Kevin Kirkpatrick (kevin@uprise.is) and kirkpatrick.kevin.j@gmail.com is likely an internal meeting or a product demonstration. Given the participants, it may involve reviewing or testing a tool, feature, or concept.",
    aiSummary: "Product demonstration with Kevin focusing on AI-driven scheduling tools and user-friendly solutions. Kevin has experience with AI assistants and structured content delivery.",
    hasProxy: true,
    hasNotes: true,
    proxyNotes: "Focus on practicality and personalization features",
    summaryReady: false,
    isRecording: true,
    minutesUntil: 45
  },
  {
    id: "2",
    title: "external demo",
    time: "3:00 PM",
    duration: "30 min",
    attendees: [{
      name: "External Client",
      email: "client@company.com"
    }],
    briefing: "External client demonstration meeting",
    aiSummary: "Client demonstration focusing on key product features and capabilities.",
    hasProxy: true,
    hasNotes: false,
    summaryReady: false,
    isRecording: false,
    minutesUntil: 105
  },
  {
    id: "3",
    title: "design review",
    time: "3:30 PM",
    duration: "45 min",
    attendees: [{
      name: "Design Team",
      email: "design@company.com"
    }],
    briefing: "Design review session with the design team",
    aiSummary: "Review of latest design mockups and user interface updates.",
    hasProxy: true,
    hasNotes: false,
    summaryReady: false,
    isRecording: false,
    minutesUntil: 135
  }
];