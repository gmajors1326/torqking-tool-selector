import { ToolSelectorInput } from "../types/inputs";
import { SelectionResult, ToolRecommendation, ToolData } from "../types/tools";
import { TOOL_DATA } from "./toolData";
import { toNewtonMeters } from "./validators";

const APPLICATION_BONUS = 18;
const INDUSTRY_PREFERRED_BONUS = 35; // Preferred tools for industry
const INDUSTRY_ALLOWED_BONUS = 20; // Allowed tools for industry
const INDUSTRY_DISCOURAGED_PENALTY = -40; // Discouraged tools for industry
const POWER_PREFERENCE_BONUS = 50; // Explicit power preference match (highest priority)
const POWER_PREFERENCE_MISMATCH_PENALTY = -50; // Strong penalty for not matching explicit power preference
const ENVIRONMENT_BONUS = 8;

function normalizeText(value: string) {
  return value.replace(/_/g, " ");
}

function confidenceFromScore(score: number): ToolRecommendation["confidence"] {
  if (score >= 70) {
    return "High";
  }
  if (score >= 50) {
    return "Medium";
  }
  return "Conditional";
}

function torqueFitScore(tool: ToolData, torqueNm: number): number {
  const { min, max } = tool.torqueRange;
  const midpoint = (min + max) / 2;
  const deviation = Math.abs(torqueNm - midpoint);
  const range = Math.max(1, max - min);
  const normalized = Math.max(0, 1 - deviation / range);
  return Math.round(normalized * 30);
}

function isAccuracyCompatible(tool: ToolData, priority: ToolSelectorInput["accuracyPriority"]) {
  if (priority === "critical") {
    return tool.accuracyPriorityFit === "critical";
  }
  if (priority === "high") {
    return tool.accuracyPriorityFit === "high" || tool.accuracyPriorityFit === "critical";
  }
  return true;
}

function matchesApplication(tool: ToolData, application: ToolSelectorInput["applicationType"]) {
  return tool.typicalApplications.includes(application);
}

function matchesIndustry(tool: ToolData, industry: ToolSelectorInput["industry"]) {
  return tool.industries.includes(industry);
}

function prefersHydraulicForTurnaround(application: ToolSelectorInput["applicationType"]) {
  return application === "shutdown_turnaround" || application === "flange";
}

function toolSupportsConfined(tool: ToolData) {
  return tool.category === "hydraulic_torque_wrench_cassette";
}

function fastenerIsLarge(sizeMm: number) {
  return sizeMm >= 36;
}

// Helper functions to identify tool series by name/id
function isERadTool(tool: ToolData): boolean {
  return tool.name.startsWith("E-RAD") || tool.id.startsWith("e-rad");
}

function isVRadTool(tool: ToolData): boolean {
  return tool.name.startsWith("V-RAD") || tool.id.startsWith("v-rad");
}

// Check if tool matches power preference (handles special cases for electronic/electric)
function matchesPowerPreference(tool: ToolData, powerPreference: ToolSelectorInput["powerPreference"]): boolean {
  if (powerPreference === "no_preference") {
    return true;
  }
  
  if (powerPreference === "electronic") {
    // Electronic preference matches E-RAD tools (which have powerSource: "electric")
    return isERadTool(tool);
  }
  
  if (powerPreference === "electric") {
    // Electric preference matches V-RAD tools only (which have powerSource: "battery")
    return isVRadTool(tool);
  }
  
  // For other preferences (battery, air, hydraulic), match by powerSource
  // But exclude V-RAD from battery matches since V-RAD should only match "electric"
  if (powerPreference === "battery") {
    return tool.powerSource === "battery" && !isVRadTool(tool);
  }
  
  return tool.powerSource === powerPreference;
}

// Industry-to-tool preference matrix (canonical)
type IndustryPreference = "preferred" | "allowed" | "discouraged";

