import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message content is required." });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: message,
      config: {
        systemInstruction: "You are SentriForge AI, an expert IT help desk and infrastructure assistant. Provide clear, technical, step-by-step troubleshooting instructions for IT issues."
      }
    });

    res.json({ response: response.text });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(503).json({ 
      error: "The AI service is currently busy. Please wait 30 seconds and try again." 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SentriForge server running on port ${PORT}`);
});
