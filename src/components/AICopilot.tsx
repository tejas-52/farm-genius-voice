import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Loader2, User, Bot, AlertTriangle, CheckCircle2, Lightbulb, Sun, Droplets, Image, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { T } from "@/components/TranslatedText";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import sustainableFarm from "@/assets/sustainable-farm.jpg";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  riskLevel?: "low" | "medium" | "high";
  image?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const detectRiskLevel = (content: string): "low" | "medium" | "high" | undefined => {
  const lower = content.toLowerCase();
  if (lower.includes("urgent") || lower.includes("immediate") || lower.includes("serious")) return "high";
  if (lower.includes("attention") || lower.includes("moderate") || lower.includes("monitor")) return "medium";
  if (lower.includes("safe") || lower.includes("low risk") || lower.includes("good condition")) return "low";
  return undefined;
};

export function AICopilot() {
  const { currentLanguage, translate } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [voiceModeOpen, setVoiceModeOpen] = useState(false);
  const [autoQueryProcessed, setAutoQueryProcessed] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lon: number; city?: string } | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Fetch Address
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.state;
            setLocation({ lat: latitude, lon: longitude, city });
          } catch (e) {
            setLocation({ lat: latitude, lon: longitude });
          }

          // Fetch Weather
          const weatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
          if (weatherKey) {
            try {
              const wResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherKey}`);
              const wData = await wResp.json();
              setWeatherData({
                temp: Math.round(wData.main.temp),
                condition: wData.weather[0].main,
                humidity: wData.main.humidity,
                wind: Math.round(wData.wind.speed * 3.6)
              });
            } catch (e) {
              console.warn("AICopilot weather fetch failed:", e);
            }
          }
        },
        (error) => console.warn("Location access denied:", error)
      );
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* 
   * Mock Response Generator for when Backend is offline 
   * This provides a "working" experience for demo purposes
   */
  const getMockResponse = (input: string): string => {
    const lower = input.toLowerCase();

    if (lower.includes("crop") || lower.includes("unhealthy") || lower.includes("yellow")) {
      return `Based on the symptoms you described, your crop appears to have a nitrogen deficiency. This is common in many farming regions.\n\nKey Indicators:\n• Yellowing of older leaves first\n• Stunted growth\n• Reduced yield\n\nImmediate Actions:\n1. Apply urea fertilizer at 50 kg per acre\n2. Ensure proper irrigation\n3. Consider soil testing\n\nLong-term Solutions:\n• Add organic compost regularly\n• Practice crop rotation with legumes\n• Use bio-fertilizers\n\nGovernment Scheme: Soil Health Card scheme provides free soil testing. Visit your nearest Krishi Vigyan Kendra.`;
    }

    if (lower.includes("pest") || lower.includes("insect")) {
      return `I can help you with pest management. For effective control:\n\n1. Identify the pest correctly\n2. Use neem-based organic pesticides first\n3. If needed, use chemical pesticides as per recommended dosage\n4. Practice integrated pest management (IPM)\n\nVisit your local agricultural extension office for free pest identification services.`;
    }

    if (lower.includes("water") || lower.includes("irrigation")) {
      return `Water management is crucial for sustainable farming:\n\n1. Install drip irrigation systems (50% subsidy available under PMKSY)\n2. Harvest rainwater\n3. Use mulching to retain soil moisture\n4. Apply water based on crop stage and weather\n\nPMKSY Scheme: Apply for micro-irrigation subsidy at your agriculture department.`;
    }

    return `Thank you for reaching out! I'm here to help with:\n\n• Crop health and disease diagnosis\n• Pest and weed management\n• Soil fertility improvement\n• Water and irrigation advice\n• Government schemes and subsidies\n• Sustainable farming practices\n\nPlease describe your farming situation in detail, and I'll provide specific advice.`;
  };

  // Generate business-specific prompts in different languages
  const getBusinessPrompt = useCallback((businessId: string, lang: string): string => {
    const prompts: Record<string, Record<string, string>> = {
      dairy: {
        en: `I want to start a dairy farming business. Please provide me with:\n1. Complete setup guide and requirements\n2. Investment breakdown and profit estimates\n3. Government schemes and subsidies available\n4. Step-by-step roadmap to get started\n5. Common challenges and solutions\n\nMy budget range is ₹2-5 Lakhs.`,
        hi: `मैं डेयरी फार्मिंग का व्यवसाय शुरू करना चाहता हूँ। कृपया मुझे निम्नलिखित जानकारी दें:\n1. पूर्ण सेटअप गाइड और आवश्यकताएं\n2. निवेश का विवरण और लाभ का अनुमान\n3. उपलब्ध सरकारी योजनाएं और सब्सिडी\n4. शुरुआत करने का चरण-दर-चरण मार्गदर्शन\n5. सामान्य चुनौतियां और समाधान\n\nमेरा बजट ₹2-5 लाख है।`,
        mr: `मी डेअरी फार्मिंगचा व्यवसाय सुरू करू इच्छितो. कृपया मला खालील माहिती द्या:\n1. संपूर्ण सेटअप मार्गदर्शक आणि आवश्यकता\n2. गुंतवणूक तपशील आणि नफा अंदाज\n3. उपलब्ध सरकारी योजना आणि सबसिडी\n4. सुरुवात करण्यासाठी पायरीबद्ध मार्गदर्शक\n5. सामान्य आव्हाने आणि उपाय\n\nमाझे बजेट ₹2-5 लाख आहे।`,
        pa: `ਮੈਂ ਡੇਅਰੀ ਫਾਰਮਿੰਗ ਦਾ ਕਾਰੋਬਾਰ ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦਿਓ:\n1. ਪੂਰਾ ਸੈੱਟਅੱਪ ਗਾਈਡ ਅਤੇ ਲੋੜਾਂ\n2. ਨਿਵੇਸ਼ ਦਾ ਵੇਰਵਾ ਅਤੇ ਲਾਭ ਦਾ ਅੰਦਾਜ਼ਾ\n3. ਉਪਲਬਧ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਅਤੇ ਸਬਸਿਡੀ\n4. ਸ਼ੁਰੂਆਤ ਕਰਨ ਲਈ ਕਦਮ-ਦਰ-ਕਦਮ ਮਾਰਗਦਰਸ਼ਨ\n5. ਆਮ ਚੁਣੌਤੀਆਂ ਅਤੇ ਹੱਲ\n\nਮੇਰਾ ਬਜਟ ₹2-5 ਲੱਖ ਹੈ।`,
        te: `నేను డైరీ ఫార్మింగ్ వ్యాపారాన్ని ప్రారంభించాలనుకుంటున్నాను. దయచేసి నాకు క్రింది సమాచారం అందించండి:\n1. పూర్తి సెటప్ గైడ్ మరియు అవసరాలు\n2. పెట్టుబడి వివరాలు మరియు లాభ అంచనాలు\n3. అందుబాటులో ఉన్న ప్రభుత్వ పథకాలు మరియు సబ్సిడీలు\n4. ప్రారంభించడానికి దశల వారీ మార్గదర్శకం\n5. సాధారణ సవాళ్లు మరియు పరిష్కారాలు\n\nనా బడ్జెట్ ₹2-5 లక్షలు.`
      },
      poultry: {
        en: `I'm interested in starting a poultry farming business. Please guide me on:\n1. Layer vs Broiler farming - which is better?\n2. Initial investment and setup costs\n3. Daily operational expenses\n4. Expected profits and ROI timeline\n5. Government schemes for poultry farmers\n\nI have around ₹3-8 Lakhs to invest.`,
        hi: `मैं पोल्ट्री फार्मिंग का व्यवसाय शुरू करने में रुचि रखता हूँ। कृपया मुझे मार्गदर्शन दें:\n1. लेयर vs ब्रॉयलर फार्मिंग  - कौन सा बेहतर है?\n2. शुरुआती निवेश और सेटअप लागत\n3. दैनिक परिचालन खर्च\n4. अपेक्षित लाभ और ROI समयसीमा\n5. पोल्ट्री किसानों के लिए सरकारी योजनाएं\n\nमेरे पास निवेश के लिए लगभग ₹3-8 लाख हैं।`,
        mr: `मला पोल्ट्री फार्मिंग व्यवसाय सुरू करण्यात रस आहे. कृपया मला मार्गदर्शन करा:\n1. लेयर vs ब्रॉयलर फार्मिंग - कोणते चांगले?\n2. सुरुवातीची गुंतवणूक आणि सेटअप खर्च\n3. दैनंदिन ऑपरेशनल खर्च\n4. अपेक्षित नफा आणि ROI कालमर्यादा\n5. पोल्ट्री शेतकऱ्यांसाठी सरकारी योजना\n\nमाझ्याकडे गुंतवणुकीसाठी सुमारे ₹3-8 लाख आहेत।`,
        pa: `ਮੈਂ ਪੋਲਟਰੀ ਫਾਰਮਿੰਗ ਦਾ ਕਾਰੋਬਾਰ ਸ਼ੁਰੂ ਕਰਨ ਵਿੱਚ ਦਿਲਚਸਪੀ ਰੱਖਦਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਮਾਰਗਦਰਸ਼ਨ ਦਿਓ:\n1. ਲੇਅਰ vs ਬ੍ਰੌਇਲਰ ਫਾਰਮਿੰਗ - ਕਿਹੜਾ ਬਿਹਤਰ ਹੈ?\n2. ਸ਼ੁਰੂਆਤੀ ਨਿਵੇਸ਼ ਅਤੇ ਸੈੱਟਅੱਪ ਲਾਗਤ\n3. ਰੋਜ਼ਾਨਾ ਸੰਚਾਲਨ ਖਰਚੇ\n4. ਅਨੁਮਾਨਿਤ ਲਾਭ ਅਤੇ ROI ਸਮਾਂ-ਰੇਖਾ\n5. ਪੋਲਟਰੀ ਕਿਸਾਨਾਂ ਲਈ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ\n\nਮੇਰੇ ਕੋਲ ਨਿਵੇਸ਼ ਲਈ ਲਗਭਗ ₹3-8 ਲੱਖ ਹਨ।`,
        te: `నేను పౌల్ట్రీ ఫార్మింగ్ వ్యాపారాన్ని ప్రారంభించడంలో ఆసక్తి కలిగి ఉన్నాను. దయచేసి నాకు మార్గదర్శకత్వం చేయండి:\n1. లేయర్ vs బ్రాయిలర్ ఫార్మింగ్ - ఏది మంచిది?\n2. ప్రారంభ పెట్టుబడి మరియు సెటప్ ఖర్చులు\n3. రోజువారీ నిర్వహణ ఖర్చులు\n4. ఆశించిన లాభాలు మరియు ROI కాలపట్టిక\n5. పౌల్ట్రీ రైతుల కోసం ప్రభుత్వ పథకాలు\n\nనా వద్ద పెట్టుబడి కోసం దాదాపు ₹3-8 లక్షలు ఉన్నాయి.`
      },
      organic: {
        en: `I want to transition my farm to organic farming. Please advise on:\n1. Organic certification process and requirements\n2. Transition period and challenges\n3. Organic inputs and their sources\n4. Market opportunities and pricing\n5. Government support for organic farming\n\nI farm on 5 acres of land.`,
        hi: `मैं अपने खेत को जैविक खेती में परिवर्तित करना चाहता हूँ। कृपया सलाह दें:\n1. जैविक प्रमाणन प्रक्रिया और आवश्यकताएं\n2. संक्रमण अवधि और चुनौतियां\n3. जैविक इनपुट और उनके स्रोत\n4. बाजार के अवसर और मूल्य निर्धारण\n5. जैविक खेती के लिए सरकारी सहायता\n\nमैं 5 एकड़ जमीन पर खेती करता हूँ।`,
        mr: `मला माझे शेत सेंद्रिय शेतीमध्ये रूपांतरित करायचे आहे. कृपया सल्ला द्या:\n1. सेंद्रिय प्रमाणन प्रक्रिया आणि आवश्यकता\n2. संक्रमण कालावधी आणि आव्हाने\n3. सेंद्रिय इनपुट आणि त्यांचे स्रोत\n4. बाजाराच्या संधी आणि किंमत\n5. सेंद्रिय शेतीसाठी सरकारी मदत\n\nमी 5 एकर जमिनीवर शेती करतो।`,
        pa: `ਮੈਂ ਆਪਣੇ ਖੇਤ ਨੂੰ ਜੈਵਿਕ ਖੇਤੀ ਵਿੱਚ ਤਬਦੀਲ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਸਲਾਹ ਦਿਓ:\n1. ਜੈਵਿਕ ਪ੍ਰਮਾਣੀਕਰਨ ਪ੍ਰਕਿਰਿਆ ਅਤੇ ਲੋੜਾਂ\n2. ਪਰਿਵਰਤਨ ਸਮਾਂ ਅਤੇ ਚੁਣੌਤੀਆਂ\n3. ਜੈਵਿਕ ਇਨਪੁੱਟ ਅਤੇ ਉਹਨਾਂ ਦੇ ਸਰੋਤ\n4. ਮਾਰਕੀਟ ਦੇ ਮੌਕੇ ਅਤੇ ਕੀਮਤ\n5. ਜੈਵਿਕ ਖੇਤੀ ਲਈ ਸਰਕਾਰੀ ਸਹਾਇਤਾ\n\nਮੈਂ 5 ਏਕੜ ਜ਼ਮੀਨ ਤੇ ਖੇਤੀ ਕਰਦਾ ਹਾਂ।`,
        te: `నేను నా పొలాన్ని సేంద్రీయ వ్యవసాయంలోకి మార్చాలనుకుంటున్నాను. దయచేసి సలహా ఇవ్వండి:\n1. సేంద్రీయ ధృవీకరణ ప్రక్రియ మరియు అవసరాలు\n2. పరివర్తన కాలం మరియు సవాళ్లు\n3. సేంద్రీయ ఇన్‌పుట్‌లు మరియు వాటి మూలాలు\n4. మార్కెట్ అవకాశాలు మరియు ధర నిర్ణయం\n5. సేంద్రీయ వ్యవసాయానికి ప్రభుత్వ మద్దతు\n\nనేను 5 ఎకరాల భూమిలో వ్యవసాయం చేస్తాను.`
      },
      machinery: {
        en: `I'm planning to start a farm machinery rental business. Need guidance on:\n1. Best equipment to purchase for rentals\n2. Total investment and maintenance costs\n3. Rental rates and demand in rural areas\n4. Government subsidies for agricultural machinery\n5. Business registration and insurance\n\nBudget: ₹5-15 Lakhs`,
        hi: `मैं कृषि मशीनरी किराए का व्यवसाय शुरू करने की योजना बना रहा हूँ। मार्गदर्शन चाहिए:\n1. किराए के लिए खरीदने हेतु सर्वोत्तम उपकरण\n2. कुल निवेश और रखरखाव लागत\n3. ग्रामीण क्षेत्रों में किराए की दरें और मांग\n4. कृषि मशीनरी के लिए सरकारी सब्सिडी\n5. व्यवसाय पंजीकरण और बीमा\n\nबजट: ₹5-15 लाख`,
        mr: `मी शेती यंत्रसामग्री भाड्याने देण्याचा व्यवसाय सुरू करण्याची योजना आखत आहे. मार्गदर्शन हवे:\n1. भाड्याने देण्यासाठी खरेदी करावयाची सर्वोत्तम उपकरणे\n2. एकूण गुंतवणूक आणि देखभाल खर्च\n3. ग्रामीण भागात भाड्याचे दर आणि मागणी\n4. शेती यंत्रसामग्रीसाठी सरकारी सबसिडी\n5. व्यवसाय नोंदणी आणि विमा\n\nबजेट: ₹5-15 लाख`,
        pa: `ਮੈਂ ਫਾਰਮ ਮਸ਼ੀਨਰੀ ਕਿਰਾਏ ਦਾ ਕਾਰੋਬਾਰ ਸ਼ੁਰੂ ਕਰਨ ਦੀ ਯੋਜਨਾ ਬਣਾ ਰਿਹਾ ਹਾਂ। ਮਾਰਗਦਰਸ਼ਨ ਚਾਹੀਦਾ ਹੈ:\n1. ਕਿਰਾਏ ਲਈ ਖਰੀਦਣ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਉਪਕਰਣ\n2. ਕੁੱਲ ਨਿਵੇਸ਼ ਅਤੇ ਰੱਖ-ਰਖਾਅ ਲਾਗਤ\n3. ਪੇਂਡੂ ਖੇਤਰਾਂ ਵਿੱਚ ਕਿਰਾਏ ਦੀਆਂ ਦਰਾਂ ਅਤੇ ਮੰਗ\n4. ਖੇਤੀ ਮਸ਼ੀਨਰੀ ਲਈ ਸਰਕਾਰੀ ਸਬਸਿਡੀਆਂ\n5. ਕਾਰੋਬਾਰ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਤੇ ਬੀਮਾ\n\nਬਜਟ: ₹5-15 ਲੱਖ`,
        te: `నేను వ్యవసాయ యంత్రాల అద్దె వ్యాపారాన్ని ప్రారంభించాలని ఆలోచిస్తున్నాను. మార్గదర్శకత్వం కావాలి:\n1. అద్దెకు కొనుగోలు చేయడానికి ఉత్తమ పరికరాలు\n2. మొత్తం పెట్టుబడి మరియు నిర్వహణ ఖర్చులు\n3. గ్రామీణ ప్రాంతాల్లో అద్దె రేట్లు మరియు డిమాండ్\n4. వ్యవసాయ యంత్రాలకు ప్రభుత్వ సబ్సిడీలు\n5. వ్యాపార నమోదు మరియు బీమా\n\nబడ్జెట్: ₹5-15 లక్షలు`
      }
    };

    const fallback = prompts[businessId]?.en || `Tell me about starting a ${businessId} business in farming.`;
    return prompts[businessId]?.[lang] || fallback;
  }, []);
