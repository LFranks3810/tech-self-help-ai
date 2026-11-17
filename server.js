async function callGeminiWithRetry(promptText, modelName = 'gemini-1.5-flash', retries = 3, delay = 1000) {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptText,
      config: {
        systemInstruction: "You are SentriForge AI, an expert IT help desk and infrastructure assistant. Provide clear, technical, step-by-step troubleshooting instructions for IT issues such as network adapters, Active Directory, VPNs, and system permissions."
      }
    });
    return response.text;
  } catch (error) {
    console.warn(`Attempt with model ${modelName} failed:`, error.message);
    
    if (retries > 0) {
      console.log(`Retrying in ${delay}ms... (${retries} attempts left)`);
      await sleep(delay);
      return callGeminiWithRetry(promptText, modelName, retries - 1, delay * 2);
    }

    throw error;
  }
}
