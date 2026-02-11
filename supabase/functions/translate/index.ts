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
    const { text, targetLang } = await req.json();
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_TRANSLATE_API_KEY");

    if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_TRANSLATE_API_KEY is not configured");
    }

    if (!text || !targetLang || targetLang === "en") {
      return new Response(JSON.stringify({ translatedText: text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Translating to ${targetLang}: "${text.substring(0, 50)}..."`);

    // Use Google Cloud Translation API
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: "en",
          format: "text",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Translate API error:", response.status, errorText);
      return new Response(JSON.stringify({ translatedText: text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const translatedText = data.data?.translations?.[0]?.translatedText || text;

    console.log(`Translation success: "${translatedText.substring(0, 50)}..."`);

    return new Response(JSON.stringify({ translatedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
