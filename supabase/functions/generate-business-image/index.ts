// Using Deno's built-in serve function (no import needed)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const businessPrompts: Record<string, string> = {
  dairy: "A prosperous Indian dairy farm in the future, modern white cowshed with solar panels on roof, happy healthy cows, automatic milking machines, green pastures, traditional farmer family proud of their farm, warm sunrise lighting, photorealistic, rural India setting",
  poultry: "A successful modern poultry farm in rural India, clean organized chicken houses, free-range chickens, solar-powered ventilation, farmer collecting eggs, lush green surroundings, professional farm setup, warm golden hour lighting, photorealistic",
  organic: "A flourishing organic farm in India, diverse vegetable fields without chemicals, farmer using natural compost, certification sign visible, biodiversity with bees and butterflies, traditional farming wisdom meets modern sustainability, sunrise over healthy crops, photorealistic",
  "cold-storage": "A modern cold storage facility in rural India, large warehouse with refrigeration units, farmers delivering fresh vegetables in trucks, loading dock with workers, solar panels providing power, professional agricultural infrastructure, daytime, photorealistic",
  machinery: "An agricultural machinery rental business in India, tractors and harvesters lined up, farmer entrepreneur with equipment fleet, service workshop visible, customers inspecting machines, prosperous rural business setting, warm lighting, photorealistic",
  processing: "A food processing unit in rural India, clean production facility, workers packaging organic products, brand packaging visible, quality control setup, small-scale agribusiness success story, modern equipment with traditional products, photorealistic"
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = businessPrompts[businessId] || businessPrompts.dairy;
    console.log("Generating image for business:", businessId);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Image generation error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Image generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("Image generated successfully");

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Generate image error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
