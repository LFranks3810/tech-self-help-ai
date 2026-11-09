import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
// CRITICAL: Render provides a dynamic port via process.env.PORT. Fall back to 3000 for local testing.
const PORT = process.env.PORT || 3000;

// Setup directory pathing for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname)); // Serve index.html and static files

// Initialize Gemini Client
let ai;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (err) {
  console.error('Failed to initialize GoogleGenAI client:', err);
}

// Knowledge Base Data Store
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SentriForge - IT Help Desk & Self-Service Portal</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Marked.js CDN for Markdown Parsing -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <!-- FontAwesome Icons CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">

  <!-- Header -->
  <header class="bg-slate-900 border-b border-slate-800 p-4">
    <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-shield-halved text-blue-500"></i> SentriForge
        </h1>
        <p class="text-xs text-slate-400">IT Help Desk & Self-Service Portal</p>
      </div>

      <!-- Navigation Tabs -->
      <nav class="flex flex-wrap gap-2">
        <button id="nav-chat-btn" onclick="switchTab('chat')" class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition">
          <i class="fa-solid fa-robot mr-1"></i> AI Assistant
        </button>
        <button id="nav-kb-btn" onclick="switchTab('kb')" class="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
          <i class="fa-solid fa-book mr-1"></i> Knowledge Base
        </button>
        <button id="nav-ticket-btn" onclick="switchTab('ticket')" class="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
          <i class="fa-solid fa-ticket mr-1"></i> Submit Ticket
        </button>
        <button id="nav-dashboard-btn" onclick="switchTab('dashboard')" class="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
          <i class="fa-solid fa-chart-line mr-1"></i> Dashboard
        </button>
      </nav>
    </div>
  </header>

  <!-- Main Content Area -->
  <main class="max-w-4xl mx-auto w-full flex-1 p-4 flex flex-col">

    <!-- Tab 1: AI Assistant Chat -->
    <section id="tab-chat" class="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg min-h-[500px]">
      <div class="bg-slate-900/80 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-xs text-slate-300 font-medium">SentriForge AI Assistant Online</span>
      </div>

      <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-4 max-h-[60vh]">
        <div class="flex items-start gap-3">
          <div class="bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-xs shrink-0">SF</div>
          <div class="bg-slate-800 p-3 rounded-lg max-w-md text-sm text-slate-200">
            Hello! I am your SentriForge assistant. How can I help you troubleshoot your IT issue today?
          </div>
        </div>
      </div>

      <!-- Chat Input Form -->
      <form id="chat-form" class="p-4 border-t border-slate-800 flex gap-2 bg-slate-900">
        <input type="text" id="chat-input" placeholder="Type your IT support question..." class="flex-1 px-4 py-2 text-sm text-white bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500" required>
        <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1">
          <i class="fa-solid fa-paper-plane"></i> Send
        </button>
      </form>
    </section>

    <!-- Tab 2: Knowledge Base (3 Full Articles Displayed) -->
    <section id="tab-kb" class="hidden bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <i class="fa-solid fa-book text-blue-500"></i> IT Knowledge Base
      </h2>
      <div id="kb-articles-list" class="space-y-4">
        <!-- Injected dynamically from server.js -->
      </div>
    </section>

    <!-- Tab 3: Submit Ticket -->
    <section id="tab-ticket" class="hidden bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <i class="fa-solid fa-ticket text-blue-500"></i> Submit Support Ticket
      </h2>
      <form id="ticket-form" class="space-y-4" onsubmit="handleTicketSubmit(event)">
        <div>
          <label class="block text-xs text-slate-400 mb-1">Issue Subject</label>
          <input type="text" id="ticket-subject" placeholder="Brief summary of the issue" class="w-full px-4 py-2 text-sm text-white bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500" required>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Category</label>
          <select id="ticket-category" class="w-full px-4 py-2 text-sm text-white bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500">
            <option value="ACCESS">Access & Credentials</option>
            <option value="NETWORK">Network & Wi-Fi / VPN</option>
            <option value="HARDWARE">Hardware & Peripherals</option>
            <option value="SOFTWARE">Software & Applications</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Description</label>
          <textarea id="ticket-desc" rows="4" placeholder="Detailed steps or symptoms..." class="w-full px-4 py-2 text-sm text-white bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500" required></textarea>
        </div>
        <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
          Submit Ticket
        </button>
      </form>
      <div id="ticket-success" class="hidden mt-4 p-3 bg-emerald-950 border border-emerald-800 text-emerald-200 text-sm rounded-lg">
        Ticket successfully submitted! Our IT team will review it shortly.
      </div>
    </section>

    <!-- Tab 4: Dashboard -->
    <section id="tab-dashboard" class="hidden bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <i class="fa-solid fa-chart-line text-blue-500"></i> Support Dashboard & Metrics
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-slate-950 p-4 border border-slate-800 rounded-lg text-center">
          <p class="text-xs text-slate-400">Active Incidents</p>
          <p class="text-2xl font-bold text-blue-500 mt-1">2</p>
        </div>
        <div class="bg-slate-950 p-4 border border-slate-800 rounded-lg text-center">
          <p class="text-xs text-slate-400">Resolved Today</p>
          <p class="text-2xl font-bold text-emerald-500 mt-1">14</p>
        </div>
        <div class="bg-slate-950 p-4 border border-slate-800 rounded-lg text-center">
          <p class="text-xs text-slate-400">AI Resolution Rate</p>
          <p class="text-2xl font-bold text-indigo-400 mt-1">87%</p>
        </div>
      </div>
      <div class="bg-slate-950 p-4 border border-slate-800 rounded-lg">
        <h3 class="font-semibold text-sm mb-2 text-slate-300">System Statuses</h3>
        <ul class="space-y-2 text-xs text-slate-400">
          <li class="flex justify-between items-center"><span>Active Directory Auth</span> <span class="text-emerald-400">Operational</span></li>
          <li class="flex justify-between items-center"><span>Corporate VPN Tunnel</span> <span class="text-emerald-400">Operational</span></li>
          <li class="flex justify-between items-center"><span>AI RAG Knowledge Engine</span> <span class="text-emerald-400">Operational</span></li>
        </ul>
      </div>
    </section>

  </main>

  <!-- Script Logic -->
  <script>
    function switchTab(tab) {
      const tabs = ['chat', 'kb', 'ticket', 'dashboard'];
      tabs.forEach(t => {
        document.getElementById(`tab-${t}`).classList.add('hidden');
        document.getElementById(`nav-${t}-btn`).className = 'px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
      });

      document.getElementById(`tab-${tab}`).classList.remove('hidden');
      document.getElementById(`nav-${tab}-btn`).className = 'px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition';
    }

    function appendMessage(sender, text) {
      const chatContainer = document.getElementById('chat-messages');
      if (!chatContainer) return;

      const messageDiv = document.createElement('div');
      messageDiv.className = sender === 'user' ? 'flex justify-end' : 'flex items-start gap-3';

      if (sender === 'user') {
        const bubble = document.createElement('div');
        bubble.className = 'bg-blue-600 text-white p-3 rounded-lg max-w-md text-sm';
        bubble.textContent = text;
        messageDiv.appendChild(bubble);
      } else {
        const avatar = document.createElement('div');
        avatar.className = 'bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-xs shrink-0';
        avatar.textContent = 'SF';

        const bubble = document.createElement('div');
        bubble.className = 'bg-slate-800 text-slate-200 p-3 rounded-lg max-w-lg text-sm space-y-2';
        bubble.innerHTML = marked.parse(text);
        addCopyButtonsToMessage(bubble);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
      }

      chatContainer.appendChild(messageDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function addCopyButtonsToMessage(container) {
      const codeBlocks = container.querySelectorAll('pre');
      codeBlocks.forEach((pre) => {
        if (pre.querySelector('.copy-btn')) return;
        pre.style.position = 'relative';
        const button = document.createElement('button');
        button.className = 'copy-btn absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-2 py-1 rounded transition';
        button.textContent = 'Copy';
        button.addEventListener('click', () => {
          const codeText = pre.querySelector('code')?.innerText || pre.innerText;
          navigator.clipboard.writeText(codeText).then(() => {
            button.textContent = 'Copied!';
            setTimeout(() => { button.textContent = 'Copy'; }, 2000);
          });
        });
        pre.appendChild(button);
      });
    }

    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;
      chatInput.value = '';
      await handleUserSubmit(message);
    });

    async function handleUserSubmit(userText) {
      appendMessage('user', userText);

      const chatContainer = document.getElementById('chat-messages');
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'typing-indicator';
      loadingDiv.className = 'flex items-start gap-3';
      loadingDiv.innerHTML = `
        <div class="bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-xs shrink-0">SF</div>
        <div class="bg-slate-800 text-slate-400 p-3 rounded-lg text-xs italic">
          <i class="fa-solid fa-spinner fa-spin mr-1"></i> SentriForge AI is analyzing your issue...
        </div>
      `;
      chatContainer.appendChild(loadingDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userText })
        });
        
        const data = await res.json();
        document.getElementById('typing-indicator')?.remove();

        if (res.ok && data.reply) {
          appendMessage('bot', data.reply);
        } else {
          appendMessage('bot', `Error: ${data.error || 'Failed to get response from AI.'}`);
        }
      } catch (err) {
        document.getElementById('typing-indicator')?.remove();
        appendMessage('bot', 'Error: Could not connect to AI assistant server.');
      }
    }

    async function loadKnowledgeBase() {
      const kbContainer = document.getElementById('kb-articles-list');
      if (!kbContainer) return;

      try {
        const response = await fetch('/api/kb');
        const articles = await response.json();

        kbContainer.innerHTML = articles.map(art => `
          <div class="p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-blue-500/50 cursor-pointer transition" onclick="queryKBAI('${art.title.replace(/'/g, "\\'")}')">
            <span class="text-xs text-blue-400 font-semibold uppercase">${art.category}</span>
            <h3 class="font-semibold text-white mt-1">${art.title}</h3>
            <p class="text-sm text-slate-300 mt-1">${art.content}</p>
          </div>
        `).join('');
      } catch (err) {
        console.warn('Could not fetch KB articles:', err);
      }
    }

    function queryKBAI(title) {
      switchTab('chat');
      handleUserSubmit(`How do I handle or resolve: ${title}?`);
    }

    function handleTicketSubmit(e) {
      e.preventDefault();
      document.getElementById('ticket-success').classList.remove('hidden');
      document.getElementById('ticket-form').reset();
      setTimeout(() => {
        document.getElementById('ticket-success').classList.add('hidden');
      }, 4000);
    }

    loadKnowledgeBase();
  </script>
</body>
</html>

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

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing on server environment.' });
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
    res.json({ reply: response.text });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI response.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SentriForge server running on port ${PORT}`);
});