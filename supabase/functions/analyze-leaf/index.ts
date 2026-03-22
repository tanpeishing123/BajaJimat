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
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { image_base64, mime_type, crop_type, lang } = await req.json();

    if (!image_base64) {
      throw new Error('image_base64 is required');
    }

    const langInstruction = lang === 'bm'
      ? 'Respond with all text fields in Bahasa Malaysia.'
      : 'Respond with all text fields in English.';

    const prompt = `You are an expert agricultural plant pathologist AI. Analyze this leaf/plant photo for a ${crop_type || 'crop'} plant.

FIRST: Determine if this image shows a plant or leaf. If it does NOT show a plant/leaf (e.g. random object, person, document), respond with exactly:
{"is_plant_photo": false}

If it IS a plant/leaf photo, analyze it for nutrient deficiencies and health issues.

${langInstruction}

Respond with ONLY valid JSON in this exact format:
{
  "is_plant_photo": true,
  "deficiencies": [
    {
      "nutrient": "nitrogen" | "phosphorus" | "potassium" | "magnesium" | "calcium" | "iron" | "zinc" | "manganese" | "boron",
      "severity": "mild" | "moderate" | "severe",
      "estimated_deficit_pct": <number 0-100>,
      "visual_evidence": "<description of what you see>"
    }
  ],
  "overall_health": "good" | "fair" | "poor" | "critical",
  "confidence": "high" | "medium" | "low",
  "recommendation": "<actionable advice for the farmer>"
}

Guidelines:
- List all detected deficiencies, even mild ones
- estimated_deficit_pct represents how deficient the plant appears (0=adequate, 100=completely absent)
- visual_evidence should describe specific leaf symptoms (yellowing patterns, spots, curling, etc.)
- recommendation should be practical advice a smallholder farmer can act on
- If the plant looks healthy with no deficiencies, return an empty deficiencies array with overall_health "good"
Do not include any text outside the JSON.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mime_type || 'image/jpeg',
                data: image_base64,
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      throw new Error(`Gemini API error: ${errText}`);
    }

    const geminiData = await geminiRes.json();
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse Gemini response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(parsed), {
      status: parsed.is_plant_photo === false ? 400 : 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
