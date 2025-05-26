import { create } from 'zustand';
import { getUnreadCount } from '@/api/unreadCount';

interface BriefStore {
  unreadCount: number | null;
  getUnreadCount: () => Promise<void>;
}

export const useBriefStore = create<BriefStore>((set) => ({
  unreadCount: null,

  getUnreadCount: async () => {
    try {
      const count = await getUnreadCount(); // API call
      set({ unreadCount: count });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  },
}));
