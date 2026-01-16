import { ConfidenceLevel } from "../types/tools";

const confidenceStyles: Record<ConfidenceLevel, string> = {
  High: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  Conditional: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200"
};

export default function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  return <span className={`badge ${confidenceStyles[level]}`}>{level} Confidence</span>;
}
