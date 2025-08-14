import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";
import { PriorityPeopleList } from "./priority-people/PriorityPeopleList";
import { SuggestedContacts } from "./priority-people/SuggestedContacts";
import { ManualInputSection } from "./priority-people/ManualInputSection";
import { useSlackPriorityPeopleState } from "./priority-people/useSlackPriorityPeopleState";
import { PriorityPerson } from "./priority-people/types";
import { memo, useMemo, useState } from "react";
import { useGmailPriorityPeopleState } from "./priority-people/useGmailPriorityPeopleState";
import { UserData } from "@/hooks/useOnboardingState";
import FancyLoader from "../settings/modal/FancyLoader";
import { ConnectedAccount, Person, ValidationError } from "../settings/types";
import AddEmailModal from "../settings/modal/AddEmailModal";
import { useOutlookPriorityPeopleState } from "./priority-people/useOutlookPriorityPeopleState";

interface PriorityPeopleStepProps {
	onNext: () => void;
	onBack: () => void;
	updateUserData: (data: any) => void;
	userData: UserData;
	connectedAccount: ConnectedAccount[];
}

const AllowedPlatforms = ["slack", "google", "outlook"];

const PriorityPeopleStep = memo(
	({
		onNext,
		onBack,
		updateUserData,
		userData,
		connectedAccount,
	}: PriorityPeopleStepProps) => {
		// Get the state and functions from the custom hook
		const googleId = connectedAccount?.find(
			(c) => c?.provider_name?.toLowerCase() === "google"
		)?.id;
		const slackId = connectedAccount?.find(
			(c) => c?.provider_name?.toLowerCase() === "slack"
		)?.id;
		const outlookId = connectedAccount?.find(
			(c) => c?.provider_name?.toLowerCase() === "outlook"
		)?.id;
		const slackState = useSlackPriorityPeopleState(
			slackId,
			userData.slackPriorityPeople || []
		);
		const gmailState = useGmailPriorityPeopleState(
			googleId,
			userData.googlePriorityPeople || []
		);
		const outlookState = useOutlookPriorityPeopleState(
			outlookId,
			userData.outlookPriorityPeople || []
		);
		const [people, setPeople] = useState<Person[]>([
			{ name: "", email: "", label: "" },
		]);
		const [addEmailModalOpen, setAddEmailModalOpen] = useState(false);
		const [saveLoading, setSaveLoading] = useState(false);
		const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
			[]
		);
		const [hasTriedToSave, setHasTriedToSave] = useState(false);

		const [platformIndex, setPlatformIndex] = useState(0);
		const allowedPlatforms = useMemo(
			() =>
				(userData?.integrations || []).filter((p) =>
					AllowedPlatforms.includes(p)
				),
			[userData?.integrations]
		);
		const currentPlatform: (typeof allowedPlatforms)[number] =
			allowedPlatforms?.[platformIndex];

		const platformState = useMemo(() => {
			switch (currentPlatform) {
				case "slack":
					return slackState;
				case "google":
					return gmailState;
				case "outlook":
					return outlookState;
				default:
					return slackState;
			}
		}, [currentPlatform, slackState, gmailState, outlookState]);

		const handleContinue = () => {
			const platformKey = `${currentPlatform}PriorityPeople` as keyof UserData;

			if (AllowedPlatforms.includes(currentPlatform)) {
				updateUserData({ [platformKey]: platformState.priorityPeople });
			}

			if (platformIndex + 1 < allowedPlatforms.length) {
				setPlatformIndex(platformIndex + 1);
			} else {
				onNext();
			}
		};

		const handleBackClick = () => {
			if (platformIndex > 0) {
				setPlatformIndex(platformIndex - 1);
			} else {
				onBack();
			}
		};

		const handleSkip = () => {
			// Just proceed to next step without saving any priority people
			onNext();
		};

		// for add priority person modal
		const handleCancel = () => {
			setAddEmailModalOpen(false);
			setPeople([{ name: "", email: "", label: "" }]);
		};
		const handleSave = async () => {
			setHasTriedToSave(true);

			const filtered = people.filter((p) => p.name || p.email);
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			const errors: ValidationError[] = [];
			const seenEmails = new Set<string>();

			filtered.forEach((p, i) => {
				const name = p.name.trim();
				const email = p.email.trim();

				if ((name && !email) || (!name && email)) {
					errors.push({
						index: i,
						message: "Both name and email must be filled.",
					});
				} else if (email && /[A-Z]/.test(email)) {
					errors.push({
						index: i,
						message: "Email cannot contain uppercase letters.",
					});
				} else if (email && !emailRegex.test(email)) {
					errors.push({
						index: i,
						message: "Email is not valid.",
					});
				} else if (email && seenEmails.has(email.toLowerCase())) {
					errors.push({
						index: i,
						message: "Duplicate email not allowed.",
					});
				} else if (email) {
					seenEmails.add(email.toLowerCase());
				}
			});

			setValidationErrors(errors);

			if (errors.length > 0) return;

			filtered.forEach((p) =>
				platformState.addPerson(
					Math.random(),
					p.name,
					p.email?.toLowerCase(),
					undefined,
					p.label
				)
			);
			handleCancel();
		};
		return (
			<div className="space-y-6">
				<ProgressIndicator currentStep={4} totalSteps={10} />

				<div className="space-y-3">
					<h2 className="text-2xl font-semibold text-foreground tracking-tighter">
						Who are your priority people? ({currentPlatform})
					</h2>
					<p className="text-foreground/70 dark:text-white/70">
						Designate important people who should be able to break through
						Brief-Me barriers.
					</p>
				</div>

				{platformState.loading ? (
					<FancyLoader />
				) : (
					<div className="space-y-4">
						{/* Search input */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50 dark:text-white/40" />

							<Input
								placeholder="Search contacts..."
								value={platformState.searchQuery}
								onChange={(e) => platformState.setSearchQuery(e.target.value)}
								className="pl-10 bg-white/20 dark:bg-white/10 border-black/30 dark:border-white/20 text-foreground dark:text-ice-grey placeholder:text-foreground/60 dark:placeholder:text-white/50"
							/>
						</div>

						{/* Added people list */}
						<PriorityPeopleList
							priorityPeople={platformState?.priorityPeople}
							removePerson={platformState?.removePerson}
							designateContact={platformState?.designateContact}
							addLabel={platformState?.addLabel}
							contacts={platformState?.platformContacts}
						/>

						{/* Manual input with dropdown */}
						<ManualInputSection
							inputValue={platformState?.inputValue}
							setInputValue={platformState?.setInputValue}
							selectedLabel={platformState?.selectedLabel}
							setSelectedLabel={platformState?.setSelectedLabel}
							addPerson={platformState?.addPerson}
							filteredManualContacts={platformState?.filteredManualContacts}
							openPriorityPeopleModal={
								currentPlatform === "google"
									? () => setAddEmailModalOpen(true)
									: null
							}
						/>

						{/* Suggested contacts */}
						<SuggestedContacts
							suggestedContacts={platformState?.suggestedContacts}
							priorityPeople={platformState?.priorityPeople}
							platformContacts={platformState?.platformContacts}
							addPerson={platformState?.addPerson}
							removePerson={platformState?.removePerson}
							designateContact={platformState?.designateContact}
							addLabel={platformState?.addLabel}
							searchQuery={platformState?.searchQuery}
						/>
					</div>
				)}

				<div className="flex justify-between pt-4">
					<Button onClick={handleBackClick} variant="back" size="none">
						Back
					</Button>
					<Button onClick={handleContinue} variant="primary" size="pill">
						Continue
					</Button>
				</div>

				{/* <div className="text-center">
          <Button
            variant="link"
            onClick={handleSkip}
            className="text-foreground/60 dark:text-white/50 hover:text-primary dark:hover:text-white"
          >
            Skip this step
          </Button>
        </div> */}
				<AddEmailModal
					open={addEmailModalOpen}
					onClose={handleCancel}
					people={people}
					setPeople={setPeople}
					saveLoading={saveLoading}
					hasTriedToSave={hasTriedToSave}
					setHasTriedToSave={setHasTriedToSave}
					validationErrors={validationErrors}
					onSave={handleSave}
					provider={{ id: null, name: currentPlatform }}
				/>
			</div>
		);
	}
);

PriorityPeopleStep.displayName = "PriorityPeopleStep";

export default PriorityPeopleStep;
