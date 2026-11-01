const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files (like index.html) from the root directory
app.use(express.static(path.join(__dirname)));

// API Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Knowledge Base Endpoint
app.get('/api/kb', (req, res) => {
  res.json([
    { id: 1, title: 'Active Directory Password Reset', category: 'Access', content: 'Use self-service portal or contact IT.' },
    { id: 2, title: 'VPN Connection Failure', category: 'Network', content: 'Verify MFA token and re-authenticate.' }
  ]);
});

// Tickets Endpoints
app.get('/api/tickets', (req, res) => {
  res.json([
    { id: 'SF-1001', subject: 'VPN Login Error', status: 'In Progress', priority: 'High' }
  ]);
});

app.post('/api/tickets', (req, res) => {
  const newTicket = { id: 'SF-' + Math.floor(1000 + Math.random() * 9000), ...req.body, status: 'Open' };
  res.json({ success: true, ticket: newTicket });
});

// AI Chat Endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  let reply = "I'm here to help with SentriForge support! Let me check that for you.";
  
  const msgLower = (message || '').toLowerCase();
  if (msgLower.includes('password')) {
    reply = "To reset your password, visit the self-service portal or submit an Access ticket.";
  } else if (msgLower.includes('vpn')) {
    reply = "For VPN issues, verify your MFA token in Microsoft Authenticator and re-authenticate.";
  }

  res.json({ success: true, reply });
});

// Fallback route to serve index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Render dynamically assigns a port via process.env.PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`SentriForge Backend Running on Port ${PORT}`);
});