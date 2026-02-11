import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Loader2,
  User,
  Bot,
  RotateCcw,
  MessageCircle,
  Square,
  Sprout,
  Navigation,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation, languages } from "@/hooks/useTranslation";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInterface extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInterface;
    webkitSpeechRecognition: new () => SpeechRecognitionInterface;
  }
}

interface ConversationItem {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function VoiceMode() {
  const navigate = useNavigate();
  const { currentLanguage } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");

  const isLLMGeneratingRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number; city?: string } | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Scroll to bottom of conversation
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  // Fetch location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Fetch Address
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            setLocation({ lat: latitude, lon: longitude, city: data.address.city || data.address.town || data.address.village || data.address.state });
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
                humidity: wData.main.humidity
              });
            } catch (e) {
              console.warn("VoiceMode weather fetch failed:", e);
            }
          }
        },
        (error) => console.warn("VoiceMode location access denied:", error)
      );
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setCurrentTranscript(transcriptText);

        if (event.results[current].isFinal) {
          handleFinalTranscript(transcriptText);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setStatus("idle");
      };
    }

    return () => {
      recognitionRef.current?.stop();
      if (audioRef.current) audioRef.current.pause();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const getMockResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes("crop") || lower.includes("unhealthy") || lower.includes("yellow")) {
      return "Based on your description, your crop might be suffering from Nitrogen Deficiency or Early Blight. Apply organic compost or vermicompost to improve soil nutrients.";
    }
    if (lower.includes("solar") || lower.includes("pump")) {
      return "Solar pumps are an excellent investment. For a 2-acre farm, a 3HP to 5HP Solar Pump is recommended. The cost is approximately 1.5 Lakhs with available subsidies.";
    }
    return "I recommend focusing on Sustainable Practices like soil health checks and water conservation. Could you provide more details?";
  };

  const getAIResponse = useCallback(async (
    text: string,
    history: ConversationItem[],
    onChunk: (chunk: string) => void,
    onDone: (fullText: string) => void
  ) => {
    const ollamaUrl = import.meta.env.VITE_OLLAMA_URL;
    const ollamaModel = import.meta.env.VITE_OLLAMA_MODEL || "llama3";
    const weatherStr = weatherData ? `, Weather: ${weatherData.temp}°C, ${weatherData.condition}, ${weatherData.humidity}% humidity` : "";
    const contextStr = `[Context: Location: ${location?.city || "Unknown"}${weatherStr}]`;

    const historyMessages = history.map(item => ({
      role: item.role,
      content: item.content
    }));

    let fullResponse = "";

    try {
      if (ollamaUrl) {
        const resp = await fetch(`${ollamaUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: ollamaModel,
            messages: [
              { role: "system", content: `You are KrishiMitra, an expert farming assistant. ${contextStr}. Respond strictly in ${currentLanguage.name}. Keep it very brief and voice-friendly.` },
              ...historyMessages,
              { role: "user", content: text }
            ],
            stream: true,
          }),
        });

        if (!resp.ok || !resp.body) throw new Error("Ollama unavailable");

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
              const content = json.message?.content;
              if (content) {
                fullResponse += content;
                onChunk(content);
              }
            } catch (e) { }
          }
        }
        onDone(fullResponse);
        return;
      }

      // Supabase fallback
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `You are KrishiMitra, an expert farming assistant. ${contextStr}. Respond strictly in ${currentLanguage.name}. Keep it brief.` },
            ...historyMessages,
            { role: "user", content: text }
          ]
        })
      });

      if (!resp.ok || !resp.body) throw new Error("Backend unavailable");
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
              if (content) {
                fullResponse += content;
                onChunk(content);
              }
            } catch { }
          }
        }
      }
      onDone(fullResponse);
    } catch (e) {
      const mock = getMockResponse(text);
      let i = 0;
      const interval = setInterval(() => {
        if (i < mock.length) {
          onChunk(mock.charAt(i));
          fullResponse += mock.charAt(i);
          i++;
        } else {
          clearInterval(interval);
          onDone(fullResponse);
        }
      }, 10);
    }
  }, [currentLanguage, weatherData, location]);

  const handleFinalTranscript = async (text: string) => {
    const userItem: ConversationItem = {
      id: Date.now().toString(),
      role: "user",
      content: text
    };
    const history = [...conversation];
    setConversation(prev => [...prev, userItem]);
    setCurrentTranscript("");
    setStatus("processing");

    const assistantId = (Date.now() + 1).toString();
    const assistantItem: ConversationItem = {
      id: assistantId,
      role: "assistant",
      content: ""
    };
    setConversation(prev => [...prev, assistantItem]);

    let accumulatedText = "";
    let sentenceBuffer = "";
    const processedSentences = new Set<string>();

    isLLMGeneratingRef.current = true;
    await getAIResponse(
      text,
      history,
      (chunk) => {
        accumulatedText += chunk;
        sentenceBuffer += chunk;
        setConversation(prev =>
          prev.map(item => item.id === assistantId ? { ...item, content: accumulatedText } : item)
        );

        const sentenceMatch = sentenceBuffer.match(/[^.!?\n]+[.!?\n]+/g);
        if (sentenceMatch) {
          for (const sentence of sentenceMatch) {
            const cleanSentence = sentence.trim();
            if (cleanSentence.length > 5 && !processedSentences.has(cleanSentence)) {
              processedSentences.add(cleanSentence);
              addToSpeechQueue(cleanSentence);
            }
          }
        }
      },
      (fullText) => {
        isLLMGeneratingRef.current = false;
        const remaining = fullText.slice(accumulatedText.length).trim();
        if (remaining.length > 0 && !processedSentences.has(remaining)) {
          addToSpeechQueue(remaining);
        } else if (speechQueueRef.current.length === 0) {
          setStatus("idle");
        }
      }
    );
  };

  const speechQueueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef(false);

  const addToSpeechQueue = useCallback((text: string) => {
    speechQueueRef.current.push(text);
    if (!isProcessingQueueRef.current) {
      processSpeechQueue();
    }
  }, []);

  const processSpeechQueue = async () => {
    if (speechQueueRef.current.length === 0) {
      isProcessingQueueRef.current = false;
      if (!isLLMGeneratingRef.current) setStatus("idle");
      return;
    }
    isProcessingQueueRef.current = true;
    const nextText = speechQueueRef.current.shift();
    if (nextText) {
      setStatus("speaking");
      await speakResponse(nextText);
      processSpeechQueue();
    }
  };

  const speakResponse = (text: string): Promise<void> => {
    return new Promise(async (resolve) => {
      let cleanText = text.replace(/[*#_~]/g, "")
        .replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, "")
        .trim();
      if (currentLanguage.code === 'hi') {
        cleanText = cleanText.replace(/KrishiMitra|KrushiMitra|Krishi mitra/gi, "कृषिमित्र");
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

      const voice = googleVoiceMap[currentLanguage.code] || googleVoiceMap.en;

      try {
        setIsSpeaking(true);
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
        audio.onended = () => { setIsSpeaking(false); resolve(); };
        audio.onerror = () => { setIsSpeaking(false); resolve(); };
        await audio.play();
      } catch (e) {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const ut = new SpeechSynthesisUtterance(cleanText);
          ut.lang = currentLanguage.code === 'en' ? 'en-IN' : `${currentLanguage.code}-IN`;
          ut.rate = 1.25;
          ut.onstart = () => setIsSpeaking(true);
          ut.onend = () => { setIsSpeaking(false); resolve(); };
          ut.onerror = () => { setIsSpeaking(false); resolve(); };
          window.speechSynthesis.speak(ut);
        } else {
          setIsSpeaking(false); resolve();
        }
      }
    });
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported");
      return;
    }
    recognitionRef.current.lang = currentLanguage.code === 'en' ? 'en-IN' : `${currentLanguage.code}-IN`;
    try {
      setCurrentTranscript("");
      setStatus("listening");
      setIsListening(true);
      recognitionRef.current.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    if (!currentTranscript) setStatus("idle");
  };

  const stopSpeaking = () => {
    speechQueueRef.current = [];
    isProcessingQueueRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setStatus("idle");
  };

  const clearConversation = () => {
    setConversation([]);
    setCurrentTranscript("");
    setStatus("idle");
  };

  const WaveAnimation = ({ active }: { active: boolean }) => (
    <div className="flex items-center justify-center gap-1.5 h-16">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "w-1.5 rounded-full",
            status === "listening" ? "bg-primary shadow-glow-accent" :
              status === "speaking" ? "bg-eco shadow-glow-eco" : "bg-white/10"
          )}
          animate={{
            height: active ? [8, 32 + Math.random() * 24, 8] : 8,
            opacity: active ? 1 : 0.3,
          }}
          transition={{
            duration: 0.5,
            repeat: active ? Infinity : 0,
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] flex flex-col pt-16 overflow-hidden">
      {/* Background Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-eco/20 rounded-full blur-[120px]"
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Voice Advisor</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                status === "listening" ? "bg-primary animate-ping" :
                  status === "speaking" ? "bg-eco animate-pulse" : "bg-white/20"
              )} />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em]",
                status === "listening" ? "text-primary" :
                  status === "speaking" ? "text-eco" : "text-white/40"
              )}>
                {status === "idle" ? "Ready" : status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <button
            onClick={() => navigate("/copilot")}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Conversation Area */}
      <main className="relative z-10 flex-1 overflow-y-auto p-6 space-y-8 flex flex-col items-center">
        {conversation.length === 0 && status === "idle" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center max-w-sm"
          >
            <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner">
              <Globe className="w-12 h-12 text-white/10" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">How can I help?</h3>
            <p className="text-white/40 text-lg leading-relaxed">
              Speak naturally in your language. I'm listening.
            </p>
          </motion.div>
        )}

        <div className="w-full max-w-2xl space-y-6">
          <AnimatePresence>
            {conversation.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex flex-col gap-2",
                  msg.role === "user" ? "items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "max-w-[90%] p-6 rounded-[2rem] text-lg font-medium",
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-none shadow-glow-accent"
                    : "bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {currentTranscript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <div className="max-w-[90%] p-6 rounded-[2rem] rounded-tr-none bg-primary/20 text-white border border-primary/30 text-lg font-medium italic opacity-70">
                {currentTranscript}...
              </div>
            </motion.div>
          )}

          {status === "processing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-white/40"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-bold uppercase tracking-widest">Thinking</span>
            </motion.div>
          )}
        </div>
        <div ref={conversationEndRef} />
      </main>

      {/* Control Panel */}
      <footer className="relative z-20 pb-12 pt-8 backdrop-blur-3xl bg-black/40 border-t border-white/10 flex flex-col items-center gap-10">
        <WaveAnimation active={status === "listening" || status === "speaking"} />

        <div className="relative">
          <AnimatePresence>
            {status !== "idle" && (
              <motion.div
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: [1, 1.2, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className={cn(
                  "absolute -inset-8 rounded-full blur-3xl opacity-30",
                  status === "listening" ? "bg-primary" :
                    status === "speaking" ? "bg-eco" : "bg-solar"
                )}
              />
            )}
          </AnimatePresence>

          <Button
            onClick={status === "idle" ? startListening : status === "listening" ? stopListening : stopSpeaking}
            className={cn(
              "relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-elevated border-4",
              status === "idle" ? "bg-white border-white text-primary hover:scale-105" :
                status === "listening" ? "bg-primary border-primary/50 text-white scale-110 active:scale-95" :
                  "bg-destructive border-destructive/50 text-white hover:bg-destructive/90"
            )}
          >
            {status === "idle" ? <Mic className="w-12 h-12" /> :
              status === "listening" ? <Mic className="w-12 h-12 animate-pulse" /> :
                <Square className="w-10 h-10" />}
          </Button>
        </div>

        <div className="flex items-center gap-12">
          <button
            onClick={clearConversation}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all hover:scale-110"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center gap-1">
            <span className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px]">
              {status === "idle" ? "TAP MICROPHONE" : "TAP TO STOP"}
            </span>
          </div>

          <button
            onClick={() => navigate("/copilot")}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      </footer>
    </div>
  );
}
