import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartSchedulingSuggestion = async (
  currentDate: string,
  appointments: any[]
): Promise<string> => {
  try {
    const prompt = `
      I am a medical scheduler. Here are the appointments for ${currentDate}:
      ${JSON.stringify(appointments)}
      
      Please suggest 3 optimal time slots for a 30-minute emergency consultation today between 09:00 and 15:00.
      Format the output as a simple HTML list with <ul> and <li> tags. Do not include markdown code blocks.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No suggestions available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to contact AI service. Please check your connection.";
  }
};