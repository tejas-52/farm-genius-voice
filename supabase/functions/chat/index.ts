// Using Deno's built-in serve function (no import needed)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are KrishiMitra AI, a sustainable farming assistant for Indian farmers.

IMPORTANT: Keep responses SHORT and CONCISE. Answer in 2-4 sentences for simple questions, max 6-8 sentences for complex ones. Use bullet points sparingly.

Guidelines:
- Be practical and actionable
- Include sustainability tips when relevant
- Mention government schemes if applicable
- Suggest organic alternatives briefly
- Consider Indian farming conditions

Format rules:
- NO asterisks or hash symbols for formatting
- Use plain text only
- Bold important terms by stating them clearly
- Use numbered lists (1. 2. 3.) for steps
- Keep points short and clear

Language rules:
- Respond ONLY in the language the user is using
- DO NOT provide translations or explanations in other languages
- DO NOT add English text in parentheses after Hindi/regional language responses
- If responding in Hindi, use ONLY Hindi throughout
- Never mix languages or provide dual-language responses

Topics: crop health, pest management, soil health, water management, fertilizers, solar energy, government schemes, sustainable farming.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chat request with", messages?.length, "messages");

    // Build messages array with optional image
    const hasSystemPrompt = messages.some((m: any) => m.role === "system");
    const apiMessages = [
      ...(hasSystemPrompt ? [] : [{ role: "system", content: SYSTEM_PROMPT }]),
      ...messages.map((msg: any) => {
        if (msg.image && msg.role === "user") {
          return {
            role: "user",
            content: [
              { type: "text", text: msg.content },
              { type: "image_url", image_url: { url: msg.image } }
            ]
          };
        }
        return msg;
      })
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please check your credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response back to client");
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
