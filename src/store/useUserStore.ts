import { create } from "zustand";
import { UserData } from "@/hooks/useOnboardingState";

interface UserStoreType {
	user: UserData | null;
	setUser: (user: UserData) => void;
	updateUser: (key: string, value: any) => void;
}

const useUserStore = create<UserStoreType>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
	updateUser: (key, value) =>
		set((state) => ({
			user: {
				...(state.user ?? {}),
				[key]: value,
			} as UserData,
		})),
}));

export default useUserStore;
