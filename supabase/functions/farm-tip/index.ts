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

    const { crop_type, lang, month } = await req.json();

    const currentMonth = month || new Date().toLocaleString('en-US', { month: 'long' });
    const language = lang === 'bm' ? 'Bahasa Malaysia' : 'English';
    const langInstruction = lang === 'bm' ? 'Reply in Bahasa Malaysia.' : 'Reply in English.';

    const prompt = `You are a Malaysian agricultural expert. For a farmer growing ${crop_type || 'general crop'} in Malaysia, give ONE practical farming tip for ${currentMonth}. Focus on timing of fertiliser application, watering, pest watch, or harvesting. Keep it under 15 words. ${langInstruction} Do not say 'no tip available'.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: 'You are a practical Malaysian agriculture advisor. Give brief, actionable tips.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errText = await response.text();
      throw new Error(`AI gateway error: ${errText}`);
    }

    const aiData = await response.json();
    const tip = aiData.choices?.[0]?.message?.content?.trim() || '';

    return new Response(JSON.stringify({ tip, month }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
