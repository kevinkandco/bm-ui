import { create } from "zustand";

import { persist } from "zustand/middleware";

export interface AuthAdminUser {
	id: number;
	name: string;
	email: string;
	profile_path: string;
	email_verified_at: string | null;
	job_title: string;
	department: string;
	provider: string;
	provider_id: string;
	slack_token: string;
	slack_user_token: string;
	is_onboard: number;
	created_at: string;
	updated_at: string;
}

interface AdminAuthStoreType {
	user: AuthAdminUser | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (user: AuthAdminUser, token?: string) => void;
	verify: (user: AuthAdminUser, status: boolean) => void;
	logout: () => void;
	setUser: (user: Partial<AuthAdminUser>) => void;
	gotoLogin: () => void;
}

const useAdminAuthStore = create<AdminAuthStoreType>((set) => ({
	user: null,
	token: null,
	isAuthenticated: false,

	login: (user, token) => {
		if (token) localStorage.setItem("admin-token", token);
		set({ user, token, isAuthenticated: true });
	},

	verify: (user, status) => set({ user, isAuthenticated: status }),

	logout: () => {
		localStorage.removeItem("admin-token");
		set({ user: null, token: null, isAuthenticated: false });
	},

	setUser: (partialUser) =>
		set((state) => ({
			user: state.user
				? { ...state.user, ...partialUser }
				: (partialUser as AuthAdminUser),
		})),

	gotoLogin: () => {
		localStorage.removeItem("admin-token");
		if (window.location.pathname !== "/admin/login") {
			window.location.href = "/admin/login";
		}
	},
}));

export default useAdminAuthStore;
