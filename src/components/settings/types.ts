export interface ConnectedAccount {
  id?: string;
  provider?: number;
  provider_name?: string;
  email?: string;
  name?: string;
  tagId?: string;
  includeInCombined?: boolean;
  connectedAt?: Date;
  type?: 'input' | 'output';
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  emoji: string;
  splitBriefEnabled: boolean;
  splitBriefTime: string;
  splitBriefEmail: boolean;
  splitBriefAudio: boolean;
  isDefault?: boolean;
}

export interface SplitBriefSettings {
  enabled: boolean;
  time: string;
  email: boolean;
  audio: boolean;
}
