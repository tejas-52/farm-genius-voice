import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind, X, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "partly-cloudy";
  humidity: number;
  windSpeed: number;
  location: string;
  forecast: string;
}

const conditionIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  "partly-cloudy": Cloud,
};

const conditionLabels = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  "partly-cloudy": "Partly Cloudy",
};

interface WeatherPopupProps {
  hiddenOnPages?: string[];
}

export function WeatherPopup({ hiddenOnPages = [] }: WeatherPopupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if current page should hide the popup
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const shouldHide = hiddenOnPages.some(page => currentPath.includes(page));

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

      const getPosition = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
      };

      try {
        let lat = 20.5937; // Default India
        let lon = 78.9629;
        let locationName = "India";

        try {
          const pos = await getPosition();
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        } catch (e) {
          console.warn("Location denied, using default");
        }

        if (apiKey) {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
          );

          if (!response.ok) throw new Error("Weather API failed");

          const data = await response.json();

          // Map OpenWeather conditions to our types
          let condition: WeatherData["condition"] = "partly-cloudy";
          const main = data.weather[0].main.toLowerCase();
          if (main.includes("clear")) condition = "sunny";
          else if (main.includes("cloud")) condition = data.clouds.all > 50 ? "cloudy" : "partly-cloudy";
          else if (main.includes("rain") || main.includes("drizzle") || main.includes("thunderstorm")) condition = "rainy";

          setWeather({
            temperature: Math.round(data.main.temp),
            condition,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
            location: data.name,
            forecast: condition === "rainy"
              ? "Expect rain: check drainage and avoid fertilizer application"
              : "Good conditions for general farm work today",
          });
        } else {
          // No API key, try Supabase fallback
          const { data, error } = await supabase.functions.invoke('weather');
          if (error) throw error;
          setWeather(data);
        }
      } catch (e) {
        console.error("Weather error:", e);
        setWeather({
          temperature: 28,
          condition: "partly-cloudy",
          humidity: 65,
          windSpeed: 12,
          location: "India",
          forecast: "Good conditions for irrigation today",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  if (shouldHide || !weather) {
    if (isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <div className="glass-card px-4 py-3 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading weather...</span>
          </div>
        </motion.div>
      );
    }
    return null;
  }

  const WeatherIcon = conditionIcons[weather.condition];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, type: "spring" }}
      className="fixed bottom-4 left-4 z-50"
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass-card-elevated p-5 w-72 shadow-elevated"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-solar/20 flex items-center justify-center"
                  animate={{ rotate: weather.condition === "sunny" ? 360 : 0 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <WeatherIcon className="w-5 h-5 text-solar" />
                </motion.div>
                <div>
                  <p className="text-xs text-muted-foreground">📍 {weather.location}</p>
                  <p className="text-sm font-semibold">{conditionLabels[weather.condition]}</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Main temperature */}
            <div className="text-center mb-4">
              <motion.div
                className="text-5xl font-bold text-gradient"
                key={weather.temperature}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {weather.temperature}°C
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 rounded-xl bg-muted/50">
                <Thermometer className="w-4 h-4 mx-auto mb-1 text-destructive" />
                <p className="text-xs text-muted-foreground">Feels</p>
                <p className="text-sm font-semibold">{weather.temperature + 2}°C</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-muted/50">
                <Droplets className="w-4 h-4 mx-auto mb-1 text-water" />
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="text-sm font-semibold">{weather.humidity}%</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-muted/50">
                <Wind className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="text-sm font-semibold">{weather.windSpeed} km/h</p>
              </div>
            </div>

            {/* Forecast note */}
            <div className="p-3 rounded-xl bg-eco/10 border border-eco/20">
              <p className="text-xs text-eco font-medium">
                🌱 {weather.forecast}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsExpanded(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card px-4 py-3 flex items-center gap-3 shadow-elevated hover:shadow-glow transition-shadow group"
          >
            <motion.div
              className="w-9 h-9 rounded-xl bg-solar/20 flex items-center justify-center"
              animate={{ rotate: weather.condition === "sunny" ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <WeatherIcon className="w-5 h-5 text-solar" />
            </motion.div>
            <div className="text-left">
              <p className="text-xl font-bold">{weather.temperature}°C</p>
              <p className="text-xs text-muted-foreground">{weather.location}</p>
            </div>
            <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
