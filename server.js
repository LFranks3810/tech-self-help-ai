const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files from root directory
app.use(express.static(path.join(__dirname)));

// API Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Sample Mock Data Endpoints
app.get('/api/kb', (req, res) => {
  res.json([
    { id: 1, title: 'Active Directory Password Reset', category: 'Access', content: 'Use self-service portal or contact IT.' },
    { id: 2, title: 'VPN Connection Failure', category: 'Network', content: 'Verify MFA token and re-authenticate.' }
  ]);
});

app.get('/api/tickets', (req, res) => {
  res.json([
    { id: 'SF-1001', subject: 'VPN Login Error', status: 'In Progress', priority: 'High' }
  ]);
});

app.post('/api/tickets', (req, res) => {
  const newTicket = { id: 'SF-' + Math.floor(1000 + Math.random() * 9000), ...req.body, status: 'Open' };
  res.json({ success: true, ticket: newTicket });
});

// Fallback to serve index.html for root requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`SentriForge Backend Running on Port ${PORT}`);
});