const streamChat = useCallback(async (
  chatMessages: { role: string; content: string; image?: string }[],
  onDelta: (delta: string) => void,
  onDone: () => void
) => {
  const ollamaUrl = import.meta.env.VITE_OLLAMA_URL;
  const ollamaModel = import.meta.env.VITE_OLLAMA_MODEL || "llama3";

  // Inject Context
  const now = new Date();
  const weatherStr = weatherData ? `, Weather: ${weatherData.temp}°C, ${weatherData.condition}, ${weatherData.humidity}% humidity` : "";
  const contextStr = `[Context: Current local time is ${now.toLocaleString()}. User Location: ${location?.city || "Unknown"} (Lat: ${location?.lat || "N/A"}, Lon: ${location?.lon || "N/A"})${weatherStr}]`;

  const contextMessage = {
    role: "system",
    content: `You are KrishiMitra, an expert farming assistant. ${contextStr}. Respond strictly in ${currentLanguage.name}. Provide very brief, voice-friendly advice using bullet points. Keep it small and easy to read.`
  };

  const finalMessages = [contextMessage, ...chatMessages.map(m => ({ role: m.role, content: m.content }))];

  try {
    if (ollamaUrl) {
      console.log("Attempting to connect to Ollama at:", ollamaUrl);
      const resp = await fetch(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ollamaModel,
          messages: finalMessages,
          stream: true,
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Ollama unavailable");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              onDelta(json.message.content);
            }
            if (json.done) break;
          } catch (e) {
            // Ignore partial JSON chunks
          }
        }
      }
      onDone();
      return;
    }

    // Fallback to Supabase if Ollama URL is not set
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: finalMessages }),
    });

    if (!resp.ok || !resp.body) {
      throw new Error("Backend unavailable");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const json = JSON.parse(line.slice(6));
            const content = json.choices?.[0]?.delta?.content;
            if (content) onDelta(content);
          } catch { }
        }
      }
    }

    onDone();

  } catch (error) {
    console.warn("Using Mock Response due to API error:", error);

    // MOCK FALLBACK
    const lastUserMessage = chatMessages[chatMessages.length - 1];
    const mockResponse = getMockResponse(typeof lastUserMessage.content === 'string' ? lastUserMessage.content : "Help");

    // Simulate typing delay
    let i = 0;
    const interval = setInterval(() => {
      if (i < mockResponse.length) {
        onDelta(mockResponse.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        onDone();
      }
    }, 15); // Fast typing speed
  }
}, []);

