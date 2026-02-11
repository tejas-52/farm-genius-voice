import { motion, useScroll, useTransform } from "framer-motion";
import { Sprout, Shield, TrendingUp, Globe, Leaf, Sun, Droplets, ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { ClimateChangeSection } from "@/components/ClimateChangeSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { T } from "@/components/TranslatedText";
import sustainableFarm from "@/assets/sustainable-farm.jpg";

const stats = [
  { value: "10+", label: "Languages Supported", icon: Globe },
  { value: "1M+", label: "Farmers Helped", icon: Sprout },
  { value: "99%", label: "Accuracy Rate", icon: Shield },
  { value: "24/7", label: "Always Available", icon: TrendingUp },
];

const sustainabilityFeatures = [
  {
    icon: Leaf,
    title: "Eco-Friendly Practices",
    description: "Reduce chemical inputs while maintaining high yields",
    color: "from-eco to-eco/70",
  },
  {
    icon: Sun,
    title: "Solar Integration",
    description: "Save ₹15,000-30,000/year with renewable energy",
    color: "from-solar to-solar/70",
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    description: "Smart irrigation reduces water usage by 40%",
    color: "from-water to-water/70",
  },
];

const Index = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: statsRef,
    offset: ["start end", "end start"],
  });

  const statsY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <>
      <HeroSection />

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-eco/5 rounded-full blur-3xl"
        />
        <div className="container relative z-10">
          <motion.div style={{ y: statsY }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", bounce: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass-card-elevated p-6 text-center group cursor-pointer"
                >
                  <motion.div 
                    className="w-12 h-12 mx-auto mb-4 rounded-2xl gradient-hero flex items-center justify-center shadow-glow"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
                  <motion.div 
                    className="text-3xl md:text-4xl font-bold text-gradient mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-muted-foreground font-medium"><T>{stat.label}</T></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Climate Change Section */}
      <ClimateChangeSection />

      {/* Sustainability Banner */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            src={sustainableFarm}
            alt="Sustainable farming"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco/20 text-eco text-sm font-bold mb-6 border border-eco/30"
            >
              <Leaf className="w-4 h-4" />
              <T>Sustainability Built-In</T>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            >
              <T>Farm Smarter,</T>{" "}
              <span className="text-gradient-eco"><T>Save More</T></span>
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
              {sustainabilityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass-card p-4"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                    <feature.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-sm mb-1"><T>{feature.title}</T></h3>
                  <p className="text-xs text-muted-foreground"><T>{feature.description}</T></p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/copilot">
                <Button variant="eco" size="lg" className="group">
                  <T>Try Sustainable Advice</T>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-card/50">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center shadow-glow"
              >
                <Sprout className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div>
                <span className="font-bold text-xl block">KrishiMitra AI</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  <T>Sustainable Farming Intelligence</T>
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              <T>Empowering farmers with AI-powered sustainable decision intelligence</T>
            </p>
            <div className="text-sm text-muted-foreground">
              <T>© 2024 KrishiMitra. All rights reserved.</T>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Index;
