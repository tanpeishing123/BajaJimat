# API Contracts — BajaJimat

## Language values
lang = "en" | "bm"
Passed in every request body. Edge Functions return all human-readable
strings in the requested language.

---

## POST /functions/v1/extract-soil
Request:
{
  "image_base64": "...",
  "mime_type": "image/jpeg",
  "lang": "bm"
}

Response (success):
{
  "n_ppm": 45,
  "p_ppm": 20,
  "k_ppm": 30,
  "ph": 6.2,
  "confidence": "high" | "medium" | "low",
  "confidence_label": "Keyakinan Tinggi" | "Confidence: High" (in requested lang)
}

Response (error):
{ "error": "not_a_soil_report" }

---

## POST /functions/v1/analyze-leaf
Request:
{
  "image_base64": "...",
  "mime_type": "image/jpeg",
  "crop_type": "musang_king_durian",
  "lang": "bm"
}

Response:
{
  "is_plant_photo": true,
  "deficiencies": [
    {
      "nutrient": "nitrogen",
      "severity": "severe",
      "estimated_deficit_pct": 60,
      "visual_evidence": "Daun bawah menguning bermula di hujung"
    }
  ],
  "overall_health": "poor",
  "confidence": "medium",
  "recommendation": "Guna baja nitrogen segera."
}

---

## POST /functions/v1/run-solver
Request:
{
  "input_mode": "soil_report" | "manual" | "leaf_photo",
  "soil_npk": { "n_ppm": 45, "p_ppm": 20, "k_ppm": 30, "confidence": "high" },
  "leaf_result": { ...analyze-leaf response... },
  "crop_type": "musang_king_durian",
  "farm_size_ha": 2.0,
  "lang": "bm"
}

Response:
{
  "success": true,
  "recommendations": [
    { "name": "Urea", "bags": 3, "price_per_bag": 42.00, "subtotal_rm": 126.00 }
  ],
  "total_cost_rm": 426.00,
  "savings_rm": 334.00,
  "n_deficit_kg": 270,
  "p_deficit_kg": 80,
  "k_deficit_kg": 420,
  "input_mode": "soil_report",
  "confidence": "high",
  "voice_summary": "Ladang anda memerlukan 3 beg Urea, 1 beg TSP,
    dan 4 beg MOP. Jumlah kos ialah RM426.
    Anda jimat RM334 berbanding baja NPK premium."
}