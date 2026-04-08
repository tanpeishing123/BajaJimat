import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const CROP_REQUIREMENTS: Record<string, { n: number; p: number; k: number; mg: number }> = {
  musang_king_durian: { n: 180, p: 60, k: 240, mg: 40 },
  kelapa_sawit:       { n: 120, p: 50, k: 160, mg: 30 },
  padi:               { n: 90,  p: 30, k: 60,  mg: 15 },
  sayur_sayuran:      { n: 100, p: 40, k: 80,  mg: 20 },
  getah:              { n: 80,  p: 35, k: 100, mg: 20 },
  pisang:             { n: 120, p: 40, k: 200, mg: 25 },
  nanas:              { n: 80,  p: 35, k: 120, mg: 15 },
  jagung:             { n: 150, p: 50, k: 100, mg: 20 },
  koko:               { n: 120, p: 35, k: 150, mg: 25 },
  kelapa:             { n: 90,  p: 30, k: 160, mg: 20 },
  rubber:             { n: 80,  p: 35, k: 100, mg: 20 },
  oil_palm:           { n: 120, p: 50, k: 160, mg: 30 },
  paddy:              { n: 90,  p: 30, k: 60,  mg: 15 },
  rice:               { n: 90,  p: 30, k: 60,  mg: 15 },
  durian:             { n: 180, p: 60, k: 240, mg: 40 },
  vegetables:         { n: 100, p: 40, k: 80,  mg: 20 },
  vegetable:          { n: 100, p: 40, k: 80,  mg: 20 },
  banana:             { n: 120, p: 40, k: 200, mg: 25 },
  pineapple:          { n: 80,  p: 35, k: 120, mg: 15 },
  corn:               { n: 150, p: 50, k: 100, mg: 20 },
  maize:              { n: 150, p: 50, k: 100, mg: 20 },
  cocoa:              { n: 120, p: 35, k: 150, mg: 25 },
  coconut:            { n: 90,  p: 30, k: 160, mg: 20 },
  sawit:              { n: 120, p: 50, k: 160, mg: 30 },
}
const CROP_OPTIMAL_PPM: Record<string, { n: number; p: number; k: number }> = {
  musang_king_durian: { n: 150, p: 40, k: 200 },
  kelapa_sawit:       { n: 120, p: 35, k: 160 },
  padi:               { n: 80,  p: 25, k: 80  },
  sayur_sayuran:      { n: 100, p: 30, k: 100 },
  getah:              { n: 80,  p: 30, k: 100 },
  pisang:             { n: 100, p: 30, k: 150 },
  nanas:              { n: 70,  p: 25, k: 90  },
  jagung:             { n: 120, p: 35, k: 80  },
  koko:               { n: 100, p: 25, k: 120 },
  kelapa:             { n: 80,  p: 25, k: 130 },

  // English versions
  rubber:   { n: 80,  p: 30, k: 100 },
  oil_palm: { n: 120, p: 35, k: 160 },
  paddy:    { n: 80,  p: 25, k: 80  },
  rice:     { n: 80,  p: 25, k: 80  },
  durian:   { n: 150, p: 40, k: 200 },
  banana:   { n: 100, p: 30, k: 150 },
  pineapple:{ n: 70,  p: 25, k: 90  },
  corn:     { n: 120, p: 35, k: 80  },
  cocoa:    { n: 100, p: 25, k: 120 },
  coconut:  { n: 80,  p: 25, k: 130 },
}

// Soil type adjustment factors
const SOIL_TYPE_ADJUSTMENTS: Record<string, { n: number; p: number; k: number }> = {
  mineral:  { n: 1.0, p: 1.0, k: 1.0 },
  peat:     { n: 0.8, p: 1.2, k: 1.5 }, // peat locks K, needs more
  clay:     { n: 1.0, p: 1.3, k: 0.9 }, // clay locks P, needs more
  sandy:    { n: 1.2, p: 1.0, k: 1.3 }, // sandy leaches N and K
  alluvial: { n: 1.0, p: 1.1, k: 1.0 },
}



function normalizeCropKey(crop_type: string): string {
  return crop_type.toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .replace(/[^a-z_]/g, "")
}

