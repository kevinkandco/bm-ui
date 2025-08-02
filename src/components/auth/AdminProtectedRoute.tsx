import { Outlet, Navigate, useLocation } from "react-router-dom";
import Loader from "../Loader";
import { useEffect } from "react";
import useVerifyAdminAuth from "@/hooks/useVerifyAdminAuth";

const COMPANY = import.meta.env.VITE_COMPANY;

declare global {
	interface Window {
		Featurebase: (...args: any[]) => void;
	}
}

const AdminProtectedRoute = ({
	element,
}: {
	element: "protected" | "unprotected";
}) => {
	const { checked, validSession, user } = useVerifyAdminAuth();
	const authAdminToken = localStorage.getItem("admin-token");
	const authToken = localStorage.getItem("token");

	useEffect(() => {
		if (window.Featurebase) {
			window.Featurebase(
				"identify",
				{
					organization: COMPANY,
					name: user?.name,
					email: user?.email,
				},
				(err) => {
					if (err) {
						console.error(err);
					}
				}
			);

			window.Featurebase("initialize_feedback_widget", {
				organization: COMPANY,
				theme: "dark",
				name: "ssp",
				placement: "right",
				locale: "en",
			});
		}
	}, [user]);

	if (!checked) return <Loader />;

	if (element === "unprotected") {
		if (validSession) {
			return <Navigate to="/admin" replace />;
		}
		return <Outlet />;
	}

	if (element === "protected") {
		if (!authAdminToken) {
			if (authToken) {
				return <Navigate to="/Dashboard" replace />;
			}
			return <Navigate to="/" replace />;
		}

		if (!validSession) {
			return <Navigate to="/admin/login" replace />;
		}

		return <Outlet />;
	}

	return null;
};

export default AdminProtectedRoute;
