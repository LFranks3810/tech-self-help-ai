import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

// Initialize Gemini Client
const ai = new GoogleGenAI();

// Knowledge Base Articles (All 3 Included)
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
  },
  {
    id: 'kb-3',
    category: 'HARDWARE',
    title: 'Wi-Fi & Network Adapter Troubleshooting',
    content: 'Restart your wireless adapter, flush DNS configurations via command prompt, and ensure your DHCP lease is renewed.'
  }
];

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

app.get('/api/kb', (req, res) => {
  res.json(kbArticles);
});

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
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
    });

    // Ensure we handle response text safely
    const replyText = response.text || (response.candidates?.[0]?.content?.parts?.[0]?.text) || 'No text returned from model.';
    res.json({ reply: replyText });
  } catch (error) {
    console.error('API Error Details:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI response.' });
  }
});
You are the SentriForge IT Support Assistant. Provide concise, helpful IT troubleshooting steps based on the provided internal Knowledge Base context. If the issue is not covered in the Knowledge Base, provide clear standard IT troubleshooting guidelines.

Internal Knowledge Base Context:
${kbContext}

User Query: ${prompt}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
    });

    // Ensure we handle response text safely
    const replyText = response.text || (response.candidates?.[0]?.content?.parts?.[0]?.text) || 'No text returned from model.';
    res.json({ reply: replyText });
  } catch (error) {
    console.error('API Error Details:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI response.' });
  }
});
You are the SentriForge IT Support Assistant. Provide concise, helpful IT troubleshooting steps based on the provided internal Knowledge Base context. If the issue is not covered in the Knowledge Base, provide clear standard IT troubleshooting guidelines.

Internal Knowledge Base Context:
${kbContext}

User Query: ${prompt}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI response.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SentriForge server running on port ${PORT}`);
});