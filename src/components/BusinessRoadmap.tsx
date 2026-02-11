import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Milk, 
  Bird, 
  Leaf, 
  Thermometer, 
  Tractor, 
  Wheat,
  ArrowRight,
  ArrowLeft,
  IndianRupee,
  Clock,
  AlertTriangle,
  Building2,
  FileText,
  Download,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
  Calculator,
  TrendingUp,
  Star,
  Heart,
  Share2,
  MessageSquare,
  Users,
  Lightbulb,
  Target,
  BarChart3,
  Award,
  HelpCircle,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { T } from "@/components/TranslatedText";

interface Business {
  id: string;
  icon: any;
  title: string;
  description: string;
  investment: string;
  investmentRange: { min: number; max: number };
  timeToProfit: string;
  risk: string;
  riskColor: string;
  color: string;
  roadmap: RoadmapStep[];
  schemes: Scheme[];
}

interface RoadmapStep {
  phase: string;
  duration: string;
  tasks: string[];
  cost: string;
}

interface Scheme {
  name: string;
  benefit: string;
  link: string;
  type: "government" | "bank";
}

const businesses: Business[] = [
  {
    id: "dairy",
    icon: Milk,
    title: "Dairy Farming",
    description: "Start milk production with cows or buffaloes",
    investment: "₹2-5 Lakhs",
    investmentRange: { min: 200000, max: 500000 },
    timeToProfit: "6-12 months",
    risk: "Low",
    riskColor: "text-eco",
    color: "from-water to-water/70",
    roadmap: [
      {
        phase: "Planning & Setup",
        duration: "1-2 months",
        tasks: ["Land arrangement (500-1000 sq ft)", "Shed construction", "Purchase 2-5 cows/buffaloes", "Feed storage setup"],
        cost: "₹1.5-3 Lakhs"
      },
      {
        phase: "Operations Start",
        duration: "Month 2-3",
        tasks: ["Hire helper", "Setup milking routine", "Connect with local dairy", "Veterinary registration"],
        cost: "₹30,000-50,000"
      },
      {
        phase: "Scaling",
        duration: "Month 6-12",
        tasks: ["Add more animals", "Direct selling to consumers", "Value-added products (ghee, paneer)", "Quality certification"],
        cost: "₹50,000-1 Lakh"
      }
    ],
    schemes: [
      { name: "NABARD Dairy Loan", benefit: "Up to ₹10 Lakh at 4% interest", link: "https://www.nabard.org", type: "bank" },
      { name: "Rashtriya Gokul Mission", benefit: "30-50% subsidy on animals", link: "https://dahd.nic.in", type: "government" },
      { name: "MUDRA Loan", benefit: "Up to ₹10 Lakh collateral-free", link: "https://mudra.org.in", type: "bank" },
    ]
  },
  {
    id: "poultry",
    icon: Bird,
    title: "Poultry Farming",
    description: "Eggs or broiler chicken production",
    investment: "₹1-3 Lakhs",
    investmentRange: { min: 100000, max: 300000 },
    timeToProfit: "3-6 months",
    risk: "Medium",
    riskColor: "text-solar",
    color: "from-solar to-solar/70",
    roadmap: [
      {
        phase: "Infrastructure",
        duration: "2-4 weeks",
        tasks: ["Build poultry shed (1000 sq ft)", "Install feeders & drinkers", "Arrange heating system", "Biosecurity measures"],
        cost: "₹50,000-80,000"
      },
      {
        phase: "First Batch",
        duration: "Month 1-2",
        tasks: ["Purchase 500-1000 chicks", "Vaccination schedule", "Feed management", "Temperature control"],
        cost: "₹40,000-70,000"
      },
      {
        phase: "Marketing & Growth",
        duration: "Month 3-6",
        tasks: ["Connect with local markets", "Increase batch size", "Add layer birds for eggs", "Direct restaurant supply"],
        cost: "₹30,000-50,000"
      }
    ],
    schemes: [
      { name: "Poultry Venture Capital Fund", benefit: "Up to 40% subsidy", link: "https://dahd.nic.in", type: "government" },
      { name: "KCC for Allied Activities", benefit: "Loan up to ₹3 Lakh", link: "https://pmkisan.gov.in", type: "bank" },
    ]
  },
  {
    id: "organic",
    icon: Leaf,
    title: "Organic Farming",
    description: "Premium organic produce cultivation",
    investment: "₹50K-2 Lakhs",
    investmentRange: { min: 50000, max: 200000 },
    timeToProfit: "12-18 months",
    risk: "Medium",
    riskColor: "text-solar",
    color: "from-eco to-eco/70",
    roadmap: [
      {
        phase: "Soil Preparation",
        duration: "1-3 months",
        tasks: ["Soil testing", "Organic certification application", "Composting setup", "Green manure cultivation"],
        cost: "₹20,000-40,000"
      },
      {
        phase: "Transition Period",
        duration: "Month 3-12",
        tasks: ["Organic inputs only", "Crop rotation planning", "Natural pest management", "Documentation"],
        cost: "₹30,000-60,000"
      },
      {
        phase: "Certification & Sales",
        duration: "Month 12-18",
        tasks: ["Get organic certificate", "Connect with organic stores", "Premium pricing (40% extra)", "Farmer market presence"],
        cost: "₹20,000-30,000"
      }
    ],
    schemes: [
      { name: "Paramparagat Krishi Vikas Yojana", benefit: "₹50,000/ha for 3 years", link: "https://pgsindia-ncof.gov.in", type: "government" },
      { name: "Mission Organic Value Chain", benefit: "100% for NE states", link: "https://movcdner.gov.in", type: "government" },
    ]
  },
  {
    id: "cold-storage",
    icon: Thermometer,
    title: "Cold Storage",
    description: "Preserve and sell produce year-round",
    investment: "₹10-25 Lakhs",
    investmentRange: { min: 1000000, max: 2500000 },
    timeToProfit: "18-24 months",
    risk: "Low",
    riskColor: "text-eco",
    color: "from-water to-water/70",
    roadmap: [
      {
        phase: "Planning & Land",
        duration: "1-2 months",
        tasks: ["Market survey", "Location selection", "Land purchase/lease", "Design & permits"],
        cost: "₹2-5 Lakhs"
      },
      {
        phase: "Construction",
        duration: "Month 2-6",
        tasks: ["Building construction", "Refrigeration installation", "Power backup", "Loading/unloading area"],
        cost: "₹8-15 Lakhs"
      },
      {
        phase: "Operations",
        duration: "Month 6-24",
        tasks: ["Hire staff", "Marketing to farmers", "Tie-ups with FPOs", "Expansion planning"],
        cost: "₹2-3 Lakhs"
      }
    ],
    schemes: [
      { name: "PMFME Scheme", benefit: "35% subsidy up to ₹10 Lakh", link: "https://pmfme.mofpi.gov.in", type: "government" },
      { name: "NABARD Cold Chain", benefit: "50% back-ended subsidy", link: "https://www.nabard.org", type: "bank" },
    ]
  },
  {
    id: "machinery",
    icon: Tractor,
    title: "Machinery Rental",
    description: "Rent out tractors and equipment",
    investment: "₹5-15 Lakhs",
    investmentRange: { min: 500000, max: 1500000 },
    timeToProfit: "12-18 months",
    risk: "Low",
    riskColor: "text-eco",
    color: "from-solar to-solar/70",
    roadmap: [
      {
        phase: "Equipment Purchase",
        duration: "1-2 months",
        tasks: ["Market research", "Purchase tractor (35-50 HP)", "Buy implements", "Insurance & registration"],
        cost: "₹4-10 Lakhs"
      },
      {
        phase: "Business Setup",
        duration: "Month 2-3",
        tasks: ["Driver hiring", "Rate fixation", "Marketing in villages", "Booking system"],
        cost: "₹50,000-1 Lakh"
      },
      {
        phase: "Expansion",
        duration: "Month 6-18",
        tasks: ["Add more equipment", "Harvester rental", "Maintenance workshop", "Fleet management app"],
        cost: "₹2-4 Lakhs"
      }
    ],
    schemes: [
      { name: "Sub-Mission on Agricultural Mechanization", benefit: "40-50% subsidy", link: "https://agrimachinery.nic.in", type: "government" },
      { name: "Custom Hiring Centre", benefit: "Up to ₹10 Lakh grant", link: "https://agriwelfare.gov.in", type: "government" },
    ]
  },
  {
    id: "processing",
    icon: Wheat,
    title: "Food Processing",
    description: "Value-added products from your farm",
    investment: "₹3-10 Lakhs",
    investmentRange: { min: 300000, max: 1000000 },
    timeToProfit: "12-24 months",
    risk: "Medium",
    riskColor: "text-solar",
    color: "from-primary to-primary/70",
    roadmap: [
      {
        phase: "Product & Planning",
        duration: "1-2 months",
        tasks: ["Product selection", "Recipe development", "FSSAI registration", "Packaging design"],
        cost: "₹30,000-50,000"
      },
      {
        phase: "Unit Setup",
        duration: "Month 2-4",
        tasks: ["Equipment purchase", "Facility setup", "Hygiene compliance", "Staff training"],
        cost: "₹2-6 Lakhs"
      },
      {
        phase: "Launch & Scale",
        duration: "Month 4-24",
        tasks: ["Local market testing", "Online sales", "Retailer tie-ups", "Export certification"],
        cost: "₹1-3 Lakhs"
      }
    ],
    schemes: [
      { name: "PMFME Scheme", benefit: "35% credit-linked subsidy", link: "https://pmfme.mofpi.gov.in", type: "government" },
      { name: "One District One Product", benefit: "Marketing support", link: "https://odopmart.com", type: "government" },
    ]
  },
];

