import React from "react";
import { X, Calendar, Clock, Users, FileText, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Meeting } from "../types";

interface MeetingDetailsPanelProps {
	meeting: Meeting;
	onClose: () => void;
}

const MeetingDetailsPanel = ({
	meeting,
	onClose,
}: MeetingDetailsPanelProps) => {
	return (
		<div className="fixed inset-y-0 right-0 w-96 bg-surface border-l border-border-subtle shadow-xl z-50 overflow-y-auto">
			<div className="p-6 space-y-6">
				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h2 className="text-xl font-semibold text-text-primary mb-1">
							{meeting.title}
						</h2>
						<div className="flex items-center gap-2 text-sm text-text-secondary">
							<Clock className="w-4 h-4" />
							{meeting.time} • {meeting.duration}
						</div>
					</div>
					<Button
						onClick={onClose}
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0 hover:bg-white/10"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>

				<Separator className="bg-border-subtle" />

				{/* Attendees */}
				<div>
					<div className="flex items-center gap-2 mb-3">
						<Users className="w-4 h-4 text-text-secondary" />
						<span className="text-sm font-medium text-text-primary">
							Attendees
						</span>
					</div>
					<div className="space-y-2">
						{meeting.attendees.map((attendee, index) => (
							<div key={index} className="flex items-center gap-3">
								<div className="w-8 h-8 bg-accent-primary/20 rounded-full flex items-center justify-center">
									<span className="text-xs font-medium text-accent-primary">
										{attendee.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</span>
								</div>
								<div>
									<p className="text-sm text-text-primary">{attendee.name}</p>
									<p className="text-xs text-text-secondary">
										{attendee.email}
									</p>
								</div>
								<div className="ml-auto flex items-center gap-1">
									{attendee?.response_status === "accepted" && (
										<Check className="text-text-secondary" />
									)}
									<Button
										variant="ghost"
										size="sm"
										className="h-6 w-6 p-0 text-text-secondary hover:text-text-primary"
									>
										<Mail className="h-3 w-3" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>

				<Separator className="bg-border-subtle" />

				{/* Briefing */}
				<div>
					<div className="flex items-center gap-2 mb-3">
						<FileText className="w-4 h-4 text-text-secondary" />
						<span className="text-sm font-medium text-text-primary">
							Description
						</span>
					</div>
					<p
						dangerouslySetInnerHTML={{ __html: meeting.description }}
						className="text-sm text-text-secondary leading-relaxed"
					>
					</p>
				</div>
        
				<div>
					<div className="flex items-center gap-2 mb-3">
						<FileText className="w-4 h-4 text-text-secondary" />
						<span className="text-sm font-medium text-text-primary">
							Briefing
						</span>
					</div>
					<p
						dangerouslySetInnerHTML={{ __html: meeting.briefing }}
						className="text-sm text-text-secondary leading-relaxed"
					>
					</p>
				</div>

				{/* Relevant Context */}
				{meeting.context && (
					<div>
						<h3 className="text-sm font-medium text-text-primary mb-3">
							Relevant Context:
						</h3>
						<div className="space-y-3">
							{meeting.context.relevantEmails && (
								<div>
									<p className="text-sm font-medium text-text-primary mb-1">
										Parenting Schedule Emails:
									</p>
									<p className="text-xs text-text-secondary">
										Kevin Kirkpatrick has been actively using an AI assistant
										for daily parenting and nanny scheduling. This suggests
										familiarity with AI-driven tools and a focus on practical,
										user-friendly solutions.
									</p>
								</div>
							)}

							{meeting.context.interests && (
								<div>
									<p className="text-sm font-medium text-text-primary mb-1">
										Tennis Newsletters:
									</p>
									<p className="text-xs text-text-secondary">
										Kevin also receives curated tennis updates, indicating an
										interest in personalized, well-structured content delivery.
										This could be relevant if the demo involves content curation
										or user engagement.
									</p>
								</div>
							)}

							{meeting.context.weeklyCheckIns && (
								<div>
									<p className="text-sm font-medium text-text-primary mb-1">
										Weekly Check-Ins:
									</p>
									<p className="text-xs text-text-secondary">
										Kevin has participated in numerous recurring "Weekly
										Check-In" meetings with sb.suico@gmail.com. This
										demonstrates a routine of structured updates and
										collaboration.
									</p>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Preparation Points */}
				{meeting.preparationPoints && (
					<div>
						<h3 className="text-sm font-medium text-text-primary mb-3">
							Preparation Points:
						</h3>
						<div className="space-y-2">
							<div className="flex items-start gap-2">
								<span className="text-sm font-medium text-accent-primary">
									1.
								</span>
								<p className="text-sm text-text-secondary">
									<span className="font-medium">Focus on Practicality:</span>{" "}
									Highlight how the demoed tool or feature can simplify tasks or
									improve efficiency, similar to the AI assistant's scheduling
									capabilities.
								</p>
							</div>
							<div className="flex items-start gap-2">
								<span className="text-sm font-medium text-accent-primary">
									2.
								</span>
								<p className="text-sm text-text-secondary">
									<span className="font-medium">Personalization:</span> If
									applicable, emphasize customization options or how the tool
									adapts to user preferences, drawing parallels to the curated
									tennis newsletters.
								</p>
							</div>
							<div className="flex items-start gap-2">
								<span className="text-sm font-medium text-accent-primary">
									3.
								</span>
								<p className="text-sm text-text-secondary">
									<span className="font-medium">Clarity and Structure:</span>{" "}
									Ensure the demo is well-organized, reflecting the structured
									approach Kevin is accustomed to in his weekly check-ins.
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Suggested Agenda */}
				{meeting.suggestedAgenda && (
					<div>
						<h3 className="text-sm font-medium text-text-primary mb-3">
							Suggested Agenda:
						</h3>
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<div className="w-1 h-1 bg-accent-primary rounded-full"></div>
								<p className="text-sm text-text-secondary">
									<span className="font-medium">Introduction:</span> Brief
									overview of the tool or feature being demonstrated.
								</p>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-1 h-1 bg-accent-primary rounded-full"></div>
								<p className="text-sm text-text-secondary">
									<span className="font-medium">Key Features:</span> Highlight
									functionalities that align with Kevin's known interests.
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MeetingDetailsPanel;