// Get crop requirements from AI if not in hardcoded list
async function getCropRequirementsFromAI(crop_type: string, gemini_key: string): Promise<{ n: number; p: number; k: number }> {
  try {
    const prompt = `You are an agricultural expert for Malaysian tropical crops.
What are the NPK fertiliser requirements in kg per hectare per year for ${crop_type} grown in Malaysia?

Return ONLY valid JSON, no markdown:
{
  "n": <number kg/ha/year>,
  "p": <number kg/ha/year>,
  "k": <number kg/ha/year>
}

Base your answer on Malaysian DOA recommendations.
If unsure, use these typical Malaysian crop values as reference:
- Most fruit trees: N=100-180, P=40-60, K=150-240
- Most vegetables: N=80-120, P=30-50, K=80-120
- Most field crops: N=80-150, P=30-50, K=60-120`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${gemini_key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )
    const data = await res.json()
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    raw = raw.replace(/```json|```/g, "").trim()
    const result = JSON.parse(raw)
    return {
      n: Number(result.n) || 120,
      p: Number(result.p) || 40,
      k: Number(result.k) || 150,
    }
  } catch {
    // Fallback to default if AI fails
    return { n: 120, p: 40, k: 150 }
  }
}

function normalizeSoilInput(body: any): { n_ppm: number; p_ppm: number; k_ppm: number; mg_ppm: number } {
  const cropKey = normalizeCropKey(body.crop_type ?? "padi")

  if (body.input_mode === "manual" || body.input_mode === "soil_report") {
    return {
      n_ppm: Number(body.soil_npk?.n_ppm ?? 0),
      p_ppm: Number(body.soil_npk?.p_ppm ?? 0),
      k_ppm: Number(body.soil_npk?.k_ppm ?? 0),
      mg_ppm: Number(body.soil_npk?.mg_ppm ?? 0),
    }
  }

  if (body.input_mode === "leaf_photo") {
    const baseline = CROP_OPTIMAL_PPM[cropKey] ?? { n: 100, p: 30, k: 120 }
    const deficiencies: any[] = body.leaf_result?.deficiencies ?? []
    const getDeficit = (nutrient: string) => {
      const d = deficiencies.find((x: any) => x.nutrient === nutrient)
      return d ? d.estimated_deficit_pct / 100 : 0
    }
    return {
      n_ppm: baseline.n * (1 - getDeficit("nitrogen")),
      p_ppm: baseline.p * (1 - getDeficit("phosphorus")),
      k_ppm: baseline.k * (1 - getDeficit("potassium")),
      mg_ppm: 0,
    }
  }

  throw new Error(`Unknown input_mode: ${body.input_mode}`)
}

// Liming recommendation based on pH
function getLimingRecommendation(ph: number | null, farm_size_ha: number, lang: string) {
  if (!ph || ph >= 6.0) return null

  const lime_kg_per_ha = ph < 4.5 ? 1500 : ph < 5.0 ? 1000 : 500
  const total_lime_kg = lime_kg_per_ha * farm_size_ha
  const bags = Math.ceil(total_lime_kg / 25)
  const cost = bags * 22

  return {
    name: lang === "bm" ? "Kapur Dolomit" : "Dolomite Lime",
    bags,
    price_per_bag: 22,
    subtotal_rm: cost,
    is_liming: true,
    is_separate: true,
    reason: lang === "bm"
      ? `pH tanah ${ph} terlalu rendah (optimum 6.0-6.5). Kapur diperlukan sebelum membaja.`
      : `Soil pH ${ph} is too low (optimum 6.0-6.5). Liming needed before fertilising.`
  }
}


// Greedy LP solver
function solveLP(fertilisers: any[], n_deficit: number, p_deficit: number, k_deficit: number): any[] {
  const remaining = [n_deficit, p_deficit, k_deficit]
  const allocation: number[] = new Array(fertilisers.length).fill(0)
  const nutrients = fertilisers.map(f => [f.n_pct / 100, f.p_pct / 100, f.k_pct / 100])
  const costs = fertilisers.map(f => f.price_per_bag_rm / f.bag_weight_kg)

  for (let iter = 0; iter < 30; iter++) {
    let improved = false
    for (let j = 0; j < 3; j++) {
      if (remaining[j] < 0.5) continue
      let bestI = -1
      let bestRate = Infinity
      for (let i = 0; i < fertilisers.length; i++) {
        if (nutrients[i][j] <= 0) continue
        const rate = costs[i] / nutrients[i][j]
        if (rate < bestRate) { bestRate = rate; bestI = i }
      }
      if (bestI === -1) continue
      const kgNeeded = remaining[j] / nutrients[bestI][j]
      const kgToAdd = Math.min(kgNeeded, 5000)
      if (kgToAdd < 0.1) continue
      allocation[bestI] += kgToAdd
      improved = true
      for (let jj = 0; jj < 3; jj++) {
        remaining[jj] = Math.max(0, remaining[jj] - kgToAdd * nutrients[bestI][jj])
      }
    }
    if (!improved) break
  }
  return allocation
}

