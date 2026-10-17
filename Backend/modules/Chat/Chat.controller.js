import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

// ⭐ List of Gemini models to try in order. 
// If one is busy/rate-limited, it falls back to the next.
const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  // Add more variants if you have access to them
];

const SYSTEM_PROMPT = `
You are the official AI assistant for "Amir Cafe & Marriage Hall" (also known as Aamir Cafe & Bakers).
Your ONLY job is to help users with information about this specific business.

Here is the context about the business:
- We have a Cafe, Bakers (Sweets & Cakes), Fast Food, and a Marriage Hall.
- We offer Hall bookings, Deals, and Food ordering.
- We have been serving since 1985 in Bannu, Pakistan.
- Users can book the hall, order food, and track their orders on this website.

RULES:
1. You MUST politely refuse to answer questions that are NOT related to Amir Cafe & Marriage Hall. 
2. If a user asks about coding, general knowledge, other restaurants, or anything off-topic, reply: "I'm sorry, I am the assistant for Amir Cafe & Marriage Hall and can only answer questions related to our cafe, food, and hall bookings."
3. Keep answers concise, friendly, and helpful.
4. Do not make up information. If you don't know something, advise them to contact the cafe directly.
`;

export async function sendMessage(req, res) {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.json({ success: false, msg: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, msg: "Chatbot API key not configured." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Format chat history for Gemini
    const formattedHistory = (history || []).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    let lastError = null;

    // ⭐ Try each model until one works
    for (const modelName of MODELS) {
      try {
        console.log(`🤖 Trying Chatbot Model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT,
        });

        const chat = model.startChat({
          history: formattedHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const reply = response.text();

        console.log(`✅ Success with model: ${modelName}`);
        return res.json({ success: true, reply, model: modelName });
        
      } catch (error) {
        console.warn(`⚠️ Model ${modelName} failed:`, error.message);
        lastError = error;
        // Loop continues to the next model
      }
    }

    // If all models fail
    return res.status(500).json({
      success: false,
      msg: "All AI models are currently busy. Please try again in a few moments.",
      error: lastError?.message,
    });

  } catch (err) {
    console.error("Chat Controller Error:", err);
    return res.status(500).json({ success: false, msg: err.message });
  }
}