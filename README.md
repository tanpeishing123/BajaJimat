# 🌾 AgroMate - Precision Farming Powered by AI

**Team:** hoo lee not sheet  
**Live Deployment:** [Insert your Lovable link here, e.g., https://agromate.lovable.app/]  
**Pitch Deck:** [Insert link to your PDF, or write "Included in repository"]

---

## 📖 Project Overview

Malaysian farmers are facing a crisis: soaring fertilizer prices and unpredictable crop diseases are devastating local yields. Currently, up to 39.5% of applied nutrients wash away due to improper application, and 60% of crop yields are threatened by undiagnosed diseases. 

**AgroMate** is a mobile-first, precision farming AI built to stop this guesswork. Designed specifically for the realities of the Malaysian *ladang* (fields), AgroMate combines Google Gemini's vision capabilities with a custom Linear Programming mathematical solver to give farmers exact, actionable, and cost-saving treatments.

### ✨ Key Features
* **📸 Instant AI Diagnosis:** Powered by Google Gemini Vision. Farmers snap a photo of a sick leaf to receive a real-time disease diagnosis and targeted recovery protocol.
* **🧮 Smart LP Solver:** A custom Linear Programming engine that cross-references soil nutrient deficits with live local market prices to calculate the mathematically cheapest fertilizer combination.
* **🇲🇾 Built for the Ladang:** Seamless English to Bahasa Malaysia toggle and native Text-to-Speech Voice Readout ensure the technology is entirely accessible and hands-free for farmers in the field.

---

## 💻 Installation / Setup Guide

This project consists of a React frontend and a Supabase Edge Function backend. To run the frontend locally, ensure you have Node.js installed.

**1. Clone the repository:**
```bash
git clone [https://github.com/YOUR_USERNAME/agromate.git](https://github.com/YOUR_USERNAME/agromate.git)
cd agromate
```

**2. Install dependencies:**
```bash
npm install
```

**3. Environment Variables setup:**
For security reasons, live API keys are not committed to this public repository. Create a `.env` file in the root directory and add your keys:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*(Note to Judges: You can test the fully functional, authenticated application via our Live Deployment link at the top of this document).*

**4. Run the development server:**
```bash
npm run dev
```
The app will be running at `http://localhost:8080` (or the port specified by Vite).

**🔍 Technical Note for Judges:**
Our custom Linear Programming algorithm and API routing are handled securely on the backend. You can review the exact logic and math for our solver in this repository under the `supabase/functions/run-solver/index.ts` directory.

---

## 🛠️ Technologies Used

**Frontend**
* React 18 (Vite)
* TypeScript
* Tailwind CSS
* Built & deployed via Lovable

**Backend & Data**
* Supabase (PostgreSQL)
* Supabase Edge Functions (Deno)

**AI & External APIs**
* Google Gemini 2.0 Flash (Vision OCR and Leaf Analysis)
* Open-Meteo API (Live weather forecasting)
* Web Speech API (Native voice readout)

---

## 🚀 Future Roadmap

AgroMate is designed to scale from a localized tool into a national asset for food security.

* **Phase 1 (Current MVP):** Web app deployment featuring the LP fertilizer solver, Gemini AI leaf diagnosis, bilingual support, and voice accessibility.
* **Phase 2 (Next 6 Months):** Launch native iOS and Android mobile applications. Integrate real-time soil data APIs directly from the Department of Agriculture (DOA).
* **Phase 3 (Year 1):** Develop a Supplier Marketplace, connecting farmers directly to local fertilizer shops for immediate, optimized purchasing within the app.
* **Phase 4 (Year 2):** Implement predictive AI yield models and secure a direct government partnership with DOA Malaysia to serve as the national precision agriculture platform.

---
*Built with ❤️ for Malaysia's agricultural future.*
