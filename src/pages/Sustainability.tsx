import { motion } from "framer-motion";
import { 
  Leaf, 
  Droplets, 
  Sun, 
  Sprout, 
  Tractor, 
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  Calculator,
  Lightbulb,
  AlertTriangle,
  Target,
  IndianRupee,
  Clock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const sustainabilityModules = [
  {
    id: "soil",
    icon: Sprout,
    title: "Soil Health Management",
    status: "Needs Attention",
    statusColor: "solar",
    currentScore: 65,
    description: "Improve soil biology for long-term productivity",
    tips: [
      "Add 2 tonnes compost per acre annually",
      "Practice crop rotation with legumes",
      "Avoid deep tillage to preserve soil structure",
      "Use green manuring between seasons"
    ],
    savings: "₹8,000-15,000/year",
    impact: "30% yield improvement in 3 years",
    aiQuery: "I want detailed guidance on Soil Health Management for my farm. What are the best practices for improving soil biology, adding organic matter, crop rotation with legumes, and sustainable tillage methods? Please provide a step-by-step action plan."
  },
  {
    id: "water",
    icon: Droplets,
    title: "Water Conservation",
    status: "Critical",
    statusColor: "water",
    currentScore: 45,
    description: "Reduce water usage while maintaining crop health",
    tips: [
      "Install drip irrigation system",
      "Use mulching to reduce evaporation",
      "Schedule irrigation based on soil moisture",
      "Build rainwater harvesting structures"
    ],
    savings: "₹12,000-25,000/year",
    impact: "40% water reduction",
    aiQuery: "I need detailed guidance on Water Conservation for my farm. How can I reduce water usage with drip irrigation, mulching, soil moisture scheduling, and rainwater harvesting? Please provide specific recommendations and government schemes available."
  },
  {
    id: "fertilizer",
    icon: TrendingDown,
    title: "Chemical Reduction",
    status: "In Progress",
    statusColor: "eco",
    currentScore: 72,
    description: "Transition to organic and natural inputs",
    tips: [
      "Replace 25% chemical fertilizer with vermicompost",
      "Use neem-based pest control",
      "Adopt integrated nutrient management",
      "Test soil before applying fertilizers"
    ],
    savings: "₹10,000-20,000/year",
    impact: "Healthier soil, safer produce",
    aiQuery: "I want to reduce chemical usage on my farm. How can I transition from chemical fertilizers to organic alternatives like vermicompost, use neem-based pest control, and adopt integrated nutrient management? Provide a practical transition plan."
  },
  {
    id: "solar",
    icon: Sun,
    title: "Solar & Renewable Energy",
    status: "Recommended",
    statusColor: "solar",
    currentScore: 30,
    description: "Zero fuel costs with solar-powered equipment",
    tips: [
      "Install 3HP solar pump (govt subsidy available)",
      "Use solar fencing for crop protection",
      "Solar dryers for post-harvest processing",
      "Apply for PM-KUSUM scheme"
    ],
    savings: "₹25,000-40,000/year",
    impact: "Carbon neutral farming",
    aiQuery: "I want to adopt Solar and Renewable Energy on my farm. Tell me about solar pumps, PM-KUSUM scheme subsidies, solar fencing, and solar dryers. What are the costs, benefits, and how to apply for government schemes?"
  },
  {
    id: "machinery",
    icon: Tractor,
    title: "Smart Machinery",
    status: "Optimized",
    statusColor: "eco",
    currentScore: 85,
    description: "Right-size equipment for efficiency",
    tips: [
      "Rent heavy machinery instead of buying",
      "Use FPO for shared equipment access",
      "Maintain equipment for fuel efficiency",
      "Consider electric/battery equipment"
    ],
    savings: "₹15,000-30,000/year",
    impact: "50% fuel reduction possible",
    aiQuery: "I need guidance on Smart Machinery for my farm. How can I optimize equipment usage, share machinery through FPO, maintain fuel efficiency, and explore electric/battery equipment options? What are the cost savings?"
  }
];

const quickActions = [
  {
    icon: Calculator,
    title: "Water Savings Calculator",
    description: "Calculate savings from drip irrigation",
    link: "/copilot",
    query: "Calculate how much water and money I can save by switching to drip irrigation for my 2 acre farm"
  },
  {
    icon: Sun,
    title: "Solar ROI Calculator", 
    description: "Check solar pump break-even time",
    link: "/copilot",
    query: "What is the break-even time for a 5HP solar pump with government subsidy?"
  },
  {
    icon: Leaf,
    title: "Organic Transition Plan",
    description: "Get your 3-year transition roadmap",
    link: "/copilot",
    query: "Create a 3-year organic transition plan for my farm with step-by-step guidance"
  },
  {
    icon: IndianRupee,
    title: "Subsidy Finder",
    description: "Find applicable government schemes",
    link: "/copilot",
    query: "What government subsidies are available for sustainable farming equipment and organic certification in Maharashtra?"
  }
];

const governmentSchemes = [
  {
    name: "PM-KUSUM",
    benefit: "90% subsidy on solar pumps",
    deadline: "Ongoing",
    icon: Sun
  },
  {
    name: "PKVY Scheme",
    benefit: "₹50,000/ha for organic farming",
    deadline: "Apply by March",
    icon: Leaf
  },
  {
    name: "Micro Irrigation",
    benefit: "55-70% subsidy on drip systems",
    deadline: "Ongoing",
    icon: Droplets
  },
  {
    name: "Soil Health Card",
    benefit: "Free soil testing",
    deadline: "Always open",
    icon: Sprout
  }
];

export default function Sustainability() {
  const [activeModule, setActiveModule] = useState<string | null>("soil");

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Critical": return { bg: "bg-destructive/10", text: "text-destructive", icon: AlertTriangle };
      case "Needs Attention": return { bg: "bg-solar/10", text: "text-solar", icon: AlertTriangle };
      case "In Progress": return { bg: "bg-water/10", text: "text-water", icon: Clock };
      case "Recommended": return { bg: "bg-primary/10", text: "text-primary", icon: Lightbulb };
      case "Optimized": return { bg: "bg-eco/10", text: "text-eco", icon: CheckCircle2 };
      default: return { bg: "bg-muted", text: "text-muted-foreground", icon: Target };
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Hero Banner */}
      <section className="relative py-16 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-eco/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-water/10 rounded-full blur-3xl"
        />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-eco/10 text-eco text-sm font-bold mb-6 border border-eco/30"
            >
              <Leaf className="w-4 h-4" />
              Sustainability Intelligence
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Your <span className="text-gradient-eco">Sustainable Farming</span> Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              AI-powered guidance to reduce costs, protect the environment, and build long-term farm profitability
            </p>
          </motion.div>

          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card-elevated p-8 max-w-4xl mx-auto mb-12"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80" cy="80" r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-muted/30"
                  />
                  <motion.circle
                    cx="80" cy="80" r="70"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={440}
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset: 440 - (440 * 0.62) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--eco))" />
                      <stop offset="100%" stopColor="hsl(var(--water))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold">62</span>
                  <span className="text-sm text-muted-foreground">Score</span>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Good Progress!</h2>
                <p className="text-muted-foreground mb-4">
                  Your farm sustainability score is improving. Focus on water conservation and solar adoption to reach 80+.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-eco/10 text-eco text-sm font-medium">
                    <TrendingDown className="w-4 h-4" />
                    ₹45,000+ potential savings
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-water/10 text-water text-sm font-medium">
                    <Droplets className="w-4 h-4" />
                    40% water reduction possible
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sustainability Modules */}
      <section className="py-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">Sustainability Modules</h2>
            <p className="text-muted-foreground">Click on each module to see detailed guidance and actionable tips</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Module Tabs */}
            <div className="lg:col-span-1 space-y-3">
              {sustainabilityModules.map((module, index) => {
                const statusConfig = getStatusConfig(module.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <motion.button
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 text-left transition-all duration-300",
                      activeModule === module.id 
                        ? "border-primary bg-primary/5 shadow-glow" 
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        module.statusColor === "eco" ? "gradient-eco" :
                        module.statusColor === "water" ? "bg-water/20" :
                        module.statusColor === "solar" ? "bg-solar/20" :
                        "bg-muted"
                      )}>
                        <module.icon className={cn(
                          "w-6 h-6",
                          module.statusColor === "eco" ? "text-foreground" :
                          module.statusColor === "water" ? "text-water" :
                          module.statusColor === "solar" ? "text-solar" :
                          "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">{module.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                            statusConfig.bg, statusConfig.text
                          )}>
                            <StatusIcon className="w-3 h-3" />
                            {module.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold">{module.currentScore}</span>
                        <span className="text-xs text-muted-foreground block">score</span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Module Details */}
            <div className="lg:col-span-2">
              {activeModule && (
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card-elevated p-6 h-full"
                >
                  {sustainabilityModules.filter(m => m.id === activeModule).map(module => {
                    const statusConfig = getStatusConfig(module.status);
                    
                    return (
                      <div key={module.id}>
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                            <p className="text-muted-foreground">{module.description}</p>
                          </div>
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center",
                            module.statusColor === "eco" ? "gradient-eco" :
                            module.statusColor === "water" ? "bg-water/20" :
                            module.statusColor === "solar" ? "bg-solar/20" :
                            "bg-muted"
                          )}>
                            <module.icon className={cn(
                              "w-7 h-7",
                              module.statusColor === "eco" ? "text-foreground" :
                              module.statusColor === "water" ? "text-water" :
                              module.statusColor === "solar" ? "text-solar" :
                              "text-muted-foreground"
                            )} />
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-6">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Current Score</span>
                            <span className="font-bold">{module.currentScore}/100</span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${module.currentScore}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={cn(
                                "h-full rounded-full",
                                module.statusColor === "eco" ? "gradient-eco" :
                                module.statusColor === "water" ? "bg-water" :
                                module.statusColor === "solar" ? "bg-solar" :
                                "bg-primary"
                              )}
                            />
                          </div>
                        </div>

                        {/* Tips */}
                        <div className="mb-6">
                          <h4 className="font-bold mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-solar" />
                            Action Items
                          </h4>
                          <div className="space-y-2">
                            {module.tips.map((tip, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
                              >
                                <CheckCircle2 className="w-5 h-5 text-eco flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{tip}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Savings & Impact */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="p-4 rounded-xl bg-eco/10 border border-eco/30">
                            <IndianRupee className="w-5 h-5 text-eco mb-2" />
                            <p className="text-xs text-muted-foreground">Potential Savings</p>
                            <p className="font-bold text-eco">{module.savings}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-water/10 border border-water/30">
                            <Zap className="w-5 h-5 text-water mb-2" />
                            <p className="text-xs text-muted-foreground">Environmental Impact</p>
                            <p className="font-bold text-water">{module.impact}</p>
                          </div>
                        </div>

                        <Link to={`/copilot?query=${encodeURIComponent(module.aiQuery)}`}>
                          <Button variant="eco" className="w-full gap-2 group">
                            Get Detailed AI Guidance
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gradient-to-b from-muted/30 to-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">Quick Sustainability Tools</h2>
            <p className="text-muted-foreground">Get instant calculations and recommendations</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link 
                  to={action.link}
                  state={{ prefillQuery: action.query }}
                  className="block"
                >
                  <div className="glass-card p-5 h-full hover:border-primary/40 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                      <action.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Schemes */}
      <section className="py-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">Government Schemes for Sustainable Farming</h2>
            <p className="text-muted-foreground">Take advantage of these subsidies and support programs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {governmentSchemes.map((scheme, index) => (
              <motion.div
                key={scheme.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <scheme.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold mb-1">{scheme.name}</h3>
                <p className="text-sm text-eco font-semibold mb-2">{scheme.benefit}</p>
                <p className="text-xs text-muted-foreground">{scheme.deadline}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link to="/copilot">
              <Button variant="outline" size="lg" className="gap-2 group">
                Ask AI About Eligibility
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
