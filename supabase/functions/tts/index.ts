import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { text, languageCode, voiceName, ssmlGender } = await req.json();
        const GOOGLE_API_KEY = Deno.env.get("GOOGLE_TRANSLATE_API_KEY"); // Using the same key if available

        if (!GOOGLE_API_KEY) {
            throw new Error("GOOGLE_API_KEY is not configured in Supabase secrets");
        }

        console.log(`Synthesizing speech (${languageCode}): "${text.substring(0, 50)}..."`);

        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: { text },
                    voice: {
                        languageCode: languageCode || "en-IN",
                        name: voiceName || (languageCode === "hi-IN" ? "hi-IN-Neural2-A" : "en-IN-Neural2-A"),
                        ssmlGender: ssmlGender || "FEMALE",
                    },
                    audioConfig: {
                        audioEncoding: "MP3",
                        speakingRate: 1.25,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Google TTS API error:", response.status, errorText);
            return new Response(JSON.stringify({ error: "Google TTS API error" }), {
                status: response.status,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const data = await response.json();
        return new Response(JSON.stringify({ audioContent: data.audioContent }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("TTS error:", error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
