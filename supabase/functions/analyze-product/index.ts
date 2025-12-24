import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls, analysisType = 'full' } = await req.json();
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error('No image URLs provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Analyzing ${imageUrls.length} images with type: ${analysisType}`);

    // Build the system prompt for product analysis
    const systemPrompt = `You are an expert e-commerce product analyst and visual designer. Analyze the product images and provide detailed insights.

Your analysis should include:
1. **Brand Recognition**: Identify brand name, logo text (Chinese and English)
2. **Product Info**: Category, product name, specifications, materials
3. **Key Selling Points**: Extract 5-8 core selling points from packaging/product features
4. **Color Palette**: Extract main colors with hex values
5. **Visual Style**: Identify design style and recommend visual approach
6. **Target Audience**: Infer target demographics
7. **Copy Suggestions**: Generate marketing copy in both Chinese and English

Return your analysis as valid JSON with this structure:
{
  "brandName": { "zh": "中文品牌名", "en": "English Brand Name" },
  "productName": { "zh": "产品名称", "en": "Product Name" },
  "category": "product category",
  "specifications": ["spec1", "spec2"],
  "sellingPoints": [
    { "zh": "卖点1", "en": "Selling Point 1", "icon": "sparkles" },
    { "zh": "卖点2", "en": "Selling Point 2", "icon": "shield" }
  ],
  "colorPalette": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex"
  },
  "visualStyle": {
    "recommended": "magazine_editorial",
    "alternatives": ["natural_organic", "tech_futuristic"],
    "reason": { "zh": "推荐理由", "en": "Recommendation reason" }
  },
  "targetAudience": { "zh": "目标人群描述", "en": "Target audience description" },
  "suggestedCopy": {
    "headline": { "zh": "主标题", "en": "Main Headline" },
    "subheadline": { "zh": "副标题", "en": "Subheadline" },
    "cta": { "zh": "行动召唤", "en": "Call to Action" },
    "features": [
      { "zh": "特性1", "en": "Feature 1" },
      { "zh": "特性2", "en": "Feature 2" }
    ]
  },
  "confidence": 0.85
}`;

    // Build messages with image content
    const imageContent = imageUrls.slice(0, 4).map((url: string) => ({
      type: "image_url",
      image_url: { url }
    }));

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Please analyze these product images and provide comprehensive insights for e-commerce visual design. Focus on identifying brand elements, key selling points, and recommending the best visual style for marketing materials.`
          },
          ...imageContent
        ]
      }
    ];

    console.log('Sending request to Lovable AI Gateway...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response received, parsing...');

    // Extract JSON from the response
    let analysis;
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return a structured fallback
      analysis = {
        brandName: { zh: "未识别", en: "Not Identified" },
        productName: { zh: "产品", en: "Product" },
        category: "general",
        sellingPoints: [],
        colorPalette: { primary: "#6366f1", secondary: "#8b5cf6", accent: "#06b6d4" },
        visualStyle: { recommended: "ai_auto", alternatives: [], reason: { zh: "AI分析中", en: "AI analyzing" } },
        targetAudience: { zh: "通用", en: "General" },
        suggestedCopy: {
          headline: { zh: "优质产品", en: "Premium Product" },
          subheadline: { zh: "", en: "" },
          cta: { zh: "立即购买", en: "Buy Now" },
          features: []
        },
        confidence: 0.5,
        rawContent: content
      };
    }

    console.log('Analysis complete:', JSON.stringify(analysis).slice(0, 200));

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error in analyze-product function:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
