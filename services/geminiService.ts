import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: In a real app, ensure process.env.API_KEY is set.
// For this demo, we handle the case where it might be missing gracefully in the UI.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getSmartSchedulingSuggestion = async (
  currentDate: string,
  appointments: any[]
): Promise<string> => {
  if (!apiKey) {
    return "API Key not configured. Unable to fetch AI suggestions.";
  }

  try {
    const prompt = `
      I am a medical scheduler. Here are the appointments for ${currentDate}:
      ${JSON.stringify(appointments)}
      
      Please suggest 3 optimal time slots for a 30-minute emergency consultation today between 09:00 and 15:00.
      Format the output as a simple list.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No suggestions available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to contact AI service at the moment.";
  }
};
