import { ToolRecommendation } from "../types/tools";
import { TorqueUnit } from "../types/inputs";
import { fromNewtonMeters } from "../lib/validators";

export default function ToolComparisonTable({
  recommendations,
  torqueUnit = "Nm"
}: {
  recommendations: ToolRecommendation[];
  torqueUnit?: TorqueUnit;
}) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="card mt-8 overflow-x-auto p-6">
      <h3 className="text-xl font-bold text-text-primary">Side-by-Side Comparison</h3>
      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-dark-pressed text-left">
            <th className="py-3 pr-4 font-semibold text-text-primary">Tool</th>
            <th className="py-3 pr-4 font-semibold text-text-primary">Torque Range</th>
            <th className="py-3 pr-4 font-semibold text-text-primary">Power Source</th>
            <th className="py-3 pr-4 font-semibold text-text-primary">Best For</th>
            <th className="py-3 pr-4 font-semibold text-text-primary">Accuracy Fit</th>
            <th className="py-3 pr-4 font-semibold text-text-primary">Rental Fit</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map(({ tool }) => {
            const minTorque = fromNewtonMeters(tool.torqueRange.min, torqueUnit);
            const maxTorque = fromNewtonMeters(tool.torqueRange.max, torqueUnit);
            const torqueDisplay = `${Math.round(minTorque)}–${Math.round(maxTorque)} ${torqueUnit}`;
            return (
            <tr key={tool.id} className="border-b border-dark-pressed">
              <td className="py-4 pr-4 font-semibold text-text-primary">{tool.name}</td>
              <td className="py-4 pr-4 text-text-secondary">
                {torqueDisplay}
              </td>
              <td className="py-4 pr-4 text-text-secondary">{tool.powerSource}</td>
              <td className="py-4 pr-4 text-text-secondary">
                {tool.typicalApplications[0]?.replace(/_/g, " ") || "General bolting"}
              </td>
              <td className="py-4 pr-4 text-text-secondary">{tool.accuracyPriorityFit}</td>
              <td className="py-4 pr-4 text-text-secondary">{tool.rentalFit}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
