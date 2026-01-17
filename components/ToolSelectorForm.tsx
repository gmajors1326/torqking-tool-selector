"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AccuracyPriority,
  ApplicationType,
  EnvironmentType,
  Industry,
  PowerPreference,
  PurchaseIntent,
  TorqueUnit,
  ToolSelectorInput
} from "../types/inputs";
import { FASTENER_OPTIONS, validateInput } from "../lib/validators";

const INDUSTRY_OPTIONS: Array<{ value: Industry; label: string }> = [
  { value: "aerospace", label: "Aerospace" },
  { value: "mining", label: "Mining" },
  { value: "oil_gas", label: "Oil & Gas" },
  { value: "petrochemical", label: "Petrochemical" },
  { value: "railway", label: "Railway" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "wind_energy", label: "Wind Energy" },
  { value: "refineries", label: "Refineries" }
];

const APPLICATION_OPTIONS: Array<{ value: ApplicationType; label: string }> = [
  { value: "flange", label: "Flange" },
  { value: "wheel_nuts", label: "Wheel Nuts" },
  { value: "structural", label: "Structural" },
  { value: "turbine", label: "Turbine" },
  { value: "shutdown_turnaround", label: "Shutdown / Turnaround" },
  { value: "plant_maintenance", label: "Plant Maintenance" },
  { value: "heavy_equipment", label: "Heavy Equipment" }
];

const POWER_OPTIONS: Array<{ value: PowerPreference; label: string }> = [
  { value: "no_preference", label: "No Preference" },
  { value: "battery", label: "Battery" },
  { value: "electric", label: "Electric" },
  { value: "electronic", label: "Electronic" },
  { value: "air", label: "Air" },
  { value: "hydraulic", label: "Hydraulic" }
];

const ENVIRONMENT_OPTIONS: Array<{ value: EnvironmentType; label: string }> = [
  { value: "field", label: "Field" },
  { value: "plant", label: "Plant" },
  { value: "confined_space", label: "Confined Space" },
  { value: "hazardous_area", label: "Hazardous Area" },
  { value: "remote", label: "Remote" }
];

const ACCURACY_OPTIONS: Array<{ value: AccuracyPriority; label: string }> = [
  { value: "standard", label: "Standard" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" }
];

const PURCHASE_OPTIONS: Array<{ value: PurchaseIntent; label: string }> = [
  { value: "rental", label: "Rental" },
  { value: "purchase", label: "Purchase" },
  { value: "unsure", label: "Unsure" }
];

const TORQUE_UNITS: TorqueUnit[] = ["Nm", "ft-lb", "in-lb"];

export default function ToolSelectorForm() {
  const router = useRouter();
  const [form, setForm] = useState<ToolSelectorInput>({
    requiredTorque: 1000,
    torqueUnit: "ft-lb",
    fastenerSizeMm: FASTENER_OPTIONS[0]?.sizeMm ?? 19.05,
    industry: "oil_gas",
    applicationType: "flange",
    powerPreference: "hydraulic",
    environment: "field",
    accuracyPriority: "high",
    purchaseIntent: "rental"
  });
  const [errors, setErrors] = useState<string[]>([]);

  const selectedFastener = useMemo(
    () => FASTENER_OPTIONS.find((option) => option.sizeMm === form.fastenerSizeMm),
    [form.fastenerSizeMm]
  );

  const updateField = <K extends keyof ToolSelectorInput>(key: K, value: ToolSelectorInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }
    
    const validation = validateInput(form);
    if (validation.length > 0) {
      setErrors(validation);
      return;
    }

    setErrors([]);
    const params = new URLSearchParams({
      requiredTorque: String(form.requiredTorque),
      torqueUnit: form.torqueUnit,
      fastenerSizeMm: String(form.fastenerSizeMm),
      industry: form.industry,
      applicationType: form.applicationType,
      powerPreference: form.powerPreference,
      environment: form.environment,
      accuracyPriority: form.accuracyPriority,
      purchaseIntent: form.purchaseIntent
    });

    router.push(`/results?${params.toString()}`);
  };


  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="card p-6">
        <h2 className="section-title">Job Scope</h2>
        <p className="muted mt-2">
          Capture core torque and fastener details to anchor the selection.
        </p>
        <div className="mt-6 grid gap-5">
          <div>
            <label className="label" htmlFor="requiredTorque">
              Required Torque
            </label>
            <input
              id="requiredTorque"
              className="input"
              type="number"
              min={0}
              value={form.requiredTorque}
              onChange={(event) => updateField("requiredTorque", Number(event.target.value))}
            />
          </div>
          <div>
            <label className="label" htmlFor="torqueUnit">
              Torque Unit
            </label>
            <select
              id="torqueUnit"
              className="select"
              value={form.torqueUnit}
              onChange={(event) => updateField("torqueUnit", event.target.value as TorqueUnit)}
            >
              {TORQUE_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="fastenerSize">
              Fastener Size
            </label>
            <select
              id="fastenerSize"
              className="select"
              value={form.fastenerSizeMm}
              onChange={(event) => updateField("fastenerSizeMm", Number(event.target.value))}
            >
              {FASTENER_OPTIONS.map((option) => (
                <option key={option.label} value={option.sizeMm}>
                  {option.label}
                </option>
              ))}
            </select>
            {selectedFastener && (
              <p className="muted mt-2">
                Reference size: {selectedFastener.sizeMm.toFixed(1)} mm
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="section-title">Operational Context</h2>
        <p className="muted mt-2">
          Provide environmental and operational factors that influence tool choice.
        </p>
        <div className="mt-6 grid gap-5">
          <div>
            <label className="label" htmlFor="industry">
              Industry
            </label>
            <select
              id="industry"
              className="select"
              value={form.industry}
              onChange={(event) => updateField("industry", event.target.value as Industry)}
            >
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="applicationType">
              Application Type
            </label>
            <select
              id="applicationType"
              className="select"
              value={form.applicationType}
              onChange={(event) =>
                updateField("applicationType", event.target.value as ApplicationType)
              }
            >
              {APPLICATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="powerPreference">
              Power Preference
            </label>
            <select
              id="powerPreference"
              className="select"
              value={form.powerPreference}
              onChange={(event) =>
                updateField("powerPreference", event.target.value as PowerPreference)
              }
            >
              {POWER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="environment">
              Environment
            </label>
            <select
              id="environment"
              className="select"
              value={form.environment}
              onChange={(event) =>
                updateField("environment", event.target.value as EnvironmentType)
              }
            >
              {ENVIRONMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="accuracyPriority">
              Accuracy Priority
            </label>
            <select
              id="accuracyPriority"
              className="select"
              value={form.accuracyPriority}
              onChange={(event) =>
                updateField("accuracyPriority", event.target.value as AccuracyPriority)
              }
            >
              {ACCURACY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="purchaseIntent">
              Rental / Purchase Intent
            </label>
            <select
              id="purchaseIntent"
              className="select"
              value={form.purchaseIntent}
              onChange={(event) =>
                updateField("purchaseIntent", event.target.value as PurchaseIntent)
              }
            >
              {PURCHASE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="card p-6 lg:col-span-2" style={{ background: '#2D2D2D', boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.05)' }}>
          <p className="font-semibold text-text-primary">Resolve the following before continuing:</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-text-secondary">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 lg:col-span-2">
        <p className="muted">
          Recommendations prioritize safety and conservative tool selection.
        </p>
        <button type="button" className="button-primary" onClick={handleSubmit}>
          Generate Recommendations
        </button>
      </div>

    </section>
  );
}
