export interface ConnectedAccount {
  id?: number;
  provider?: number;
  provider_name?: string;
  email?: string;
  name?: string;
  tagId?: number;
  is_combined?: boolean;
  connectedAt?: Date;
  type?: 'input' | 'output';
  workspace?: string;
}

export interface Tag {
  id?: number;
  name?: string;
  color?: string;
  emoji?: string;
  splitBriefEnabled?: boolean;
  splitBriefTime?: string;
  splitBriefEmail?: boolean;
  splitBriefAudio?: boolean;
  isDefault?: boolean;
}

export interface SplitBriefSettings {
  enabled: boolean;
  time: string;
  email: boolean;
  audio: boolean;
}
