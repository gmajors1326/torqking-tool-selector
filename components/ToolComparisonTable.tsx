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
      <h3 className="text-lg font-semibold text-industrial-900 dark:text-industrial-100">Side-by-Side Comparison</h3>
      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-industrial-200 text-left text-industrial-700 dark:border-industrial-700 dark:text-industrial-300">
            <th className="py-2 pr-4 font-semibold">Tool</th>
            <th className="py-2 pr-4 font-semibold">Torque Range</th>
            <th className="py-2 pr-4 font-semibold">Power Source</th>
            <th className="py-2 pr-4 font-semibold">Best For</th>
            <th className="py-2 pr-4 font-semibold">Accuracy Fit</th>
            <th className="py-2 pr-4 font-semibold">Rental Fit</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map(({ tool }) => {
            const minTorque = fromNewtonMeters(tool.torqueRange.min, torqueUnit);
            const maxTorque = fromNewtonMeters(tool.torqueRange.max, torqueUnit);
            const torqueDisplay = `${Math.round(minTorque)}–${Math.round(maxTorque)} ${torqueUnit}`;
            return (
            <tr key={tool.id} className="border-b border-industrial-100 dark:border-industrial-700">
              <td className="py-3 pr-4 font-semibold text-industrial-900 dark:text-industrial-100">{tool.name}</td>
              <td className="py-3 pr-4 text-industrial-700 dark:text-industrial-300">
                {torqueDisplay}
              </td>
              <td className="py-3 pr-4 text-industrial-700 dark:text-industrial-300">{tool.powerSource}</td>
              <td className="py-3 pr-4 text-industrial-700 dark:text-industrial-300">
                {tool.typicalApplications[0]?.replace(/_/g, " ") || "General bolting"}
              </td>
              <td className="py-3 pr-4 text-industrial-700 dark:text-industrial-300">{tool.accuracyPriorityFit}</td>
              <td className="py-3 pr-4 text-industrial-700 dark:text-industrial-300">{tool.rentalFit}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
