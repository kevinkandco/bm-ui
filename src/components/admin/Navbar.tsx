import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApi } from "@/hooks/useApi";
import useAdminAuthStore from "@/store/useAdminAuthStore";
import { LogOut } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "react-day-picker";
import { Link } from "react-router-dom";

const navItems = [
	{ id: "dashboard", label: "Dashboard", link: "/admin/dashboard" },
	{ id: "users", label: "Users", link: "/admin/users" },
	{ id: "plans", label: "Plans", link: "/admin/plans" },
	{ id: "invoice", label: "Invoices", link: "/admin/invoices" },
] as const;

type NavItemId = (typeof navItems)[number]["id"];

const Navbar = ({ currentPage }: { currentPage: NavItemId }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const logout = useAdminAuthStore((state) => state.logout);
	const gotoLogin = useAdminAuthStore((state) => state.gotoLogin);

	const { call } = useApi();

	const handleLogout = useCallback(async () => {
		const response = await call("post", `/admin/logout`, {
			isAdmin: true,
			toastTitle: "Failed to fetch dashboard data",
			toastDescription: "Unable to load dashboard data. Please try again.",
			returnOnFailure: false,
		});

		if (!response) {
			return;
		}

		logout();
		gotoLogin();
	}, [call, logout, gotoLogin]);

	return (
		<nav className="bg-white border-gray-200 dark:bg-gray-900">
			<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
				<Link
					to="/admin"
					className="flex items-center space-x-3 rtl:space-x-reverse"
				>
					<img
						src="/lovable-uploads/logo_resize.jpg"
						className="h-8"
						alt="Brief Me Logo"
					/>
					<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
						Brief Me
					</span>
				</Link>

				<div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
					<div className="flex text-sm bg-gray-800 rounded-full md:me-0 hover:bg-gray-700">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<img
									className="w-8 h-8 rounded-full cursor-pointer"
									src="/images/default.png"
									alt="user photo"
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="bg-surface border-border-subtle w-56"
								align="start"
							>
								<DropdownMenuItem
									onClick={handleLogout}
									className="text-text-primary hover:bg-white/5"
								>
									<LogOut className="mr-2 h-4 w-4" />
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						type="button"
						className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
					>
						<span className="sr-only">Open main menu</span>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>

				<div
					className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
						isMenuOpen ? "block" : "hidden"
					}`}
					id="navbar-user"
				>
					<ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
						{navItems.map((page) => (
							<li key={page.id}>
								<Link
									to={page.link}
									className={`block py-2 px-3 rounded-sm md:p-0 ${
										currentPage === page.id
											? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
											: "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
									}`}
								>
									{page.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
