export const generateInsights = async (data) => {
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API key is missing. Please make sure REACT_APP_GEMINI_API_KEY is set in your .env file.');
    }
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"  
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this expense data and give 3 short insights:

Total Spent: ${data.total}
Top Spender: ${data.topSpender}
Category Breakdown: ${JSON.stringify(data.categories)}
Transactions: ${data.transactions}

Keep it short and useful.`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch insights');
    }

    const result = await response.json();
    return result?.candidates?.[0]?.content?.parts?.[0]?.text || "No insights available";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Failed to generate insights. Please try again later.";
  }
};
