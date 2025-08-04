import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Input } from "@/components/admin/Input";
import { useApi } from "@/hooks/useApi";
import useAdminAuthStore from "@/store/useAdminAuthStore";
import Http from "@/Http";
import { BaseURL } from "@/config";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
	const navigate = useNavigate();
	const { theme } = useTheme();
	const { toast } = useToast();
	const { login } = useAdminAuthStore();
	const [showPassword, setShowPassword] = useState(false);
	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

	const handleSignIn = async () => {
		try {
			const response = await Http.callApi(
				"post",
				`${BaseURL}/admin/login`,
				loginData
			);

			if (!response) return;

			login(response.data.data.user, response.data.data.token);

			navigate("/admin/dashboard");
		} catch (error: any) {
			console.log(error);
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginData({
			...loginData,
			[e.target.name]: e.target.value,
		});
	};

	const handleBack = () => {
		navigate("/");
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-surface">
			<div className="absolute inset-0 w-full h-full">
				<div className="absolute inset-0 w-full h-full">
					<img
						src="/lovable-uploads/8ea55fb5-fb6e-49d0-881c-5d96263e886d.png"
						alt="Dashboard background"
						className="w-full h-full object-cover filter blur"
						loading="eager"
					/>
				</div>
				<div
					className={`absolute inset-0 ${
						theme === "dark" ? "bg-gradient-dark" : "bg-gradient-light"
					} opacity-60`}
				></div>
				<div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-texture"></div>
			</div>

			<div className="absolute top-4 left-4 z-20">
				<Button
					variant="back"
					onClick={handleBack}
					className="flex items-center gap-2"
				>
					<ArrowLeft className="w-4 h-4" />
					Back
				</Button>
			</div>

			{/* Glass card */}
			<div className="w-full max-w-md mx-auto z-10">
				<Card
					className="rounded-3xl overflow-hidden border border-border-subtle glass-reflection"
					style={{
						background: "rgba(35, 35, 38, 0.75)",
						backdropFilter: "blur(16px)",
						boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
					}}
				>
					<CardContent className="px-4 py-6 sm:px-6 sm:py-8 flex flex-col items-center text-center">
						{/* Glow orb visual element */}
						<div className="h-28 sm:h-40 w-full flex items-center justify-center relative mb-4 sm:mb-8">
							<div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-accent-primary/5 animate-pulse absolute"></div>
							<div className="w-18 sm:w-24 h-18 sm:h-24 rounded-full bg-accent-primary/10 animate-glow absolute"></div>
							<div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-accent-primary/15 absolute flex items-center justify-center">
								<img
									src="/lovable-uploads/432a0bc4-376f-4766-864d-ff5f206b8068.png"
									alt="Sound wave"
									className="w-8 sm:w-10 h-8 sm:h-10 opacity-90 wave-pulse"
									style={{
										filter:
											theme === "dark"
												? "brightness(0) invert(1)"
												: "brightness(0.2)",
									}}
								/>
							</div>
						</div>

						<div className="space-y-3 sm:space-y-4 text-center mb-6 sm:mb-8">
							<div className="inline-flex items-center justify-center px-3 py-1 rounded-full">
								<span className="text-gradient-blue font-medium text-lg sm:text-xl">
									Admin panel
								</span>
							</div>
							<h1 className="text-2xl sm:text-4xl font-semibold text-text-primary tracking-tighter leading-tight">
								Sign in to Brief-me
							</h1>
						</div>

						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSignIn();
							}}
							className="space-y-4 w-full"
						>
							<div className="relative">
								<Mail
									className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
									size={16}
								/>
								<Input
									name="email"
									type="email"
									placeholder="Email"
									className="pl-10"
									onChange={handleInputChange}
								/>
							</div>

							<div className="relative">
								<Lock
									className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
									size={16}
								/>

								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									className="p-1 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
								>
									{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>

								<Input
									name="password"
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									className="pl-10 pr-10"
									onChange={handleInputChange}
								/>
							</div>
							<Button
								className="w-full bg-surface-overlay hover:bg-surface-raised text-text-primary border border-border-subtle shadow-subtle flex items-center justify-center gap-2 sm:gap-3 rounded-xl py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-400"
								type="submit"
							>
								Login
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Login;