function buildVoiceSummary(recommendations: any[], total_cost: number, savings: number, lang: string): string {
  if (recommendations.filter(r => !r.is_liming).length === 0) {
    return lang === "bm"
      ? "Tanah anda sudah mencukupi nutrien untuk tanaman ini. Tahniah!"
      : "Your soil already has sufficient nutrients for this crop. Congratulations!"
  }
  const bagWord = (n: number) => lang === "bm" ? "beg" : n === 1 ? "bag" : "bags"
  const and = lang === "bm" ? "dan" : "and"
  const npkRecs = recommendations.filter(r => !r.is_liming)
  const itemStrings = npkRecs.map((r, i) => {
    const isLast = i === npkRecs.length - 1
    const connector = i === 0 ? "" : isLast ? ` ${and} ` : ", "
    return `${connector}${r.bags} ${bagWord(r.bags)} ${r.name}`
  })
  return lang === "bm"
    ? `Ladang anda memerlukan ${itemStrings.join("")}. Jumlah kos ialah RM${total_cost}. Anda jimat RM${savings} berbanding baja NPK premium.`
    : `Your farm needs ${itemStrings.join("")}. Total cost is RM${total_cost}. You save RM${savings} compared to a premium NPK blend.`
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors })

  try {
    const body = await req.json()
    const { crop_type, farm_size_ha, input_mode, lang = "bm", soil_type = "mineral", ph } = body

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY") ?? ""

    // Step 1: Get crop requirements
    const cropKey = normalizeCropKey(crop_type ?? "padi")
    let req_crop = CROP_REQUIREMENTS[cropKey]

    // If crop not in hardcoded list, ask AI
    if (!req_crop && crop_type && GEMINI_KEY) {
  const aiReq = await getCropRequirementsFromAI(crop_type, GEMINI_KEY)
  req_crop = { ...aiReq, mg: 20 } // add default mg
} else if (!req_crop) {
  req_crop = { n: 120, p: 40, k: 150, mg: 20 } // default with mg
}
    // Step 2: Apply soil type adjustments
    const soilAdj = SOIL_TYPE_ADJUSTMENTS[soil_type] ?? SOIL_TYPE_ADJUSTMENTS.mineral
    const adjusted_req = {
      n: req_crop.n * soilAdj.n,
      p: req_crop.p * soilAdj.p,
      k: req_crop.k * soilAdj.k,
      mg: req_crop.mg ?? 20,
    }

    // Step 3: Normalize soil input
    const soil = normalizeSoilInput(body)

    // Step 4: Load fertiliser prices from DB
    const { data: fertilisers, error: dbErr } = await supabase
      .from("fertiliser_prices")
      .select("*")
      .eq("is_active", true)

    if (dbErr || !fertilisers) throw new Error("Could not load fertiliser prices")

    // Step 5: Calculate deficits
    const n_deficit = Math.max(0, (adjusted_req.n - soil.n_ppm * 2) * farm_size_ha)
    const p_deficit = Math.max(0, (adjusted_req.p - soil.p_ppm * 2) * farm_size_ha)
    const k_deficit = Math.max(0, (adjusted_req.k - soil.k_ppm * 2) * farm_size_ha)
    const mg_deficit = soil.mg_ppm > 0 
  ? Math.max(0, (adjusted_req.mg - soil.mg_ppm * 2) * farm_size_ha)
  : 0  // skip Mg calculation if no data provided

    // Step 6: Liming recommendation
    const ph_value = ph ?? body.soil_npk?.ph ?? null
    const liming = getLimingRecommendation(ph_value, farm_size_ha, lang)
    // Mg recommendation
let mg_recommendation = null
if (mg_deficit > 0 && soil.mg_ppm > 0) {
  const kieserite_kg = mg_deficit / 0.17
  const bags = Math.ceil(kieserite_kg / 25)
  const cost = bags * 48
  mg_recommendation = {
    name: lang === "bm" ? "Kieserit (MgSO4)" : "Kieserite (MgSO4)",
    bags,
    price_per_bag: 48,
    subtotal_rm: cost,
    is_mg: true,
    reason: lang === "bm"
      ? `Magnesium tanah ${soil.mg_ppm} ppm — di bawah paras optimum.`
      : `Soil Magnesium ${soil.mg_ppm} ppm — below optimum level.`
  }
}


    // Step 8: Handle no deficit
    if (n_deficit === 0 && p_deficit === 0 && k_deficit === 0) {
      const recommendations = liming ? [liming] : []
      const voice = lang === "bm"
        ? "Tanah anda sudah mencukupi nutrien NPK. Tahniah!"
        : "Your soil NPK is sufficient. Congratulations!"
      return new Response(JSON.stringify({
        success: true,
        recommendations,
        total_cost_rm: liming?.subtotal_rm ?? 0,
        savings_rm: 0,
        n_deficit_kg: 0, p_deficit_kg: 0, k_deficit_kg: 0,
        input_mode, confidence: "high",
        voice_summary: voice,
        crop_requirements_source: CROP_REQUIREMENTS[cropKey] ? "database" : "ai"
      }), { headers: { ...cors, "Content-Type": "application/json" } })
    }

    // Step 9: Run LP solver
    const allocation = solveLP(fertilisers, n_deficit, p_deficit, k_deficit)

    // Step 10: Build recommendations
    const recommendations: any[] = []
    let total_cost = 0

    // Add liming first if needed
    if (liming) {
      recommendations.push(liming)
    }

    if (mg_recommendation) {
  recommendations.push(mg_recommendation)
  total_cost += mg_recommendation.subtotal_rm
}

    for (let i = 0; i < fertilisers.length; i++) {
      const kg = allocation[i]
      if (kg < 1) continue
      const bags = Math.ceil(kg / fertilisers[i].bag_weight_kg)
      const subtotal = bags * fertilisers[i].price_per_bag_rm
      total_cost += subtotal
      const displayName = lang === "bm" && fertilisers[i].name_bm
        ? fertilisers[i].name_bm
        : fertilisers[i].name
      recommendations.push({
        name: displayName,
        brand: fertilisers[i].brand ?? "",
        kg_needed: Math.round(kg),
        bags,
        price_per_bag: fertilisers[i].price_per_bag_rm,
        subtotal_rm: subtotal,
      })
    }

    total_cost = Math.round(total_cost * 100) / 100

    // Step 11: Savings vs premium NPK
    const total_nutrient_kg = n_deficit + p_deficit + k_deficit
    const premium_bags = Math.ceil(total_nutrient_kg / (25 * 0.45))
    const savings_rm = Math.max(0, Math.round(premium_bags * 95 - total_cost))

    // Step 12: Voice summary
    const voice_summary = buildVoiceSummary(recommendations, total_cost, savings_rm, lang)

    // Step 13: Confidence
    const confidence = body.soil_npk?.confidence ?? body.leaf_result?.confidence ?? "high"

    // Step 14: Save to DB async
    supabase.from("soil_reports").insert({
      input_mode,
      n_ppm: soil.n_ppm,
      p_ppm: soil.p_ppm,
      k_ppm: soil.k_ppm,
      extraction_confidence: confidence,
      raw_gemini_response: body.leaf_result ?? null,
    }).select().then(({ data }) => {
      if (data?.[0]?.id) {
        supabase.from("optimization_results").insert({
          soil_report_id: data[0].id,
          recommendations,
          total_cost_rm: total_cost,
          savings_rm,
          n_deficit_kg: Math.round(n_deficit),
          p_deficit_kg: Math.round(p_deficit),
          k_deficit_kg: Math.round(k_deficit),
          mg_deficit_kg: Math.round(mg_deficit),
        })
      }
    })

    return new Response(JSON.stringify({
      success: true,
      recommendations,
      total_cost_rm: total_cost,
      savings_rm,
      n_deficit_kg: Math.round(n_deficit),
      p_deficit_kg: Math.round(p_deficit),
      k_deficit_kg: Math.round(k_deficit),
      input_mode,
      confidence,
      voice_summary,
      liming_needed: !!liming,
      soil_type_used: soil_type,
      crop_requirements_source: CROP_REQUIREMENTS[cropKey] ? "database" : "ai",
      crop_requirements_used: adjusted_req,
    }), { headers: { ...cors, "Content-Type": "application/json" } })

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } })
  }
})
