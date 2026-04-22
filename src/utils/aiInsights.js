import { GoogleGenAI } from "@google/genai";

export const generateInsights = async (data) => {
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API key is missing. Please make sure REACT_APP_GEMINI_API_KEY is set in your .env file.');
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this expense data and give 3 short insights:

Total Spent: ${data.total}
Top Spender: ${data.topSpender}
Category Breakdown: ${JSON.stringify(data.categories)}
Transactions: ${data.transactions}

Keep it short and useful.`
    });

    return response.text || "No insights available";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Failed to generate insights. Please try again later.";
  }
};