// Auto-send query from URL parameter
const sendQuery = useCallback(async (queryText: string) => {
  if (!queryText.trim() || isLoading) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: queryText,
  };

  const newMessages = [userMessage];
  setMessages(newMessages);
  setIsLoading(true);

  let assistantContent = "";

  // Optimistic UI update wrapper
  const upsertAssistant = (chunk: string) => {
    assistantContent += chunk;
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant") {
        return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
      }
      return [...prev, { id: Date.now().toString(), role: "assistant", content: assistantContent }];
    });
  };

  // Call streamChat (which now handles fallback internally)
  await streamChat(
    newMessages.map(m => ({ role: m.role, content: m.content })),
    upsertAssistant,
    () => {
      setIsLoading(false);
      if (assistantContent.length > 50) {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            // Detect risk level as regular
            const risk = detectRiskLevel(assistantContent);
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, riskLevel: risk } : m);
          }
          return prev;
        });
      }
    }
  );
}, [isLoading, streamChat]);

// Process query parameter on mount
useEffect(() => {
  const query = searchParams.get("query");
  const businessParam = searchParams.get("business");

  if (query && !autoQueryProcessed) {
    setAutoQueryProcessed(true);
    setSearchParams({}, { replace: true });
    sendQuery(query);
  } else if (businessParam && !autoQueryProcessed) {
    // Auto-send business guidance query in user's language
    setAutoQueryProcessed(true);
    setSearchParams({}, { replace: true });
    const businessQuery = getBusinessPrompt(businessParam, currentLanguage.code);
    sendQuery(businessQuery);
  }
}, [searchParams, autoQueryProcessed, setSearchParams, sendQuery, getBusinessPrompt, currentLanguage.code]);

