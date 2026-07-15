const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

class GeminiVoiceService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }

    async processAudioCommand(filePath) {
        try {
            // 1. Convert audio to base64
            const audioFile = fs.readFileSync(filePath);
            const base64Audio = audioFile.toString("base64");

            // 2. Initialize Model
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // 3. System Prompt
            const prompt = `You are the AI Brain of 'VoiceStore', a bilingual (Urdu/English) e-commerce store.
            **INPUT:** Audio of a user looking for products.
            **TASK:** Extract the intent and filters.
            **EXAMPLES:**
            - 'Mujhe red shoes dikhao' -> { "intent": "SEARCH", "query": "red shoes", "category": "fashion" }
            - 'Show me mobile under 50000' -> { "intent": "SEARCH", "query": "mobile", "maxPrice": 50000 }
            - 'Mera order kahan hai?' -> { "intent": "TRACK_ORDER" }
            - 'Login page par le chalo' -> { "intent": "NAVIGATE", "route": "/login" }
            - 'Home page par jao' -> { "intent": "NAVIGATE", "route": "/" }
            - 'Cart me jao' -> { "intent": "NAVIGATE", "route": "/cart" }
            **OUTPUT:** Return STRICT JSON only. No markdown. No explanations.`;

            // 4. Generate Content
            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType: "audio/webm", // Assuming webm from frontend
                        data: base64Audio
                    }
                }
            ]);

            const response = await result.response;
            const text = response.text();

            // 5. Clean & Parse JSON
            const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(jsonStr);

        } catch (error) {
            console.error("Gemini Voice Service Error:", error);
            throw new Error("Failed to process voice command");
        }
    }
}

module.exports = new GeminiVoiceService();
