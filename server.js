import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper for exponential backoff delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGeminiWithRetry(promptText, modelName = 'gemini-2.5-flash', retries = 3, delay = 1000) {
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
    
    // If it's a 503 / capacity issue and we have retries left, wait and retry
    if ((error.status === 503 || error.message?.includes('503') || error.message?.includes('overloaded')) && retries > 0) {
      console.log(`Retrying in ${delay}ms... (${retries} attempts left)`);
      await sleep(delay);
      return callGeminiWithRetry(promptText, modelName, retries - 1, delay * 2);
    }

    // If gemini-2.5-flash fails completely, fallback to gemini-2.0-flash once
    if (modelName === 'gemini-2.5-flash') {
      console.log('Falling back to gemini-2.0-flash...');
      return callGeminiWithRetry(promptText, 'gemini-2.0-flash', 2, 1000);
    }

    throw error;
  }
}

// Root route to prevent "Cannot GET /"
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

// Chat endpoint matching frontend expectation ({ message } -> { response })
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message content is required." });
    }

    const aiResponseText = await callGeminiWithRetry(message);
    res.json({ response: aiResponseText });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(503).json({ 
      error: "This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later." 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SentriForge server running on port ${PORT}`);
});
