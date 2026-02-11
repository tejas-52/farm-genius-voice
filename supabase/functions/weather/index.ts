// Using Deno's built-in serve function (no import needed)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from headers
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "auto:ip";

    console.log("Getting weather for IP:", clientIP);

    // Get location from IP using free IP API
    let lat = 19.076; // Default to Mumbai
    let lon = 72.877;
    let location = "Maharashtra";

    try {
      const ipResponse = await fetch(`http://ip-api.com/json/${clientIP === "auto:ip" ? "" : clientIP}`);
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        if (ipData.status === "success") {
          lat = ipData.lat;
          lon = ipData.lon;
          location = ipData.regionName || ipData.city || "India";
          console.log("Location detected:", location, lat, lon);
        }
      }
    } catch (e) {
      console.log("IP geolocation failed, using default");
    }

    // Get weather from Open-Meteo (free, no API key needed)
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
    );

    if (!weatherResponse.ok) {
      throw new Error("Weather API error");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    // Map weather codes to conditions
    const weatherCodeMap: Record<number, string> = {
      0: "sunny",
      1: "partly-cloudy",
      2: "partly-cloudy",
      3: "cloudy",
      45: "cloudy",
      48: "cloudy",
      51: "rainy",
      53: "rainy",
      55: "rainy",
      61: "rainy",
      63: "rainy",
      65: "rainy",
      80: "rainy",
      81: "rainy",
      82: "rainy",
    };

    const condition = weatherCodeMap[current.weather_code] || "partly-cloudy";

    // Generate farming-relevant forecast
    const forecasts: Record<string, string> = {
      sunny: "Good conditions for field work and harvesting",
      "partly-cloudy": "Good conditions for irrigation today",
      cloudy: "Favorable for transplanting seedlings",
      rainy: "Skip irrigation - natural watering expected",
    };

    const result = {
      temperature: Math.round(current.temperature_2m),
      condition,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      location,
      forecast: forecasts[condition] || "Monitor conditions before field work",
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Weather error:", error);
    // Return fallback data
    return new Response(JSON.stringify({
      temperature: 28,
      condition: "partly-cloudy",
      humidity: 65,
      windSpeed: 12,
      location: "India",
      forecast: "Good conditions for irrigation today",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
