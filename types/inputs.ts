export type TorqueUnit = "Nm" | "ft-lb" | "in-lb";

export type Industry =
  | "aerospace"
  | "mining"
  | "oil_gas"
  | "petrochemical"
  | "railway"
  | "manufacturing"
  | "wind_energy"
  | "refineries";

export type ApplicationType =
  | "flange"
  | "wheel_nuts"
  | "structural"
  | "turbine"
  | "shutdown_turnaround"
  | "plant_maintenance"
  | "heavy_equipment";

export type PowerPreference = "battery" | "electric" | "air" | "hydraulic" | "no_preference";

export type EnvironmentType = "field" | "plant" | "confined_space" | "hazardous_area" | "remote";

export type AccuracyPriority = "standard" | "high" | "critical";

export type PurchaseIntent = "rental" | "purchase" | "unsure";

export interface ToolSelectorInput {
  requiredTorque: number;
  torqueUnit: TorqueUnit;
  fastenerSizeMm: number;
  industry: Industry;
  applicationType: ApplicationType;
  powerPreference: PowerPreference;
  environment: EnvironmentType;
  accuracyPriority: AccuracyPriority;
  purchaseIntent: PurchaseIntent;
}
