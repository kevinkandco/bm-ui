
export interface PriorityChannelsStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    priorityChannels: string[];
    integrations: any[];
    [key: string]: any;
  };
}