function getIndustryToolPreference(
  toolId: string,
  toolCategory: ToolData["category"],
  industry: ToolSelectorInput["industry"]
): IndustryPreference {
  const matrix: Record<string, Record<string, IndustryPreference>> = {
    aerospace: {
      "e-rad-300": "preferred",
      "e-rad-600": "preferred",
      "e-rad-900": "preferred",
      "e-rad-1200": "preferred",
      "e-rad-2000": "preferred",
      "e-rad-3000": "preferred",
      "e-rad-5000": "preferred",
      "e-rad-8000": "preferred",
      "e-rad-blu-300": "preferred",
      "e-rad-blu-600": "preferred",
      "e-rad-blu-900": "preferred",
      "e-rad-blu-1200": "preferred",
      "e-rad-blu-2000": "preferred",
      "e-rad-blu-3000": "preferred",
      "e-rad-blu-5000": "preferred",
      "e-rad-blu-8000": "preferred",
      "e-rad-blu-11000": "preferred",
      "hydraulic-tensioner": "preferred",
      "v-rad-300": "allowed",
      "v-rad-600": "allowed",
      "v-rad-900": "allowed",
      "v-rad-1200": "allowed",
      "v-rad-2000": "allowed",
      "rad-pneumatic-300": "discouraged",
      "rad-pneumatic-600": "discouraged",
      "rad-pneumatic-900": "discouraged",
      "rad-pneumatic-1200": "discouraged",
      "rad-pneumatic-2000": "discouraged",
      "rad-pneumatic-3000": "discouraged",
      "rad-pneumatic-5000": "discouraged",
      "rad-pneumatic-8000": "discouraged",
      "rad-pneumatic-11000": "discouraged",
      "torsionx-sd-2": "discouraged",
      "torsionx-sd-4": "discouraged",
      "torsionx-sd-8": "discouraged",
      "torsionx-sd-16": "discouraged",
      "torsionx-sd-32": "discouraged",
      "torsionx-sd-64": "discouraged",
      "torsionx-lp-2": "discouraged",
      "torsionx-lp-4": "discouraged",
      "torsionx-lp-8": "discouraged",
      "torsionx-lp-16": "discouraged",
      "torsionx-lp-32": "discouraged"
    },
    mining: {
      "rad-pneumatic-300": "preferred",
      "rad-pneumatic-600": "preferred",
      "rad-pneumatic-900": "preferred",
      "rad-pneumatic-1200": "preferred",
      "rad-pneumatic-2000": "preferred",
      "rad-pneumatic-3000": "preferred",
      "rad-pneumatic-5000": "preferred",
      "rad-pneumatic-8000": "preferred",
      "rad-pneumatic-11000": "preferred",
      "b-rad-300": "preferred",
      "b-rad-600": "preferred",
      "b-rad-900": "preferred",
      "b-rad-1200": "preferred",
      "b-rad-1500": "preferred",
      "b-rad-2000": "preferred",
      "b-rad-3000": "preferred",
      "b-rad-5000": "preferred",
      "b-rad-xtreme-3000": "preferred",
      "b-rad-xtreme-6000": "preferred",
      "b-rad-xtreme-9000": "preferred",
      "db-rad-700": "preferred",
      "db-rad-1000": "preferred",
      "db-rad-1500": "preferred",
      "db-rad-2000": "preferred",
      "db-rad-4000": "preferred",
      "db-rad-6000": "preferred",
      "db-rad-8000": "preferred",
      "db-rad-11000": "preferred",
      "torsionx-sd-2": "allowed",
      "torsionx-sd-4": "allowed",
      "torsionx-sd-8": "allowed",
      "torsionx-sd-16": "allowed",
      "torsionx-sd-32": "allowed",
      "torsionx-sd-64": "allowed",
      "e-rad-300": "discouraged",
      "e-rad-600": "discouraged",
      "e-rad-900": "discouraged",
      "e-rad-1200": "discouraged",
      "e-rad-2000": "discouraged",
      "e-rad-3000": "discouraged",
      "e-rad-5000": "discouraged",
      "e-rad-8000": "discouraged",
      "e-rad-blu-300": "discouraged",
      "e-rad-blu-600": "discouraged",
      "e-rad-blu-900": "discouraged",
      "e-rad-blu-1200": "discouraged",
      "e-rad-blu-2000": "discouraged",
      "e-rad-blu-3000": "discouraged",
      "e-rad-blu-5000": "discouraged",
      "e-rad-blu-8000": "discouraged",
      "e-rad-blu-11000": "discouraged",
      "hydraulic-tensioner": "discouraged"
    },
    oil_gas: {
      "torsionx-sd-2": "preferred",
      "torsionx-sd-4": "preferred",
      "torsionx-sd-8": "preferred",
      "torsionx-sd-16": "preferred",
      "torsionx-sd-32": "preferred",
      "torsionx-sd-64": "preferred",
      "torsionx-lp-2": "preferred",
      "torsionx-lp-4": "preferred",
      "torsionx-lp-8": "preferred",
      "torsionx-lp-16": "preferred",
      "torsionx-lp-32": "preferred",
      "hydraulic-tensioner": "preferred",
      "b-rad-300": "allowed",
      "b-rad-600": "allowed",
      "b-rad-900": "allowed",
      "b-rad-1200": "allowed",
      "b-rad-1500": "allowed",
      "b-rad-2000": "allowed",
      "b-rad-3000": "allowed",
      "b-rad-5000": "allowed",
      "b-rad-xtreme-3000": "allowed",
      "b-rad-xtreme-6000": "allowed",
      "b-rad-xtreme-9000": "allowed",
      "db-rad-700": "allowed",
      "db-rad-1000": "allowed",
      "db-rad-1500": "allowed",
      "db-rad-2000": "allowed",
      "db-rad-4000": "allowed",
      "db-rad-6000": "allowed",
      "db-rad-8000": "allowed",
      "db-rad-11000": "allowed",
      "e-rad-300": "allowed",
      "e-rad-600": "allowed",
      "e-rad-900": "allowed",
      "e-rad-1200": "allowed",
      "e-rad-2000": "allowed",
      "e-rad-3000": "allowed",
      "e-rad-5000": "allowed",
      "e-rad-8000": "allowed",
      "e-rad-blu-300": "allowed",
      "e-rad-blu-600": "allowed",
      "e-rad-blu-900": "allowed",
      "e-rad-blu-1200": "allowed",
      "e-rad-blu-2000": "allowed",
      "e-rad-blu-3000": "allowed",
      "e-rad-blu-5000": "allowed",
      "e-rad-blu-8000": "allowed",
      "e-rad-blu-11000": "allowed",
      "rad-pneumatic-300": "discouraged",
      "rad-pneumatic-600": "discouraged",
      "rad-pneumatic-900": "discouraged",
      "rad-pneumatic-1200": "discouraged",
      "rad-pneumatic-2000": "discouraged",
      "rad-pneumatic-3000": "discouraged",
      "rad-pneumatic-5000": "discouraged",
      "rad-pneumatic-8000": "discouraged",
      "rad-pneumatic-11000": "discouraged"
    },
    petrochemical: {
      "torsionx-lp-2": "preferred",
      "torsionx-lp-4": "preferred",
      "torsionx-lp-8": "preferred",
      "torsionx-lp-16": "preferred",
      "torsionx-lp-32": "preferred",
      "e-rad-blu-300": "preferred",
      "e-rad-blu-600": "preferred",
      "e-rad-blu-900": "preferred",
      "e-rad-blu-1200": "preferred",
      "e-rad-blu-2000": "preferred",
      "e-rad-blu-3000": "preferred",
      "e-rad-blu-5000": "preferred",
      "e-rad-blu-8000": "preferred",
      "e-rad-blu-11000": "preferred",
      "hydraulic-tensioner": "allowed",
      "b-rad-300": "allowed",
      "b-rad-600": "allowed",
      "b-rad-900": "allowed",
      "b-rad-1200": "allowed",
      "b-rad-1500": "allowed",
      "b-rad-2000": "allowed",
      "b-rad-3000": "allowed",
      "b-rad-5000": "allowed",
      "b-rad-xtreme-3000": "allowed",
      "b-rad-xtreme-6000": "allowed",
      "b-rad-xtreme-9000": "allowed",
      "rad-pneumatic-300": "discouraged",
      "rad-pneumatic-600": "discouraged",
      "rad-pneumatic-900": "discouraged",
      "rad-pneumatic-1200": "discouraged",
      "rad-pneumatic-2000": "discouraged",
      "rad-pneumatic-3000": "discouraged",
      "rad-pneumatic-5000": "discouraged",
      "rad-pneumatic-8000": "discouraged",
      "rad-pneumatic-11000": "discouraged"
    },
    railway: {
      "rad-pneumatic-300": "preferred",
      "rad-pneumatic-600": "preferred",
      "rad-pneumatic-900": "preferred",
      "rad-pneumatic-1200": "preferred",
      "rad-pneumatic-2000": "preferred",
      "rad-pneumatic-3000": "preferred",
      "rad-pneumatic-5000": "preferred",
      "rad-pneumatic-8000": "preferred",
      "rad-pneumatic-11000": "preferred",
      "b-rad-300": "preferred",
      "b-rad-600": "preferred",
      "b-rad-900": "preferred",
      "b-rad-1200": "preferred",
      "b-rad-1500": "preferred",
      "b-rad-2000": "preferred",
      "b-rad-3000": "preferred",
      "b-rad-5000": "preferred",
      "b-rad-xtreme-3000": "preferred",
      "b-rad-xtreme-6000": "preferred",
      "b-rad-xtreme-9000": "preferred",
      "e-rad-300": "allowed",
      "e-rad-600": "allowed",
      "e-rad-900": "allowed",
      "e-rad-1200": "allowed",
      "e-rad-2000": "allowed",
      "e-rad-3000": "allowed",
      "e-rad-5000": "allowed",
      "e-rad-8000": "allowed",
      "e-rad-blu-300": "allowed",
      "e-rad-blu-600": "allowed",
      "e-rad-blu-900": "allowed",
      "e-rad-blu-1200": "allowed",
      "e-rad-blu-2000": "allowed",
      "e-rad-blu-3000": "allowed",
      "e-rad-blu-5000": "allowed",
      "e-rad-blu-8000": "allowed",
      "e-rad-blu-11000": "allowed",
      "hydraulic-tensioner": "discouraged",
      "torsionx-sd-2": "discouraged",
      "torsionx-sd-4": "discouraged",
      "torsionx-sd-8": "discouraged",
      "torsionx-sd-16": "discouraged",
      "torsionx-sd-32": "discouraged",
      "torsionx-sd-64": "discouraged",
      "torsionx-lp-2": "discouraged",
      "torsionx-lp-4": "discouraged",
      "torsionx-lp-8": "discouraged",
      "torsionx-lp-16": "discouraged",
      "torsionx-lp-32": "discouraged"
    },
    manufacturing: {
      "e-rad-300": "preferred",
      "e-rad-600": "preferred",
      "e-rad-900": "preferred",
      "e-rad-1200": "preferred",
      "e-rad-2000": "preferred",
      "e-rad-3000": "preferred",
      "e-rad-5000": "preferred",
      "e-rad-8000": "preferred",
      "e-rad-blu-300": "preferred",
      "e-rad-blu-600": "preferred",
      "e-rad-blu-900": "preferred",
      "e-rad-blu-1200": "preferred",
      "e-rad-blu-2000": "preferred",
      "e-rad-blu-3000": "preferred",
      "e-rad-blu-5000": "preferred",
      "e-rad-blu-8000": "preferred",
      "e-rad-blu-11000": "preferred",
      "b-rad-300": "preferred",
      "b-rad-600": "preferred",
      "b-rad-900": "preferred",
      "b-rad-1200": "preferred",
      "b-rad-1500": "preferred",
      "b-rad-2000": "preferred",
      "b-rad-3000": "preferred",
      "b-rad-5000": "preferred",
      "b-rad-xtreme-3000": "preferred",
      "b-rad-xtreme-6000": "preferred",
      "b-rad-xtreme-9000": "preferred",
      "rad-pneumatic-300": "allowed",
      "rad-pneumatic-600": "allowed",
      "rad-pneumatic-900": "allowed",
      "rad-pneumatic-1200": "allowed",
      "rad-pneumatic-2000": "allowed",
      "rad-pneumatic-3000": "allowed",
      "rad-pneumatic-5000": "allowed",
      "rad-pneumatic-8000": "allowed",
      "rad-pneumatic-11000": "allowed",
      "hydraulic-tensioner": "discouraged",
      "torsionx-sd-2": "discouraged",
      "torsionx-sd-4": "discouraged",
      "torsionx-sd-8": "discouraged",
      "torsionx-sd-16": "discouraged",
      "torsionx-sd-32": "discouraged",
      "torsionx-sd-64": "discouraged",
      "torsionx-lp-2": "discouraged",
      "torsionx-lp-4": "discouraged",
      "torsionx-lp-8": "discouraged",
      "torsionx-lp-16": "discouraged",
      "torsionx-lp-32": "discouraged"
    },
    wind_energy: {
      "e-rad-blu-300": "preferred",
      "e-rad-blu-600": "preferred",
      "e-rad-blu-900": "preferred",
      "e-rad-blu-1200": "preferred",
      "e-rad-blu-2000": "preferred",
      "e-rad-blu-3000": "preferred",
      "e-rad-blu-5000": "preferred",
      "e-rad-blu-8000": "preferred",
      "e-rad-blu-11000": "preferred",
      "hydraulic-tensioner": "preferred",
      "torsionx-sd-2": "allowed",
      "torsionx-sd-4": "allowed",
      "torsionx-sd-8": "allowed",
      "torsionx-sd-16": "allowed",
      "torsionx-sd-32": "allowed",
      "torsionx-sd-64": "allowed",
      "torsionx-lp-2": "allowed",
      "torsionx-lp-4": "allowed",
      "torsionx-lp-8": "allowed",
      "torsionx-lp-16": "allowed",
      "torsionx-lp-32": "allowed",
      "b-rad-300": "allowed",
      "b-rad-600": "allowed",
      "b-rad-900": "allowed",
      "b-rad-1200": "allowed",
      "b-rad-1500": "allowed",
      "b-rad-2000": "allowed",
      "b-rad-3000": "allowed",
      "b-rad-5000": "allowed",
      "b-rad-xtreme-3000": "allowed",
      "b-rad-xtreme-6000": "allowed",
      "b-rad-xtreme-9000": "allowed",
      "rad-pneumatic-300": "discouraged",
      "rad-pneumatic-600": "discouraged",
      "rad-pneumatic-900": "discouraged",
      "rad-pneumatic-1200": "discouraged",
      "rad-pneumatic-2000": "discouraged",
      "rad-pneumatic-3000": "discouraged",
      "rad-pneumatic-5000": "discouraged",
      "rad-pneumatic-8000": "discouraged",
      "rad-pneumatic-11000": "discouraged"
    },
    refineries: {
      "torsionx-lp-2": "preferred",
      "torsionx-lp-4": "preferred",
      "torsionx-lp-8": "preferred",
      "torsionx-lp-16": "preferred",
      "torsionx-lp-32": "preferred",
      "hydraulic-tensioner": "preferred",
      "e-rad-300": "allowed",
      "e-rad-600": "allowed",
      "e-rad-900": "allowed",
      "e-rad-1200": "allowed",
      "e-rad-2000": "allowed",
      "e-rad-3000": "allowed",
      "e-rad-5000": "allowed",
      "e-rad-8000": "allowed",
      "e-rad-blu-300": "allowed",
      "e-rad-blu-600": "allowed",
      "e-rad-blu-900": "allowed",
      "e-rad-blu-1200": "allowed",
      "e-rad-blu-2000": "allowed",
      "e-rad-blu-3000": "allowed",
      "e-rad-blu-5000": "allowed",
      "e-rad-blu-8000": "allowed",
      "e-rad-blu-11000": "allowed",
      "b-rad-300": "allowed",
      "b-rad-600": "allowed",
      "b-rad-900": "allowed",
      "b-rad-1200": "allowed",
      "b-rad-1500": "allowed",
      "b-rad-2000": "allowed",
      "b-rad-3000": "allowed",
      "b-rad-5000": "allowed",
      "b-rad-xtreme-3000": "allowed",
      "b-rad-xtreme-6000": "allowed",
      "b-rad-xtreme-9000": "allowed",
      "rad-pneumatic-300": "discouraged",
      "rad-pneumatic-600": "discouraged",
      "rad-pneumatic-900": "discouraged",
      "rad-pneumatic-1200": "discouraged",
      "rad-pneumatic-2000": "discouraged",
      "rad-pneumatic-3000": "discouraged",
      "rad-pneumatic-5000": "discouraged",
      "rad-pneumatic-8000": "discouraged",
      "rad-pneumatic-11000": "discouraged"
    }
  };

  return matrix[industry]?.[toolId] || "allowed";
}

