import type { Metadata } from "next";
import ToolComparisonTable from "../../components/ToolComparisonTable";
import ToolResultsCard from "../../components/ToolResultsCard";
import ThemeToggle from "../../components/ThemeToggle";
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
  air: "Air",
  hydraulic: "Hydraulic"
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
        <h1 className="text-2xl font-semibold text-industrial-900 dark:text-industrial-100">Selection Details Needed</h1>
        <p className="muted">
          The selection engine requires the required torque, unit, and fastener size to proceed.
        </p>
        <div className="card border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          <p className="font-semibold">Missing inputs:</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
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

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Torque Tool Selector",
    applicationCategory: "IndustrialTool",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    featureList: [
      "Torque tool selection",
      "Industrial bolting recommendations",
      "Multi-industry support",
      "Tool comparison"
    ]
  };

  const toolStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Recommended Torque Tools",
    description: `Recommended torque tools for ${LABELS[input.industry]} ${LABELS[input.applicationType]} applications`,
    numberOfItems: selection.recommendations.length,
    itemListElement: selection.recommendations.map((rec, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: rec.tool.name,
        description: rec.reasons.join(" "),
        category: rec.tool.category.replace(/_/g, " "),
        brand: {
          "@type": "Brand",
          name: rec.tool.category.includes("hydraulic") ? "TorsionX" : "RAD"
        }
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolStructuredData) }}
      />
      <div className="space-y-8">
      <header className="space-y-3">
        <nav aria-label="Breadcrumb">
          <div className="flex items-center justify-between">
            <a className="button-secondary" href="/" aria-label="Return to tool selector">
              Back to Selector
            </a>
            <ThemeToggle />
          </div>
        </nav>
        <p className="text-sm font-semibold uppercase tracking-widest text-industrial-700 dark:text-industrial-300">
          Recommended Tooling
        </p>
        <h1 className="text-3xl font-semibold text-industrial-900 dark:text-industrial-100">
          Shortlist built for safe, accurate bolting
        </h1>
        <p className="max-w-3xl text-base text-industrial-700 dark:text-industrial-300">
          Results are conservative and based on the inputs below. Confirm final tooling with site
          procedures and OEM guidance.
        </p>
      </header>
      <section aria-label="Selection parameters">

      <div className="card grid gap-4 p-6 text-sm text-industrial-700 dark:text-industrial-300 md:grid-cols-3">
        <div>
          <p className="font-semibold text-industrial-900 dark:text-industrial-100">Torque Requirement</p>
          <p>
            {input.requiredTorque} {input.torqueUnit} ({torqueNm.toFixed(0)} Nm)
          </p>
        </div>
        <div>
          <p className="font-semibold text-industrial-900 dark:text-industrial-100">Fastener Size</p>
          <p>{fastenerLabel ?? `${input.fastenerSizeMm.toFixed(1)} mm`}</p>
        </div>
        <div>
          <p className="font-semibold text-industrial-900 dark:text-industrial-100">Industry / Application</p>
          <p>
            {LABELS[input.industry]} · {LABELS[input.applicationType]}
          </p>
        </div>
        <div>
          <p className="font-semibold text-industrial-900 dark:text-industrial-100">Environment</p>
          <p>{LABELS[input.environment]}</p>
        </div>
        <div>
          <p className="font-semibold text-industrial-900 dark:text-industrial-100">Accuracy Priority</p>
          <p>{LABELS[input.accuracyPriority]}</p>
        </div>
        <div>
          <p className="font-semibold text-industrial-900 dark:text-industrial-100">Power Preference</p>
          <p>{LABELS[input.powerPreference] || "No Preference"}</p>
        </div>
      </div>
      </section>

      {selection.notes.length > 0 && (
        <div className="card border border-slate-200 bg-slate-50 p-4 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <p className="font-semibold">Field Notes</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
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
    </div>
    </>
  );
}
