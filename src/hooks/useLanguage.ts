import { useState, useCallback } from 'react';

type Lang = 'en' | 'bm';

const dictionary: Record<string, Record<Lang, string>> = {
  app_name: { en: 'BajaJimat', bm: 'BajaJimat' },
  tagline: { en: 'Smart Fertiliser Optimizer', bm: 'Pengoptimum Baja Pintar' },
  welcome: { en: 'Welcome', bm: 'Selamat Datang' },
  get_started: { en: 'Get Started →', bm: 'Mulakan →' },
  your_name: { en: 'Your Name', bm: 'Nama Anda' },
  crop_type: { en: 'Crop Type', bm: 'Jenis Tanaman' },
  farm_size: { en: 'Farm Size (hectares)', bm: 'Saiz Ladang (hektar)' },
  select_language: { en: 'Select Language', bm: 'Pilih Bahasa' },
  soil_report: { en: 'Soil Report', bm: 'Laporan Tanah' },
  test_kit: { en: 'Test Kit', bm: 'Kit Ujian' },
  leaf_photo: { en: 'Leaf Photo', bm: 'Foto Daun' },
  submit_btn: { en: 'Submit', bm: 'Hantar' },
  loading: { en: 'Finding cheapest combination...', bm: 'Mencari kombinasi termurah...' },
  error_title: { en: 'Something went wrong', bm: 'Sesuatu tidak kena' },
  retry: { en: 'Retry', bm: 'Cuba Semula' },
  success_title: { en: 'No Deficits Detected!', bm: 'Tiada Kekurangan Dikesan!' },
  success_msg: { en: 'Your soil is balanced. Keep up the great work!', bm: 'Tanah anda seimbang. Teruskan usaha!' },
  hear_summary: { en: '🔊 Hear Full Summary', bm: '🔊 Dengar Ringkasan Penuh' },
  confidence: { en: 'Confidence', bm: 'Keyakinan' },
  high: { en: 'High', bm: 'Tinggi' },
  medium: { en: 'Medium', bm: 'Sederhana' },
  low: { en: 'Low', bm: 'Rendah' },
  npk_deficit: { en: 'NPK Deficit Analysis', bm: 'Analisis Kekurangan NPK' },
  savings: { en: 'Saved vs Premium Blends', bm: 'Jimat vs Baja Premium' },
  recommendations: { en: 'Recommendations', bm: 'Cadangan' },
  bags: { en: 'bags', bm: 'beg' },
  subtotal: { en: 'Subtotal', bm: 'Jumlah' },
  upload_soil: { en: 'Drag DOA report here or click to upload', bm: 'Seret laporan DOA ke sini atau klik untuk muat naik' },
  upload_leaf: { en: 'Upload a photo of your crop leaf', bm: 'Muat naik foto daun tanaman anda' },
  ai_disclaimer: { en: 'AI Visual Analysis — results are estimates only', bm: 'Analisis Visual AI — keputusan hanya anggaran' },
  nitrogen: { en: 'Nitrogen (N)', bm: 'Nitrogen (N)' },
  phosphorus: { en: 'Phosphorus (P)', bm: 'Fosforus (P)' },
  potassium: { en: 'Potassium (K)', bm: 'Kalium (K)' },
  depleted: { en: 'Depleted', bm: 'Habis' },
  deficient: { en: 'Deficient', bm: 'Kurang' },
  adequate: { en: 'Adequate', bm: 'Mencukupi' },
  sufficient: { en: 'Sufficient', bm: 'Cukup' },
  surplus: { en: 'Surplus', bm: 'Lebihan' },
  your_farm: { en: 'Your {crop} farm, {size} ha', bm: 'Ladang {crop} anda, {size} ha' },
  english: { en: 'English', bm: 'English' },
  bahasa: { en: 'Bahasa Melayu', bm: 'Bahasa Melayu' },
  musang_king: { en: 'Musang King', bm: 'Musang King' },
  oil_palm: { en: 'Oil Palm', bm: 'Kelapa Sawit' },
  paddy: { en: 'Paddy', bm: 'Padi' },
  vegetables: { en: 'Vegetables', bm: 'Sayuran' },
  rubber: { en: 'Rubber', bm: 'Getah' },
};

export function useLanguage() {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('baja_lang') as Lang) || 'en';
  });

  const t = useCallback((key: string, vars?: Record<string, string>): string => {
    let text = dictionary[key]?.[lang] || key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  }, [lang]);

  const setLanguage = useCallback((l: Lang) => {
    setLang(l);
    localStorage.setItem('baja_lang', l);
  }, []);

  return { lang, setLanguage, t };
}
