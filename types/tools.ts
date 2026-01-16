export type ToolCategory =
  | "battery_torque_tool"
  | "electric_torque_tool"
  | "pneumatic_torque_tool"
  | "hydraulic_torque_wrench_square_drive"
  | "hydraulic_torque_wrench_cassette"
  | "hydraulic_bolt_tensioner";

export type PowerSource = "battery" | "electric" | "air" | "hydraulic";

export type WeightClass = "light" | "medium" | "heavy";

export type RentalFit = "high" | "medium" | "low";

export type AccuracyPriorityFit = "standard" | "high" | "critical";

export interface TorqueRange {
  min: number;
  max: number;
}

export interface ToolData {
  id: string;
  name: string;
  category: ToolCategory;
  torqueRange: TorqueRange;
  accuracy: string;
  weightClass: WeightClass;
  typicalApplications: string[];
  industries: string[];
  powerSource: PowerSource;
  rentalFit: RentalFit;
  notes: string[];
  accuracyPriorityFit: AccuracyPriorityFit;
}

export type ConfidenceLevel = "High" | "Medium" | "Conditional";

export interface ToolRecommendation {
  tool: ToolData;
  reasons: string[];
  confidence: ConfidenceLevel;
  fitScore: number;
}

export interface SelectionResult {
  recommendations: ToolRecommendation[];
  notes: string[];
}
