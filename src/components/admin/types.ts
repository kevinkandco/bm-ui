export interface IUsers {
  id: number;
  name: string;
  email: string;
  profile_path: null | string;
  created_at: string;
  integrations: Integration[];
}

export interface Integration {
  id: number;
  provider: number;
  provider_id?: string;
  name: string;
  provider_name: string;
  integration_type: string;
  email: string;
  is_connected: boolean;
  created_at: string;
  updated_at: string;
  is_combined?: number;
  is_parent?: number;
  workspace?: null | string;
  error?: null;
}