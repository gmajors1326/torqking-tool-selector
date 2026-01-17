import type { Metadata } from "next";
import ToolComparisonTable from "../../components/ToolComparisonTable";
import ToolResultsCard from "../../components/ToolResultsCard";
import { selectTools } from "../../lib/selectorLogic";
import { parseSelectionInput, toNewtonMeters } from "../../lib/validators";

export async function generateMetadata({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
  const { input, fastenerLabel } = parseSelectionInput(searchParams);
  
  if (!input) {
    return {
      title: "Tool Selection Results",
      description: "View torque tool recommendations for your industrial bolting application."
    };
  }

  const torqueNm = toNewtonMeters(input.requiredTorque, input.torqueUnit);
  const industryLabel = input.industry.replace(/_/g, " ");
  const applicationLabel = input.applicationType.replace(/_/g, " ");

  return {
    title: `Torque Tool Recommendations for ${industryLabel} - ${input.requiredTorque} ${input.torqueUnit}`,
    description: `Recommended torque tools for ${industryLabel} ${applicationLabel} applications requiring ${input.requiredTorque} ${input.torqueUnit} (${torqueNm.toFixed(0)} Nm). Expert tool selection for industrial bolting.`,
    robots: {
      index: false, // Don't index dynamic results pages
      follow: true
    }
  };
}

const LABELS: Record<string, string> = {
  aerospace: "Aerospace",
  mining: "Mining",
  oil_gas: "Oil & Gas",
  petrochemical: "Petrochemical",
  railway: "Railway",
  manufacturing: "Manufacturing",
  wind_energy: "Wind Energy",
  refineries: "Refineries",
  flange: "Flange",
  wheel_nuts: "Wheel Nuts",
  structural: "Structural",
  turbine: "Turbine",
  shutdown_turnaround: "Shutdown / Turnaround",
  plant_maintenance: "Plant Maintenance",
  heavy_equipment: "Heavy Equipment",
  field: "Field",
  plant: "Plant",
  confined_space: "Confined Space",
  hazardous_area: "Hazardous Area",
  remote: "Remote",
  standard: "Standard",
  high: "High",
  critical: "Critical",
  rental: "Rental",
  purchase: "Purchase",
  unsure: "Unsure",
  no_preference: "No Preference",
  battery: "Battery",
  electric: "Electric",
  electronic: "Electronic",
  air: "Air"
};

export default function ResultsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { input, errors, fastenerLabel } = parseSelectionInput(searchParams);

  if (!input || errors.length > 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-primary">Selection Details Needed</h1>
        <p className="muted">
          The selection engine requires the required torque, unit, and fastener size to proceed.
        </p>
        <div className="card p-6" style={{ background: '#2D2D2D', boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.05)' }}>
          <p className="font-semibold text-text-primary">Missing inputs:</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-text-secondary">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
        <a className="button-secondary" href="/">
          Return to Selector
        </a>
      </div>
    );
  }

  const selection = selectTools(input);
  const torqueNm = toNewtonMeters(input.requiredTorque, input.torqueUnit);

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <nav aria-label="Breadcrumb">
          <div className="flex flex-col gap-3">
            <a href="https://www.thetorqking.com" target="_blank" rel="noopener noreferrer" className="h-20 flex items-center mb-[5px]" aria-label="Visit TorqKing.com">
              <img
                src="/torqking-logo.png.png"
                alt="TorqKing - Industrial Torque Tool Selector and Bolting Solutions"
                className="h-full w-auto object-contain"
                width={200}
                height={80}
              />
            </a>
            <div className="flex gap-2">
              <a className="button-secondary text-xs px-4 py-2 w-fit flex items-center gap-1" href="/" aria-label="Return to tool selector">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Selector
              </a>
              <a className="button-secondary text-xs px-4 py-2 w-fit flex items-center gap-1" href="https://www.thetorqking.com" target="_blank" rel="noopener noreferrer" aria-label="Visit TorqKing.com">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </a>
            </div>
          </div>
        </nav>
        <p className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
          Recommended Tooling
        </p>
        <h1 className="text-4xl font-bold text-text-primary">
          Built for safe, accurate bolting
        </h1>
        <p className="max-w-3xl text-base text-text-secondary">
          Results are conservative and based on the inputs below. Confirm final tooling with site
          procedures and OEM guidance.
        </p>
      </header>
      <section aria-label="Selection parameters">

      <div className="card grid gap-4 p-6 text-sm text-text-secondary md:grid-cols-3">
        <div>
          <p className="font-semibold text-text-primary">Torque Requirement</p>
          <p className="mt-1">
            {input.requiredTorque} {input.torqueUnit} ({torqueNm.toFixed(0)} Nm)
          </p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Fastener Size</p>
          <p className="mt-1">{fastenerLabel ?? `${input.fastenerSizeMm.toFixed(1)} mm`}</p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Industry / Application</p>
          <p className="mt-1">
            {LABELS[input.industry]} · {LABELS[input.applicationType]}
          </p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Environment</p>
          <p className="mt-1">{LABELS[input.environment]}</p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Accuracy Priority</p>
          <p className="mt-1">{LABELS[input.accuracyPriority]}</p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Power Preference</p>
          <p className="mt-1">{LABELS[input.powerPreference] || "No Preference"}</p>
        </div>
      </div>
      </section>

      {selection.notes.length > 0 && (
        <div className="card p-6" style={{ background: '#2D2D2D', boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.05)' }}>
          <p className="font-semibold text-text-primary">Field Notes</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-text-secondary">
            {selection.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      <section aria-label="Tool recommendations">
        <div className="grid gap-6 lg:grid-cols-2">
        {selection.recommendations.map((recommendation) => (
          <ToolResultsCard
            key={recommendation.tool.id}
            recommendation={recommendation}
            torqueUnit={input.torqueUnit}
          />
        ))}
        </div>
      </section>

      <section aria-label="Tool comparison">
        <ToolComparisonTable
          recommendations={selection.recommendations}
          torqueUnit={input.torqueUnit}
        />
      </section>

      <div className="card mt-8 p-8">
        <p className="text-center text-lg font-semibold text-text-primary">
          Get the exact torque tool for your application — matched by real-world load, not guesswork.
        </p>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Rentals, sales, and calibrated tools — spec'd by a torque specialist.
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href="https://www.thetorqking.com/torque-tool-rental-request"
            target="_blank"
            rel="noopener noreferrer"
            className="button-primary"
          >
            Rent or Buy This Tool
          </a>
        </div>
      </div>
    </div>
  );
}