const handleSend = async () => {
  if ((!input.trim() && !selectedImage) || isLoading) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: input || "Please analyze this image",
    image: selectedImage || undefined,
  };

  const newMessages = [...messages, userMessage];
  setMessages(newMessages);
  setInput("");
  setSelectedImage(null);
  setIsLoading(true);

  let assistantContent = "";

  const upsertAssistant = (chunk: string) => {
    assistantContent += chunk;
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant") {
        return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
      }
      return [...prev, { id: Date.now().toString(), role: "assistant", content: assistantContent }];
    });
  };

  // Use shared streamChat logic
  await streamChat(
    newMessages.map(m => ({ role: m.role, content: m.content, image: m.image })),
    upsertAssistant,
    () => {
      setIsLoading(false);
      if (assistantContent.length > 50) {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            const risk = detectRiskLevel(assistantContent);
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, riskLevel: risk } : m);
          }
          return prev;
        });
      }
    }
  );
};

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => {
      toast.info("Processing image...");
    };
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      toast.success("✅ Image ready! Ask me about crop health, pests, or diseases.");
    };
    reader.onerror = () => {
      toast.error("Failed to load image. Please try again.");
    };
    reader.readAsDataURL(file);
  }
  // Reset input to allow re-uploading the same file
  e.target.value = '';
};

