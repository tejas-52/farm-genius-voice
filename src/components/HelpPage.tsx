import { motion } from "framer-motion";
import { Mic, MessageCircle, Globe, Phone, BookOpen, HelpCircle, Sparkles, Image, Volume2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import sustainableFarm from "@/assets/sustainable-farm.jpg";

const helpTopics = [
  {
    icon: Mic,
    title: "Voice Commands",
    description: "Tap the microphone and speak naturally in your language. The AI understands Hindi, Marathi, Punjabi, Telugu and more.",
    tips: [
      "Speak clearly at normal pace",
      "Describe your problem in detail",
      "You can mix languages",
    ],
    color: "from-primary to-primary/70",
  },
  {
    icon: MessageCircle,
    title: "Text Chat",
    description: "Type your questions if you prefer. The AI responds with structured, actionable advice.",
    tips: [
      "Be specific about crop type",
      "Mention your location/climate",
      "Ask follow-up questions",
    ],
    color: "from-eco to-eco/70",
  },
  {
    icon: Image,
    title: "Image Analysis",
    description: "Upload photos of crops, leaves, or pests for AI-powered disease detection and diagnosis.",
    tips: [
      "Take clear, well-lit photos",
      "Focus on affected areas",
      "Include multiple angles",
    ],
    color: "from-solar to-solar/70",
  },
  {
    icon: Globe,
    title: "Languages Supported",
    description: "KrishiMitra understands and responds in multiple Indian languages.",
    tips: [
      "हिंदी (Hindi)",
      "मराठी (Marathi)",
      "ਪੰਜਾਬੀ (Punjabi)",
      "తెలుగు (Telugu)",
      "English",
    ],
    color: "from-water to-water/70",
  },
];

const faqs = [
  {
    question: "Is this free to use?",
    answer: "Yes, KrishiMitra is free for all farmers. We're supported by agricultural development initiatives.",
  },
  {
    question: "How accurate is the advice?",
    answer: "Our AI is trained on agricultural best practices and government recommendations. For serious issues, always consult local agricultural officers.",
  },
  {
    question: "Can I upload images for disease detection?",
    answer: "Yes! Tap the image icon in the chatbot to upload photos of your crops. The AI will analyze them and provide diagnosis.",
  },
  {
    question: "What is Voice Mode?",
    answer: "Voice Mode lets you have a hands-free conversation with the AI. Just speak your question and hear the response - perfect for when you're in the field.",
  },
  {
    question: "How does the sustainability feature work?",
    answer: "When enabled, the AI includes environmental impact insights with every response - water usage, soil health, input costs, and long-term benefits.",
  },
];

const features = [
  { icon: Sparkles, title: "AI-Powered Advice", desc: "Get instant, personalized farming recommendations" },
  { icon: Volume2, title: "Voice Conversations", desc: "Speak naturally, hear responses aloud" },
  { icon: Image, title: "Disease Detection", desc: "Upload photos for crop analysis" },
  { icon: Leaf, title: "Sustainability Insights", desc: "Balance profit with environmental care" },
];

export function HelpPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden mb-12">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={sustainableFarm}
            alt="Sustainable farming"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-hero flex items-center justify-center shadow-glow"
            >
              <HelpCircle className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              How to Use <span className="text-gradient">KrishiMitra</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple voice-first AI assistant for all your farming decisions
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container">
        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border shadow-soft"
            >
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Help Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {helpTopics.map((topic, index) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-card-elevated p-6"
            >
              <motion.div 
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-4 shadow-soft`}
                whileHover={{ rotate: 10, scale: 1.05 }}
              >
                <topic.icon className="w-7 h-7 text-primary-foreground" />
              </motion.div>
              <h3 className="text-lg font-bold mb-2">{topic.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{topic.description}</p>
              <ul className="space-y-2">
                {topic.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card-elevated p-8 mb-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Open AI Copilot", desc: "Go to the AI Copilot page", icon: "🤖" },
              { step: "2", title: "Choose Input", desc: "Voice, text, or upload image", icon: "🎤" },
              { step: "3", title: "Describe Problem", desc: "Tell about your crop issue", icon: "🌾" },
              { step: "4", title: "Get Advice", desc: "Receive actionable guidance", icon: "✨" },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-hero flex items-center justify-center text-3xl shadow-glow"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {item.icon}
                </motion.div>
                <div className="text-xs font-bold text-primary mb-2">Step {item.step}</div>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/copilot">
              <Button variant="hero" size="lg" className="gap-2">
                <Mic className="w-5 h-5" />
                Start Now
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                className="glass-card p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 8 }}
              >
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full gradient-hero flex items-center justify-center text-xs text-primary-foreground font-bold">
                    {index + 1}
                  </span>
                  {faq.question}
                </h4>
                <p className="text-muted-foreground text-sm ml-8">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-5 rounded-2xl bg-card border border-border shadow-elevated">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Need more help?</p>
              <p className="text-sm text-muted-foreground">
                Contact your local Krishi Vigyan Kendra (KVK)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
