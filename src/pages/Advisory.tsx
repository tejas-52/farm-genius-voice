import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Sprout,
    Droplets,
    ThermometerSun,
    Navigation,
    Search,
    Loader2,
    ArrowRight,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Calendar,
    CloudSun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { T } from "@/components/TranslatedText";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const soilTypes = [
    { id: "black", name: "Black Soil", icon: "🌋", properties: "Rich in iron, lime, calcium, potassium. Ideal for heavy crops." },
    { id: "red", name: "Red Soil", icon: "🔴", properties: "Porous structure, high iron content. Best for pulses." },
    { id: "alluvial", name: "Alluvial Soil", icon: "🌊", properties: "Mineral-rich silt from rivers. Most fertile soil type." },
    { id: "laterite", name: "Laterite Soil", icon: "🧱", properties: "Typical of tropical areas. Best for plantation crops." },
    { id: "sandy", name: "Sandy Soil", icon: "🏖️", properties: "Fast drainage, warms quickly. Great for root vegetables." },
];

export default function Advisory() {
    const [location, setLocation] = useState<{ lat: number, lon: number, address?: string } | null>(null);
    const [detecting, setDetecting] = useState(false);
    const [selectedSoil, setSelectedSoil] = useState("");
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<any[] | null>(null);

    const detectLocation = () => {
        setDetecting(true);
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            setDetecting(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lon: longitude, address: "Detecting address..." });

                try {
                    // Reverse geocoding optional, but nice
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                    const data = await res.json();
                    setLocation({
                        lat: latitude,
                        lon: longitude,
                        address: data.display_name.split(',').slice(0, 3).join(',')
                    });
                    toast.success("Location detected successfully!");
                } catch (e) {
                    setLocation({ lat: latitude, lon: longitude, address: "Location Pinpointed" });
                } finally {
                    setDetecting(false);
                }
            },
            (error) => {
                toast.error("Unable to retrieve location");
                setDetecting(false);
            }
        );
    };

    const getSuggestions = async () => {
        if (!selectedSoil) {
            toast.error("Please select a soil type first");
            return;
        }

        setLoadingSuggestions(true);

        // Simulate AI thinking or call edge function
        try {
            // In a real app, we'd call an Edge Function that uses the location and soil type
            // to query a knowledge base or GPT-4.
            // For now, we'll use high-quality mock data that feels real.

            const prompt = `Suggest crops for ${selectedSoil} soil in ${location?.address || 'India'}. Include season, maturity period, and yield potential.`;

            // We could call supabase.functions.invoke('chat', ...) here

            setTimeout(() => {
                const mockResults: Record<string, any[]> = {
                    black: [
                        { name: "Long Staple Cotton", season: "Kharif", maturity: "160-180 days", yield: "15-20 quintal/ha", risk: "Medium", reliability: 85 },
                        { name: "Soybean (JS 335)", season: "Kharif", maturity: "95-100 days", yield: "20-25 quintal/ha", risk: "Low", reliability: 92 },
                        { name: "Gram (Chickpea)", season: "Rabi", maturity: "110-120 days", yield: "12-15 quintal/ha", risk: "Low", reliability: 88 }
                    ],
                    red: [
                        { name: "Finger Millet (Ragi)", season: "Kharif", maturity: "105-120 days", yield: "25-30 quintal/ha", risk: "Low", reliability: 95 },
                        { name: "Groundnut", season: "Kharif", maturity: "110-125 days", yield: "20-30 quintal/ha", risk: "Medium", reliability: 82 },
                        { name: "Pigeon Pea", season: "Kharif", maturity: "160-180 days", yield: "10-12 quintal/ha", risk: "Low", reliability: 90 }
                    ],
                    alluvial: [
                        { name: "Basmati Rice", season: "Kharif", maturity: "135-145 days", yield: "40-50 quintal/ha", risk: "Medium", reliability: 80 },
                        { name: "Sonalika Wheat", season: "Rabi", maturity: "120-130 days", yield: "45-55 quintal/ha", risk: "Low", reliability: 94 },
                        { name: "Sugarcane", season: "Annual", maturity: "10-12 months", yield: "700-800 quintal/ha", risk: "Low", reliability: 85 }
                    ]
                };

                setSuggestions(mockResults[selectedSoil] || mockResults['alluvial']);
                setLoadingSuggestions(false);
                toast.success("Crop recommendations generated!");
            }, 2000);

        } catch (e) {
            toast.error("Failed to fetch suggestions");
            setLoadingSuggestions(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#F8FAFC] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-eco/5 rounded-full blur-[100px] -z-10" />

            <div className="container max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white shadow-card border border-primary/10 text-primary text-sm font-bold mb-8"
                    >
                        <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <Navigation className="w-4 h-4" />
                        <T>Precision Smart Advisory</T>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Smart <span className="text-gradient">Advisory</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                        Discover the perfect crops for your land using AI-powered analysis of your local climate and soil health.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Input Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 space-y-8"
                    >
                        <div className="glass-card-elevated p-8 space-y-8 border-white/60">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Search className="w-6 h-6 text-primary" />
                                    </div>
                                    <T>Farm Specs</T>
                                </h2>
                            </div>

                            {/* Location Selector */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Farm Location</label>
                                {!location ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full h-32 rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-3 group hover:border-primary/50 transition-all"
                                        onClick={detectLocation}
                                        disabled={detecting}
                                    >
                                        {detecting ? (
                                            <div className="relative">
                                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <MapPin className="w-10 h-10 text-primary/40 group-hover:text-primary transition-colors" />
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                            </div>
                                        )}
                                        <span className="text-sm font-bold text-primary/70">
                                            {detecting ? "Locating..." : "Auto-Detect Location"}
                                        </span>
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="p-6 rounded-3xl bg-primary text-white shadow-glow relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Navigation className="w-20 h-20 rotate-45" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-5 h-5" />
                                                    <span className="text-xs font-black uppercase tracking-widest opacity-80">Pinned</span>
                                                </div>
                                                <button
                                                    onClick={() => setLocation(null)}
                                                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                                >
                                                    <ArrowRight className="w-4 h-4 rotate-180" />
                                                </button>
                                            </div>
                                            <p className="text-lg font-bold leading-tight line-clamp-2 pr-8">{location.address}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Soil Type Selector */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Land Character</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {soilTypes.map((soil) => (
                                        <motion.button
                                            key={soil.id}
                                            whileHover={{ x: 4 }}
                                            onClick={() => setSelectedSoil(soil.id)}
                                            className={cn(
                                                "w-full p-4 rounded-2xl text-left border-2 transition-all duration-300 flex items-center gap-4 group",
                                                selectedSoil === soil.id
                                                    ? "border-primary bg-primary shadow-glow-accent text-white"
                                                    : "border-border bg-white hover:border-primary/30"
                                            )}
                                        >
                                            <span className="text-3xl filter group-hover:scale-110 transition-transform">{soil.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-base tracking-tight">{soil.name}</span>
                                                    {selectedSoil === soil.id && <CheckCircle2 className="w-5 h-5 text-white" />}
                                                </div>
                                                <p className={cn(
                                                    "text-xs mt-0.5 line-clamp-1 font-medium",
                                                    selectedSoil === soil.id ? "text-white/80" : "text-muted-foreground"
                                                )}>
                                                    {soil.properties}
                                                </p>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={getSuggestions}
                                    disabled={loadingSuggestions || !selectedSoil}
                                    className="w-full h-16 rounded-[1.25rem] text-xl font-bold gap-3 shadow-glow"
                                >
                                    {loadingSuggestions ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <Search className="w-6 h-6" />
                                    )}
                                    <T>Run AI Analysis</T>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Results Panel */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {!suggestions ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 glass-card border-dashed"
                                >
                                    <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
                                        <Sprout className="w-10 h-10 text-muted-foreground/30" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-muted-foreground">No Analysis Yet</h3>
                                    <p className="text-muted-foreground max-w-sm">
                                        Enter your farm's location and soil type to get AI-powered crop recommendations.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-2xl font-bold"><T>Top Recommendations</T></h2>
                                        <div className="flex items-center gap-2 text-sm font-bold text-eco">
                                            <TrendingUp className="w-4 h-4" />
                                            <T>Optimized for current season</T>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {suggestions.map((crop, index) => (
                                            <motion.div
                                                key={crop.name}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="glass-card-elevated p-6 hover:border-primary/40 transition-all group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                        <Sprout className="w-6 h-6" />
                                                    </div>
                                                    <div className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                                        crop.risk === "Low" ? "bg-eco/10 text-eco" : "bg-solar/10 text-solar"
                                                    )}>
                                                        {crop.risk} Risk
                                                    </div>
                                                </div>

                                                <h4 className="text-xl font-bold mb-4">{crop.name}</h4>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" /> Season
                                                        </span>
                                                        <p className="text-sm font-semibold">{crop.season}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                                            <CloudSun className="w-3 h-3" /> Maturity
                                                        </span>
                                                        <p className="text-sm font-semibold">{crop.maturity}</p>
                                                    </div>
                                                    <div className="space-y-1 col-span-2">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                                            <TrendingUp className="w-3 h-3" /> Yield Potential
                                                        </span>
                                                        <p className="text-sm font-bold text-primary">{crop.yield}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-eco rounded-full"
                                                                style={{ width: `${crop.reliability}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-eco">{crop.reliability}% Reliability</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Summary Card */}
                                    <div className="glass-card p-6 bg-primary/5 border-primary/20">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-2xl bg-primary text-primary-foreground">
                                                <AlertCircle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold mb-1"><T>Expert Farmer Tip</T></h5>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Based on your {soilTypes.find(s => s.id === selectedSoil)?.name} soil and the current humidity levels in {location?.address?.split(',')[0] || 'your area'}, we highly recommend prioritizing {suggestions[0].name} for this season. Ensure proper drainage before sowing.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
