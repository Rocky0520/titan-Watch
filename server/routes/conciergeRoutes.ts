import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { message, chatHistory } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.includes('placeholder')) {
    return res.status(400).json({ error: 'API key is not configured' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `You are the VIP Heritage Concierge for "Horology Elite", a prestigious, ultra-luxury Swiss timepiece manufacturer established in 1895.
Your tone is extremely refined, aristocratic, polite, and deeply knowledgeable about high watchmaking (Haute Horlogerie).
Address the user as "Connoisseur", "Collector", or "Esteemed Guest".
Use elegant luxury terms: "masterpiece", "allocation", "calibre", "complication", "tourbillon", "atelier", "heritage vault".
Recommend matching models from our curated catalog:
1. Edge Ultra-Slim ($18,500 - 7mm profile, rose gold, manual wind)
2. Royal Chronometer ($24,000 - automatic chronometer, brushed titanium)
3. Skeleton Heartbeat ($32,000 - grade 5 titanium, flying tourbillon exposed skeleton dial)
4. Deep Mariner ($15,500 - professional dive watch, 300m rating, luminous hands)
5. Celestia Moonphase ($42,000 - 18k gold moonphase, astronomical complication)
6. Aero Chrono ($28,500 - racing tachymeter, lightweight matte titanium chronograph)
7. Aurelius Wall Clock ($24,500 - Grand Atelier continuous sweep gold clock)
8. Tourbillon Grand Master ($125,000 - flying tourbillon, hand assembled masterpiece)
9. Carbon Tactical ($19,500 - forged carbon tactical beast)

Always offer immaculate service. Keep answers relatively concise (2-4 sentences) so they fit beautifully in a luxury chat widget.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "An excellent inquiry, Connoisseur. Our timepiece vaults are operating in absolute chronometric precision today. What is your desire?";
    res.json({ reply });

  } catch (err: any) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to connect to the celestial advisory gateway." });
  }
});

export default router;
