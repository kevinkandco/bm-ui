import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import {
	Blocks,
	Calendar,
	Mail,
	MailOpen,
	Slack,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConnectedAccount } from "@/components/settings/types";

interface IntegrationModelProps {
	open: boolean;
	onClose: () => void;
	user: any;
}

const IntegrationModal = ({ open, onClose, user }: IntegrationModelProps) => {
	const isMobile = useIsMobile();

	const getProviderIcon = (provider: string) => {
		switch (provider?.toLowerCase()) {
			case "google":
				return <Mail className="h-4 w-4" />;
			case "outlook":
				return <MailOpen className="h-4 w-4" />;
			case "slack":
				return <Slack className="h-4 w-4" />;
			case "calendar":
				return <Calendar className="h-4 w-4" />;
			case "asana":
				return (
					<svg
						className="text-[#fff]"
						viewBox="-0.5 -0.5 16 16"
						fill="none"
						id="Asana--Streamline-Iconoir"
						height="16"
						width="16"
					>
						<path
							d="M7.5 7.1230625000000005c1.6653125 0 3.015375 -1.35 3.015375 -3.015375S9.1653125 1.0923125 7.5 1.0923125c-1.665375 0 -3.015375 1.35 -3.015375 3.015375s1.35 3.015375 3.015375 3.015375Z"
							stroke="#fff"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
						></path>
						<path
							d="M3.73075 13.907687500000002c1.665375 0 3.0154375 -1.3500625 3.0154375 -3.015375 0 -1.6653125 -1.3500625 -3.015375 -3.0154375 -3.015375s-3.015375 1.3500625 -3.015375 3.015375c0 1.6653125 1.3500625 3.015375 3.015375 3.015375Z"
							stroke="#fff"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
						></path>
						<path
							d="M11.26925 13.907687500000002c1.6653125 0 3.015375 -1.3500625 3.015375 -3.015375 0 -1.6653125 -1.3500625 -3.015375 -3.015375 -3.015375 -1.6653125 0 -3.015375 1.3500625 -3.015375 3.015375 0 1.6653125 1.3500625 3.015375 3.015375 3.015375Z"
							stroke="#fff"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
						></path>
					</svg>
				);
			default:
				return <div className="w-4 h-4 bg-white/20 rounded" />;
		}
	};

	const getDisplayName = (account: ConnectedAccount) => {
		if (account.name) {
			return account.name;
		}
		// Auto-generate names based on provider
		switch (account.provider_name.toLowerCase()) {
			case "slack":
				return account.name
					? `${account.name}`
					: account.workspace
					? `${account.workspace}`
					: "Slack Workspace";
			case "gmail":
				return account.email ? `Gmail (${account.email})` : "Gmail";
			case "google":
				return account.email ? `Google (${account.email})` : "Google";
			case "outlook":
				return account.email ? `Outlook (${account.email})` : "Outlook";
			case "calendar":
				return "Google Calendar";
			default:
				return (
					account.provider_name.charAt(0).toUpperCase() +
					account.provider_name.slice(1)
				);
		}
	};

	const supportsAISettings = (provider: string) => {
		return ["google", "outlook", "slack"].includes(provider);
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent
				className={`sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-background/80 backdrop-blur-xl border border-white/10 ${
					isMobile ? "p-4" : "p-6"
				}`}
			>
				<DialogHeader>
					<DialogTitle className="text-white flex items-center">
						<Blocks className="mr-2 h-5 w-5 text-blue-400" />
						Integrations
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-2">
					{user?.integrations?.map((account) => {
						return (
							<div
								key={account.id}
								className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
							>
								<div className="flex items-center space-x-4 flex-1">
									{/* Provider Icon */}
									<Tooltip delayDuration={0}>
										<TooltipTrigger asChild>
											<div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
												{getProviderIcon(account.provider_name)}
											</div>
										</TooltipTrigger>
										<TooltipContent side="right" sideOffset={-14}>
											<p>{account.provider_name}</p>
										</TooltipContent>
									</Tooltip>

									{/* Account Info */}
									<div className="flex-1 min-w-0">
											<h4 className="font-medium text-text-primary">
												{getDisplayName(account)}
											</h4>

										<span className="text-sm text-text-secondary truncate">
											{account.email || account.provider}
										</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default IntegrationModal;