const speakMessage = async (text: string, messageId: string) => {
  if (isSpeaking === messageId) {
    audioRef.current?.pause();
    setIsSpeaking(null);
    return;
  }

  if (audioRef.current) {
    audioRef.current.pause();
  }

  const googleVoiceMap: Record<string, { name: string; locale: string }> = {
    en: { name: "en-IN-Neural2-A", locale: "en-IN" },
    hi: { name: "hi-IN-Neural2-A", locale: "hi-IN" },
    mr: { name: "mr-IN-Standard-A", locale: "mr-IN" },
    ta: { name: "ta-IN-Standard-A", locale: "ta-IN" },
    te: { name: "te-IN-Standard-A", locale: "te-IN" },
    gu: { name: "gu-IN-Standard-A", locale: "gu-IN" },
    kn: { name: "kn-IN-Standard-A", locale: "kn-IN" },
    ml: { name: "ml-IN-Standard-A", locale: "ml-IN" },
    bn: { name: "bn-IN-Standard-A", locale: "bn-IN" },
    pa: { name: "pa-IN-Standard-A", locale: "pa-IN" },
  };

  let cleanText = text.replace(/[*#_~]/g, "")
    .replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, "")
    .trim();
  if (currentLanguage.code === 'hi') {
    cleanText = cleanText.replace(/KrishiMitra|KrushiMitra|Krishi mitra/gi, "कृषिमित्र");
  }

  const voice = googleVoiceMap[currentLanguage.code] || googleVoiceMap.en;

  try {
    setIsSpeaking(messageId);
    const { data, error } = await supabase.functions.invoke('tts', {
      body: {
        text: cleanText,
        languageCode: voice.locale,
        voiceName: voice.name
      }
    });

    if (error || !data?.audioContent) throw new Error(error?.message || "TTS failed");

    const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      setIsSpeaking(null);
    };

    await audio.play();
  } catch (e) {
    console.warn("Google TTS via Edge failed, falling back to browser:", e);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(cleanText);
      ut.lang = currentLanguage.code === 'en' ? 'en-IN' : `${currentLanguage.code}-IN`;
      ut.rate = 1.25;
      ut.onstart = () => setIsSpeaking(messageId);
      ut.onend = () => setIsSpeaking(null);
      window.speechSynthesis.speak(ut);
    } else {
      setIsSpeaking(null);
    }
  }
};

