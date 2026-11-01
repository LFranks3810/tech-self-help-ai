/**
 * SentriForge IT Helpdesk Backend API
 * Compatible with Node.js & Express - Ready for Render deployment.
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend requests and parse JSON bodies
app.use(cors());
app.use(express.json());

// In-memory data store for Knowledge Base articles
let kbArticles = [
    {
        id: 'kb-1',
        category: 'access',
        categoryName: 'Account & Access',
        title: 'How to Reset Your Enterprise Domain Password',
        summary: 'Step-by-step guide to resetting your Active Directory password via the self-service portal.',
        content: '<p>Navigate to sso.company.com and select Forgot Password. Authenticate via MFA.</p>'
    },
    {
        id: 'kb-2',
        category: 'network',
        categoryName: 'Network & Connectivity',
        title: 'GlobalProtect VPN Connection Troubleshooting',
        summary: 'Fix common VPN connection drops and portal timeouts.',
        content: '<p>Verify your local internet connection and make sure portal address is set to vpn.company.com.</p>'
    },
    {
        id: 'kb-3',
        category: 'hardware',
        categoryName: 'Hardware & Peripherals',
        title: 'Dual Monitor & Docking Station Configuration',
        summary: 'Resolving display detection failures and dock power issues.',
        content: '<p>Power cycle the docking station by unplugging power for 10 seconds, then press Win + P to extend displays.</p>'
    }
];

// In-memory data store for Support Tickets
let tickets = [
    {
        id: 'TICK-8021',
        category: 'Network & Connectivity',
        priority: 'High',
        subject: 'GlobalProtect VPN disconnects every 15 minutes',
        description: 'VPN drops repeatedly on home Wi-Fi after gateway update.',
        status: 'In Progress',
        date: '2026-10-26 09:15',
        history: [
            { sender: 'User', message: 'Ticket created with High priority.', time: 'Oct 26, 09:15 AM' },
            { sender: 'Agent (SentriForge Support)', message: 'Reviewing VPN adapter logs.', time: 'Oct 26, 10:30 AM' }
        ]
    }
];

// Healthcheck Route (used by frontend status indicator and Render ping)
app.get('/api/health', (req, res) => {
    res.json({ status: 'online', service: 'SentriForge API Server', timestamp: new Date() });
});

// GET Knowledge Base Articles
app.get('/api/kb', (req, res) => {
    const { category, search } = req.query;
    let filtered = [...kbArticles];

    if (category && category !== 'all') {
        filtered = filtered.filter(a => a.category === category);
    }

    if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(a => 
            a.title.toLowerCase().includes(query) || 
            a.summary.toLowerCase().includes(query)
        );
    }

    res.json(filtered);
});

// GET Support Tickets
app.get('/api/tickets', (req, res) => {
    res.json(tickets);
});

// POST New Support Ticket
app.post('/api/tickets', (req, res) => {
    const { category, priority, subject, description } = req.body;

    if (!subject || !description) {
        return res.status(400).json({ error: 'Subject and description are required.' });
    }

    const newTicket = {
        id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
        category: category || 'General Support',
        priority: priority || 'Medium',
        subject,
        description,
        status: 'Open',
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        history: [
            { sender: 'User', message: 'Ticket created via SentriForge Web Portal.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            { sender: 'SentriForge Engine', message: 'Ticket queued for Support Engineering.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]
    };

    tickets.unshift(newTicket);
    res.status(201).json(newTicket);
});

// POST Ticket Reply Message
app.post('/api/tickets/:id/reply', (req, res) => {
    const { id } = req.params;
    const { message, sender } = req.body;

    const ticket = tickets.find(t => t.id === id);
    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    const reply = {
        sender: sender || 'User',
        message: message || '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    ticket.history.push(reply);

    // Simulate Automated System Acknowledgment
    setTimeout(() => {
        ticket.history.push({
            sender: 'SentriForge Dispatcher',
            message: 'Your response was updated on the support dispatch board.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    }, 1000);

    res.json(ticket);
});

// POST AI Chat Endpoint
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    const query = (message || '').toLowerCase();

    let botResponse = {
        id: Date.now(),
        sender: 'bot',
        text: `SentriForge Engine received: "${message}". Let me assist you with standard troubleshooting procedures or open an IT ticket.`,
        options: [
            { label: '🔑 Reset Password', action: 'Reset my password' },
            { label: '🌐 VPN Fix', action: 'VPN won\'t connect' },
            { label: '🎫 Open Support Ticket', action: 'Submit Ticket' }
        ],
        escalateBtn: true
    };

    if (query.includes('password') || query.includes('reset') || query.includes('lock')) {
        botResponse.category = 'Account & Access';
        botResponse.text = `
            <p class="font-bold border-b pb-1 border-gray-200 dark:border-gray-600">🔑 SentriForge Identity Management</p>
            <p>To reset your enterprise password via our secure directory portal:</p>
            <ol class="list-decimal pl-4 space-y-1 my-2">
                <li>Go to <strong>sso.company.com/reset</strong>.</li>
                <li>Approve the notification on your Authenticator App.</li>
                <li>Set a 12+ character password.</li>
            </ol>
        `;
    } else if (query.includes('vpn') || query.includes('connect')) {
        botResponse.category = 'Network & Connectivity';
        botResponse.text = `
            <p class="font-bold border-b pb-1 border-gray-200 dark:border-gray-600">🌐 VPN Gateway Diagnostics</p>
            <p>1. Ensure host address is set to <code>vpn.company.com</code>.<br>2. Right-click tray icon and select <strong>Refresh Connection</strong>.</p>
        `;
    }

    res.json(botResponse);
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`SentriForge Backend Running on Port ${PORT}`);
});