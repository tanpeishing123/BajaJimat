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

    const { image_base64, mime_type, lang } = await req.json();

    if (!image_base64) {
      throw new Error('image_base64 is required');
    }

    const prompt = `You are an agricultural soil report OCR system. Analyze this image.

FIRST: Determine if this image is a soil analysis report. If it is NOT a soil report (e.g. random photo, document, etc.), respond with exactly:
{"error": "not_a_soil_report"}

If it IS a soil report, extract the following values:
- Nitrogen (N) in ppm
- Phosphorus (P) in ppm  
- Potassium (K) in ppm
- Soil pH

Respond with ONLY valid JSON in this exact format:
{
  "n_ppm": <number>,
  "p_ppm": <number>,
  "k_ppm": <number>,
  "ph": <number>,
  "confidence": "high" | "medium" | "low",
  "confidence_label": "${lang === 'bm' ? 'Keyakinan Tinggi/Sederhana/Rendah' : 'Confidence: High/Medium/Low'}"
}

Set confidence based on how clearly the values could be read from the report.
The confidence_label should be in ${lang === 'bm' ? 'Bahasa Malaysia' : 'English'}.
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
          temperature: 0.1,
          maxOutputTokens: 512,
        }
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      throw new Error(`Gemini API error: ${errText}`);
    }

    const geminiData = await geminiRes.json();
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse Gemini response');
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
