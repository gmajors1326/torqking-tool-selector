import ConfidenceBadge from "./ConfidenceBadge";
import { ToolRecommendation } from "../types/tools";
import { TorqueUnit } from "../types/inputs";
import { fromNewtonMeters } from "../lib/validators";

const CATEGORY_LABELS: Record<string, string> = {
  battery_torque_tool: "Battery Torque Tool",
  electric_torque_tool: "Electric Torque Tool",
  pneumatic_torque_tool: "Pneumatic Torque Tool",
  hydraulic_torque_wrench_square_drive: "Hydraulic Torque Wrench - Square Drive",
  hydraulic_torque_wrench_cassette: "Hydraulic Torque Wrench - Low Profile Cassette",
  hydraulic_bolt_tensioner: "Hydraulic Bolt Tensioner"
};

export default function ToolResultsCard({
  recommendation,
  torqueUnit = "Nm"
}: {
  recommendation: ToolRecommendation;
  torqueUnit?: TorqueUnit;
}) {
  const { tool, reasons, confidence } = recommendation;
  
  const minTorque = fromNewtonMeters(tool.torqueRange.min, torqueUnit);
  const maxTorque = fromNewtonMeters(tool.torqueRange.max, torqueUnit);
  const torqueDisplay = `${Math.round(minTorque)}–${Math.round(maxTorque)} ${torqueUnit}`;

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-industrial-900 dark:text-industrial-100">{tool.name}</h3>
          <p className="muted mt-1">{CATEGORY_LABELS[tool.category]}</p>
        </div>
        <ConfidenceBadge level={confidence} />
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-industrial-900 dark:text-industrial-100">Why this was selected</p>
        <ul className="mt-2 list-disc pl-5 text-sm text-industrial-700 dark:text-industrial-300">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-industrial-700 dark:text-industrial-300 md:grid-cols-2">
        <div>
          <p className="font-semibold text-industrial-900 dark:text-industrial-100">Ideal Use Case</p>
          <p>{tool.typicalApplications[0]?.replace(/_/g, " ") || "General bolting"}</p>
        </div>
        <div>
          <p className="font-semibold text-industrial-900 dark:text-industrial-100">Key Specs</p>
          <p>
            {torqueDisplay} · {tool.accuracy} · {tool.weightClass} duty
          </p>
        </div>
        <div>
          <p className="font-semibold text-industrial-900 dark:text-industrial-100">Power Source</p>
          <p>{tool.powerSource}</p>
        </div>
        <div>
          <p className="font-semibold text-industrial-900 dark:text-industrial-100">Rental Fit</p>
          <p>{tool.rentalFit}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a 
          href="https://www.thetorqking.com/torque-tool-rental-request" 
          target="_blank" 
          rel="noopener noreferrer"
          className="button-primary"
        >
          Request Rental
        </a>
        <button className="button-secondary" type="button">
          Talk to a Specialist
        </button>
      </div>
    </div>
  );
}