// Global rules that apply universally across all industries
function applyGlobalRules(
  tool: ToolData,
  input: ToolSelectorInput,
  torqueNm: number
): { scoreAdjustment: number; reasons: string[] } {
  let adjustment = 0;
  const reasons: string[] = [];

  // Critical accuracy → favor Electric or Tensioning
  if (input.accuracyPriority === "critical") {
    if (tool.category === "electric_torque_tool" || tool.category === "hydraulic_bolt_tensioner") {
      adjustment += 15;
      reasons.push("Critical accuracy requirement favors electric or tensioning systems.");
    } else if (tool.category === "battery_torque_tool" || tool.category === "pneumatic_torque_tool") {
      adjustment -= 10;
      reasons.push("Note: Critical accuracy may require electric or tensioning systems.");
    }
  }

  // Tight clearance → favor Cassette Hydraulic
  if (input.environment === "confined_space") {
    if (tool.category === "hydraulic_torque_wrench_cassette") {
      adjustment += 12;
      reasons.push("Low-profile cassette ideal for tight clearance.");
    } else if (
      tool.category === "hydraulic_torque_wrench_square_drive" ||
      tool.weightClass === "heavy"
    ) {
      adjustment -= 8;
      reasons.push("Note: Tight clearance may require low-profile cassette tooling.");
    }
  }

  // Speed-critical repetitive work → favor Pneumatic
  if (
    input.applicationType === "wheel_nuts" ||
    (input.applicationType === "plant_maintenance" && input.industry === "railway")
  ) {
    if (tool.category === "pneumatic_torque_tool") {
      adjustment += 10;
      reasons.push("Pneumatic tooling optimized for speed-critical repetitive work.");
    }
  }

  // Hazardous area → avoid Electric unless verified
  if (input.environment === "hazardous_area") {
    if (tool.powerSource === "electric") {
      adjustment -= 15;
      reasons.push("Warning: Verify hazardous area classification before using electric tools.");
    } else if (tool.powerSource === "battery" || tool.powerSource === "air" || tool.powerSource === "hydraulic") {
      adjustment += 5;
      reasons.push("Non-electric power source suitable for hazardous areas.");
    }
  }

  // If torque > battery upper range → Hydraulic only
  const maxBatteryTorque = 11000; // DB-RAD 11000 upper limit
  if (torqueNm > maxBatteryTorque) {
    if (tool.category === "battery_torque_tool") {
      adjustment -= 20;
      reasons.push("Torque requirement exceeds battery tool capacity; hydraulic recommended.");
    } else if (
      tool.category === "hydraulic_torque_wrench_square_drive" ||
      tool.category === "hydraulic_torque_wrench_cassette" ||
      tool.category === "hydraulic_bolt_tensioner"
    ) {
      adjustment += 8;
      reasons.push("Hydraulic tooling required for torque above battery range.");
    }
  }

  return { scoreAdjustment: adjustment, reasons };
}

