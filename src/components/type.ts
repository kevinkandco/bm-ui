export interface IntegrationOption {
  id: string;
  name: string;
  icon: string;
  available: boolean;
  description: string;
  version: "V1" | "V2" | "V3" | "Future";
}