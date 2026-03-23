import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const { image_base64, mime_type, lang } = await req.json();

    if (!image_base64) {
      throw new Error('image_base64 is required');
    }

    const systemPrompt = `You are an agricultural soil report OCR system. You extract nutrient values from soil analysis reports. Always respond with ONLY valid JSON, no other text.`;

    const userPrompt = `Analyze this image.

FIRST: Determine if this image is a soil analysis report. If it is NOT a soil report (e.g. random photo, document, etc.), respond with exactly:
{"error": "not_a_soil_report"}

If it IS a soil report, extract the following values:
- Nitrogen (N) in ppm
- Phosphorus (P) in ppm  
- Potassium (K) in ppm
- Soil pH
- Magnesium (Mg) in ppm — if shown in cmol/kg or meq/100g, multiply by 243 to convert to ppm. If not found, set to null.

Respond with ONLY valid JSON in this exact format:
{
  "n_ppm": <number>,
  "p_ppm": <number>,
  "k_ppm": <number>,
  "ph": <number>,
  "mg_ppm": <number or null>,
  "confidence": "high" | "medium" | "low",
  "confidence_label": "${lang === 'bm' ? 'Keyakinan Tinggi/Sederhana/Rendah' : 'Confidence: High/Medium/Low'}"
}

Set confidence based on how clearly the values could be read from the report.
The confidence_label should be in ${lang === 'bm' ? 'Bahasa Malaysia' : 'English'}.`;

    const dataUrl = `data:${mime_type || 'image/jpeg'};base64,${image_base64}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errText = await response.text();
      throw new Error(`AI gateway error: ${errText}`);
    }

    const aiData = await response.json();
    const text = aiData.choices?.[0]?.message?.content || '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (parsed.error === 'not_a_soil_report') {
      return new Response(JSON.stringify({ error: 'not_a_soil_report' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
