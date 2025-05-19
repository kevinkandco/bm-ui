import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import Http from "@/Http";
// import LoadingFallback from "@/components/LoadingFallback";
const BaseURL = import.meta.env.VITE_API_HOST;

const ProtectedRoute = ({element}: {element: "protected" | "unprotected"}) => {
	const [checked, setChecked] = useState(false);
	const [validSession, setValidSession] = useState(false);

	const { user, logout, verify } = useAuthStore();

	useEffect(() => {
		const verifyAuth = async () => {
			const token = localStorage.getItem("token");

			if (!token) {
				logout();
				setChecked(true);
				return;
			}

			try {
				Http.setBearerToken(token);
				const response = await Http.callApi("get", `${BaseURL}/api/me`, null, {
					headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
				});

				console.log("User data:", response);

				if (response && response.data) {
					verify(response.data, true);
					setValidSession(true);
				} else {
					logout();
				}

				setChecked(true);
			} catch (err) {
				console.error("Auth verification failed", err);
				logout();
				setChecked(true);
			}
		};

		verifyAuth();
	}, [verify, logout]);

	// if (!checked) return <LoadingFallback />;
	if (!checked) return <div>Loading</div>;

	if (validSession && !user?.is_onboard) {
		return <Navigate to="/onboarding" replace />;
	}

	if (element === "unprotected") return validSession ?  <Navigate to="/dashboard" replace /> : <Outlet />;

	return validSession ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
