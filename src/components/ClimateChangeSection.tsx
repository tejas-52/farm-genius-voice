import { motion } from "framer-motion";
import {
  Leaf,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
  TrendingDown,
  Sprout,
  Sun,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { T } from "@/components/TranslatedText";

const climateMetrics = [
  {
    id: "soil",
    icon: Sprout,
    title: "Soil Health",
    status: "Moderate",
    statusColor: "solar",
    value: "6.2 pH",
    description: "Regular organic matter addition needed",
    improvement: "Add compost & cover crops",
  },
  {
    id: "water",
    icon: Droplets,
    title: "Water Usage",
    status: "High",
    statusColor: "water",
    value: "2400L/day",
    description: "Above optimal irrigation levels",
    improvement: "Switch to drip irrigation",
  },
  {
    id: "chemicals",
    icon: AlertTriangle,
    title: "Chemical Input",
    status: "Critical",
    statusColor: "destructive",
    value: "High",
    description: "Excessive fertilizer dependency",
    improvement: "Adopt integrated nutrient mgmt",
  },
  {
    id: "climate",
    icon: Thermometer,
    title: "Climate Risk",
    status: "Medium",
    statusColor: "solar",
    value: "+2.1°C",
    description: "Rising temperatures affect yields",
    improvement: "Heat-resistant crop varieties",
  },
];

const sustainableSuggestions = [
  {
    icon: Leaf,
    title: "Organic Transition",
    description: "Reduce chemical inputs by 50% in first year",
    savings: "₹15,000/year",
    impact: "Improved soil biology",
  },
  {
    icon: Sun,
    title: "Solar Irrigation",
    description: "Zero fuel costs with solar pumps",
    savings: "₹25,000/year",
    impact: "Carbon neutral farming",
  },
  {
    icon: Droplets,
    title: "Rainwater Harvesting",
    description: "Store monsoon water for dry season",
    savings: "₹8,000/year",
    impact: "40% less groundwater use",
  },
  {
    icon: Wind,
    title: "Crop Rotation",
    description: "Natural soil fertility restoration",
    savings: "₹12,000/year",
    impact: "Pest cycle disruption",
  },
];

export function ClimateChangeSection() {
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 rounded-full bg-eco/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-water/10 blur-3xl"
        />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-eco/10 text-eco text-sm font-bold mb-6 border border-eco/30"
          >
            <Thermometer className="w-4 h-4" />
            <T>Climate Intelligence</T>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <T>Climate &</T> <span className="text-gradient-eco"><T>Sustainability</T></span> <T>Dashboard</T>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <T>Monitor environmental impact and get AI-powered suggestions for sustainable farming</T>
          </p>
        </motion.div>

        {/* Interactive Climate Metrics Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card-elevated p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold"><T>Environmental Impact Overview</T></h3>
              <p className="text-sm text-muted-foreground"><T>Click on any metric for details</T></p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {climateMetrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveMetric(activeMetric === metric.id ? null : metric.id)}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${activeMetric === metric.id
                    ? 'border-primary bg-primary/5 shadow-glow'
                    : 'border-border bg-card/50 hover:border-primary/30'
                  }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${metric.statusColor === 'eco' ? 'bg-eco/20 text-eco' :
                    metric.statusColor === 'water' ? 'bg-water/20 text-water' :
                      metric.statusColor === 'solar' ? 'bg-solar/20 text-solar' :
                        'bg-destructive/20 text-destructive'
                  }`}>
                  <metric.icon className="w-5 h-5" />
                </div>

                <h4 className="font-bold text-sm mb-1"><T>{metric.title}</T></h4>
                <p className={`text-2xl font-bold mb-1 ${metric.statusColor === 'eco' ? 'text-eco' :
                    metric.statusColor === 'water' ? 'text-water' :
                      metric.statusColor === 'solar' ? 'text-solar' :
                        'text-destructive'
                  }`}>{metric.value}</p>

                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${metric.statusColor === 'eco' ? 'bg-eco/10 text-eco' :
                    metric.statusColor === 'water' ? 'bg-water/10 text-water' :
                      metric.statusColor === 'solar' ? 'bg-solar/10 text-solar' :
                        'bg-destructive/10 text-destructive'
                  }`}>
                  <T>{metric.status}</T>
                </span>

                {/* Expanded content */}
                <motion.div
                  initial={false}
                  animate={{
                    height: activeMetric === metric.id ? 'auto' : 0,
                    opacity: activeMetric === metric.id ? 1 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-border/50 mt-4">
                    <p className="text-xs text-muted-foreground mb-2"><T>{metric.description}</T></p>
                    <div className="flex items-center gap-1 text-xs font-semibold text-eco">
                      <Leaf className="w-3 h-3" />
                      <T>{metric.improvement}</T>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sustainability Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-2"><T>Sustainable Farming Recommendations</T></h3>
              <p className="text-muted-foreground"><T>AI-powered suggestions to reduce environmental impact</T></p>
            </div>
            <Link to="/copilot">
              <Button variant="outline" className="hidden md:flex gap-2 group">
                <T>Get Detailed Plan</T>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {sustainableSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-6 group cursor-pointer hover:border-eco/40 transition-all duration-300"
              >
                <motion.div
                  className="w-12 h-12 rounded-2xl gradient-eco flex items-center justify-center mb-4 group-hover:shadow-glow-accent transition-shadow"
                  whileHover={{ rotate: 10 }}
                >
                  <suggestion.icon className="w-6 h-6 text-primary-foreground" />
                </motion.div>

                <h4 className="font-bold mb-2 text-lg"><T>{suggestion.title}</T></h4>
                <p className="text-sm text-muted-foreground mb-4"><T>{suggestion.description}</T></p>

                <div className="space-y-2 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground"><T>Annual Savings:</T></span>
                    <span className="font-bold text-eco"><T>{suggestion.savings}</T></span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground"><T>Impact:</T></span>
                    <span className="font-medium text-foreground"><T>{suggestion.impact}</T></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 text-center md:hidden">
            <Link to="/copilot">
              <Button variant="eco" size="lg" className="w-full gap-2">
                <T>Get Detailed Sustainability Plan</T>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
