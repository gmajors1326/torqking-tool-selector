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
          <h3 className="text-xl font-bold text-text-primary">{tool.name}</h3>
          <p className="muted mt-1">{CATEGORY_LABELS[tool.category]}</p>
        </div>
        <ConfidenceBadge level={confidence} />
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-text-primary">Why this was selected</p>
        <ul className="mt-2 list-disc pl-5 text-sm text-text-secondary">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid gap-4 text-sm text-text-secondary md:grid-cols-2">
        <div>
          <p className="font-semibold text-text-primary">Ideal Use Case</p>
          <p className="mt-1">{tool.typicalApplications[0]?.replace(/_/g, " ") || "General bolting"}</p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Key Specs</p>
          <p className="mt-1">
            {torqueDisplay} · {tool.accuracy} · {tool.weightClass} duty
          </p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Power Source</p>
          <p className="mt-1">{tool.powerSource}</p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Rental Fit</p>
          <p className="mt-1">{tool.rentalFit}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a 
          href="https://www.thetorqking.com/torque-tool-rental-request" 
          target="_blank" 
          rel="noopener noreferrer"
          className="button-primary"
        >
          Request Rental
        </a>
        <a 
          href="https://www.thetorqking.com/contact" 
          target="_blank" 
          rel="noopener noreferrer"
          className="button-secondary"
        >
          Talk to a Specialist
        </a>
      </div>
    </div>
  );
}