function scoreTool(tool: ToolData, input: ToolSelectorInput, torqueNm: number): ToolRecommendation {
  let score = torqueFitScore(tool, torqueNm);
  const reasons: string[] = [];

  if (matchesApplication(tool, input.applicationType)) {
    score += APPLICATION_BONUS;
    reasons.push(`Matches ${normalizeText(input.applicationType)} applications.`);
  }

  // Industry preference matrix scoring (canonical)
  let industryPreference = getIndustryToolPreference(tool.id, tool.category, input.industry);
  
  // Exception: Pneumatic tools allowed for wheel nuts in Oil & Gas
  if (
    industryPreference === "discouraged" &&
    tool.category === "pneumatic_torque_tool" &&
    input.industry === "oil_gas" &&
    input.applicationType === "wheel_nuts"
  ) {
    industryPreference = "allowed";
  }

  if (industryPreference === "preferred") {
    score += INDUSTRY_PREFERRED_BONUS;
    reasons.push(`Preferred tool for ${normalizeText(input.industry)} applications.`);
  } else if (industryPreference === "allowed") {
    score += INDUSTRY_ALLOWED_BONUS;
    reasons.push(`Commonly applied in ${normalizeText(input.industry)}.`);
  } else if (industryPreference === "discouraged") {
    score += INDUSTRY_DISCOURAGED_PENALTY;
    reasons.push(`Note: Generally discouraged for ${normalizeText(input.industry)}; verify suitability.`);
  }

  // Explicit power preference is high priority - user has stated a requirement
  if (input.powerPreference !== "no_preference") {
    if (matchesPowerPreference(tool, input.powerPreference)) {
      score += POWER_PREFERENCE_BONUS;
      const preferenceLabel = input.powerPreference === "electronic" ? "electronic (E-RAD)" : 
                              input.powerPreference === "electric" ? "electric (V-RAD)" : 
                              normalizeText(input.powerPreference);
      reasons.push(`Matches explicit ${preferenceLabel} power preference.`);
    } else {
      score += POWER_PREFERENCE_MISMATCH_PENALTY;
      const preferenceLabel = input.powerPreference === "electronic" ? "electronic (E-RAD)" : 
                              input.powerPreference === "electric" ? "electric (V-RAD)" : 
                              normalizeText(input.powerPreference);
      reasons.push(`Does not match ${preferenceLabel} power preference.`);
    }
  }

  if (input.environment === "confined_space" && toolSupportsConfined(tool)) {
    score += ENVIRONMENT_BONUS;
    reasons.push("Low-profile geometry supports confined access.");
  }

  if (input.environment === "remote" && tool.powerSource === "battery") {
    score += ENVIRONMENT_BONUS;
    reasons.push("Battery power supports remote locations.");
  }

  if (input.environment === "field" && tool.powerSource !== "electric") {
    score += 4;
    reasons.push("Field-ready power source.");
  }

  if (input.applicationType === "wheel_nuts") {
    if (tool.category === "pneumatic_torque_tool" || tool.category === "battery_torque_tool") {
      score += 12;
      reasons.push("High-speed rundown suited for wheel nuts.");
    }
  }

  if (prefersHydraulicForTurnaround(input.applicationType)) {
    if (
      tool.category === "hydraulic_torque_wrench_square_drive" ||
      tool.category === "hydraulic_torque_wrench_cassette" ||
      tool.category === "hydraulic_bolt_tensioner"
    ) {
      score += 12;
      reasons.push("Hydraulic tooling supports flange and turnaround control.");
    }
  }

  if (fastenerIsLarge(input.fastenerSizeMm)) {
    if (
      tool.category === "hydraulic_torque_wrench_square_drive" ||
      tool.category === "hydraulic_torque_wrench_cassette" ||
      tool.category === "hydraulic_bolt_tensioner"
    ) {
      score += 10;
      reasons.push("Large fasteners benefit from hydraulic tooling.");
    }
  }

  if (input.accuracyPriority === "critical") {
    score += 6;
    reasons.push("Accuracy-critical requirement prioritized.");
  } else if (input.accuracyPriority === "high" && tool.accuracyPriorityFit !== "standard") {
    score += 4;
    reasons.push("Enhanced torque control aligns with high accuracy needs.");
  }

  if (input.purchaseIntent === "rental" && tool.rentalFit === "high") {
    score += 6;
    reasons.push("Strong rental availability profile.");
  }

  // Apply global rules (universal across all industries)
  const globalRules = applyGlobalRules(tool, input, torqueNm);
  score += globalRules.scoreAdjustment;
  reasons.push(...globalRules.reasons);

  if (reasons.length === 0) {
    reasons.push("Meets torque range and baseline fit.");
  }

  return {
    tool,
    reasons,
    confidence: confidenceFromScore(score),
    fitScore: score
  };
}

