import { ToolSelectorInput, TorqueUnit } from "../types/inputs";

export const FASTENER_OPTIONS: Array<{ label: string; sizeMm: number }> = [
  { label: '3/4"', sizeMm: 19.05 },
  { label: '7/8"', sizeMm: 22.23 },
  { label: '1"', sizeMm: 25.4 },
  { label: '1-1/8"', sizeMm: 28.58 },
  { label: '1-1/4"', sizeMm: 31.75 },
  { label: '1-3/8"', sizeMm: 34.93 },
  { label: '1-1/2"', sizeMm: 38.1 },
  { label: '1-5/8"', sizeMm: 41.28 },
  { label: '1-3/4"', sizeMm: 44.45 },
  { label: '2"', sizeMm: 50.8 },
  { label: "M20", sizeMm: 20 },
  { label: "M24", sizeMm: 24 },
  { label: "M30", sizeMm: 30 },
  { label: "M36", sizeMm: 36 },
  { label: "M42", sizeMm: 42 },
  { label: "M48", sizeMm: 48 }
];

export function toNewtonMeters(value: number, unit: TorqueUnit): number {
  if (unit === "Nm") {
    return value;
  }
  if (unit === "ft-lb") {
    return value * 1.3558179483314;
  }
  return value * 0.1129848290276;
}

export function fromNewtonMeters(value: number, unit: TorqueUnit): number {
  if (unit === "Nm") {
    return value;
  }
  if (unit === "ft-lb") {
    return value / 1.3558179483314;
  }
  return value / 0.1129848290276;
}

export interface ParsedInputResult {
  input: ToolSelectorInput | null;
  errors: string[];
  fastenerLabel?: string;
}

export function parseSelectionInput(
  raw: Record<string, string | string[] | undefined>
): ParsedInputResult {
  const errors: string[] = [];
  const requiredTorque = Number(raw.requiredTorque);
  const torqueUnit = raw.torqueUnit as TorqueUnit | undefined;
  const fastenerSizeMm = Number(raw.fastenerSizeMm);

  if (!requiredTorque || requiredTorque <= 0) {
    errors.push("Required torque must be greater than 0.");
  }

  if (!torqueUnit) {
    errors.push("Torque unit is required.");
  }

  if (!fastenerSizeMm || fastenerSizeMm <= 0) {
    errors.push("Fastener size is required.");
  }

  const fastenerLabel = FASTENER_OPTIONS.find(
    (option) => Math.abs(option.sizeMm - fastenerSizeMm) < 0.05
  )?.label;

  const input: ToolSelectorInput | null =
    errors.length > 0 || !torqueUnit
      ? null
      : {
          requiredTorque,
          torqueUnit,
          fastenerSizeMm,
          industry: (raw.industry as ToolSelectorInput["industry"]) || "oil_gas",
          applicationType:
            (raw.applicationType as ToolSelectorInput["applicationType"]) || "plant_maintenance",
          powerPreference:
            (raw.powerPreference as ToolSelectorInput["powerPreference"]) || "no_preference",
          environment: (raw.environment as ToolSelectorInput["environment"]) || "field",
          accuracyPriority:
            (raw.accuracyPriority as ToolSelectorInput["accuracyPriority"]) || "standard",
          purchaseIntent:
            (raw.purchaseIntent as ToolSelectorInput["purchaseIntent"]) || "unsure"
        };

  return { input, errors, fastenerLabel };
}

export function validateInput(input: ToolSelectorInput): string[] {
  const errors: string[] = [];

  if (input.requiredTorque <= 0) {
    errors.push("Required torque must be greater than 0.");
  }

  if (input.fastenerSizeMm <= 0) {
    errors.push("Fastener size must be selected.");
  }

  return errors;
}
