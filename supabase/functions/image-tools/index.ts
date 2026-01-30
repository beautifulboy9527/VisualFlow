import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ImageToolRequest {
  tool: 'inpainting' | 'upscale' | 'remove_bg' | 'scene_replace' | 'product_swap';
  imageUrl: string;
  prompt?: string;
  maskArea?: string; // For inpainting: description of area to edit
  newScene?: string; // For scene replacement
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { tool, imageUrl, prompt, maskArea, newScene }: ImageToolRequest = await req.json();

    console.log(`Processing image tool: ${tool}`);
    console.log(`Image URL: ${imageUrl?.substring(0, 100)}...`);

    // Build the prompt based on the tool
    let editPrompt = '';
    switch (tool) {
      case 'inpainting':
        editPrompt = prompt || `Edit the ${maskArea || 'specified area'} of this image. Make it look natural and seamless.`;
        break;
      case 'upscale':
        editPrompt = 'Enhance and upscale this image to higher resolution. Improve clarity, sharpness, and details while maintaining the original composition and colors. Make it look professional and high quality.';
        break;
      case 'remove_bg':
        editPrompt = 'Remove the background from this image and replace it with a clean, pure white background. Keep only the main subject/product with crisp edges.';
        break;
      case 'scene_replace':
        editPrompt = newScene 
          ? `Replace the background/scene with: ${newScene}. Keep the main product/subject intact and blend it naturally into the new scene.`
          : 'Replace the background with a professional studio setting. Keep the main subject intact.';
        break;
      case 'product_swap':
        editPrompt = prompt || 'Keep the scene and lighting exactly the same, but modify the product as specified.';
        break;
      default:
        throw new Error(`Unknown tool: ${tool}`);
    }

    console.log(`Edit prompt: ${editPrompt}`);

    // Call Lovable AI Gateway for image editing
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: editPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI Gateway error: ${response.status} - ${errorText}`);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Rate limit exceeded. Please try again later." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Credits exhausted. Please add credits to continue." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the generated image
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

    if (!generatedImage) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image was generated. Please try again with a different prompt.");
    }

    return new Response(JSON.stringify({ 
      success: true, 
      imageUrl: generatedImage,
      message: textResponse || `${tool} completed successfully`
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Image tool error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