interface BusinessRoadmapProps {
  onGenerateImage: (businessId: string) => void;
  isGeneratingImage: boolean;
}

// Interactive Features Component
function InteractiveFeatures({ business }: { business: Business }) {
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const quizQuestions = [
    {
      question: `What is the minimum investment for ${business.title}?`,
      options: [business.investment, "₹10 Lakhs", "₹50,000", "₹1 Crore"],
      correct: 0
    },
    {
      question: `What is the risk level for ${business.title}?`,
      options: ["Very High", business.risk, "Extreme", "Zero"],
      correct: 1
    },
    {
      question: "What should you do before starting any farm business?",
      options: ["Jump in immediately", "Market research & planning", "Ignore schemes", "Skip training"],
      correct: 1
    }
  ];
  
  const handleAnswer = (index: number) => {
    if (index === quizQuestions[currentQuestion].correct) {
      setQuizScore(prev => prev + 1);
    }
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };
  
  const resetQuiz = () => {
    setActiveQuiz(false);
    setQuizScore(0);
    setCurrentQuestion(0);
    setShowResult(false);
  };
  
  const handleShare = async () => {
    const shareData = {
      title: `${business.title} - Farm Business Roadmap`,
      text: `Check out this ${business.title} business plan with ${business.investment} investment!`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Business Readiness Quiz */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-elevated p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Readiness Quiz</h3>
        </div>
        
        {!activeQuiz ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Test your knowledge and readiness for this business!
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setActiveQuiz(true)}
              className="w-full gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              Start Quiz
            </Button>
          </div>
        ) : showResult ? (
          <div className="text-center">
            <Award className={`w-12 h-12 mx-auto mb-3 ${quizScore >= 2 ? 'text-eco' : 'text-solar'}`} />
            <p className="font-bold text-lg">{quizScore}/{quizQuestions.length} Correct</p>
            <p className="text-sm text-muted-foreground mb-4">
              {quizScore >= 2 ? "Great! You're ready to start!" : "Learn more before starting."}
            </p>
            <Button variant="ghost" size="sm" onClick={resetQuiz}>Try Again</Button>
          </div>
        ) : (
          <div>
            <p className="text-sm mb-3">{quizQuestions[currentQuestion].question}</p>
            <div className="space-y-2">
              {quizQuestions[currentQuestion].options.map((option, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => handleAnswer(i)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-elevated p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Quick Actions</h3>
        </div>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2"
            onClick={toggleFavorite}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share Business Plan
          </Button>
          <Link to="/copilot" className="block">
            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
              <MessageSquare className="w-4 h-4" />
              Ask AI Questions
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Key Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card-elevated p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Pro Tips</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-eco flex-shrink-0 mt-0.5" />
            <span>Start small and scale gradually</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-eco flex-shrink-0 mt-0.5" />
            <span>Always apply for government subsidies first</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-eco flex-shrink-0 mt-0.5" />
            <span>Network with successful farmers</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-eco flex-shrink-0 mt-0.5" />
            <span>Keep detailed records from day one</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}

// Success Stories Component  
function SuccessStories({ businessId }: { businessId: string }) {
  const stories: Record<string, { name: string; location: string; profit: string; story: string }[]> = {
    dairy: [
      { name: "Ramesh Kumar", location: "Punjab", profit: "₹45,000/month", story: "Started with 3 buffaloes, now runs a dairy with 25 animals" },
      { name: "Sunita Devi", location: "Haryana", profit: "₹30,000/month", story: "Women self-help group managing 50+ cows" }
    ],
    poultry: [
      { name: "Vikram Singh", location: "Maharashtra", profit: "₹60,000/month", story: "From 500 to 10,000 birds in 2 years" },
      { name: "Priya Sharma", location: "Karnataka", profit: "₹25,000/month", story: "Layer farming with direct egg supply to hotels" }
    ],
    organic: [
      { name: "Govind Patel", location: "Gujarat", profit: "₹50,000/month", story: "Premium organic vegetables to city markets" },
      { name: "Lakshmi Naidu", location: "Andhra Pradesh", profit: "₹35,000/month", story: "Organic rice with export certification" }
    ],
    "cold-storage": [
      { name: "Mahesh Group", location: "UP", profit: "₹2,00,000/month", story: "500 MT capacity serving 200+ farmers" }
    ],
    machinery: [
      { name: "Kishan Rentals", location: "MP", profit: "₹80,000/month", story: "Fleet of 5 tractors with harvester" }
    ],
    processing: [
      { name: "Amma Foods", location: "Tamil Nadu", profit: "₹70,000/month", story: "Pickle and spice brand sold nationwide" }
    ]
  };
  
  const businessStories = stories[businessId] || [];
  
  if (businessStories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated p-6 mb-8"
    >
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        Success Stories
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businessStories.map((story, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-gradient-to-br from-eco/5 to-transparent border border-eco/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-eco/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-eco" />
              </div>
              <div>
                <p className="font-bold">{story.name}</p>
                <p className="text-xs text-muted-foreground">{story.location}</p>
              </div>
              <span className="ml-auto px-2 py-1 rounded-full bg-eco/10 text-eco text-xs font-bold">
                {story.profit}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{story.story}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Profit Calculator Component
function ProfitCalculator({ business }: { business: Business }) {
  const [investment, setInvestment] = useState(business.investmentRange.min);
  const [months, setMonths] = useState(12);
  
  // Simple ROI calculation based on business type
  const roiRates: Record<string, number> = {
    dairy: 0.25,
    poultry: 0.35,
    organic: 0.40,
    "cold-storage": 0.20,
    machinery: 0.30,
    processing: 0.45,
  };
  
  const monthlyProfit = (investment * (roiRates[business.id] || 0.25)) / 12;
  const totalProfit = monthlyProfit * months;
  const roi = ((totalProfit / investment) * 100).toFixed(1);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated p-6 mb-8"
    >
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-primary" />
        Profit Calculator
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Investment Amount: ₹{(investment / 100000).toFixed(1)} Lakhs
          </label>
          <input
            type="range"
            min={business.investmentRange.min}
            max={business.investmentRange.max}
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Time Period: {months} months
          </label>
          <input
            type="range"
            min={6}
            max={36}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 rounded-xl bg-eco/10 text-center">
          <TrendingUp className="w-5 h-5 mx-auto mb-2 text-eco" />
          <p className="text-xs text-muted-foreground">Monthly Profit</p>
          <p className="text-lg font-bold text-eco">₹{Math.round(monthlyProfit).toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-primary/10 text-center">
          <IndianRupee className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-xs text-muted-foreground">Total Profit ({months}mo)</p>
          <p className="text-lg font-bold text-primary">₹{Math.round(totalProfit).toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-solar/10 text-center">
          <Star className="w-5 h-5 mx-auto mb-2 text-solar" />
          <p className="text-xs text-muted-foreground">ROI</p>
          <p className="text-lg font-bold text-solar">{roi}%</p>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        * Estimated values based on average market conditions. Actual profits may vary.
      </p>
    </motion.div>
  );
}

export function BusinessRoadmap({ onGenerateImage, isGeneratingImage }: BusinessRoadmapProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const downloadRoadmap = (business: Business) => {
    const content = `
${business.title} - Business Roadmap
=====================================

Investment Required: ${business.investment}
Time to Profit: ${business.timeToProfit}
Risk Level: ${business.risk}

ROADMAP:
${business.roadmap.map((step, i) => `
Phase ${i + 1}: ${step.phase}
Duration: ${step.duration}
Estimated Cost: ${step.cost}
Tasks:
${step.tasks.map(t => `  • ${t}`).join('\n')}
`).join('\n')}

GOVERNMENT SCHEMES & LOANS:
${business.schemes.map(s => `
• ${s.name}
  Benefit: ${s.benefit}
  Type: ${s.type}
  Apply: ${s.link}
`).join('\n')}

Generated by KrishiMitra AI
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${business.id}-roadmap.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container">
        <AnimatePresence mode="wait">
          {!selectedBusiness ? (
            // Business Selection View
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/30"
                >
                  <Building2 className="w-4 h-4" />
716:                   <T>Business Planning</T>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  <T>Choose Your</T> <span className="text-gradient"><T>Farm Business</T></span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  <T>Select a business to see complete roadmap with investment, timeline, government schemes, and bank loans</T>
                </p>
              </motion.div>

              {/* Business Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business, index) => (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => setSelectedBusiness(business)}
                    className="glass-card-elevated p-6 cursor-pointer group hover:border-primary/40 transition-all duration-300"
                  >
                    <motion.div 
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${business.color} flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow`}
                      whileHover={{ rotate: 10 }}
                    >
                      <business.icon className="w-7 h-7 text-primary-foreground" />
                    </motion.div>

                    <h3 className="text-xl font-bold mb-2"><T>{business.title}</T></h3>
                    <p className="text-muted-foreground text-sm mb-5"><T>{business.description}</T></p>

                    {/* Quick Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <IndianRupee className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground"><T>Investment:</T></span>
                        <span className="font-bold ml-auto">{business.investment}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground"><T>Profit in:</T></span>
                        <span className="font-bold ml-auto">{business.timeToProfit}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground"><T>Risk:</T></span>
                        <span className={`font-bold ml-auto ${business.riskColor}`}><T>{business.risk}</T></span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all gap-2">
                      <T>View Roadmap</T>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            // Roadmap Detail View
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              {/* Back Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedBusiness(null)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <T>Back to all businesses</T>
              </motion.button>

              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${selectedBusiness.color} flex items-center justify-center shadow-glow`}
                  >
                    <selectedBusiness.icon className="w-8 h-8 text-primary-foreground" />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold"><T>{selectedBusiness.title}</T></h1>
                    <p className="text-muted-foreground"><T>{selectedBusiness.description}</T></p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => downloadRoadmap(selectedBusiness)}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <T>Download Roadmap</T>
                  </Button>
                  <Button 
                    variant="eco" 
                    onClick={() => onGenerateImage(selectedBusiness.id)}
                    disabled={isGeneratingImage}
                    className="gap-2"
                  >
                    {isGeneratingImage ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        <T>Generating...</T>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4" />
                        <T>Visualize Future</T>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Interactive Features Section */}
              <InteractiveFeatures business={selectedBusiness} />

              {/* Profit Calculator */}
              <ProfitCalculator business={selectedBusiness} />

              {/* Success Stories */}
              <SuccessStories businessId={selectedBusiness.id} />

              {/* Quick Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 mb-10"
              >
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <IndianRupee className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{selectedBusiness.investment}</p>
                    <p className="text-sm text-muted-foreground">Total Investment</p>
                  </div>
                  <div className="text-center border-x border-border">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-solar" />
                    <p className="text-2xl font-bold">{selectedBusiness.timeToProfit}</p>
                    <p className="text-sm text-muted-foreground">Time to Profit</p>
                  </div>
                  <div className="text-center">
                    <AlertTriangle className={`w-6 h-6 mx-auto mb-2 ${selectedBusiness.riskColor}`} />
                    <p className={`text-2xl font-bold ${selectedBusiness.riskColor}`}>{selectedBusiness.risk}</p>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                  </div>
                </div>
              </motion.div>

              {/* Roadmap Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  Step-by-Step Roadmap
                </h2>
                
                <div className="space-y-6">
                  {selectedBusiness.roadmap.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="relative pl-8"
                    >
                      {/* Timeline line */}
                      {index < selectedBusiness.roadmap.length - 1 && (
                        <div className="absolute left-3 top-12 bottom-0 w-0.5 bg-border" />
                      )}
                      
                      {/* Phase marker */}
                      <div className="absolute left-0 top-0 w-6 h-6 rounded-full gradient-hero flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </div>

                      <div className="glass-card p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-bold">{step.phase}</h3>
                            <p className="text-sm text-muted-foreground">Duration: {step.duration}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                            <IndianRupee className="w-3 h-3" />
                            {step.cost}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {step.tasks.map((task, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-eco flex-shrink-0" />
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Government Schemes & Loans */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-primary" />
                  Government Schemes & Bank Loans
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBusiness.schemes.map((scheme, index) => (
                    <motion.a
                      key={index}
                      href={scheme.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="glass-card p-5 group hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          scheme.type === 'government' 
                            ? 'bg-eco/10 text-eco' 
                            : 'bg-water/10 text-water'
                        }`}>
                          {scheme.type === 'government' ? '🏛️ Government' : '🏦 Bank'}
                        </span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h4 className="font-bold mb-2">{scheme.name}</h4>
                      <p className="text-sm text-muted-foreground">{scheme.benefit}</p>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
              >
                <div className="glass-card-elevated p-8 max-w-xl mx-auto">
                  <Sparkles className="w-10 h-10 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-3">Need Personalized Guidance?</h3>
                  <p className="text-muted-foreground mb-6">
                    Chat with our AI advisor for customized advice based on your location, budget, and goals
                  </p>
                  <Link to={`/copilot?business=${selectedBusiness.id}`}>
                    <Button variant="hero" size="lg" className="gap-2">
                      Get AI Guidance
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
