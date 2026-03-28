import { GoogleGenerativeAI } from '@google/generative-ai';

export const processChaoticInput = async (apiKey, input, category = 'Traffic Gridlock') => {
  if (!apiKey) throw new Error("API key is missing.");
  
  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `
You are Nexus Responder, an advanced AI designed to parse unstructured, chaotic real-world inputs and output structured action plans for societal benefit. 
The current focus domain is: ${category}.

Given the following chaotic input, extract relevant entities, gauge the priority level, and determine the immediate verified action steps required. 

Return strictly a JSON object with this exact structure:
{
  "priority": "Critical",
  "entities": ["array", "of", "extracted", "keywords", "or", "locations"],
  "summary": "1 sentence brief summary of the situation",
  "actionSteps": [
    {
      "step": "Short description of the action",
      "assignee": "Who or what agency should handle this"
    }
  ],
  "verified": true
}

Input data to parse:
"""
${input}
"""
`;

  // We explicitly try the absolute newest and oldest stable models since different keys map differently
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-pro"
  ];

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log("Attempting inference with model:", modelName);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
      
      // If the model is not found (404), we gracefully continue the loop to the next model
      if (!error.message.includes("404") && !error.message.includes("not found")) {
        // If it's a completely different error (like invalid prompt length, block, billing), throw immediately.
        throw new Error("Error details: " + error.message);
      }
    }
  }

  throw new Error("Your API Key did not have access to any standard Gemini models. Last Error: " + (lastError?.message || 'Unknown'));
};
