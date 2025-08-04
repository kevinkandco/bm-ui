import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import useAdminAuthStore from "@/store/useAdminAuthStore";

function useVerifyAdminAuth() {
	const [checked, setChecked] = useState(false);
	const [validSession, setValidSession] = useState(false);
	const { user, logout, verify, gotoLogin } = useAdminAuthStore();
	const { call } = useApi();

	useEffect(() => {
		async function verifyAuth() {
			const token = localStorage.getItem("admin-token");
			
			if (!token) {
				gotoLogin();
				setChecked(true);
				return;
			}

			
			const response = await call("get", "/admin/me", {
				showToast: false,
				returnOnFailure: false,
				isAdmin: true
			});
			
			if (response?.data) {
				verify(response.data, true);
				setValidSession(true);
			} else {
				logout();
				gotoLogin();
			}

			setChecked(true);
		}

		const timer = setTimeout(verifyAuth, 50);
		return () => clearTimeout(timer);
	}, [logout, verify, call, gotoLogin]);

	return { checked, validSession, user };
}

export default useVerifyAdminAuth;
