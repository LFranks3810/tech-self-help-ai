import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Setup directory pathing for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname)); // Serve index.html and static files

// Initialize Gemini Client explicitly with the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Knowledge Base Data Store
const kbArticles = [
  {
    id: 'kb-1',
    category: 'ACCESS',
    title: 'Active Directory Password Reset',
    content: 'Use the self-service portal or contact IT administrators to reset corporate credentials securely.'
  },
  {
    id: 'kb-2',
    category: 'NETWORK',
    title: 'VPN Connection Failure & MFA',
    content: 'Verify your Microsoft Authenticator push notification token and re-authenticate your secure tunnel session.'
  }
];

// Helper: Query matching KB context
function findRelevantKB(userQuery) {
  const queryLower = userQuery.toLowerCase();
  const matches = kbArticles.filter(art => 
    art.title.toLowerCase().includes(queryLower) || 
    art.content.toLowerCase().includes(queryLower) ||
    art.category.toLowerCase().includes(queryLower)
  );

  if (matches.length === 0) return 'No specific internal KB articles found for this issue.';

  return matches.map(art => `[${art.category}] ${art.title}: ${art.content}`).join('\n');
}

// API Route: Return Knowledge Base Articles
app.get('/api/kb', (req, res) => {
  res.json(kbArticles);
});

// API Route: Gemini Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const kbContext = findRelevantKB(prompt);

    const fullPrompt = `
You are the SentriForge IT Support Assistant. Provide concise, helpful IT troubleshooting steps based on the provided internal Knowledge Base context. If the issue is not covered in the Knowledge Base, provide clear standard IT troubleshooting guidelines.

Internal Knowledge Base Context:
${kbContext}

User Query: ${prompt}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Failed to process AI response.' });
  }
});

app.listen(PORT, () => {
  console.log(`SentriForge server running at http://localhost:${PORT}`);
});