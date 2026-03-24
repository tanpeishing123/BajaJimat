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
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const { issue_name, severity, visual_evidence, crop_type, farm_size_ha, lang } = await req.json();

    if (!issue_name) throw new Error('issue_name is required');

    const langInstruction = lang === 'bm'
      ? 'Respond with all text fields in Bahasa Malaysia.'
      : 'Respond with all text fields in English.';

    const systemPrompt = `You are an expert agricultural advisor AI specializing in crop disease, pest management, and micronutrient treatment for Malaysian farms. Always respond with ONLY valid JSON, no other text.`;

    const userPrompt = `A farmer growing ${crop_type || 'crops'} on ${farm_size_ha || 2} hectares has a NON-NPK issue detected via leaf photo analysis.

Detected issue: ${issue_name}
Severity: ${severity || 'moderate'}
Visual evidence: ${visual_evidence || 'Not specified'}

${langInstruction}

Generate a treatment plan. Respond with ONLY valid JSON in this exact format:
{
  "issue_name": "${issue_name}",
  "shopping_list": [
    {
      "product_name": "<specific product or chemical name>",
      "type": "fungicide" | "insecticide" | "micronutrient" | "organic" | "supplement",
      "quantity_per_ha": "<e.g. 1 bottle, 2 kg — amount for 1 hectare>",
      "price_per_ha_rm": <number — cost for 1 hectare>,
      "application_method": "<brief how-to>"
    }
  ],
  "action_plan": [
    {
      "step": 1,
      "title": "<bold 3-4 word action title>",
      "description": "<one short sentence explaining why>",
      "timing": "<e.g. Morning Only, Immediate, Week 2>"
    }
  ],
  "prevention_tips": ["<tip1>", "<tip2>", "<tip3>"],
  "severity_assessment": "${severity || 'moderate'}",
  "expected_recovery_days": <number>
}

Guidelines:
- Include 2-4 products in the shopping list with realistic per-hectare Malaysian market prices in RM
- Provide 3-5 action steps with punchy 3-4 word titles and ONE short sentence descriptions
- Use concise timing tags like "Morning Only", "Immediate", "Week 2", "Daily"
- Include 3 prevention tips
- Be practical for a smallholder Malaysian farmer
- Use products commonly available at Malaysian agricultural supply shops`;

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
          { role: 'user', content: userPrompt },
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
    if (!jsonMatch) throw new Error('Could not parse AI response');

    const parsed = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
