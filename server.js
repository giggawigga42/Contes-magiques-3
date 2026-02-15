// Simple proxy server for Contes Magiques PWA
// This server calls the Synthetic AI API with proper authentication

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Your OpenClaw gateway configuration
const OPENCLAW_GATEWAY = process.env.OPENCLAW_GATEWAY || 'http://localhost:8080';
const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN || 'your-gateway-token-here';

// Middleware
app.use(cors()); // Allow PWA to call this server
app.use(express.json());

// Serve static files (the PWA) - from root directory
app.use(express.static('.'));

// Fallback to index.html for any route (SPA behavior)
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '.' });
});

// API endpoint for story generation
app.post('/api/generate-story', async (req, res) => {
    try {
        const { model, messages, max_tokens, temperature } = req.body;
        
        console.log('Generating story with model:', model);
        
        // Call Synthetic AI API through OpenClaw gateway
        const response = await fetch(`${OPENCLAW_GATEWAY}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GATEWAY_TOKEN}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: max_tokens || 1500,
                temperature: temperature || 0.8
            })
        });
        
        if (!response.ok) {
            const error = await response.text();
            console.error('Synthetic AI API error:', error);
            return res.status(500).json({ error: 'AI generation failed' });
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug: List files (remove in production)
app.get('/api/debug', (req, res) => {
    const fs = require('fs');
    fs.readdir('.', (err, files) => {
        if (err) return res.json({ error: err.message });
        res.json({ files: files });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Contes Magiques server running on port ${PORT}`);
    console.log(`📱 PWA available at: http://localhost:${PORT}`);
    console.log(`🤖 AI proxy endpoint: http://localhost:${PORT}/api/generate-story`);
});
