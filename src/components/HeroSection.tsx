import { motion, useScroll, useTransform } from "framer-motion";
import { Mic, Sprout, Shield, Leaf, Sun, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { T } from "@/components/TranslatedText";
import farmBanner from "@/assets/farm-banner.jpg";

const features = [
  {
    icon: Mic,
    title: "Voice-First",
    description: "Speak naturally in your language",
    color: "from-primary to-primary/80",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Prevent crop loss with early warnings",
    color: "from-destructive/80 to-destructive/60",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Eco-friendly farming insights",
    color: "from-eco to-eco/80",
  },
  {
    icon: Sun,
    title: "Solar & Energy",
    description: "Renewable energy guidance",
    color: "from-solar to-solar/80",
  },
];


const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
};

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background Image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${farmBanner})` }}
        />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </motion.div>

      {/* Animated particles/leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 text-eco/30"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: -20,
              rotate: 0,
            }}
            animate={{ 
              y: "120vh",
              rotate: 360,
              x: `${Math.random() * 100}%`,
            }}
            transition={{ 
              duration: 15 + Math.random() * 10, 
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
          >
            <Leaf className="w-full h-full" />
          </motion.div>
        ))}
      </div>

      {/* Glowing orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 right-20 w-64 h-64 bg-accent/20 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-40 left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px]"
      />

      <motion.div style={{ opacity }} className="container relative z-10 py-20">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Animated Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/15 backdrop-blur-md text-primary text-sm font-bold mb-8 border border-primary/30 shadow-glow"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sprout className="w-5 h-5" />
            </motion.div>
            <T>AI-Powered Sustainable Farming</T>
          </motion.div>

          {/* Headline with gradient animation */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
          >
            <T>Your AI Farming</T>{" "}
            <motion.span
              className="text-gradient inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <T>Decision Partner</T>
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            <T>Make smarter, sustainable farming decisions every day. Prevent crop loss, reduce costs, and grow your business — all in your language.</T>
          </motion.p>

          {/* CTA Buttons with hover animations */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/copilot">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Mic className="w-6 h-6" />
                  </motion.div>
                  <T>Start Talking to AI</T>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <a href="https://www.youtube.com/watch?v=demo" target="_blank" rel="noopener noreferrer">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" size="xl" className="w-full sm:w-auto backdrop-blur-md">
                  <Play className="w-5 h-5" />
                  <T>Watch Demo</T>
                </Button>
              </motion.div>
            </a>
          </motion.div>

          {/* Feature Pills - HD Cards with animations */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={scaleIn}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.2 } 
                }}
                className="glass-card-elevated p-5 md:p-6 text-center group cursor-pointer"
              >
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                <h3 className="font-bold text-base md:text-lg mb-1"><T>{feature.title}</T></h3>
                <p className="text-sm text-muted-foreground"><T>{feature.description}</T></p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-16 flex flex-wrap justify-center items-center gap-6 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-eco animate-pulse" />
              <span className="text-sm font-medium"><T>10+ Languages</T></span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-solar animate-pulse" />
              <span className="text-sm font-medium"><T>1M+ Farmers</T></span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-water animate-pulse" />
              <span className="text-sm font-medium"><T>100+ Crops</T></span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ height: ["20%", "50%", "20%"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 bg-muted-foreground/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
