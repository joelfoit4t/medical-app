
import { GoogleGenAI } from "@google/genai";

// getSmartSchedulingSuggestion: Asks Gemini for optimal emergency consultation slots
export const getSmartSchedulingSuggestion = async (
  currentDate: string,
  appointments: any[]
): Promise<string> => {
  try {
    // Initialize Gemini API with the required process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      I am a medical scheduler. Here are the appointments for ${currentDate}:
      ${JSON.stringify(appointments)}
      
      Please suggest 3 optimal time slots for a 30-minute emergency consultation today between 09:00 and 15:00.
      Format the output as a simple HTML list with <ul> and <li> tags. Do not include markdown code blocks.
    `;

    // Using gemini-3-flash-preview for the basic text-based reasoning task of scheduling
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Access the text property directly from the response as per current SDK guidelines
    return response.text || "No suggestions available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to contact AI service. Please check your connection.";
  }
};
