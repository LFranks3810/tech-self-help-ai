const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files (like index.html)
app.use(express.static(path.join(__dirname)));

// 1. Knowledge Base API Endpoint (Sends articles to index.html)
app.get('/api/kb', (req, res) => {
  res.json([
    { 
      id: 1, 
      title: 'Active Directory Password Reset', 
      category: 'Access', 
      content: 'Use self-service portal or contact IT administrators to reset corporate credentials securely.' 
    },
    { 
      id: 2, 
      title: 'VPN Connection Failure & MFA', 
      category: 'Network', 
      content: 'Verify your Microsoft Authenticator push notification token and re-authenticate your secure tunnel session.' 
    },
    { 
      id: 3, 
      title: 'Network Printer Setup & Drivers', 
      category: 'Hardware', 
      content: 'Connect to the print server via \\print-srv01 and select your department printer.' 
    }
  ]);
});

// 2. AI Chat API Endpoint (Sends bot replies to index.html)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  let reply = "I'm here to help with SentriForge support! Let me check that for you.";
  
  const msgLower = (message || '').toLowerCase();
  if (msgLower.includes('password')) {
    reply = "To reset your password, visit the self-service portal or submit an Access ticket.";
  } else if (msgLower.includes('vpn')) {
    reply = "For VPN issues, verify your MFA token in Microsoft Authenticator and re-authenticate.";
  } else if (msgLower.includes('printer')) {
    reply = "For network printer issues, verify you are connected to the office network and map to \\print-srv01.";
  }

  res.json({ success: true, reply });
});

// Fallback route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Render dynamically assigns a port via process.env.PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`SentriForge Backend Running on Port ${PORT}`);
});