export function selectTools(input: ToolSelectorInput): SelectionResult {
  const torqueNm = toNewtonMeters(input.requiredTorque, input.torqueUnit);
  const notes: string[] = [];

  let candidates = TOOL_DATA.filter(
    (tool) => torqueNm >= tool.torqueRange.min && torqueNm <= tool.torqueRange.max
  );

  // When explicit power preference is set, ONLY show tools matching that preference
  // User's explicit requirement takes absolute priority
  if (input.powerPreference !== "no_preference") {
    const powerPreferenceMatches = candidates.filter(
      (tool) => matchesPowerPreference(tool, input.powerPreference)
    );
    if (powerPreferenceMatches.length > 0) {
      // ONLY include tools matching the power preference - user requirement is absolute
      candidates = powerPreferenceMatches;
      const powerMatchesInIndustry = candidates.filter((tool) =>
        matchesIndustry(tool, input.industry)
      );
      if (powerMatchesInIndustry.length === 0) {
        notes.push(
          `Power preference (${input.powerPreference}) tools shown. Note: Less common in ${input.industry.replace(/_/g, " ")}.`
        );
      }
    } else {
      // No tools match power preference - fall back to industry filter with warning
      const industryFiltered = candidates.filter((tool) => matchesIndustry(tool, input.industry));
      if (industryFiltered.length > 0) {
        candidates = industryFiltered;
        notes.push(
          `No ${input.powerPreference} tools available in torque range. Showing industry-appropriate alternatives.`
        );
      } else {
        notes.push(
          `No tools in the torque range match power preference or are commonly used in ${input.industry.replace(/_/g, " ")}. Review torque requirement or contact engineering.`
        );
      }
    }
  } else {
    // No explicit power preference - use industry filter
    const industryFiltered = candidates.filter((tool) => matchesIndustry(tool, input.industry));
    if (industryFiltered.length > 0) {
      candidates = industryFiltered;
    } else {
      notes.push(
        `No tools in the torque range are commonly used in ${input.industry.replace(/_/g, " ")}. Review torque requirement or contact engineering.`
      );
    }
  }

  if (input.environment === "hazardous_area" && input.powerPreference !== "electric" && input.powerPreference !== "electronic") {
    // Filter out E-RAD tools (electronic) in hazardous areas unless explicitly requested
    candidates = candidates.filter((tool) => !isERadTool(tool));
    notes.push("Hazardous area selected: non-electric tools prioritized.");
  }

  const accuracyFiltered = candidates.filter((tool) =>
    isAccuracyCompatible(tool, input.accuracyPriority)
  );

  if (accuracyFiltered.length > 0) {
    candidates = accuracyFiltered;
  } else if (input.accuracyPriority !== "standard") {
    notes.push("Accuracy priority exceeds available tooling in the torque range.");
  }

  const scored = candidates.map((tool) => scoreTool(tool, input, torqueNm));
  
  // When explicit power preference is set, prioritize matching tools
  if (input.powerPreference !== "no_preference") {
    scored.sort((a, b) => {
      const aMatches = matchesPowerPreference(a.tool, input.powerPreference);
      const bMatches = matchesPowerPreference(b.tool, input.powerPreference);
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return b.fitScore - a.fitScore;
    });
  } else {
    scored.sort((a, b) => b.fitScore - a.fitScore);
  }

  const limit = input.accuracyPriority === "critical" ? 2 : 3;
  const recommendations = scored.slice(0, limit);

  if (recommendations.length === 0) {
    notes.push("No tools match the torque range; review torque requirement or contact engineering.");
  }

  if (input.environment === "hazardous_area" && (input.powerPreference === "electric" || input.powerPreference === "electronic")) {
    const toolType = input.powerPreference === "electric" ? "V-RAD" : "E-RAD";
    notes.push(`${toolType} preference noted; confirm hazardous area classification before deployment.`);
  }

  if (input.applicationType === "shutdown_turnaround") {
    notes.push("Shutdown/turnaround work often benefits from hydraulic torque or tensioning systems.");
  }

  return { recommendations, notes };
}
