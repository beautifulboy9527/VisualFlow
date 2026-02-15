import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { thumbnails } = await req.json();

    if (!thumbnails || !Array.isArray(thumbnails) || thumbnails.length === 0) {
      throw new Error('No thumbnails provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Classifying ${thumbnails.length} images`);

    const imageContent = thumbnails.map((thumb: string, i: number) => ({
      type: "image_url" as const,
      image_url: { url: thumb }
    }));

    const systemPrompt = `You are an image classifier for e-commerce product photos. Classify each image into exactly ONE category.

Categories:
- main: Hero/front product shot, clean background, product centered
- angle: Product from different angles (side, back, top)
- detail: Close-up of texture, material, stitching, label
- lifestyle: Product in use/scene, styled environment
- model: Person wearing/holding/using the product
- packaging: Box, bag, gift wrap, unboxing

Rules:
- If a person is prominently featured → model
- If it's a close-up/macro shot → detail  
- If product is in a styled scene without a person → lifestyle
- If showing the box/packaging → packaging
- Default to angle if uncertain

Return ONLY a JSON array of category strings, one per image, in order.
Example for 3 images: ["main","model","detail"]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: `Classify these ${thumbnails.length} product images. Return a JSON array of ${thumbnails.length} category strings.` },
              ...imageContent
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error('No content in AI response');

    let categories: string[];
    try {
      const match = content.match(/\[[\s\S]*\]/);
      categories = match ? JSON.parse(match[0]) : [];
    } catch {
      console.error('Failed to parse categories:', content);
      categories = [];
    }

    // Validate and normalize
    const validTypes = ['main', 'angle', 'detail', 'lifestyle', 'model', 'packaging'];
    categories = categories.map(c => validTypes.includes(c) ? c : 'angle');

    // Pad if AI returned fewer than expected
    while (categories.length < thumbnails.length) {
      categories.push('angle');
    }

    console.log('Classifications:', categories);

    return new Response(
      JSON.stringify({ success: true, categories }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('classify-images error:', msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
