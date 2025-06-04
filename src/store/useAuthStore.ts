import { create } from "zustand";

import { persist } from "zustand/middleware";

export interface AuthUser {
	id: number;
	name: string;
	email: string;
	email_verified_at: string | null;
	provider: string;
	provider_id: string;
	slack_token: string;
	slack_user_token: string;
	is_onboard: number;
	created_at: string;
	updated_at: string;
}

interface AuthStoreType {
	user: AuthUser | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (user: AuthUser, token?: string) => void;
	verify: (user: AuthUser, status: boolean) => void;
	logout: () => void;
	setUser: (user: Partial<AuthUser>) => void;
	gotoLogin: () => void;
}

const useAuthStore = create(
	persist<AuthStoreType>(
		(set) => ({
			user: null,
			token: null,
			isAuthenticated: false,

			login: (user, token) => {
				if (token) localStorage.setItem("token", token);
				set({ user, token, isAuthenticated: true });
			},

			verify: (user, status) => set({ user, isAuthenticated: status }),

			logout: () => {
				localStorage.clear();
				set({ user: null, token: null, isAuthenticated: false });
			},

			setUser: (partialUser) =>
				set((state) => ({
					user: state.user
						? { ...state.user, ...partialUser }
						: (partialUser as AuthUser),
				})),
			
			gotoLogin: () => {
				localStorage.removeItem("token");
				window.location.href = "/";
			}
			
		}),
		{
			name: "auth-storage", // name in localStorage
		}
	)
);

export default useAuthStore;
