import { useCallback, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";
import useAuthStore from "@/store/useAuthStore";

const ProfileSettings = () => {
	const { call } = useApi();
	const { toast } = useToast();
	const { user } = useAuthStore();
	const [briefPreferences, setBriefPreferences] = useState<{
		dailyBrief: boolean;
		weekendBrief: boolean;
	}>({
		dailyBrief: false,
		weekendBrief: false,
	});
	const [settings, setSettings] = useState({
		name: "",
		job_title: "",
		department: "",
		profileImage: "",
	});
	const [imageFile, setImageFile] = useState<File | null>(null);

	const getData = useCallback(async () => {
		const response = await call("get", "/settings/brief-preferences", {
			showToast: true,
			toastTitle: "Failed to get data",
			toastDescription: "Failed to get data",
		});

		if (!response) return;

		setBriefPreferences(response.data);
	}, [call]);

	useEffect(() => {
		getData();
		if (user) {
			setSettings({
				name: user.name ?? "",
				job_title: user.job_title ?? "",
				department: user.department ?? "",
				profileImage: user?.profile_path || null,
			});
		}
	}, [user, getData]);

	const handleBriefPreferences = useCallback(
		async (checked: boolean, key: keyof typeof briefPreferences) => {
			const newBriefPreferences = {
				...briefPreferences,
				[key]: checked,
			};

			const response = await call("post", "/settings/brief-preferences", {
				body: newBriefPreferences,
				showToast: true,
				toastTitle: "Failed to save data",
				toastDescription: "Failed to save data",
			});

			if (!response) return;

			setBriefPreferences(response.data);
		},
		[briefPreferences, call]
	);

	const handleSaveSettings = async () => {
		const formData = new FormData();
		formData.append("name", settings.name);
		formData.append("job_title", settings.job_title);
		formData.append("department", settings.department);
		if (imageFile) {
			formData.append("profile_path", imageFile);
		}

		const response = await call("post", "/settings/profile-update", {
			body: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
			showToast: true,
			toastTitle: "Settings Save Failed",
			toastDescription: "Failed to save settings",
		});
		if (response)
			toast({
				title: "Settings Saved",
				description: "Your preferences have been updated successfully",
			});
	};

	const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSettings({
			...settings,
			[e.target.name]: e.target.value,
		});
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);

			const reader = new FileReader();
			reader.onloadend = () => {
				setSettings((prev) => ({
					...prev,
					profileImage: reader.result as string,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setSettings((prev) => ({
			...prev,
			profileImage: "",
		}));
		setImageFile(null);
	};
	return (
		<>
			<h2 className="text-xl font-semibold text-text-primary mb-6">
				Profile Settings
			</h2>

			<div className="mb-8">
				<h3 className="text-lg font-medium text-text-primary mb-4">
					Personal Information
				</h3>
				<div className="space-y-4 max-w-2xl">
					<div>
						<div className="flex items-center gap-4">
							<img
								src={settings?.profileImage || "/images/default.png"}
								alt="Profile"
								className="object-cover rounded-full shadow w-24 h-24 sm:w-36 sm:h-36 border-2 border-accent-primary cursor-pointer"
							/>
							<div className="flex flex-col justify-center gap-5">
								<h1 className="text-xl text-center md:text-start">
									Profile Picture
								</h1>
								<div className="flex flex-col items-center justify-center gap-3 md:flex-row md:justify-start">
									<div className="py-2 px-3 flex items-center gap-2 bg-[#377E7F] text-white rounded-lg cursor-pointer relative">
										{/* <img src="/images/upload.svg" className="w-6 h-6"> */}
										<span className="cursor-pointer text-sm">Upload Photo</span>
										<input
											accept="image/png, image/gif, image/jpeg"
											onChange={handleImageUpload}
											type="file"
											className="absolute right-0 z-0 w-full opacity-0 cursor-pointer"
										/>
									</div>

									{settings?.profileImage && (
										<div>
											<button
												onClick={handleRemoveImage}
												type="button"
												className="w-full sm:w-auto sm:text-sm py-2 px-3 flex items-center gap-2 bg-[#377E7F] text-white rounded-lg cursor-pointer relative"
											>
												Remove
											</button>
										</div>
									)}
								</div>
								<p className="text-sm">
									We support PNGs,JPEGs, and GIFs under 2Mb
								</p>
							</div>
							{/* <label className="block text-sm font-medium text-text-secondary mb-1">Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-sm text-text-primary"
                    /> */}
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-text-secondary mb-1">
							Full Name
						</label>
						<input
							type="text"
							value={settings?.name}
							name="name"
							onChange={handleUpdate}
							className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-text-secondary mb-1">
							Email Address
						</label>
						<input
							type="email"
							defaultValue={user?.email}
							disabled
							className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-text-secondary mb-1">
							Job Title
						</label>
						<input
							type="text"
							name="job_title"
							value={settings?.job_title}
							onChange={handleUpdate}
							className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-text-secondary mb-1">
							Department
						</label>
						<input
							type="text"
							name="department"
							value={settings?.department}
							onChange={handleUpdate}
							className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
						/>
					</div>
				</div>
			</div>

			<Separator className="bg-border-subtle my-8" />

			<div className="mb-8">
				<h3 className="text-lg font-medium text-text-primary mb-4">
					Brief Preferences
				</h3>
				<div className="space-y-4 max-w-2xl">
					<div className="flex items-center justify-between">
						<div>
							<h4 className="font-medium text-text-primary">Daily Briefs</h4>
							<p className="text-sm text-text-secondary">
								Receive a summary of your day every morning
							</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								className="sr-only peer"
								onChange={(e) =>
									handleBriefPreferences(e.target.checked, "dailyBrief")
								}
								checked={briefPreferences?.dailyBrief}
							/>
							<div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
						</label>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<h4 className="font-medium text-text-primary">
								Weekly Summaries
							</h4>
							<p className="text-sm text-text-secondary">
								Get a comprehensive summary at the end of each week
							</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								className="sr-only peer"
								onChange={(e) =>
									handleBriefPreferences(e.target.checked, "weekendBrief")
								}
								checked={briefPreferences?.weekendBrief}
							/>
							<div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
						</label>
					</div>
				</div>
			</div>

			<div className="flex justify-end">
				<Button
					onClick={handleSaveSettings}
					className="shadow-subtle hover:shadow-glow transition-all"
				>
					<Save className="mr-2 h-5 w-5" /> Save Changes
				</Button>
			</div>
		</>
	);
};

export default ProfileSettings;
