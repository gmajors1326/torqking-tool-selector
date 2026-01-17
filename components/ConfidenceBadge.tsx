import { ConfidenceLevel } from "../types/tools";

const confidenceStyles: Record<ConfidenceLevel, { bg: string; text: string; shadow: string }> = {
  High: {
    bg: "#2D2D2D",
    text: "#4ADE80",
    shadow: "4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)"
  },
  Medium: {
    bg: "#2D2D2D",
    text: "#FBBF24",
    shadow: "4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)"
  },
  Conditional: {
    bg: "#2D2D2D",
    text: "#E43A5F",
    shadow: "4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)"
  }
};

export default function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const style = confidenceStyles[level];
  return (
    <span 
      className="badge px-4 py-2 rounded-neumorphic font-semibold"
      style={{ 
        background: style.bg, 
        color: style.text,
        boxShadow: style.shadow
      }}
    >
      {level} Confidence
    </span>
  );
}
