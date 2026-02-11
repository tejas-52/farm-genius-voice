import { motion } from "framer-motion";
import { Leaf, Droplets, TreeDeciduous, IndianRupee, TrendingUp } from "lucide-react";

export interface SustainabilityMetrics {
  waterUsage: "reduced" | "neutral" | "high";
  soilHealth: "improved" | "stable" | "declining";
  inputCost: "lower" | "same" | "higher";
  longTermBenefit: "high" | "medium" | "low";
}

interface SustainabilitySummaryProps {
  metrics: SustainabilityMetrics;
}

const statusConfig = {
  waterUsage: {
    reduced: { label: "Reduced", color: "text-eco", bg: "bg-eco-light", icon: "✓" },
    neutral: { label: "Neutral", color: "text-water", bg: "bg-water-light", icon: "−" },
    high: { label: "High", color: "text-destructive", bg: "bg-destructive/10", icon: "!" },
  },
  soilHealth: {
    improved: { label: "Improved", color: "text-eco", bg: "bg-eco-light", icon: "✓" },
    stable: { label: "Stable", color: "text-soil", bg: "bg-soil-light", icon: "−" },
    declining: { label: "Declining", color: "text-destructive", bg: "bg-destructive/10", icon: "!" },
  },
  inputCost: {
    lower: { label: "Lower", color: "text-eco", bg: "bg-eco-light", icon: "✓" },
    same: { label: "Same", color: "text-muted-foreground", bg: "bg-muted", icon: "−" },
    higher: { label: "Higher", color: "text-warning", bg: "bg-solar-light", icon: "!" },
  },
  longTermBenefit: {
    high: { label: "High", color: "text-eco", bg: "bg-eco-light", icon: "✓" },
    medium: { label: "Medium", color: "text-solar", bg: "bg-solar-light", icon: "−" },
    low: { label: "Low", color: "text-muted-foreground", bg: "bg-muted", icon: "−" },
  },
};

export function SustainabilitySummary({ metrics }: SustainabilitySummaryProps) {
  const items = [
    {
      key: "waterUsage" as const,
      label: "Water usage",
      icon: Droplets,
      value: metrics.waterUsage,
    },
    {
      key: "soilHealth" as const,
      label: "Soil health",
      icon: TreeDeciduous,
      value: metrics.soilHealth,
    },
    {
      key: "inputCost" as const,
      label: "Input cost",
      icon: IndianRupee,
      value: metrics.inputCost,
    },
    {
      key: "longTermBenefit" as const,
      label: "Long-term benefit",
      icon: TrendingUp,
      value: metrics.longTermBenefit,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="eco-box mt-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg gradient-eco flex items-center justify-center">
          <Leaf className="w-3.5 h-3.5 text-foreground" />
        </div>
        <span className="font-bold text-sm text-foreground">Sustainability Impact</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const config = statusConfig[item.key][item.value];
          const Icon = item.icon;
          
          return (
            <div
              key={item.key}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl ${config.bg}`}
            >
              <Icon className={`w-4 h-4 ${config.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{item.label}</p>
                <p className={`text-sm font-semibold ${config.color}`}>{config.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
