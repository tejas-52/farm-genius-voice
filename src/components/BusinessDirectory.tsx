import { motion } from "framer-motion";
import { 
  Milk, 
  Bird, 
  Leaf, 
  Thermometer, 
  Tractor, 
  Wheat,
  ArrowRight,
  IndianRupee,
  Clock,
  Users,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const businesses = [
  {
    id: "dairy",
    icon: Milk,
    title: "Dairy Farming",
    description: "Start milk production with cows or buffaloes",
    investment: "₹2-5 Lakhs",
    timeToProfit: "6-12 months",
    risk: "Low",
    riskColor: "text-success",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    id: "poultry",
    icon: Bird,
    title: "Poultry Farming",
    description: "Eggs or broiler chicken production",
    investment: "₹1-3 Lakhs",
    timeToProfit: "3-6 months",
    risk: "Medium",
    riskColor: "text-warning",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    id: "organic",
    icon: Leaf,
    title: "Organic Farming",
    description: "Premium organic produce cultivation",
    investment: "₹50K-2 Lakhs",
    timeToProfit: "12-18 months",
    risk: "Medium",
    riskColor: "text-warning",
    color: "bg-green-500/10 text-green-600",
  },
  {
    id: "cold-storage",
    icon: Thermometer,
    title: "Cold Storage",
    description: "Preserve and sell produce year-round",
    investment: "₹10-25 Lakhs",
    timeToProfit: "18-24 months",
    risk: "Low",
    riskColor: "text-success",
    color: "bg-cyan-500/10 text-cyan-600",
  },
  {
    id: "machinery",
    icon: Tractor,
    title: "Machinery Rental",
    description: "Rent out tractors and equipment",
    investment: "₹5-15 Lakhs",
    timeToProfit: "12-18 months",
    risk: "Low",
    riskColor: "text-success",
    color: "bg-yellow-500/10 text-yellow-600",
  },
  {
    id: "processing",
    icon: Wheat,
    title: "Food Processing",
    description: "Value-added products from your farm",
    investment: "₹3-10 Lakhs",
    timeToProfit: "12-24 months",
    risk: "Medium",
    riskColor: "text-warning",
    color: "bg-purple-500/10 text-purple-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function BusinessDirectory() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Farm Business
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore profitable farm-based businesses. Get AI-powered guidance on setup, 
            investment, and growth strategies.
          </p>
        </motion.div>

        {/* Business Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {businesses.map((business) => (
            <motion.div
              key={business.id}
              variants={itemVariants}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${business.color} flex items-center justify-center mb-4`}>
                <business.icon className="w-7 h-7" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-semibold mb-2">{business.title}</h3>
              <p className="text-muted-foreground text-sm mb-5">{business.description}</p>

              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <IndianRupee className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Investment:</span>
                  <span className="font-medium ml-auto">{business.investment}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Profit in:</span>
                  <span className="font-medium ml-auto">{business.timeToProfit}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Risk:</span>
                  <span className={`font-medium ml-auto ${business.riskColor}`}>{business.risk}</span>
                </div>
              </div>

              {/* CTA */}
              <Link to={`/copilot?business=${business.id}`}>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  Get AI Guidance
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-3">Need Custom Business Advice?</h2>
            <p className="text-muted-foreground mb-6">
              Our AI can help you plan any farm-related business based on your location, 
              budget, and experience level.
            </p>
            <Link to="/copilot">
              <Button variant="hero" size="lg">
                Talk to AI Business Advisor
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
