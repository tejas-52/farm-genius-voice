import { Leaf } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SustainabilityToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function SustainabilityToggle({ enabled, onToggle }: SustainabilityToggleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-2xl border-2 transition-all duration-300",
        enabled
          ? "bg-eco-light border-eco/30"
          : "bg-muted/50 border-border"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300",
          enabled ? "gradient-eco" : "bg-muted"
        )}
      >
        <Leaf
          className={cn(
            "w-4 h-4 transition-colors duration-300",
            enabled ? "text-foreground" : "text-muted-foreground"
          )}
        />
      </div>
      <div className="flex-1">
        <p className={cn(
          "text-sm font-semibold transition-colors duration-300",
          enabled ? "text-eco" : "text-muted-foreground"
        )}>
          Optimize for Sustainability
        </p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-eco"
      />
    </div>
  );
}