const handleVoiceTranscript = (text: string) => {
  setInput(text);
  setVoiceModeOpen(false);
};

const getRiskBadge = (level?: "low" | "medium" | "high") => {
  if (!level) return null;
  const config = {
    low: { color: "bg-eco-light text-eco", icon: CheckCircle2, label: "Low Risk" },
    medium: { color: "bg-solar-light text-solar", icon: AlertTriangle, label: "Medium Risk" },
    high: { color: "bg-destructive/10 text-destructive", icon: AlertTriangle, label: "High Risk" },
  };
  const { color, icon: Icon, label } = config[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold", color)}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

const quickActions = [
  { label: "Crop health issue", icon: Lightbulb, query: "My crops look unhealthy, leaves are turning yellow" },
  { label: "Solar pump advice", icon: Sun, query: "Is solar pump right for my 2 acre farm in Maharashtra?" },
  { label: "Reduce chemicals", icon: Droplets, query: "How to reduce chemical fertilizers and switch to organic?" },
];

return (
  <div className="flex flex-col h-[calc(100vh-4rem)]">
    {/* Hero Banner */}
    <div className="relative h-32 md:h-40 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </motion.div>

      <div className="absolute inset-0 flex items-center">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-3xl gradient-hero flex items-center justify-center shadow-glow">
                <Bot className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-xl md:text-2xl text-foreground drop-shadow-sm"><T>Farming Decision Copilot</T></h1>
                <p className="text-sm text-muted-foreground"><T>AI-powered sustainable farming advice</T></p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Link to="/voice">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <T>Voice Mode</T>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,hsl(var(--muted)/0.3),transparent)]">
      <div className="container py-8 md:py-12 space-y-8 max-w-4xl mx-auto">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 md:py-24"
          >
            <div className="relative inline-block mb-10">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-[3rem] gradient-hero flex items-center justify-center shadow-glow-accent relative z-10"
              >
                <Lightbulb className="w-16 h-16 md:w-20 md:h-20 text-white" />
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-primary/20 rounded-full blur-[80px] -z-10" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <T>How can I help</T> <span className="text-gradient">today?</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-12 text-xl font-medium leading-relaxed">
              <T>I'm your AI partner for sustainable farming, crop health, and climate adaptation. How can we optimize your farm today?</T>
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {quickActions.map((action, idx) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={() => setInput(action.query)}
                    className="gap-3 rounded-3xl bg-white/50 backdrop-blur-md border-white/40 border-2 text-primary hover:bg-white transition-all shadow-card hover:shadow-glow"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <action.icon className="w-5 h-5" />
                    </div>
                    <T>{action.label}</T>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "flex gap-4 md:gap-6 group",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-3xl flex-shrink-0 flex items-center justify-center transition-all shadow-card group-hover:shadow-glow",
                  message.role === "user"
                    ? "bg-secondary text-primary border-2 border-white/50"
                    : "gradient-hero text-white"
                )}
              >
                {message.role === "user" ? (
                  <User className="w-6 h-6" />
                ) : (
                  <Bot className="w-6 h-6" />
                )}
              </div>
              <div className={cn(
                "flex flex-col gap-3",
                message.role === "user" ? "items-end max-w-[80%]" : "items-start max-w-[85%]"
              )}>
                <div
                  className={cn(
                    "glass-card-elevated p-6 md:p-8",
                    message.role === "user"
                      ? "bg-secondary/40 border-secondary/20 rounded-tr-none shadow-soft"
                      : "rounded-tl-none border-primary/5 shadow-glow/5"
                  )}
                >
                  {message.image && (
                    <div className="relative group/img mb-6">
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="max-w-sm rounded-[1.5rem] border-4 border-white shadow-elevated transition-transform group-hover/img:scale-[1.02]"
                      />
                      <div className="absolute inset-0 rounded-[1.5rem] shadow-inner" />
                    </div>
                  )}
                  {message.riskLevel && (
                    <div className="mb-6">{getRiskBadge(message.riskLevel)}</div>
                  )}
                  <div className="prose prose-md max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
                    {message.content.split('\n').map((line, i) => {
                      // Remove markdown symbols and format properly
                      let cleanLine = line.replace(/\*\*/g, '').replace(/##/g, '').replace(/###/g, '').replace(/#/g, '');

                      // Check for numbered lists (1. 2. 3.)
                      if (cleanLine.match(/^\d+\.\s/)) {
                        const [num, ...rest] = cleanLine.split(/\.\s/);
                        return (
                          <div key={i} className="my-3 flex items-start gap-3">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex-shrink-0 shadow-soft">
                              {num}
                            </span>
                            <span className="text-base text-foreground font-medium pt-0.5">{rest.join('. ')}</span>
                          </div>
                        );
                      }
                      // Check for bullet points
                      if (cleanLine.startsWith('•') || cleanLine.startsWith('-') || cleanLine.startsWith('✅') || cleanLine.startsWith('⚠️') || cleanLine.startsWith('*')) {
                        const content = cleanLine.replace(/^[•\-\*]\s*/, '');
                        const icon = cleanLine.startsWith('✅') ? '✅' : cleanLine.startsWith('⚠️') ? '⚠️' : '•';
                        return (
                          <div key={i} className="my-3 ml-2 flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-white/40">
                            <span className="text-primary font-bold text-lg leading-none">{icon !== '•' ? icon : '•'}</span>
                            <span className="text-base text-muted-foreground font-medium">{icon !== '•' ? content.substring(2) : content}</span>
                          </div>
                        );
                      }
                      // Check for section headers (lines that look like titles)
                      if (cleanLine.length > 0 && cleanLine.length < 50 && cleanLine.endsWith(':')) {
                        return (
                          <p key={i} className="font-bold text-primary text-xl mt-8 mb-4 border-l-4 border-primary pl-4">
                            {cleanLine}
                          </p>
                        );
                      }
                      return cleanLine ? <p key={i} className="text-base my-3 leading-relaxed font-medium">{cleanLine}</p> : <div className="h-2" />;
                    })}
                  </div>
                </div>
                {message.role === "assistant" && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <Button
                      variant="hero"
                      size="default"
                      onClick={() => speakMessage(message.content, message.id)}
                      className={cn(
                        "w-fit h-10 gap-2.5 rounded-2xl px-5 text-sm font-bold border-2 transition-all",
                        isSpeaking === message.id
                          ? "bg-primary text-white border-primary shadow-glow-accent ring-4 ring-primary/20"
                          : "bg-white text-primary border-primary/20 hover:border-primary shadow-card"
                      )}
                    >
                      {isSpeaking === message.id ? (
                        <div className="flex gap-1">
                          <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                          <motion.div animate={{ height: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                          <motion.div animate={{ height: [6, 14, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                        </div>
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                      {isSpeaking === message.id ? <T>Listening...</T> : <T>Hear Advice</T>}
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center shadow-soft">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium"><T>Analyzing your situation...</T></span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>

    {/* Image Preview */}
    {selectedImage && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="border-t border-border bg-gradient-to-r from-primary/5 via-eco/5 to-primary/5 backdrop-blur-xl p-6"
      >
        <div className="container max-w-4xl">
          <div className="flex items-start gap-6">
            <div className="relative group">
              <img
                src={selectedImage}
                alt="Crop Image Preview"
                className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] object-cover shadow-elevated border-4 border-white/50 group-hover:scale-105 transition-transform"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-3 -right-3 p-2.5 rounded-full bg-destructive text-white shadow-glow hover:scale-110 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-eco animate-pulse" />
                <span className="text-sm font-bold text-eco uppercase tracking-widest">Image Ready for Analysis</span>
              </div>
              <p className="text-base text-foreground font-medium leading-relaxed">
                📸 I can analyze this image for crop diseases, pest identification, nutrient deficiencies, and growth patterns.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Try: "What's wrong with this crop?" or "Identify any pests or diseases"
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )}

    {/* Input */}
    <div className="border-t border-border bg-card/80 backdrop-blur-xl p-4 md:p-5">
      <div className="container">
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            variant="outline"
            size="icon-lg"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex-shrink-0 relative overflow-hidden",
              selectedImage && "bg-primary/10 border-primary hover:bg-primary/20"
            )}
            title="Upload crop image for AI analysis"
          >
            <Image className={cn("w-5 h-5", selectedImage && "text-primary")} />
            {selectedImage && (
              <div className="absolute inset-0 bg-primary/20 animate-pulse" />
            )}
          </Button>
          <Link to="/voice">
            <Button
              variant="voice"
              size="icon-lg"
              className="flex-shrink-0"
            >
              <Mic className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe your farming situation..."
              className="w-full h-14 md:h-16 px-6 pr-16 rounded-2xl bg-background border-2 border-border focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-base md:text-lg font-medium"
            />
            <Button
              variant="default"
              size="icon"
              onClick={handleSend}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4 font-medium">
          🌐 <T>Supports Hindi, Marathi, Punjabi, Telugu and more languages</T>
        </p>
      </div>
    </div>

  </div >
);
}
