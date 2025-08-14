import {
	Mail,
	MessageSquare,
	MailOpen,
	Calendar,
	FileText,
	Users,
	CheckSquare,
	Trello,
} from "lucide-react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { UserIntegrations } from "../types";

const iconMap: Record<string, JSX.Element> = {
	Slack: (
		<div className="w-4 h-4 bg-purple-500 rounded-sm flex items-center justify-center">
			<span className="text-[10px] font-bold text-white">#</span>
		</div>
	),
	Google: (
		<div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
			<span className="text-[10px] font-bold text-white">G</span>
		</div>
	),
	Calendar: <Calendar className="w-4 h-4 text-white" />,
	Outlook: (
		<div className="w-4 h-4 bg-sky-600 rounded-sm flex items-center justify-center">
			<span className="text-[10px] font-bold text-white">O</span>
		</div>
	),
	Notion: (
		<div className="w-4 h-4 bg-gray-800 rounded-sm flex items-center justify-center">
			<FileText className="w-3 h-3 text-white" />
		</div>
	),
	Linear: (
		<div className="w-4 h-4 bg-pink-500 rounded-sm flex items-center justify-center">
			<Users className="w-3 h-3 text-white" />
		</div>
	),
	Todoist: (
		<div className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center">
			<CheckSquare className="w-3 h-3 text-white" />
		</div>
	),
	Asana: (
		<div className="w-4 h-4 bg-pink-400 rounded-sm flex items-center justify-center">
			<span className="text-[10px] font-bold text-white">A</span>
		</div>
	),
	Trello: (
		<div className="w-4 h-4 bg-blue-400 rounded-sm flex items-center justify-center">
			<Trello className="w-3 h-3 text-white" />
		</div>
	),
};

interface UserIntegrationProps {
	userintegrations: UserIntegrations[];
}

function IntegrationsList({ userintegrations }: UserIntegrationProps) {
	const sortedIntegrations = userintegrations?.sort((a, b) => {
		if (a.name === "Calendar") return 1; // move Calendar down
		if (b.name === "Calendar") return -1;
		return 0; // keep order for others
	});

	return (
		<div className="flex items-center gap-2">
			{sortedIntegrations?.map((integration) => (
				<Popover key={integration.name}>
					<PopoverTrigger asChild>
						<div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors">
							{iconMap[integration.name]}
							{integration.name !== "Calendar" && (
								<span className="text-sm font-medium text-white">
									{integration.count}
								</span>
							)}
						</div>
					</PopoverTrigger>
					<PopoverContent className="w-80 p-0" align="end">
						<div className="bg-gray-900 rounded-lg overflow-hidden">
							<div className="p-4 border-b border-gray-700">
								<h3 className="text-white font-semibold">{integration.name}</h3>
							</div>
							<div className="p-4 space-y-2">
								{integration?.emails?.map((email) => (
									<div key={email} className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<span className="text-white text-sm">{email}</span>
										<span className="text-gray-400 text-sm">
											• {integration.status}
										</span>
									</div>
								))}
							</div>
						</div>
					</PopoverContent>
				</Popover>
			))}
		</div>
	);
}

export default IntegrationsList;
