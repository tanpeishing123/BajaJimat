import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Crop nutrient requirements (kg/ha)
const CROP_REQUIREMENTS: Record<string, { n: number; p: number; k: number }> = {
  musang_king_durian: { n: 200, p: 60, k: 250 },
  durian: { n: 200, p: 60, k: 250 },
  oil_palm: { n: 150, p: 40, k: 200 },
  rubber: { n: 100, p: 30, k: 120 },
  cocoa: { n: 120, p: 35, k: 150 },
  rice: { n: 120, p: 40, k: 80 },
  coconut: { n: 90, p: 30, k: 160 },
  pepper: { n: 140, p: 50, k: 180 },
  default: { n: 150, p: 45, k: 180 },
};

// Fertilizer products
const FERTILIZERS = [
  { name: 'Urea', n_pct: 46, p_pct: 0, k_pct: 0, bag_kg: 50, price: 42.0 },
  { name: 'Triple Superphosphate (TSP)', n_pct: 0, p_pct: 46, k_pct: 0, bag_kg: 50, price: 60.0 },
  { name: 'Muriate of Potash (MOP)', n_pct: 0, p_pct: 0, k_pct: 60, bag_kg: 50, price: 60.0 },
];

// Premium NPK blend price for savings comparison
const PREMIUM_NPK_PRICE_PER_HA = 380.0;

function ppmToKgHa(ppm: number): number {
  // Approximate: ppm in top 20cm soil → kg/ha
  // Bulk density ~1.3, depth 0.2m, area 10000m²
  return ppm * 1.3 * 0.2 * 10000 / 1_000_000 * 1000;
  // Simplified: ppm * 2.6
}

function solve(
  soilN: number, soilP: number, soilK: number,
  cropType: string, farmSizeHa: number, lang: string
) {
  const req = CROP_REQUIREMENTS[cropType] || CROP_REQUIREMENTS.default;

  const availN = ppmToKgHa(soilN);
  const availP = ppmToKgHa(soilP);
  const availK = ppmToKgHa(soilK);

  const defN = Math.max(0, (req.n - availN) * farmSizeHa);
  const defP = Math.max(0, (req.p - availP) * farmSizeHa);
  const defK = Math.max(0, (req.k - availK) * farmSizeHa);

  const recommendations = FERTILIZERS.map(f => {
    let neededKg = 0;
    if (f.n_pct > 0) neededKg = defN / (f.n_pct / 100);
    else if (f.p_pct > 0) neededKg = defP / (f.p_pct / 100);
    else if (f.k_pct > 0) neededKg = defK / (f.k_pct / 100);

    const bags = Math.max(0, Math.ceil(neededKg / f.bag_kg));
    return {
      name: f.name,
      bags,
      price_per_bag: f.price,
      subtotal_rm: Math.round(bags * f.price * 100) / 100,
    };
  }).filter(r => r.bags > 0);

  const totalCost = recommendations.reduce((s, r) => s + r.subtotal_rm, 0);
  const premiumCost = PREMIUM_NPK_PRICE_PER_HA * farmSizeHa;
  const savings = Math.max(0, Math.round((premiumCost - totalCost) * 100) / 100);

  // Build voice summary
  const recText = recommendations.map(r =>
    lang === 'bm'
      ? `${r.bags} beg ${r.name}`
      : `${r.bags} bag${r.bags > 1 ? 's' : ''} of ${r.name}`
  ).join(lang === 'bm' ? ', ' : ', ');

  const voiceSummary = lang === 'bm'
    ? `Ladang anda memerlukan ${recText}. Jumlah kos ialah RM${totalCost.toFixed(0)}. Anda jimat RM${savings.toFixed(0)} berbanding baja NPK premium.`
    : `Your farm needs ${recText}. Total cost is RM${totalCost.toFixed(0)}. You save RM${savings.toFixed(0)} compared to premium NPK blends.`;

  return {
    success: true,
    recommendations,
    total_cost_rm: totalCost,
    savings_rm: savings,
    n_deficit_kg: Math.round(defN),
    p_deficit_kg: Math.round(defP),
    k_deficit_kg: Math.round(defK),
    voice_summary: voiceSummary,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { input_mode, soil_npk, leaf_result, crop_type, farm_size_ha, lang } = body;

    let n = 0, p = 0, k = 0;

    if (input_mode === 'manual' || input_mode === 'soil_report') {
      n = soil_npk?.n_ppm ?? 0;
      p = soil_npk?.p_ppm ?? 0;
      k = soil_npk?.k_ppm ?? 0;
    } else if (input_mode === 'leaf_photo' && leaf_result) {
      // Convert leaf deficiency percentages to approximate ppm
      const deficiencies = leaf_result.deficiencies || [];
      const getNutrientDeficit = (nutrient: string) => {
        const d = deficiencies.find((x: any) => x.nutrient?.toLowerCase() === nutrient);
        return d ? d.estimated_deficit_pct : 0;
      };
      // If deficit is high, available ppm is low
      const baseReq = CROP_REQUIREMENTS[crop_type] || CROP_REQUIREMENTS.default;
      n = Math.round((1 - getNutrientDeficit('nitrogen') / 100) * (baseReq.n / 2.6));
      p = Math.round((1 - getNutrientDeficit('phosphorus') / 100) * (baseReq.p / 2.6));
      k = Math.round((1 - getNutrientDeficit('potassium') / 100) * (baseReq.k / 2.6));
    }

    const result = solve(n, p, k, crop_type || 'default', farm_size_ha || 1, lang || 'en');

    return new Response(JSON.stringify({
      ...result,
      input_mode: input_mode || 'manual',
      confidence: input_mode === 'leaf_photo' ? (leaf_result?.confidence || 'medium') : (soil_npk?.confidence || 'high'),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
